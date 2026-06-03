import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Receipt } from "lucide-react";
import { usePortalAuth } from "@/lib/customer-auth";
import { invoices } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/invoices")({ component: PortalInvoices });

function PortalInvoices() {
  const { user } = usePortalAuth();
  const mine = useMemo(() => invoices.filter((i) => i.customer === user?.name), [user]);
  const [open, setOpen] = useState<string | null>(null);
  const sel = mine.find((i) => i.id === open) ?? null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
        <p className="text-sm text-muted-foreground">Download receipts and check payment status.</p>
      </div>

      <div className="grid gap-3">
        {mine.map((i) => (
          <Card key={i.id} className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{i.id}</p>
                  <p className="text-sm font-medium">Order {i.order} · {i.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={i.status === "Paid" ? "default" : i.status === "Pending" ? "destructive" : "secondary"}>{i.status}</Badge>
                <p className="text-sm font-semibold">₹{i.total.toLocaleString()}</p>
                <Button size="sm" variant="outline" onClick={() => setOpen(i.id)}>View</Button>
              </div>
            </div>
          </Card>
        ))}
        {mine.length === 0 && <Card className="p-8 text-center text-sm text-muted-foreground">No invoices yet.</Card>}
      </div>

      <Dialog open={!!sel} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-lg">
          {sel && (
            <>
              <DialogHeader>
                <DialogTitle>Invoice {sel.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-lg border border-border p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Billed to</p>
                      <p className="text-sm font-medium">{sel.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Issued</p>
                      <p className="text-sm">{sel.date}</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Order {sel.order}</span><span>₹{sel.subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Tax (GST)</span><span>₹{sel.tax.toLocaleString()}</span></div>
                    {sel.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>−₹{sel.discount.toLocaleString()}</span></div>}
                    <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-semibold"><span>Total</span><span>₹{sel.total.toLocaleString()}</span></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Method: {sel.method}</span>
                    <Badge variant={sel.status === "Paid" ? "default" : "secondary"}>{sel.status}</Badge>
                  </div>
                </div>
                <Button className="w-full" onClick={() => toast.success("Invoice PDF download started")}>
                  <Download className="mr-1.5 h-4 w-4" />Download PDF
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
