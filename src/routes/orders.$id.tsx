import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { QRLabel } from "@/components/QRLabel";
import { orders, ORDER_STATUSES } from "@/lib/mock-data";
import { ArrowLeft, Printer, CheckCircle2, Circle } from "lucide-react";

export const Route = createFileRoute("/orders/$id")({
  component: OrderDetail,
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <p className="text-sm text-muted-foreground">Order not found.</p>
      <Button asChild className="mt-4" variant="outline"><Link to="/orders">Back to orders</Link></Button>
    </div>
  ),
});

const TIMELINE = ["Created", "Measurement Confirmed", "Cutting", "Stitching", "Quality Check", "Ready for Delivery", "Delivered"];

function OrderDetail() {
  const { id } = Route.useParams();
  const order = orders.find((o) => o.id === id);
  if (!order) throw notFound();

  const idx = TIMELINE.indexOf(order.status as string);

  return (
    <>
      <PageHeader
        title={`Order ${order.id}`}
        description={`${order.garment} · ${order.customer}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link to="/orders"><ArrowLeft className="mr-1.5 h-4 w-4" />Back</Link></Button>
            <Button variant="outline" onClick={() => window.print()}><Printer className="mr-1.5 h-4 w-4" />Print Label</Button>
          </div>
        }
      />
      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              <Field label="Customer" value={order.customer} />
              <Field label="Garment" value={order.garment} />
              <Field label="Quantity" value={String(order.qty)} />
              <Field label="Tailor" value={order.tailor} />
              <Field label="Order Date" value={order.date} />
              <Field label="Delivery" value={order.delivery} />
              <Field label="Amount" value={`₹${order.amount.toLocaleString()}`} />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Priority</p>
                <div className="mt-1"><StatusBadge status={order.priority} /></div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
                <div className="mt-1"><StatusBadge status={order.status} /></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Production Timeline</CardTitle></CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {TIMELINE.map((stage, i) => {
                  const done = i <= idx;
                  return (
                    <li key={stage} className="flex items-center gap-3">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full ${done ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                        {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                      </div>
                      <span className={`text-sm ${done ? "" : "text-muted-foreground"}`}>{stage}</span>
                      {i === idx && <Badge variant="secondary" className="ml-auto">Current</Badge>}
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">QR · Scan to Open</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <QRLabel
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/orders/${order.id}`}
                title={order.id}
                subtitle={`${order.customer} · ${order.garment}`}
                size={140}
              />
              <p className="text-xs text-muted-foreground">Production floor scans this label to open the job.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
