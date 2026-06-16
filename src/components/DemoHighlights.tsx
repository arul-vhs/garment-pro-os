import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShoppingBag, Truck, IndianRupee, Users, Building2 } from "lucide-react";
import { demoHighlights, branchPerformance } from "@/lib/mock-data";

export function DemoHighlights() {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">Today at Royal Tailors</CardTitle>
            <p className="text-xs text-muted-foreground">Live demo snapshot · 3 branches · 11 active staff</p>
          </div>
        </div>
        <Badge variant="secondary" className="hidden sm:inline-flex">Demo workspace</Badge>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon={ShoppingBag} label="Orders today"   value={demoHighlights.ordersToday.toString()}                tone="text-primary" />
        <Stat icon={Truck}       label="Delivery due"   value={demoHighlights.deliveryDue.toString()}                 tone="text-info" />
        <Stat icon={IndianRupee} label="Revenue today"  value={`₹${demoHighlights.revenueToday.toLocaleString()}`}   tone="text-success" />
        <Stat icon={Users}       label="Active tailors" value={`${demoHighlights.activeTailors}/${demoHighlights.totalTailors}`} tone="text-warning-foreground" />
      </CardContent>
      <CardContent className="pt-0">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Building2 className="h-3.5 w-3.5" /> Branch performance — this week
        </p>
        <div className="space-y-2">
          {branchPerformance.map((b) => (
            <div key={b.name} className="flex items-center gap-3 text-sm">
              <span className="w-40 truncate text-muted-foreground">{b.name}</span>
              <div className="flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-1.5 rounded-full bg-primary" style={{ width: `${b.utilization}%` }} />
              </div>
              <span className="w-16 text-right font-mono text-xs">{b.orders} ord</span>
              <span className="hidden w-24 text-right font-mono text-xs sm:inline">₹{(b.revenue / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        <Icon className={`h-3.5 w-3.5 ${tone}`} />
      </div>
      <p className="mt-1.5 text-lg font-semibold tracking-tight">{value}</p>
    </div>
  );
}
