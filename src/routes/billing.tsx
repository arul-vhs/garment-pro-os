import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { invoices } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Printer } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/billing")({ component: Billing });

function Billing() {
  const total = invoices.reduce((s, i) => s + i.total, 0);
  const pending = invoices.filter(i => i.status !== "Paid").reduce((s, i) => s + i.total, 0);

  return (
    <>
      <PageHeader
        title="Billing"
        description="Invoices, payments, and tax-ready exports."
        actions={<Button onClick={() => toast.success("Invoice created")}><Plus className="mr-1.5 h-4 w-4" />New Invoice</Button>}
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="p-5"><p className="text-xs uppercase tracking-wide text-muted-foreground">Total Billed</p><p className="mt-2 text-2xl font-semibold">₹{total.toLocaleString()}</p></Card>
          <Card className="p-5"><p className="text-xs uppercase tracking-wide text-muted-foreground">Pending</p><p className="mt-2 text-2xl font-semibold text-warning-foreground">₹{pending.toLocaleString()}</p></Card>
          <Card className="p-5"><p className="text-xs uppercase tracking-wide text-muted-foreground">Invoices</p><p className="mt-2 text-2xl font-semibold">{invoices.length}</p></Card>
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Invoice #</TableHead><TableHead>Customer</TableHead><TableHead>Order</TableHead>
              <TableHead className="text-right">Subtotal</TableHead><TableHead className="text-right">Tax</TableHead>
              <TableHead className="text-right">Discount</TableHead><TableHead className="text-right">Total</TableHead>
              <TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {invoices.map(i => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.id}</TableCell>
                  <TableCell className="font-medium">{i.customer}</TableCell>
                  <TableCell className="font-mono text-xs">{i.order}</TableCell>
                  <TableCell className="text-right">₹{i.subtotal.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{i.tax.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{i.discount.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-semibold">₹{i.total.toLocaleString()}</TableCell>
                  <TableCell>{i.method}</TableCell>
                  <TableCell><StatusBadge status={i.status} /></TableCell>
                  <TableCell><Button size="icon" variant="ghost" onClick={() => window.print()}><Printer className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
}
