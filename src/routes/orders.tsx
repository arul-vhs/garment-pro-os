import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, LayoutGrid, List } from "lucide-react";
import { orders, ORDER_STATUSES, customers, employees } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({ component: Orders });

function Orders() {
  return (
    <>
      <PageHeader
        title="Orders"
        description="Track every garment from creation to delivery."
        actions={
          <Dialog>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" />New Order</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Create Order</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5"><Label>Customer</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5"><Label>Garment Type</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{["Shirt","Pant","Blazer","Kurta","Saree Blouse","Suit"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5"><Label>Quantity</Label><Input type="number" defaultValue={1} /></div>
                <div className="grid gap-1.5"><Label>Assigned Tailor</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{employees.filter(e => e.role.includes("Tailor")).map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5"><Label>Order Date</Label><Input type="date" /></div>
                <div className="grid gap-1.5"><Label>Delivery Date</Label><Input type="date" /></div>
                <div className="grid gap-1.5"><Label>Priority</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Medium" /></SelectTrigger>
                    <SelectContent>{["Low","Medium","High"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 grid gap-1.5"><Label>Notes</Label><Input /></div>
              </div>
              <DialogFooter><Button onClick={() => toast.success("Order created")}>Create Order</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="p-6">
        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list"><List className="mr-1.5 h-4 w-4" />List</TabsTrigger>
            <TabsTrigger value="kanban"><LayoutGrid className="mr-1.5 h-4 w-4" />Kanban</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-4">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Order ID</TableHead><TableHead>Customer</TableHead><TableHead>Garment</TableHead>
                  <TableHead>Qty</TableHead><TableHead>Tailor</TableHead><TableHead>Delivery</TableHead>
                  <TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-xs">{o.id}</TableCell>
                      <TableCell className="font-medium">{o.customer}</TableCell>
                      <TableCell>{o.garment}</TableCell>
                      <TableCell>{o.qty}</TableCell>
                      <TableCell className="text-muted-foreground">{o.tailor}</TableCell>
                      <TableCell>{o.delivery}</TableCell>
                      <TableCell><StatusBadge status={o.priority} /></TableCell>
                      <TableCell><StatusBadge status={o.status} /></TableCell>
                      <TableCell className="text-right font-medium">₹{o.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          <TabsContent value="kanban" className="mt-4">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {ORDER_STATUSES.map((s) => {
                const items = orders.filter((o) => o.status === s);
                return (
                  <div key={s} className="w-72 shrink-0">
                    <div className="mb-2 flex items-center justify-between px-1">
                      <h3 className="text-sm font-semibold">{s}</h3>
                      <span className="rounded-full bg-muted px-2 text-xs">{items.length}</span>
                    </div>
                    <div className="space-y-2 rounded-lg bg-muted/40 p-2 min-h-32">
                      {items.map((o) => (
                        <Card key={o.id}>
                          <div className="space-y-1.5 p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs text-muted-foreground">{o.id}</span>
                              <StatusBadge status={o.priority} />
                            </div>
                            <p className="text-sm font-medium">{o.customer}</p>
                            <p className="text-xs text-muted-foreground">{o.garment} · qty {o.qty}</p>
                            <p className="text-xs text-muted-foreground">Due {o.delivery}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
