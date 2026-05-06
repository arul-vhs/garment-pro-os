import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { customers, orders, measurements, invoices } from "@/lib/mock-data";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

export const Route = createFileRoute("/customers/$id")({ component: CustomerProfile });

function CustomerProfile() {
  const { id } = Route.useParams();
  const c = customers.find((x) => x.id === id) ?? customers[0];
  const cOrders = orders.filter((o) => o.customer === c.name);
  const cMeas = measurements.filter((m) => m.customer === c.name);
  const cInv = invoices.filter((i) => i.customer === c.name);

  return (
    <>
      <PageHeader
        title={c.name}
        description={`Customer profile · ${c.id}`}
        actions={<Button variant="outline" asChild><Link to="/customers"><ArrowLeft className="mr-1.5 h-4 w-4" />Back</Link></Button>}
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card><CardContent className="flex items-center gap-3 p-5"><Phone className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Mobile</p><p className="font-medium">{c.mobile}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-3 p-5"><Mail className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{c.email}</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-3 p-5"><MapPin className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Address</p><p className="font-medium">{c.address}</p></div></CardContent></Card>
        </div>

        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">Orders ({cOrders.length})</TabsTrigger>
            <TabsTrigger value="meas">Measurements ({cMeas.length})</TabsTrigger>
            <TabsTrigger value="pay">Payments ({cInv.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="orders" className="mt-4 space-y-2">
            {cOrders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
            {cOrders.map((o) => (
              <Card key={o.id}><CardContent className="flex items-center justify-between p-4">
                <div><p className="font-medium">{o.id} · {o.garment}</p><p className="text-xs text-muted-foreground">Delivery {o.delivery}</p></div>
                <StatusBadge status={o.status} />
              </CardContent></Card>
            ))}
          </TabsContent>
          <TabsContent value="meas" className="mt-4 space-y-2">
            {cMeas.length === 0 && <p className="text-sm text-muted-foreground">No measurements recorded.</p>}
            {cMeas.map((m) => (
              <Card key={m.id}><CardHeader><CardTitle className="text-sm">{m.garment} · v{m.version} · {m.date}</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                  {Object.entries(m.fields).map(([k, v]) => (
                    <div key={k} className="rounded-md border border-border bg-muted/40 px-3 py-2"><p className="text-xs text-muted-foreground">{k}</p><p className="font-medium">{v}"</p></div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="pay" className="mt-4 space-y-2">
            {cInv.length === 0 && <p className="text-sm text-muted-foreground">No invoices.</p>}
            {cInv.map((i) => (
              <Card key={i.id}><CardContent className="flex items-center justify-between p-4">
                <div><p className="font-medium">{i.id}</p><p className="text-xs text-muted-foreground">{i.date} · {i.method}</p></div>
                <div className="flex items-center gap-3"><span className="font-medium">₹{i.total.toLocaleString()}</span><StatusBadge status={i.status} /></div>
              </CardContent></Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
