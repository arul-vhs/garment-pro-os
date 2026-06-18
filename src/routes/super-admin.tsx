import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTenant } from "@/lib/tenant";
import { useAudit } from "@/lib/audit";
import { useAuth } from "@/lib/auth";
import { Building2, Users2, IndianRupee, Activity, MoreHorizontal, TrendingDown, ArrowUpCircle, PauseCircle, PlayCircle } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/super-admin")({ component: SuperAdmin });

type TenantStatus = "active" | "trialing" | "past_due" | "suspended";
type TenantRow = {
  id: string; name: string; plan: "Starter" | "Growth" | "Enterprise";
  users: number; mrr: number; status: TenantStatus; orders: number; since: string; churnRisk: "low" | "medium" | "high";
};

const SEED: TenantRow[] = [
  { id: "t1", name: "Atelier Kumar Tailors",     plan: "Growth",     users: 8,  mrr: 1499, status: "active",   orders: 412,  since: "2024-09", churnRisk: "low"    },
  { id: "t2", name: "Bombay Bespoke Co.",        plan: "Enterprise", users: 32, mrr: 3999, status: "active",   orders: 1287, since: "2024-03", churnRisk: "low"    },
  { id: "t3", name: "Chennai Silk House",        plan: "Growth",     users: 6,  mrr: 1499, status: "trialing", orders: 89,   since: "2026-04", churnRisk: "medium" },
  { id: "t4", name: "Delhi Designer Studio",     plan: "Starter",    users: 3,  mrr: 0,    status: "active",   orders: 45,   since: "2026-02", churnRisk: "high"   },
  { id: "t5", name: "Pune Premium Tailors",      plan: "Enterprise", users: 24, mrr: 3999, status: "past_due", orders: 654,  since: "2025-06", churnRisk: "high"   },
];

const REVENUE = [
  { m: "Dec", r: 18500 }, { m: "Jan", r: 22400 }, { m: "Feb", r: 26800 },
  { m: "Mar", r: 29200 }, { m: "Apr", r: 31900 }, { m: "May", r: 34995 },
];

function statusVariant(s: TenantStatus) {
  return s === "active" ? "default" : s === "trialing" ? "secondary" : s === "past_due" ? "destructive" : "outline";
}

function SuperAdmin() {
  const { orgs } = useTenant();
  const { log } = useAudit();
  const { user } = useAuth();
  const [tenants, setTenants] = useState<TenantRow[]>(SEED);

  const totalMRR = tenants.filter((t) => t.status !== "suspended").reduce((s, t) => s + t.mrr, 0);
  const activeCount = tenants.filter((t) => t.status === "active").length;
  const churnAtRisk = tenants.filter((t) => t.churnRisk === "high").length;

  const auditAction = (action: string, target: string, after: string) =>
    log({ module: "SuperAdmin", action, target, after, userId: user?.id ?? "system", userName: user?.fullName ?? "System" });

  const update = (id: string, patch: Partial<TenantRow>, action: string, msg: string) => {
    setTenants((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    const tenant = tenants.find((t) => t.id === id);
    if (tenant) auditAction(action, tenant.name, msg);
    toast.success(msg);
  };

  return (
    <>
      <PageHeader title="Super Admin" description="Platform-wide health, tenants and revenue." />
      <div className="grid gap-3 p-6 lg:grid-cols-4">
        <Kpi icon={Building2} label="Active tenants" value={activeCount.toString()} />
        <Kpi icon={Users2} label="Total seats" value={tenants.reduce((s, t) => s + t.users, 0).toString()} />
        <Kpi icon={IndianRupee} label="Platform MRR" value={`₹${totalMRR.toLocaleString()}`} />
        <Kpi icon={TrendingDown} label="Churn risk" value={`${churnAtRisk} tenants`} />
      </div>

      <div className="grid gap-4 p-6 pt-0 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Platform revenue (MRR)</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer><AreaChart data={REVENUE}>
              <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="m" fontSize={12} /><YAxis fontSize={12} />
              <Tooltip /><Area dataKey="r" stroke="hsl(var(--primary))" fill="url(#g)" />
            </AreaChart></ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Your workspaces</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {orgs.length === 0 && <p className="text-muted-foreground">No organizations yet.</p>}
            {orgs.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-md border border-border p-2">
                <span className="font-medium">{o.name}</span><Badge variant="secondary">{o.plan}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="p-6 pt-0">
        <Card>
          <CardHeader><CardTitle className="text-base">Tenant directory</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead><TableHead>Plan</TableHead>
                  <TableHead>Users</TableHead><TableHead>Orders</TableHead>
                  <TableHead className="text-right">MRR</TableHead>
                  <TableHead>Since</TableHead><TableHead>Risk</TableHead>
                  <TableHead>Status</TableHead><TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.plan}</TableCell>
                    <TableCell>{t.users}</TableCell>
                    <TableCell>{t.orders.toLocaleString()}</TableCell>
                    <TableCell className="text-right">₹{t.mrr.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{t.since}</TableCell>
                    <TableCell>
                      <Badge variant={t.churnRisk === "high" ? "destructive" : t.churnRisk === "medium" ? "secondary" : "outline"}>
                        {t.churnRisk}
                      </Badge>
                    </TableCell>
                    <TableCell><Badge variant={statusVariant(t.status)}>{t.status}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t.name}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {t.status !== "active" && (
                            <DropdownMenuItem onClick={() => update(t.id, { status: "active" }, "activate", `${t.name} activated`)}>
                              <PlayCircle className="mr-2 h-4 w-4" />Activate
                            </DropdownMenuItem>
                          )}
                          {t.status !== "suspended" && (
                            <DropdownMenuItem onClick={() => update(t.id, { status: "suspended", mrr: 0 }, "suspend", `${t.name} suspended`)}>
                              <PauseCircle className="mr-2 h-4 w-4" />Suspend
                            </DropdownMenuItem>
                          )}
                          {t.plan !== "Enterprise" && (
                            <DropdownMenuItem onClick={() => update(t.id, { plan: "Enterprise", mrr: 3999, status: "active" }, "upgrade", `${t.name} upgraded to Enterprise`)}>
                              <ArrowUpCircle className="mr-2 h-4 w-4" />Upgrade to Enterprise
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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

function Kpi({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <Card><CardContent className="flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
      <div><p className="text-xs text-muted-foreground">{label}</p><p className="text-lg font-semibold">{value}</p></div>
    </CardContent></Card>
  );
}
