import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orders as allOrders, monthlyRevenue } from "@/lib/mock-data";
import { useTenant } from "@/lib/tenant";
import { useMemo, useState } from "react";
import { TrendingUp, Coins, PiggyBank, Percent } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/finance")({ component: Finance });

const COLORS = ["hsl(var(--primary))", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

function Finance() {
  const { scope } = useTenant();
  const orders = scope(allOrders);

  // Deterministic synthetic cost split per order — keeps demo stable.
  const enriched = useMemo(() => orders.map((o) => {
    const fabric = Math.round(o.amount * 0.35);
    const labor = Math.round(o.amount * 0.20);
    const accessories = Math.round(o.amount * 0.08);
    const misc = Math.round(o.amount * 0.04);
    const totalCost = fabric + labor + accessories + misc;
    const profit = o.amount - totalCost;
    const margin = o.amount > 0 ? (profit / o.amount) * 100 : 0;
    return { ...o, fabric, labor, accessories, misc, totalCost, profit, margin };
  }), [orders]);

  const totals = enriched.reduce((a, o) => ({
    revenue: a.revenue + o.amount,
    cost: a.cost + o.totalCost,
    profit: a.profit + o.profit,
  }), { revenue: 0, cost: 0, profit: 0 });
  const marginAvg = enriched.length ? enriched.reduce((s, o) => s + o.margin, 0) / enriched.length : 0;

  const byCategory = useMemo(() => {
    const m = new Map<string, number>();
    enriched.forEach((o) => m.set(o.garment, (m.get(o.garment) ?? 0) + o.amount));
    return Array.from(m, ([name, value]) => ({ name, value }));
  }, [enriched]);

  const expenseBreakdown = [
    { name: "Fabric",      value: enriched.reduce((s, o) => s + o.fabric, 0) },
    { name: "Labor",       value: enriched.reduce((s, o) => s + o.labor, 0) },
    { name: "Accessories", value: enriched.reduce((s, o) => s + o.accessories, 0) },
    { name: "Misc",        value: enriched.reduce((s, o) => s + o.misc, 0) },
  ];

  const [draft, setDraft] = useState({ fabric: "", labor: "", accessories: "", misc: "" });
  const draftSum = Object.values(draft).reduce((s, v) => s + (Number(v) || 0), 0);

  return (
    <>
      <PageHeader title="Finance & Profit" description="Cost, margin and profitability across every order." />
      <div className="grid gap-3 p-6 lg:grid-cols-4">
        <Kpi icon={Coins}    label="Monthly Revenue" value={`₹${totals.revenue.toLocaleString()}`} />
        <Kpi icon={PiggyBank} label="Total Profit"   value={`₹${totals.profit.toLocaleString()}`} />
        <Kpi icon={Percent}  label="Avg Margin"      value={`${marginAvg.toFixed(1)}%`} />
        <Kpi icon={TrendingUp} label="Profit / Order" value={`₹${enriched.length ? Math.round(totals.profit / enriched.length).toLocaleString() : 0}`} />
      </div>

      <div className="grid gap-4 p-6 pt-0 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Revenue trend</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer><BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} />
              <Tooltip /><Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart></ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Expense breakdown</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer><PieChart>
              <Pie data={expenseBreakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70}>
                {expenseBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart></ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 p-6 pt-0 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Profit per order</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Garment</TableHead><TableHead className="text-right">Revenue</TableHead><TableHead className="text-right">Cost</TableHead><TableHead className="text-right">Profit</TableHead><TableHead className="text-right">Margin</TableHead></TableRow></TableHeader>
              <TableBody>
                {enriched.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell>{o.garment}</TableCell>
                    <TableCell className="text-right">₹{o.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-muted-foreground">₹{o.totalCost.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium text-emerald-600">₹{o.profit.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{o.margin.toFixed(0)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Order costing calculator</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(["fabric", "labor", "accessories", "misc"] as const).map((k) => (
              <div key={k} className="grid gap-1.5"><Label className="capitalize">{k} cost</Label><Input type="number" value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} placeholder="0" /></div>
            ))}
            <div className="rounded-md border border-dashed border-border p-3 text-sm">
              <p className="text-muted-foreground">Estimated total cost</p>
              <p className="text-lg font-semibold">₹{draftSum.toLocaleString()}</p>
            </div>
            <Button className="w-full" variant="outline">Apply to new order</Button>
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
