import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useAuth } from "@/lib/auth";

export type Plan = "starter" | "growth" | "scale";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  industry: string;
  country: string;
  currency: string;
  plan: Plan;
  createdAt: number;
  ownerId: string;
  members: Array<{ userId: string; role: "owner" | "admin" | "member" }>;
};

export const PLANS: Record<Plan, { name: string; price: string; seats: number; features: string[] }> = {
  starter:  { name: "Starter",  price: "₹0",     seats: 3,  features: ["Up to 3 users", "100 orders / mo", "Email support"] },
  growth:   { name: "Growth",   price: "₹1,499", seats: 10, features: ["Up to 10 users", "Unlimited orders", "Inventory + Reports", "Priority support"] },
  scale:    { name: "Scale",    price: "₹3,999", seats: 50, features: ["Up to 50 users", "Multi-branch", "Advanced analytics", "Dedicated manager"] },
};

const STORE_KEY = "tailorerp.tenants";
const ACTIVE_KEY = "tailorerp.activeOrg";

function seedFor(userId: string): Organization[] {
  return [{
    id: `org_${userId}_demo`,
    name: "Atelier Kumar Tailors",
    slug: "atelier-kumar",
    industry: "Bespoke Menswear",
    country: "India",
    currency: "INR",
    plan: "growth",
    createdAt: Date.now(),
    ownerId: userId,
    members: [{ userId, role: "owner" }],
  }];
}

function loadAll(): Record<string, Organization[]> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch { return {}; }
}
function saveAll(v: Record<string, Organization[]>) {
  if (typeof window !== "undefined") localStorage.setItem(STORE_KEY, JSON.stringify(v));
}

type Ctx = {
  orgs: Organization[];
  activeOrg: Organization | null;
  setActive: (id: string) => void;
  createOrg: (data: Omit<Organization, "id" | "createdAt" | "ownerId" | "members" | "slug"> & { slug?: string }) => Organization;
  updateOrg: (id: string, patch: Partial<Organization>) => void;
  setPlan: (id: string, plan: Plan) => void;
  scope: <T>(items: T[]) => T[]; // tenant-scoping helper for sample data
};

const TenantCtx = createContext<Ctx | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Load orgs for current user
  useEffect(() => {
    if (!user) { setOrgs([]); setActiveId(null); return; }
    const all = loadAll();
    let mine = all[user.id];
    if (!mine || mine.length === 0) {
      // Admin gets seed org so the demo isn't empty; others start blank (onboarding).
      mine = user.role === "admin" ? seedFor(user.id) : [];
      all[user.id] = mine;
      saveAll(all);
    }
    setOrgs(mine);
    const saved = typeof window !== "undefined" ? localStorage.getItem(`${ACTIVE_KEY}.${user.id}`) : null;
    setActiveId(saved && mine.some((o) => o.id === saved) ? saved : mine[0]?.id ?? null);
  }, [user]);

  const persist = (next: Organization[]) => {
    if (!user) return;
    const all = loadAll();
    all[user.id] = next;
    saveAll(all);
    setOrgs(next);
  };

  const setActive = (id: string) => {
    setActiveId(id);
    if (user && typeof window !== "undefined") localStorage.setItem(`${ACTIVE_KEY}.${user.id}`, id);
  };

  const createOrg: Ctx["createOrg"] = (data) => {
    if (!user) throw new Error("Not authenticated");
    const id = `org_${user.id}_${Date.now()}`;
    const slug = (data.slug || data.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const org: Organization = {
      id, slug, name: data.name, industry: data.industry, country: data.country,
      currency: data.currency, plan: data.plan, createdAt: Date.now(),
      ownerId: user.id, members: [{ userId: user.id, role: "owner" }],
    };
    const next = [...orgs, org];
    persist(next);
    setActive(id);
    return org;
  };

  const updateOrg: Ctx["updateOrg"] = (id, patch) => {
    persist(orgs.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };

  const setPlan: Ctx["setPlan"] = (id, plan) => updateOrg(id, { plan });

  const activeOrg = useMemo(() => orgs.find((o) => o.id === activeId) ?? null, [orgs, activeId]);

  // Deterministic tenant scoping for shared mock arrays — slice by tenant hash
  // so each organization sees a stable, isolated subset of the sample dataset.
  const scope = useMemo(() => {
    return <T,>(items: T[]): T[] => {
      if (!activeOrg || items.length === 0) return items;
      let h = 0;
      for (const c of activeOrg.id) h = (h * 31 + c.charCodeAt(0)) | 0;
      const seed = Math.abs(h);
      // Seed-based rotation keeps every tenant non-empty but distinct.
      const offset = seed % items.length;
      const take = Math.max(1, Math.ceil(items.length * 0.75));
      const rotated = [...items.slice(offset), ...items.slice(0, offset)];
      return rotated.slice(0, take);
    };
  }, [activeOrg]);

  return (
    <TenantCtx.Provider value={{ orgs, activeOrg, setActive, createOrg, updateOrg, setPlan, scope }}>
      {children}
    </TenantCtx.Provider>
  );
}

export function useTenant() {
  const c = useContext(TenantCtx);
  if (!c) throw new Error("useTenant must be used within TenantProvider");
  return c;
}
