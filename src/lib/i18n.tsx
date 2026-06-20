import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";

// ---------- Supported languages ----------
export type Lang = "en" | "ta" | "te";

export const LANGUAGES: Array<{ code: Lang; label: string; native: string; flag: string; rtl?: boolean }> = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "ta", label: "Tamil",   native: "தமிழ்",   flag: "🇮🇳" },
  { code: "te", label: "Telugu",  native: "తెలుగు", flag: "🇮🇳" },
];

export const DEFAULT_LANG: Lang = "en";
export const RTL_LANGS: Lang[] = []; // Architecture supports RTL; none of ta/te are RTL.

// ---------- Modular dictionary (lazy-ready) ----------
// Each /locales/<lang>/<module>.json contributes namespaced keys "<module>.<key>".
// Vite's import.meta.glob bundles all modules — switching `eager: false` later
// would yield true lazy loading without changing the public API.
const modules = import.meta.glob("../locales/*/*.json", { eager: true }) as Record<string, { default: Record<string, string> }>;

const DICTS: Record<Lang, Record<string, string>> = { en: {}, ta: {}, te: {} };
for (const [path, mod] of Object.entries(modules)) {
  const m = path.match(/locales\/(\w+)\/(\w+)\.json$/);
  if (!m) continue;
  const lang = m[1] as Lang;
  const ns = m[2];
  if (!DICTS[lang]) continue;
  for (const [k, v] of Object.entries(mod.default)) {
    // Module name acts as a top-level namespace, e.g. nav.json + "dashboard" -> "nav.dashboard".
    // Keys that already start with the module name are kept verbatim so authors can
    // write dotted paths like "app.name" inside common.json without double-prefixing.
    const fullKey = k.startsWith(`${ns}.`) ? k : `${ns}.${k}`;
    DICTS[lang][fullKey] = v;
    // Also expose the bare key (without ns) so legacy callers like t("app.name") still resolve.
    if (k.includes(".") && !(k in DICTS[lang])) DICTS[lang][k] = v;
  }
}

// ---------- Storage helpers ----------
const GLOBAL_KEY = "tailorerp.lang";
const USER_KEY = (uid: string) => `tailorerp.lang.user.${uid}`;
const TENANT_KEY = (oid: string) => `tailorerp.lang.tenant.${oid}`;

function readLang(key: string): Lang | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(key);
  return v === "en" || v === "ta" || v === "te" ? v : null;
}

export function getTenantLang(orgId: string | null | undefined): Lang | null {
  return orgId ? readLang(TENANT_KEY(orgId)) : null;
}
export function setTenantLang(orgId: string, lang: Lang) {
  if (typeof window !== "undefined") localStorage.setItem(TENANT_KEY(orgId), lang);
}
export function getUserLang(userId: string | null | undefined): Lang | null {
  return userId ? readLang(USER_KEY(userId)) : null;
}
export function setUserLang(userId: string, lang: Lang) {
  if (typeof window !== "undefined") localStorage.setItem(USER_KEY(userId), lang);
}

// ---------- Context ----------
type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, fallback?: string) => string;
  dir: "ltr" | "rtl";
  // Scoped helpers
  setForUser: (userId: string, l: Lang) => void;
  setForTenant: (orgId: string, l: Lang) => void;
  resolveInitial: (opts: { userId?: string | null; orgId?: string | null }) => Lang;
};

const I18nContext = createContext<Ctx | null>(null);

function resolveInitial({ userId, orgId }: { userId?: string | null; orgId?: string | null }): Lang {
  return (
    getUserLang(userId) ??
    getTenantLang(orgId) ??
    readLang(GLOBAL_KEY) ??
    DEFAULT_LANG
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Initial resolution — pulls from global localStorage. User/Tenant overrides
  // apply once those providers mount and call setForUser/setForTenant.
  useEffect(() => {
    setLangState(resolveInitial({}));
  }, []);

  // Apply <html lang> + dir for accessibility and RTL readiness.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem(GLOBAL_KEY, l);
  }, []);

  const setForUser = useCallback((userId: string, l: Lang) => {
    setUserLang(userId, l);
    setLang(l);
  }, [setLang]);

  const setForTenant = useCallback((orgId: string, l: Lang) => {
    setTenantLang(orgId, l);
    // Only apply immediately if the user has no personal override.
    setLangState((curr) => curr);
  }, []);

  const t = useCallback((key: string, fallback?: string) => {
    return DICTS[lang]?.[key] ?? DICTS.en?.[key] ?? fallback ?? key;
  }, [lang]);

  const value = useMemo<Ctx>(() => ({
    lang,
    setLang,
    t,
    dir: RTL_LANGS.includes(lang) ? "rtl" : "ltr",
    setForUser,
    setForTenant,
    resolveInitial,
  }), [lang, setLang, t, setForUser, setForTenant]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      lang: DEFAULT_LANG as Lang,
      setLang: () => {},
      t: (k: string, f?: string) => DICTS.en?.[k] ?? f ?? k,
      dir: "ltr" as const,
      setForUser: () => {},
      setForTenant: () => {},
      resolveInitial,
    };
  }
  return ctx;
}
