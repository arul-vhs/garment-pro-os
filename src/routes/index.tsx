import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag, Clock, CheckCircle2, IndianRupee, AlertTriangle, TrendingUp, Plus,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from "recharts";
import { weeklyOrders, monthlyRevenue, productionStatus, activityFeed } from "@/lib/mock-data";
import { DemoHighlights } from "@/components/DemoHighlights";

export const Route = createFileRoute("/")({ component: Dashboard });

const kpis = [
  { label: "Total Orders", value: "1,284", delta: "+12.4%", icon: ShoppingBag, tone: "text-primary" },
  { label: "In Progress", value: "47", delta: "+6", icon: Clock, tone: "text-info" },
  { label: "Delivered", value: "1,198", delta: "+8.1%", icon: CheckCircle2, tone: "text-success" },
  { label: "Pending Payments", value: "₹84,320", delta: "12 invoices", icon: IndianRupee, tone: "text-warning-foreground" },
  { label: "Revenue Today", value: "₹38,450", delta: "+18%", icon: TrendingUp, tone: "text-success" },
  { label: "Low Stock Alerts", value: "3", delta: "needs reorder", icon: AlertTriangle, tone: "text-destructive" },
];

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Dashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Live overview of your atelier — orders, production, revenue, and stock."
        actions={<Button asChild><Link to="/orders"><Plus className="mr-1.5 h-4 w-4" />New Order</Link></Button>}
      />
      <div className="space-y-6 p-6">
        <DemoHighlights />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {kpis.map((k) => (
            <Card key={k.label} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{k.label}</span>
                  <k.icon className={`h-4 w-4 ${k.tone}`} />
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">{k.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{k.delta}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Weekly Orders</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyOrders}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar dataKey="orders" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Production Status</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={productionStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                    {productionStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Monthly Revenue</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {activityFeed.map((a, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate"><span className="font-medium">{a.who}</span> {a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
