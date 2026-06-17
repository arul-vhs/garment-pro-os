import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import {
  orders, invoices, customers, employees, inventory,
  weeklyOrders, monthlyRevenue, productionStatus, profitRecords, branchPerformance,
} from "@/lib/mock-data";
import { exportCSV, exportPDF, type ExportColumn } from "@/lib/export-service";

export const Route = createFileRoute("/reports-center")({ component: ReportsCenter });

const INR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const PCT = (n: number) => `${n.toFixed(1)}%`;
const C1 = "var(--chart-1)", C2 = "var(--chart-2)", C3 = "var(--chart-3)", C4 = "var(--chart-4)", C5 = "var(--chart-5)";

function Kpi({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: "success" | "warn" | "danger" }) {
  const toneCls = tone === "success" ? "text-success" : tone === "warn" ? "text-amber-500" : tone === "danger" ? "text-destructive" : "";
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className={`mt-2 text-2xl font-semibold tabular-nums ${toneCls}`}>{value}</div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="h-72">{children}</CardContent>
    </Card>
  );
}

function ExportBar({ onCSV, onPDF, label }: { onCSV: () => void; onPDF: () => void; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Button variant="outline" size="sm" onClick={onCSV}><Download className="mr-1.5 h-3.5 w-3.5" />CSV</Button>
      <Button variant="outline" size="sm" onClick={onPDF}><FileText className="mr-1.5 h-3.5 w-3.5" />PDF</Button>
    </div>
  );
}

function ReportsCenter() {
  /* ---------- FINANCIAL ---------- */
  const finance = useMemo(() => {
    const totalRevenue = invoices.reduce((s, i) => s + i.total, 0);
    const outstanding = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.total, 0);
    const totalProfit = profitRecords.reduce((s, p) => s + p.profit, 0);
    const totalRev = profitRecords.reduce((s, p) => s + p.revenue, 0);
    const margin = totalRev ? (totalProfit / totalRev) * 100 : 0;
    const profitTrend = monthlyRevenue.map((m, i) => ({ month: m.month, profit: Math.round(m.revenue * (0.18 + i * 0.012)) }));
    const revByBranch = branchPerformance.map((b) => ({ name: b.name, revenue: b.revenue }));
    return { totalRevenue, outstanding, totalProfit, margin, profitTrend, revByBranch };
  }, []);

  /* ---------- OPERATIONS ---------- */
  const ops = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const delayed = orders.filter((o) => o.status !== "Delivered" && new Date(o.delivery) < new Date("2026-06-12")).length;
    const completion = (delivered / total) * 100;
    const delayRate = (delayed / total) * 100;
    const trialSuccess = 92.4;
    const avgDelivery = 9.2;
    return { completion, delayRate, trialSuccess, avgDelivery, total, delivered, delayed };
  }, []);

  /* ---------- CUSTOMER ---------- */
  const cust = useMemo(() => {
    const repeat = customers.filter((c) => c.totalOrders >= 5).length;
    const repeatPct = (repeat / customers.length) * 100;
    const ltv = invoices.reduce((s, i) => s + i.total, 0) / customers.length;
    const orderFreq = orders.length / customers.length;
    const newRepeat = [
      { month: "Jan", new: 22, repeat: 18 }, { month: "Feb", new: 28, repeat: 24 },
      { month: "Mar", new: 31, repeat: 32 }, { month: "Apr", new: 35, repeat: 41 },
      { month: "May", new: 18, repeat: 26 }, { month: "Jun", new: 24, repeat: 34 },
    ];
    const growth = newRepeat.map((m, i, arr) => ({ month: m.month, total: arr.slice(0, i + 1).reduce((s, x) => s + x.new + x.repeat, 0) }));
    return { repeat, repeatPct, ltv, orderFreq, newRepeat, growth };
  }, []);

  /* ---------- INVENTORY ---------- */
  const inv = useMemo(() => {
    const totalValue = inventory.reduce((s, i) => s + i.qty * 220, 0);
    const lowStock = inventory.filter((i) => i.status === "Low Stock");
    const consumption = inventory.map((i) => ({ name: i.name.split(" — ")[0].slice(0, 14), used: Math.round(i.qty * 0.4 + 5) }));
    const fastMoving = [...inventory].sort((a, b) => b.qty - a.qty).slice(0, 4);
    const deadStock = inventory.filter((i) => i.category === "Accessories" || i.category === "Linings").slice(0, 3);
    return { totalValue, lowStock, consumption, fastMoving, deadStock };
  }, []);

  /* ---------- BRANCH ---------- */
  const branch = useMemo(() => {
    const rows = branchPerformance.map((b) => ({
      ...b,
      profit: Math.round(b.revenue * 0.22),
      productivity: Math.round((b.orders / b.utilization) * 100),
    }));
    return { rows };
  }, []);

  /* ---------- EXPORT HELPERS ---------- */
  const dl = (name: string, cols: ExportColumn[], rows: any[], title: string, meta?: Record<string, string | number>) => ({
    csv: () => exportCSV(name, cols, rows),
    pdf: () => exportPDF({ title, subtitle: "TailorERP · Reports Center", columns: cols, rows, meta }),
  });

  const revExp = dl(
    "revenue-trend",
    [
      { key: "month", label: "Month" },
      { key: "revenue", label: "Revenue (₹)", format: (v) => v.toLocaleString("en-IN") },
    ],
    monthlyRevenue,
    "Monthly Revenue",
    { "Total Revenue": INR(finance.totalRevenue), "Outstanding": INR(finance.outstanding) },
  );

  const profitExp = dl(
    "profit-by-order",
    [
      { key: "orderId", label: "Order" }, { key: "customer", label: "Customer" }, { key: "branch", label: "Branch" },
      { key: "revenue", label: "Revenue" }, { key: "profit", label: "Profit" }, { key: "margin", label: "Margin %" },
    ],
    profitRecords,
    "Order Profitability",
  );

  const opsExp = dl(
    "orders-operations",
    [
      { key: "id", label: "Order" }, { key: "customer", label: "Customer" }, { key: "garment", label: "Garment" },
      { key: "status", label: "Status" }, { key: "delivery", label: "Delivery" }, { key: "branch", label: "Branch" },
    ],
    orders,
    "Operations — Order Pipeline",
    { "Completion Rate": PCT(ops.completion), "Delay Rate": PCT(ops.delayRate) },
  );

  const custExp = dl(
    "customer-report",
    [
      { key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "mobile", label: "Mobile" },
      { key: "totalOrders", label: "Total Orders" }, { key: "lastOrder", label: "Last Order" },
    ],
    customers,
    "Customer Report",
    { "Repeat %": PCT(cust.repeatPct), "Avg LTV": INR(cust.ltv) },
  );

  const invExp = dl(
    "inventory-report",
    [
      { key: "id", label: "ID" }, { key: "name", label: "Item" }, { key: "category", label: "Category" },
      { key: "qty", label: "Qty" }, { key: "unit", label: "Unit" }, { key: "status", label: "Status" },
    ],
    inventory,
    "Inventory Report",
    { "Inventory Value": INR(inv.totalValue), "Low Stock Items": inv.lowStock.length },
  );

  const branchExp = dl(
    "branch-report",
    [
      { key: "name", label: "Branch" }, { key: "city", label: "City" }, { key: "orders", label: "Orders" },
      { key: "revenue", label: "Revenue" }, { key: "profit", label: "Profit" }, { key: "utilization", label: "Utilization %" },
    ],
    branch.rows,
    "Branch Performance",
  );

  const grid = "grid grid-cols-1 gap-4 lg:grid-cols-4";
  const chartGrid = "mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2";

  return (
    <>
      <PageHeader
        title="Reports Center"
        description="Executive analytics across finance, operations, customers, inventory, and branches."
      />
      <div className="p-6">
        <Tabs defaultValue="finance">
          <TabsList>
            <TabsTrigger value="finance">Financial</TabsTrigger>
            <TabsTrigger value="ops">Operations</TabsTrigger>
            <TabsTrigger value="cust">Customer</TabsTrigger>
            <TabsTrigger value="inv">Inventory</TabsTrigger>
            <TabsTrigger value="branch">Branch</TabsTrigger>
          </TabsList>

          {/* ---------- FINANCIAL ---------- */}
          <TabsContent value="finance" className="mt-4 space-y-4">
            <div className={grid}>
              <Kpi label="Total Revenue" value={INR(finance.totalRevenue)} hint="All invoices" />
              <Kpi label="Total Profit" value={INR(finance.totalProfit)} tone="success" />
              <Kpi label="Profit Margin" value={PCT(finance.margin)} />
              <Kpi label="Pending Collections" value={INR(finance.outstanding)} tone="warn" />
            </div>
            <div className={chartGrid}>
              <ChartCard title="Revenue Trend" action={<ExportBar label="Revenue" onCSV={revExp.csv} onPDF={revExp.pdf} />}>
                <ResponsiveContainer><AreaChart data={monthlyRevenue}>
                  <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C1} stopOpacity={0.4} /><stop offset="100%" stopColor={C1} stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Area dataKey="revenue" stroke={C1} fill="url(#rg)" strokeWidth={2.5} />
                </AreaChart></ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Monthly Profit" action={<ExportBar label="Profit" onCSV={profitExp.csv} onPDF={profitExp.pdf} />}>
                <ResponsiveContainer><LineChart data={finance.profitTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Line dataKey="profit" stroke={C2} strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart></ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Outstanding Payments">
                <ResponsiveContainer><BarChart data={invoices.filter(i => i.status !== "Paid").map(i => ({ name: i.id.slice(-4), amount: i.total }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" fontSize={11} stroke="var(--muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Bar dataKey="amount" fill={C4} radius={[6, 6, 0, 0]} />
                </BarChart></ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Revenue by Branch">
                <ResponsiveContainer><BarChart data={finance.revByBranch}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" fontSize={11} stroke="var(--muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Bar dataKey="revenue" fill={C3} radius={[6, 6, 0, 0]} />
                </BarChart></ResponsiveContainer>
              </ChartCard>
            </div>
          </TabsContent>

          {/* ---------- OPERATIONS ---------- */}
          <TabsContent value="ops" className="mt-4 space-y-4">
            <div className={grid}>
              <Kpi label="Completion Rate" value={PCT(ops.completion)} tone="success" hint={`${ops.delivered}/${ops.total} orders`} />
              <Kpi label="Delay Rate" value={PCT(ops.delayRate)} tone="danger" hint={`${ops.delayed} overdue`} />
              <Kpi label="Trial Success" value={PCT(ops.trialSuccess)} />
              <Kpi label="Avg Delivery Time" value={`${ops.avgDelivery} days`} />
            </div>
            <div className={chartGrid}>
              <ChartCard title="Orders Completed (Weekly)" action={<ExportBar label="Orders" onCSV={opsExp.csv} onPDF={opsExp.pdf} />}>
                <ResponsiveContainer><BarChart data={weeklyOrders}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Bar dataKey="orders" fill={C2} radius={[6, 6, 0, 0]} />
                </BarChart></ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Orders Delayed">
                <ResponsiveContainer><LineChart data={weeklyOrders.map((d, i) => ({ day: d.day, delayed: Math.round(d.orders * (0.08 + (i % 3) * 0.04)) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Line dataKey="delayed" stroke={C4} strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart></ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Average Delivery Time (days)">
                <ResponsiveContainer><AreaChart data={monthlyRevenue.map((m, i) => ({ month: m.month, days: 10 - i * 0.2 + (i % 2) }))}>
                  <defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C3} stopOpacity={0.4} /><stop offset="100%" stopColor={C3} stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Area dataKey="days" stroke={C3} fill="url(#dg)" strokeWidth={2.5} />
                </AreaChart></ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Production Stage Distribution">
                <ResponsiveContainer><PieChart>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Pie data={productionStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {productionStatus.map((_, i) => (<Cell key={i} fill={[C1, C2, C3, C4, C5][i % 5]} />))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart></ResponsiveContainer>
              </ChartCard>
            </div>
          </TabsContent>

          {/* ---------- CUSTOMER ---------- */}
          <TabsContent value="cust" className="mt-4 space-y-4">
            <div className={grid}>
              <Kpi label="Lifetime Value (avg)" value={INR(cust.ltv)} />
              <Kpi label="Repeat Percentage" value={PCT(cust.repeatPct)} tone="success" />
              <Kpi label="Order Frequency" value={`${cust.orderFreq.toFixed(1)}x`} hint="per customer" />
              <Kpi label="Total Customers" value={String(customers.length)} />
            </div>
            <div className={chartGrid}>
              <ChartCard title="New vs Repeat Customers" action={<ExportBar label="Customers" onCSV={custExp.csv} onPDF={custExp.pdf} />}>
                <ResponsiveContainer><BarChart data={cust.newRepeat}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="new" name="New" fill={C3} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="repeat" name="Repeat" fill={C1} radius={[6, 6, 0, 0]} />
                </BarChart></ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Customer Growth (cumulative)">
                <ResponsiveContainer><AreaChart data={cust.growth}>
                  <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C2} stopOpacity={0.4} /><stop offset="100%" stopColor={C2} stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Area dataKey="total" stroke={C2} fill="url(#cg)" strokeWidth={2.5} />
                </AreaChart></ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Top Customers by Orders">
                <ResponsiveContainer><BarChart layout="vertical" data={[...customers].sort((a, b) => b.totalOrders - a.totalOrders).slice(0, 8).map(c => ({ name: c.name.split(" ")[0], orders: c.totalOrders }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis dataKey="name" type="category" fontSize={11} stroke="var(--muted-foreground)" width={70} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Bar dataKey="orders" fill={C1} radius={[0, 6, 6, 0]} />
                </BarChart></ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Repeat vs One-time">
                <ResponsiveContainer><PieChart>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Pie dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}
                    data={[{ name: "Repeat", value: cust.repeat }, { name: "Occasional", value: customers.length - cust.repeat }]}>
                    <Cell fill={C1} /><Cell fill={C3} />
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart></ResponsiveContainer>
              </ChartCard>
            </div>
          </TabsContent>

          {/* ---------- INVENTORY ---------- */}
          <TabsContent value="inv" className="mt-4 space-y-4">
            <div className={grid}>
              <Kpi label="Inventory Value" value={INR(inv.totalValue)} />
              <Kpi label="Low Stock Items" value={String(inv.lowStock.length)} tone="warn" />
              <Kpi label="Fast Moving" value={String(inv.fastMoving.length)} tone="success" />
              <Kpi label="Dead Stock" value={String(inv.deadStock.length)} tone="danger" />
            </div>
            <div className={chartGrid}>
              <ChartCard title="Material Consumption" action={<ExportBar label="Inventory" onCSV={invExp.csv} onPDF={invExp.pdf} />}>
                <ResponsiveContainer><BarChart data={inv.consumption}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" fontSize={10} stroke="var(--muted-foreground)" interval={0} angle={-25} textAnchor="end" height={60} />
                  <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Bar dataKey="used" fill={C2} radius={[6, 6, 0, 0]} />
                </BarChart></ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Inventory Usage Trend">
                <ResponsiveContainer><LineChart data={monthlyRevenue.map((m, i) => ({ month: m.month, usage: 120 + i * 15 + (i % 2) * 20 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Line dataKey="usage" stroke={C1} strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart></ResponsiveContainer>
              </ChartCard>
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2"><CardTitle className="text-base">Low Stock Items</CardTitle></CardHeader>
                <CardContent>
                  <Table><TableHeader><TableRow>
                    <TableHead>ID</TableHead><TableHead>Item</TableHead><TableHead>Category</TableHead>
                    <TableHead className="text-right">Qty</TableHead><TableHead>Supplier</TableHead><TableHead>Status</TableHead>
                  </TableRow></TableHeader>
                    <TableBody>
                      {inv.lowStock.map((i) => (
                        <TableRow key={i.id}>
                          <TableCell className="font-mono text-xs">{i.id}</TableCell>
                          <TableCell>{i.name}</TableCell>
                          <TableCell>{i.category}</TableCell>
                          <TableCell className="text-right">{i.qty} {i.unit}</TableCell>
                          <TableCell>{i.supplier}</TableCell>
                          <TableCell><Badge variant="outline" className="border-amber-500/40 text-amber-500">{i.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ---------- BRANCH ---------- */}
          <TabsContent value="branch" className="mt-4 space-y-4">
            <div className={chartGrid}>
              <ChartCard title="Branch Revenue" action={<ExportBar label="Branches" onCSV={branchExp.csv} onPDF={branchExp.pdf} />}>
                <ResponsiveContainer><BarChart data={branch.rows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" fontSize={11} stroke="var(--muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Bar dataKey="revenue" fill={C1} radius={[6, 6, 0, 0]} />
                </BarChart></ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Branch Utilization (%)">
                <ResponsiveContainer><BarChart data={branch.rows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" fontSize={11} stroke="var(--muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--muted-foreground)" domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Bar dataKey="utilization" fill={C3} radius={[6, 6, 0, 0]} />
                </BarChart></ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Branch Productivity (orders / utilization)">
                <ResponsiveContainer><BarChart data={branch.rows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" fontSize={11} stroke="var(--muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Bar dataKey="productivity" fill={C2} radius={[6, 6, 0, 0]} />
                </BarChart></ResponsiveContainer>
              </ChartCard>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Top Performers (Tailors)</CardTitle></CardHeader>
                <CardContent className="space-y-2 p-4">
                  {employees.filter(e => e.role.includes("Tailor")).slice(0, 5).map(e => (
                    <div key={e.id} className="flex items-center justify-between rounded-md border border-border p-2 px-3">
                      <div><div className="text-sm font-medium">{e.name}</div><div className="text-xs text-muted-foreground">{e.role}</div></div>
                      <div className="text-right"><div className="text-sm font-semibold text-success">{e.performance}%</div><div className="text-xs text-muted-foreground">{e.assigned} orders</div></div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">Branch Comparison</CardTitle>
                <ExportBar label="Comparison" onCSV={branchExp.csv} onPDF={branchExp.pdf} />
              </CardHeader>
              <CardContent>
                <Table><TableHeader><TableRow>
                  <TableHead>Branch</TableHead><TableHead>City</TableHead>
                  <TableHead className="text-right">Orders</TableHead><TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Profit</TableHead><TableHead className="text-right">Utilization</TableHead>
                </TableRow></TableHeader>
                  <TableBody>
                    {branch.rows.map((b) => (
                      <TableRow key={b.name}>
                        <TableCell className="font-medium">{b.name}</TableCell>
                        <TableCell>{b.city}</TableCell>
                        <TableCell className="text-right tabular-nums">{b.orders}</TableCell>
                        <TableCell className="text-right tabular-nums">{INR(b.revenue)}</TableCell>
                        <TableCell className="text-right tabular-nums text-success">{INR(b.profit)}</TableCell>
                        <TableCell className="text-right tabular-nums">{b.utilization}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
