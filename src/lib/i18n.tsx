import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "ta";

const dict: Record<string, { en: string; ta: string }> = {
  "app.name": { en: "TailorERP", ta: "டெய்லர்ERP" },
  "app.tagline": { en: "Atelier Suite", ta: "தையல் தொகுப்பு" },
  "nav.workspace": { en: "Workspace", ta: "பணியிடம்" },
  "nav.system": { en: "System", ta: "அமைப்பு" },
  "nav.dashboard": { en: "Dashboard", ta: "முகப்பு" },
  "nav.customers": { en: "Customers", ta: "வாடிக்கையாளர்கள்" },
  "nav.measurements": { en: "Measurements", ta: "அளவுகள்" },
  "nav.orders": { en: "Orders", ta: "ஆர்டர்கள்" },
  "nav.designs": { en: "Designs", ta: "வடிவமைப்புகள்" },
  "nav.inventory": { en: "Inventory", ta: "சரக்கு" },
  "nav.production": { en: "Production", ta: "உற்பத்தி" },
  "nav.billing": { en: "Billing", ta: "பில்லிங்" },
  "nav.employees": { en: "Employees", ta: "ஊழியர்கள்" },
  "nav.reports": { en: "Reports", ta: "அறிக்கைகள்" },
  "nav.reportsCenter": { en: "Reports Center", ta: "அறிக்கை மையம்" },
  "nav.notifications": { en: "Notifications", ta: "அறிவிப்புகள்" },
  "nav.settings": { en: "Settings", ta: "அமைப்புகள்" },
  "nav.organization": { en: "Organization", ta: "நிறுவனம்" },
  "nav.finance": { en: "Finance & Profit", ta: "நிதி" },
  "nav.communications": { en: "Communications", ta: "தகவல்தொடர்பு" },
  "nav.branches": { en: "Branches", ta: "கிளைகள்" },
  "nav.roles": { en: "Roles & Permissions", ta: "அனுமதிகள்" },
  "nav.audit": { en: "Audit Logs", ta: "தணிக்கை" },
  "nav.subscription": { en: "Subscription", ta: "சந்தா" },
  "nav.superadmin": { en: "Super Admin", ta: "சூப்பர் நிர்வாகி" },
  "nav.tenantSettings": { en: "Tenant Settings", ta: "வாடகைதார் அமைப்புகள்" },
  "header.search": { en: "Search orders, customers…", ta: "ஆர்டர்கள், வாடிக்கையாளர்கள் தேடு…" },
  "lang.toggle": { en: "தமிழ்", ta: "EN" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved === "en" || saved === "ta") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };
  const t = (key: string) => dict[key]?.[lang] ?? key;
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) return { lang: "en" as Lang, setLang: () => {}, t: (k: string) => dict[k]?.en ?? k };
  return ctx;
}
