import { createContext, useContext, useEffect, useState, ReactNode } from "react";

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
};

const SESSION_KEY = "tailorerp.session";
const SESSION_MS = 1000 * 60 * 60 * 8; // 8h

// Mock user directory (frontend-only auth). Replace with real backend later.
const MOCK_USERS: Array<AuthUser & { password: string }> = [
  { id: "u_admin", fullName: "Aarav Mehta",     email: "admin@tailor.app",     role: "admin",        password: "admin123" },
  { id: "u_recep", fullName: "Priya Raman",     email: "reception@tailor.app", role: "receptionist", password: "reception123" },
  { id: "u_tailo", fullName: "Karthik Iyer",    email: "tailor@tailor.app",    role: "tailor",       password: "tailor123" },
  { id: "u_inv",   fullName: "Lakshmi Subbu",   email: "inventory@tailor.app", role: "inventory",    password: "inventory123" },
];

// Path-prefix permissions per role. Add new routes here.
export const ROLE_ROUTES: Record<Role, string[]> = {
  admin: ["/"], // wildcard handled in canAccess
  receptionist: ["/", "/customers", "/measurements", "/orders", "/billing", "/notifications", "/settings", "/organization", "/onboarding"],
  tailor: ["/", "/orders", "/production", "/notifications", "/settings", "/organization", "/onboarding"],
  inventory: ["/", "/inventory", "/reports", "/notifications", "/settings", "/organization", "/onboarding"],
};

export function canAccess(role: Role | undefined, path: string): boolean {
  if (!role) return false;
  if (role === "admin") return true;
  const allowed = ROLE_ROUTES[role];
  return allowed.some((p) => (p === "/" ? path === "/" : path === p || path.startsWith(p + "/")));
}

export function roleHome(role: Role): string {
  return "/";
}

type AuthCtx = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<AuthUser>;
  logout: () => void;
  requestReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

function readSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s: StoredSession = JSON.parse(raw);
    if (Date.now() > s.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return s.user;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readSession());
    setLoading(false);
  }, []);

  const login: AuthCtx["login"] = async (email, password, remember) => {
    await new Promise((r) => setTimeout(r, 450));
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    );
    if (!found) throw new Error("Invalid email or password.");
    const { password: _pw, ...safe } = found;
    const session: StoredSession = { user: safe, expiresAt: Date.now() + SESSION_MS };
    const store = remember ? localStorage : sessionStorage;
    store.setItem(SESSION_KEY, JSON.stringify(session));
    (remember ? sessionStorage : localStorage).removeItem(SESSION_KEY);
    setUser(safe);
    return safe;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const requestReset = async (_email: string) => {
    await new Promise((r) => setTimeout(r, 500));
  };
  const resetPassword = async (_token: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 500));
  };

  return (
    <Ctx.Provider value={{ user, loading, login, logout, requestReset, resetPassword }}>
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
