// Subscription / billing abstraction. Gateway-agnostic so it can later wire
// into Stripe, Razorpay, or any provider via a Provider implementation.

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useTenant } from "@/lib/tenant";

export type BillingCycle = "monthly" | "yearly";
export type SubStatus = "trialing" | "active" | "past_due" | "canceled";

export type SubscriptionPlan = {
  id: "starter" | "growth" | "enterprise";
  name: string;
  priceMonthly: number;
  priceYearly: number;
  seats: number;
  features: string[];
};

export const PLAN_CATALOG: SubscriptionPlan[] = [
  { id: "starter",    name: "Starter",    priceMonthly: 0,    priceYearly: 0,     seats: 3,   features: ["3 users", "100 orders / mo", "Email support"] },
  { id: "growth",     name: "Growth",     priceMonthly: 1499, priceYearly: 14990, seats: 10,  features: ["10 users", "Unlimited orders", "WhatsApp templates", "Multi-branch (2)"] },
  { id: "enterprise", name: "Enterprise", priceMonthly: 3999, priceYearly: 39990, seats: 50,  features: ["50 users", "Multi-branch (unlimited)", "Advanced analytics", "Audit log retention", "Dedicated manager"] },
];

export type Subscription = {
  orgId: string;
  planId: SubscriptionPlan["id"];
  cycle: BillingCycle;
  status: SubStatus;
  renewsAt: number;
  trialEndsAt?: number;
  history: Array<{ id: string; ts: number; planId: string; amount: number; status: "paid" | "refunded" | "pending"; method: string }>;
};

export interface PaymentGateway {
  name: string;
  charge: (orgId: string, amount: number, label: string) => Promise<{ id: string; status: "paid" | "pending" }>;
}

const MockGateway: PaymentGateway = {
  name: "mock",
  charge: async (_orgId, _amount, _label) => {
    await new Promise((r) => setTimeout(r, 400));
    return { id: `pay_${Date.now()}`, status: "paid" };
  },
};

let activeGateway: PaymentGateway = MockGateway;
export function registerGateway(g: PaymentGateway) { activeGateway = g; }
export function getGateway() { return activeGateway; }

const KEY = "tailorerp.subscriptions";

function loadAll(): Record<string, Subscription> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function saveAll(v: Record<string, Subscription>) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(v));
}

type Ctx = {
  subscription: Subscription | null;
  plan: SubscriptionPlan | null;
  changePlan: (planId: SubscriptionPlan["id"], cycle?: BillingCycle) => Promise<void>;
  cancel: () => void;
  refresh: () => void;
};
const SubCtx = createContext<Ctx | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { activeOrg } = useTenant();
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    if (!activeOrg) { setSubscription(null); return; }
    const all = loadAll();
    let sub = all[activeOrg.id];
    if (!sub) {
      sub = {
        orgId: activeOrg.id,
        planId: activeOrg.plan === "scale" ? "enterprise" : (activeOrg.plan as Subscription["planId"]) || "starter",
        cycle: "monthly",
        status: "trialing",
        trialEndsAt: Date.now() + 1000 * 60 * 60 * 24 * 14,
        renewsAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
        history: [
          { id: "h1", ts: Date.now() - 1000 * 60 * 60 * 24 * 30, planId: "growth", amount: 1499, status: "paid",    method: "UPI" },
          { id: "h2", ts: Date.now() - 1000 * 60 * 60 * 24 * 60, planId: "growth", amount: 1499, status: "paid",    method: "Card" },
          { id: "h3", ts: Date.now() - 1000 * 60 * 60 * 24 * 90, planId: "starter", amount: 0,    status: "paid",    method: "—" },
        ],
      };
      all[activeOrg.id] = sub;
      saveAll(all);
    }
    setSubscription(sub);
  }, [activeOrg]);

  const persist = (s: Subscription) => {
    const all = loadAll();
    all[s.orgId] = s;
    saveAll(all);
    setSubscription(s);
  };

  const changePlan: Ctx["changePlan"] = async (planId, cycle) => {
    if (!subscription) return;
    const plan = PLAN_CATALOG.find((p) => p.id === planId)!;
    const c = cycle ?? subscription.cycle;
    const amount = c === "yearly" ? plan.priceYearly : plan.priceMonthly;
    const charge = await activeGateway.charge(subscription.orgId, amount, `${plan.name} (${c})`);
    persist({
      ...subscription,
      planId,
      cycle: c,
      status: "active",
      renewsAt: Date.now() + 1000 * 60 * 60 * 24 * (c === "yearly" ? 365 : 30),
      history: [{ id: charge.id, ts: Date.now(), planId, amount, status: charge.status, method: activeGateway.name }, ...subscription.history],
    });
  };

  const cancel = () => { if (subscription) persist({ ...subscription, status: "canceled" }); };
  const refresh = () => { if (activeOrg) setSubscription(loadAll()[activeOrg.id] || null); };

  const plan = subscription ? PLAN_CATALOG.find((p) => p.id === subscription.planId) ?? null : null;
  return <SubCtx.Provider value={{ subscription, plan, changePlan, cancel, refresh }}>{children}</SubCtx.Provider>;
}

export function useSubscription() {
  const c = useContext(SubCtx);
  if (!c) throw new Error("useSubscription must be used within SubscriptionProvider");
  return c;
}
