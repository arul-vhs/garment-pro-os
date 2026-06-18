import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from "react";

export type Role = "admin" | "receptionist" | "tailor" | "inventory";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatar?: string;
};

type StoredSession = {
  user: AuthUser;
  expiresAt: number;
  remember: boolean;
};

const SESSION_KEY = "tailorerp.session";
const SESSION_MS = 1000 * 60 * 60 * 8;   // 8h absolute
const IDLE_MS    = 1000 * 60 * 30;       // 30m idle auto-logout
const CHECK_MS   = 1000 * 30;            // poll every 30s

// Lightweight cross-module event bus (used by audit log etc.)
function dispatchAudit(action: string, target?: string, after?: string, user?: AuthUser) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("audit:log", {
    detail: {
      module: "Auth",
      action,
      target,
      after,
      userId: user?.id ?? "system",
      userName: user?.fullName ?? "System",
    },
  }));
}

// Mock user directory (frontend-only auth). Replace with real backend later.
const MOCK_USERS: Array<AuthUser & { password: string }> = [
  { id: "u_admin", fullName: "Aarav Mehta",     email: "admin@tailor.app",     role: "admin",        password: "admin123" },
  { id: "u_recep", fullName: "Priya Raman",     email: "reception@tailor.app", role: "receptionist", password: "reception123" },
  { id: "u_tailo", fullName: "Karthik Iyer",    email: "tailor@tailor.app",    role: "tailor",       password: "tailor123" },
  { id: "u_inv",   fullName: "Lakshmi Subbu",   email: "inventory@tailor.app", role: "inventory",    password: "inventory123" },
];

// Path-prefix permissions per role. Admin gets wildcard; others must be enumerated.
// This is the single source of truth for both sidebar visibility and route guards.
export const ROLE_ROUTES: Record<Role, string[]> = {
  admin: ["/"], // wildcard via canAccess
  receptionist: [
    "/", "/customers", "/measurements", "/orders", "/billing", "/communications",
    "/notifications", "/settings", "/organization", "/onboarding", "/reports-center",
  ],
  tailor: [
    "/", "/orders", "/production", "/measurements", "/designs",
    "/notifications", "/settings", "/organization", "/onboarding",
  ],
  inventory: [
    "/", "/inventory", "/reports", "/reports-center", "/branches",
    "/notifications", "/settings", "/organization", "/onboarding",
  ],
};

// Admin-only routes (explicit deny-list for safety; admin still passes via wildcard).
const ADMIN_ONLY = [
  "/audit-logs", "/roles", "/subscription", "/super-admin", "/finance",
  "/employees", "/tenant-settings",
];

export function canAccess(role: Role | undefined, path: string): boolean {
  if (!role) return false;
  if (role === "admin") return true;
  if (ADMIN_ONLY.some((p) => path === p || path.startsWith(p + "/"))) return false;
  const allowed = ROLE_ROUTES[role];
  return allowed.some((p) => (p === "/" ? path === "/" : path === p || path.startsWith(p + "/")));
}

export function roleHome(_role: Role): string { return "/"; }

type AuthCtx = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<AuthUser>;
  logout: (reason?: "user" | "expired" | "idle") => void;
  requestReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  extendSession: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

function readSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s: StoredSession = JSON.parse(raw);
    if (Date.now() > s.expiresAt) return null;
    return s;
  } catch { return null; }
}

function writeSession(s: StoredSession) {
  const store = s.remember ? localStorage : sessionStorage;
  store.setItem(SESSION_KEY, JSON.stringify(s));
  (s.remember ? sessionStorage : localStorage).removeItem(SESSION_KEY);
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const lastActivityRef = useRef<number>(Date.now());

  // Hydrate session on mount.
  useEffect(() => {
    const s = readSession();
    if (s) setUser(s.user); else clearSession();
    setLoading(false);
  }, []);

  // Activity tracking — refresh idle timer on user interaction.
  useEffect(() => {
    if (!user) return;
    const onAct = () => { lastActivityRef.current = Date.now(); };
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, onAct, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, onAct));
  }, [user]);

  // Session expiration + idle poll.
  useEffect(() => {
    if (!user) return;
    const tick = () => {
      const s = readSession();
      if (!s) { handleExpire("expired"); return; }
      if (Date.now() - lastActivityRef.current > IDLE_MS) { handleExpire("idle"); return; }
    };
    const id = window.setInterval(tick, CHECK_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleExpire = useCallback((reason: "expired" | "idle") => {
    dispatchAudit("session_expired", reason, `Session ended (${reason})`, user ?? undefined);
    clearSession();
    setUser(null);
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/session-expired")) {
      window.location.href = "/session-expired";
    }
  }, [user]);

  const login: AuthCtx["login"] = async (email, password, remember) => {
    await new Promise((r) => setTimeout(r, 350));
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    );
    if (!found) {
      dispatchAudit("login_failed", email, "Invalid credentials");
      throw new Error("Invalid email or password.");
    }
    const { password: _pw, ...safe } = found;
    const session: StoredSession = { user: safe, expiresAt: Date.now() + SESSION_MS, remember };
    writeSession(session);
    lastActivityRef.current = Date.now();
    setUser(safe);
    dispatchAudit("login", safe.email, `Signed in as ${safe.role}`, safe);
    return safe;
  };

  const logout: AuthCtx["logout"] = (reason = "user") => {
    if (user) dispatchAudit("logout", reason, `User signed out (${reason})`, user);
    clearSession();
    setUser(null);
  };

  const extendSession = useCallback(() => {
    const s = readSession();
    if (!s) return;
    writeSession({ ...s, expiresAt: Date.now() + SESSION_MS });
    lastActivityRef.current = Date.now();
  }, []);

  const requestReset = async (_e: string) => { await new Promise((r) => setTimeout(r, 500)); };
  const resetPassword = async (_t: string, _p: string) => { await new Promise((r) => setTimeout(r, 500)); };

  return (
    <Ctx.Provider value={{ user, loading, login, logout, requestReset, resetPassword, extendSession }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}

export const DEMO_CREDENTIALS = MOCK_USERS.map((u) => ({
  email: u.email,
  password: u.password,
  role: u.role,
  fullName: u.fullName,
}));
