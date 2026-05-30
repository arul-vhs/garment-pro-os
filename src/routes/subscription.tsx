import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSubscription, PLAN_CATALOG, type BillingCycle } from "@/lib/subscription";
import { useState } from "react";
import { Check, CreditCard, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/subscription")({ component: SubscriptionPage });

function SubscriptionPage() {
  const { subscription, plan, changePlan, cancel } = useSubscription();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [busy, setBusy] = useState<string | null>(null);

  if (!subscription) return null;

  const upgrade = async (planId: typeof PLAN_CATALOG[number]["id"]) => {
    setBusy(planId);
    try { await changePlan(planId, cycle); toast.success("Plan updated"); } catch { toast.error("Payment failed"); }
    setBusy(null);
  };

  const trialDays = subscription.trialEndsAt ? Math.max(0, Math.ceil((subscription.trialEndsAt - Date.now()) / 86400000)) : 0;

  return (
    <>
      <PageHeader title="Subscription & Billing" description="Manage your plan, payment cycle and billing history." actions={
        <div className="flex rounded-md border border-border bg-card p-0.5 text-xs">
          {(["monthly", "yearly"] as const).map((c) => (
            <button key={c} onClick={() => setCycle(c)} className={`rounded px-3 py-1.5 capitalize transition ${cycle === c ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{c}</button>
          ))}
        </div>
      } />
      <div className="grid gap-4 p-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Current plan</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-semibold">{plan?.name}</p>
                <p className="text-xs text-muted-foreground">Renews on {new Date(subscription.renewsAt).toLocaleDateString()}</p>
              </div>
              <Badge variant={subscription.status === "active" ? "default" : subscription.status === "trialing" ? "secondary" : "destructive"}>{subscription.status}</Badge>
            </div>
            {subscription.status === "trialing" && (
              <div className="flex items-center gap-2 rounded-md bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                <Sparkles className="h-4 w-4" /> {trialDays} day{trialDays !== 1 ? "s" : ""} left in trial
              </div>
            )}
            <Button variant="outline" onClick={() => { cancel(); toast.message("Subscription cancelled"); }}>Cancel subscription</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Payment</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-muted-foreground" />Gateway-agnostic — Stripe & Razorpay ready</div>
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-muted-foreground" />PCI-compliant via abstraction layer</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 p-6 pt-0 md:grid-cols-3">
        {PLAN_CATALOG.map((p) => {
          const active = subscription.planId === p.id;
          const price = cycle === "yearly" ? p.priceYearly : p.priceMonthly;
          return (
            <Card key={p.id} className={active ? "ring-1 ring-primary" : ""}>
              <CardHeader>
                <CardTitle className="text-base">{p.name}</CardTitle>
                <p className="mt-1"><span className="text-2xl font-semibold">₹{price.toLocaleString()}</span><span className="text-xs text-muted-foreground"> / {cycle === "yearly" ? "year" : "month"}</span></p>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-1.5 text-sm">
                  {p.features.map((f) => <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-500" />{f}</li>)}
                </ul>
                <Button className="w-full" variant={active ? "outline" : "default"} disabled={active || busy === p.id} onClick={() => upgrade(p.id)}>
                  {busy === p.id ? "Processing…" : active ? "Current plan" : "Switch to this plan"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="p-6 pt-0">
        <Card>
          <CardHeader><CardTitle className="text-base">Billing history</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Plan</TableHead><TableHead>Method</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {subscription.history.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell className="text-xs">{new Date(h.ts).toLocaleDateString()}</TableCell>
                    <TableCell className="capitalize">{h.planId}</TableCell>
                    <TableCell>{h.method}</TableCell>
                    <TableCell className="text-right">₹{h.amount.toLocaleString()}</TableCell>
                    <TableCell><Badge variant={h.status === "paid" ? "default" : "secondary"}>{h.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
