import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import { useTenant } from "@/lib/tenant";

export type AuditEntry = {
  id: string;
  ts: number;
  orgId?: string;
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
function save(entries: AuditEntry[]) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(entries));
}

type Ctx = {
  entries: AuditEntry[];      // tenant-scoped
  allEntries: AuditEntry[];   // unscoped (Super Admin)
  log: (e: Omit<AuditEntry, "id" | "ts" | "orgId">) => void;
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
  const { activeOrg } = useTenant();
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    const stored = load();
    setEntries(stored.length ? stored : seed);
  }, []);

  const log: Ctx["log"] = useCallback((e) => {
    setEntries((prev) => {
      const next: AuditEntry[] = [
        {
          ...e,
          id: `a_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          ts: Date.now(),
          orgId: activeOrg?.id,
        },
        ...prev,
      ].slice(0, MAX);
      save(next);
      return next;
    });
  }, [activeOrg?.id]);

  // Listen to cross-module audit events (login/logout/failed/etc.)
  useEffect(() => {
    const onEvent = (ev: Event) => {
      const d = (ev as CustomEvent).detail as Omit<AuditEntry, "id" | "ts" | "orgId">;
      if (!d) return;
      log(d);
    };
    window.addEventListener("audit:log", onEvent);
    return () => window.removeEventListener("audit:log", onEvent);
  }, [log]);

  const clear = () => { setEntries([]); save([]); };

  // Tenant-scoped view: entries without orgId are legacy/system and visible to all.
  const scoped = useMemo(
    () => entries.filter((e) => !activeOrg || !e.orgId || e.orgId === activeOrg.id),
    [entries, activeOrg],
  );

  return (
    <AuditCtx.Provider value={{ entries: scoped, allEntries: entries, log, clear }}>
      {children}
    </AuditCtx.Provider>
  );
}

export function useAudit() {
  const c = useContext(AuditCtx);
  if (!c) throw new Error("useAudit must be used within AuditProvider");
  return c;
}

// Imperative helper for non-React modules to log events without coupling.
export function logAuditEvent(entry: Omit<AuditEntry, "id" | "ts" | "orgId">) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("audit:log", { detail: entry }));
}
