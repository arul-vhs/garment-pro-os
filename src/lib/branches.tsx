import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useTenant } from "@/lib/tenant";

export type Branch = {
  id: string;
  orgId: string;
  name: string;
  city: string;
  address: string;
  manager: string;
  active: boolean;
};

const KEY = "tailorerp.branches";
const ACTIVE = "tailorerp.activeBranch";

function loadAll(): Record<string, Branch[]> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function saveAll(v: Record<string, Branch[]>) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(v));
}

function seed(orgId: string): Branch[] {
  return [
    { id: `br_${orgId}_1`, orgId, name: "Flagship — Bandra", city: "Mumbai", address: "Linking Road, Bandra West", manager: "Aarav Mehta",  active: true },
    { id: `br_${orgId}_2`, orgId, name: "Koramangala",       city: "Bengaluru", address: "80ft Road, 4th Block", manager: "Priya Raman",   active: true },
    { id: `br_${orgId}_3`, orgId, name: "T. Nagar Boutique", city: "Chennai", address: "Usman Road, T. Nagar",  manager: "Karthik Iyer", active: false },
  ];
}

type Ctx = {
  branches: Branch[];
  activeBranch: Branch | null;
  setActiveBranch: (id: string | null) => void;
  addBranch: (b: Omit<Branch, "id" | "orgId">) => Branch;
  updateBranch: (id: string, patch: Partial<Branch>) => void;
  removeBranch: (id: string) => void;
};
const BC = createContext<Ctx | null>(null);

export function BranchProvider({ children }: { children: ReactNode }) {
  const { activeOrg } = useTenant();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeOrg) { setBranches([]); setActiveId(null); return; }
    const all = loadAll();
    let mine = all[activeOrg.id];
    if (!mine) { mine = seed(activeOrg.id); all[activeOrg.id] = mine; saveAll(all); }
    setBranches(mine);
    const saved = typeof window !== "undefined" ? localStorage.getItem(`${ACTIVE}.${activeOrg.id}`) : null;
    setActiveId(saved && mine.some((b) => b.id === saved) ? saved : (mine.find((b) => b.active)?.id ?? null));
  }, [activeOrg]);

  const persist = (next: Branch[]) => {
    if (!activeOrg) return;
    const all = loadAll(); all[activeOrg.id] = next; saveAll(all); setBranches(next);
  };

  const setActiveBranch = (id: string | null) => {
    setActiveId(id);
    if (activeOrg && typeof window !== "undefined") {
      if (id) localStorage.setItem(`${ACTIVE}.${activeOrg.id}`, id);
      else localStorage.removeItem(`${ACTIVE}.${activeOrg.id}`);
    }
  };
  const addBranch: Ctx["addBranch"] = (b) => {
    if (!activeOrg) throw new Error("No org");
    const br: Branch = { ...b, id: `br_${activeOrg.id}_${Date.now()}`, orgId: activeOrg.id };
    persist([...branches, br]);
    return br;
  };
  const updateBranch: Ctx["updateBranch"] = (id, patch) => persist(branches.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const removeBranch = (id: string) => persist(branches.filter((b) => b.id !== id));

  const activeBranch = useMemo(() => branches.find((b) => b.id === activeId) ?? null, [branches, activeId]);

  return <BC.Provider value={{ branches, activeBranch, setActiveBranch, addBranch, updateBranch, removeBranch }}>{children}</BC.Provider>;
}

export function useBranches() {
  const c = useContext(BC);
  if (!c) throw new Error("useBranches must be used within BranchProvider");
  return c;
}
