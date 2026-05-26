import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, AlertTriangle, Boxes, Search } from "lucide-react";
import { inventory as allInventory } from "@/lib/mock-data";
import { useTenant } from "@/lib/tenant";
import { StatusBadge } from "@/components/StatusBadge";
import { useState } from "react";

export const Route = createFileRoute("/inventory")({ component: Inventory });

function Inventory() {
  const { scope } = useTenant();
  const inventory = scope(allInventory);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(inventory.map(i => i.category)))];
  const filtered = inventory.filter(i =>
    (cat === "All" || i.category === cat) && i.name.toLowerCase().includes(q.toLowerCase())
  );
  const lowStock = inventory.filter(i => i.status === "Low Stock").length;

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Track fabrics, threads, buttons, zippers, and accessories."
        actions={<Button><Plus className="mr-1.5 h-4 w-4" />Add Stock</Button>}
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card><CardContent className="p-5"><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-wide text-muted-foreground">Total Items</span><Boxes className="h-4 w-4 text-primary" /></div><div className="mt-2 text-2xl font-semibold">{inventory.length}</div></CardContent></Card>
          <Card><CardContent className="p-5"><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-wide text-muted-foreground">Categories</span></div><div className="mt-2 text-2xl font-semibold">{cats.length - 1}</div></CardContent></Card>
          <Card><CardContent className="p-5"><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-wide text-muted-foreground">Low Stock</span><AlertTriangle className="h-4 w-4 text-destructive" /></div><div className="mt-2 text-2xl font-semibold text-destructive">{lowStock}</div></CardContent></Card>
          <Card><CardContent className="p-5"><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-wide text-muted-foreground">Suppliers</span></div><div className="mt-2 text-2xl font-semibold">{new Set(inventory.map(i => i.supplier)).size}</div></CardContent></Card>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search items…" className="pl-8" />
          </div>
          <div className="flex gap-1">
            {cats.map(c => (
              <Button key={c} size="sm" variant={cat === c ? "default" : "outline"} onClick={() => setCat(c)}>{c}</Button>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Item</TableHead><TableHead>Category</TableHead><TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead><TableHead>Supplier</TableHead><TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(i => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">{i.name}</TableCell>
                  <TableCell>{i.category}</TableCell>
                  <TableCell>{i.qty}</TableCell>
                  <TableCell className="text-muted-foreground">{i.unit}</TableCell>
                  <TableCell>{i.supplier}</TableCell>
                  <TableCell><StatusBadge status={i.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
}
