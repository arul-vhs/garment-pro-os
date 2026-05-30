import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type AuditEntry = {
  id: string;
  ts: number;
  userId: string;
  userName: string;
  module: string;
  action: string;
  target?: string;
  before?: string;
  after?: string;
};

const KEY = "tailorerp.audit";
const MAX = 500;

function load(): AuditEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

type Ctx = {
  entries: AuditEntry[];
  log: (e: Omit<AuditEntry, "id" | "ts">) => void;
  clear: () => void;
};

const AuditCtx = createContext<Ctx | null>(null);

const seed: AuditEntry[] = [
  { id: "a1", ts: Date.now() - 1000 * 60 * 6,   userId: "u_recep", userName: "Priya Raman",   module: "Orders",    action: "create", target: "ORD-1050", after: "Created order for Aarav Sharma" },
  { id: "a2", ts: Date.now() - 1000 * 60 * 22,  userId: "u_tailo", userName: "Karthik Iyer",  module: "Orders",    action: "update", target: "ORD-1042", before: "Cutting", after: "Stitching" },
  { id: "a3", ts: Date.now() - 1000 * 60 * 55,  userId: "u_inv",   userName: "Lakshmi Subbu", module: "Inventory", action: "adjust", target: "INV-02",   before: "12 m", after: "8 m" },
  { id: "a4", ts: Date.now() - 1000 * 60 * 120, userId: "u_admin", userName: "Aarav Mehta",   module: "Roles",     action: "update", target: "tailor",   before: "view orders", after: "view+edit orders" },
  { id: "a5", ts: Date.now() - 1000 * 60 * 240, userId: "u_recep", userName: "Priya Raman",   module: "Billing",   action: "create", target: "INV-2026-0145", after: "Invoice issued for ₹13,660" },
];

export function AuditProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  useEffect(() => {
    const stored = load();
    setEntries(stored.length ? stored : seed);
  }, []);

  const log: Ctx["log"] = useCallback((e) => {
    setEntries((prev) => {
      const next = [{ ...e, id: `a_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, ts: Date.now() }, ...prev].slice(0, MAX);
      if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = () => { setEntries([]); if (typeof window !== "undefined") localStorage.removeItem(KEY); };

  return <AuditCtx.Provider value={{ entries, log, clear }}>{children}</AuditCtx.Provider>;
}

export function useAudit() {
  const c = useContext(AuditCtx);
  if (!c) throw new Error("useAudit must be used within AuditProvider");
  return c;
}
