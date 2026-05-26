import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
import { customers as allCustomers } from "@/lib/mock-data";
import { useTenant } from "@/lib/tenant";
import { useState } from "react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/customers/")({ component: Customers });

function Customers() {
  const [q, setQ] = useState("");
  const { scope } = useTenant();
  const customers = scope(allCustomers);
  const filtered = customers.filter(c =>
    [c.name, c.id, c.mobile, c.email].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Customers"
        description="Manage your customer base, contacts, and order history."
        actions={
          <Dialog>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" />Add Customer</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Customer</DialogTitle></DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-1.5"><Label>Name</Label><Input placeholder="Full name" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5"><Label>Mobile</Label><Input placeholder="+91" /></div>
                  <div className="grid gap-1.5"><Label>Email</Label><Input placeholder="email@example.com" /></div>
                </div>
                <div className="grid gap-1.5"><Label>Address</Label><Input /></div>
              </div>
              <DialogFooter><Button onClick={() => toast.success("Customer added")}>Save</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers…" className="pl-8" />
          </div>
        </div>
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Mobile</TableHead>
                <TableHead>Email</TableHead><TableHead>Address</TableHead>
                <TableHead className="text-right">Orders</TableHead><TableHead>Last Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{c.id}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.mobile}</TableCell>
                  <TableCell className="text-muted-foreground">{c.email}</TableCell>
                  <TableCell className="text-muted-foreground">{c.address}</TableCell>
                  <TableCell className="text-right">{c.totalOrders}</TableCell>
                  <TableCell>{c.lastOrder}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild size="icon" variant="ghost"><Link to="/customers/$id" params={{ id: c.id }}><Eye className="h-4 w-4" /></Link></Button>
                      <Button size="icon" variant="ghost" onClick={() => toast.info("Edit")}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => toast.error("Deleted")}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
}
