import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { weeklyOrders, monthlyRevenue, employees } from "@/lib/mock-data";

export const Route = createFileRoute("/reports")({ component: Reports });

const tailorPerf = employees.filter(e => e.role.includes("Tailor")).map(e => ({ name: e.name.split(" ")[0], perf: e.performance, assigned: e.assigned }));
const repeat = [
  { month: "Jan", new: 22, repeat: 18 }, { month: "Feb", new: 28, repeat: 24 },
  { month: "Mar", new: 31, repeat: 32 }, { month: "Apr", new: 35, repeat: 41 }, { month: "May", new: 18, repeat: 26 },
];

function Reports() {
  return (
    <>
      <PageHeader title="Reports" description="Financial, operational, and customer analytics." />
      <div className="p-6">
        <Tabs defaultValue="finance">
          <TabsList>
            <TabsTrigger value="finance">Financial</TabsTrigger>
            <TabsTrigger value="ops">Operations</TabsTrigger>
            <TabsTrigger value="cust">Customer</TabsTrigger>
          </TabsList>
          <TabsContent value="finance" className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-base">Monthly Revenue</CardTitle></CardHeader>
              <CardContent className="h-72"><ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" fontSize={12} stroke="var(--muted-foreground)" /><YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Line dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} /></LineChart>
              </ResponsiveContainer></CardContent>
            </Card>
            <Card><CardHeader><CardTitle className="text-base">Outstanding Payments</CardTitle></CardHeader>
              <CardContent className="space-y-3 p-6">
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Total Outstanding</span><span className="text-2xl font-semibold">₹84,320</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Overdue (7d+)</span><span className="font-medium text-destructive">₹23,140</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Avg. Days to Pay</span><span className="font-medium">11.4</span></div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ops" className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-base">Orders Completed (Weekly)</CardTitle></CardHeader>
              <CardContent className="h-72"><ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyOrders}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" fontSize={12} stroke="var(--muted-foreground)" /><YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Bar dataKey="orders" fill="var(--chart-2)" radius={[6, 6, 0, 0]} /></BarChart>
              </ResponsiveContainer></CardContent>
            </Card>
            <Card><CardHeader><CardTitle className="text-base">Tailor Performance</CardTitle></CardHeader>
              <CardContent className="h-72"><ResponsiveContainer width="100%" height="100%">
                <BarChart data={tailorPerf}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" fontSize={12} stroke="var(--muted-foreground)" /><YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="perf" name="Performance %" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="assigned" name="Assigned" fill="var(--chart-3)" radius={[6, 6, 0, 0]} /></BarChart>
              </ResponsiveContainer></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cust" className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-base">New vs Repeat Customers</CardTitle></CardHeader>
              <CardContent className="h-72"><ResponsiveContainer width="100%" height="100%">
                <BarChart data={repeat}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" fontSize={12} stroke="var(--muted-foreground)" /><YAxis fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="new" name="New" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="repeat" name="Repeat" fill="var(--chart-1)" radius={[6, 6, 0, 0]} /></BarChart>
              </ResponsiveContainer></CardContent>
            </Card>
            <Card><CardHeader><CardTitle className="text-base">Customer Snapshot</CardTitle></CardHeader>
              <CardContent className="space-y-3 p-6">
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Total Customers</span><span className="text-2xl font-semibold">486</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Repeat Rate</span><span className="font-medium text-success">62%</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Avg. Order Value</span><span className="font-medium">₹6,840</span></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
