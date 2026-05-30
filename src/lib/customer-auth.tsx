import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type PortalUser = {
  id: string;
  name: string;
  mobile: string;
  email: string;
};

const KEY = "tailorerp.portalSession";

const DEMO: Array<PortalUser & { password: string }> = [
  { id: "CUS-001", name: "Aarav Sharma", mobile: "+91 98765 43210", email: "aarav@example.com", password: "demo123" },
  { id: "CUS-004", name: "Sneha Iyer",   mobile: "+91 90123 45678", email: "sneha@example.com", password: "demo123" },
];

type Ctx = {
  user: PortalUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<PortalUser>;
  logout: () => void;
};
const C = createContext<Ctx | null>(null);

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" && localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch { /* noop */ }
    setLoading(false);
  }, []);
  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 350));
    const f = DEMO.find((d) => d.email.toLowerCase() === email.trim().toLowerCase() && d.password === password);
    if (!f) throw new Error("Invalid email or password.");
    const { password: _p, ...safe } = f;
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(safe));
    setUser(safe);
    return safe;
  };
  const logout = () => { if (typeof window !== "undefined") localStorage.removeItem(KEY); setUser(null); };
  return <C.Provider value={{ user, loading, login, logout }}>{children}</C.Provider>;
}

export function usePortalAuth() {
  const c = useContext(C);
  if (!c) throw new Error("usePortalAuth must be used within PortalAuthProvider");
  return c;
}

export const PORTAL_DEMO = DEMO.map(({ password, ...rest }) => ({ ...rest, password }));
