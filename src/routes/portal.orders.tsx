import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight, MessageSquarePlus, CheckCircle2, Circle, ShoppingBag } from "lucide-react";
import { QRLabel } from "@/components/QRLabel";
import { EmptyState } from "@/components/EmptyState";
import { usePortalAuth } from "@/lib/customer-auth";
import { orders, ORDER_STATUSES } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/orders")({ component: PortalOrders });

const TIMELINE = ["Created", "Cutting", "Stitching", "Quality Check", "Ready for Delivery", "Delivered"];
const PAGE = 5;

function PortalOrders() {
  const { user } = usePortalAuth();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);

  const mine = useMemo(() => orders.filter((o) => o.customer === user?.name), [user]);
  const filtered = mine.filter((o) => {
    if (status !== "all" && o.status !== status) return false;
    if (!q) return true;
    return `${o.id} ${o.garment}`.toLowerCase().includes(q.toLowerCase());
  });
  const total = Math.max(1, Math.ceil(filtered.length / PAGE));
  const view = filtered.slice((page - 1) * PAGE, page * PAGE);
  const active = mine.find((o) => o.id === selected) ?? null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Orders</h1>
        <p className="text-sm text-muted-foreground">Track every garment from cutting to delivery.</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search order ID or garment…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="sm:w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        {view.map((o) => (
          <Card key={o.id} className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{o.id}</span>
                  <Badge variant="secondary">{o.status}</Badge>
                </div>
                <p className="mt-1 text-sm font-medium">{o.garment} · Qty {o.qty}</p>
                <p className="text-xs text-muted-foreground">Delivery {o.delivery} · Tailor {o.tailor}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">₹{o.amount.toLocaleString()}</p>
                <Button size="sm" variant="outline" onClick={() => setSelected(o.id)}>View</Button>
              </div>
            </div>
          </Card>
        ))}
        {view.length === 0 && (
          mine.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No orders yet"
              description="Once your tailor confirms a measurement, your orders will show up here with live progress."
            />
          ) : (
            <Card className="p-8 text-center text-sm text-muted-foreground">No orders match your filters. Try clearing search.</Card>
          )
        )}
      </div>

      {filtered.length > PAGE && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Page {page} of {total}</p>
          <div className="flex gap-1">
            <Button size="icon" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button size="icon" variant="outline" disabled={page >= total} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}

      <Dialog open={!!active} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {active && <OrderDetails order={active} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderDetails({ order }: { order: typeof orders[number] }) {
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const currentIdx = TIMELINE.indexOf(order.status as string);
  return (
    <>
      <DialogHeader>
        <DialogTitle>Order {order.id} · {order.garment}</DialogTitle>
      </DialogHeader>
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Quantity:</span> {order.qty}</p>
            <p><span className="text-muted-foreground">Tailor:</span> {order.tailor}</p>
            <p><span className="text-muted-foreground">Order date:</span> {order.date}</p>
            <p><span className="text-muted-foreground">Delivery:</span> {order.delivery}</p>
            <p><span className="text-muted-foreground">Amount:</span> ₹{order.amount.toLocaleString()}</p>
          </div>
          <QRLabel value={`https://tailorerp.app/order/${order.id}`} title={order.id} subtitle={order.garment} size={88} />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Progress</p>
          <ol className="space-y-2">
            {TIMELINE.map((s, idx) => {
              const done = idx <= currentIdx;
              return (
                <li key={s} className="flex items-center gap-3 text-sm">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full ${done ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
                    {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3 w-3" />}
                  </div>
                  <span className={done ? "" : "text-muted-foreground"}>{s}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {order.status === "Delivered" && (
          <div className="rounded-md border border-dashed border-border p-3">
            <p className="text-sm font-medium">Need an alteration?</p>
            <p className="text-xs text-muted-foreground">Submit a request and our team will reach out within 24 hours.</p>
            <Button size="sm" className="mt-3" onClick={() => setOpen(true)}>
              <MessageSquarePlus className="mr-1.5 h-4 w-4" />Request Alteration
            </Button>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Request Alteration · {order.id}</DialogTitle></DialogHeader>
          <Textarea rows={5} placeholder="Describe the issue (e.g. waist too loose, sleeve too long)…" value={note} onChange={(e) => setNote(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success("Alteration request submitted. Ticket created."); setOpen(false); setNote(""); }}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
