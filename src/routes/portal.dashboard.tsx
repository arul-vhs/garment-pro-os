import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Clock, IndianRupee, Bell, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { usePortalAuth } from "@/lib/customer-auth";
import { orders, invoices, notifications } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/portal/dashboard")({ component: PortalDashboard });

const TIMELINE = ["Created", "Cutting", "Stitching", "Quality Check", "Ready for Delivery", "Delivered"];

function PortalDashboard() {
  const { user } = usePortalAuth();
  const { t } = useI18n();
  const my = orders.filter((o) => o.customer === user?.name);
  const myInvoices = invoices.filter((i) => i.customer === user?.name);
  const active = my.filter((o) => o.status !== "Delivered");
  const pendingAmount = myInvoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.total, 0);
  const latest = active[0] ?? my[0];

  const kpis = [
    { label: t("portal.dashboard.kpi.active"), value: active.length.toString(), icon: ShoppingBag, tone: "text-primary" },
    { label: t("portal.dashboard.kpi.next"), value: latest?.delivery ?? "—", icon: Clock, tone: "text-info" },
    { label: t("portal.dashboard.kpi.pending"), value: `₹${pendingAmount.toLocaleString()}`, icon: IndianRupee, tone: "text-warning-foreground" },
    { label: t("portal.dashboard.kpi.notifications"), value: notifications.filter((n) => !n.read).length.toString(), icon: Bell, tone: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("portal.dashboard.welcome")}, {user?.name.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">{t("portal.dashboard.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{k.label}</span>
                <k.icon className={`h-4 w-4 ${k.tone}`} />
              </div>
              <div className="mt-2 text-xl font-semibold tracking-tight">{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {latest && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Order Progress · {latest.id}</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">{latest.garment} · Delivery {latest.delivery}</p>
            </div>
            <Badge variant="secondary">{latest.status}</Badge>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-3 sm:grid-cols-6">
              {TIMELINE.map((stage, idx) => {
                const currentIdx = TIMELINE.indexOf(latest.status as string);
                const done = idx <= currentIdx;
                const active = idx === currentIdx;
                return (
                  <li key={stage} className="flex flex-row items-center gap-2 sm:flex-col sm:items-start">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${done ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
                      {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-medium ${active ? "text-foreground" : done ? "text-foreground" : "text-muted-foreground"}`}>{stage}</p>
                      {active && <p className="text-[10px] text-primary">In progress</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <Button asChild size="sm" variant="ghost"><Link to="/portal/orders">View all<ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {my.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
                <div>
                  <p className="font-medium">{o.garment} · <span className="font-mono text-xs text-muted-foreground">{o.id}</span></p>
                  <p className="text-xs text-muted-foreground">Due {o.delivery}</p>
                </div>
                <Badge variant="secondary">{o.status}</Badge>
              </div>
            ))}
            {my.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No orders yet.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <div key={n.id} className="flex items-start gap-3 text-sm">
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-muted-foreground/40" : "bg-primary"}`} />
                <div className="flex-1">
                  <p className="text-sm">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
