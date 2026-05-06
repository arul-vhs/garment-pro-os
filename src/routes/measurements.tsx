import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { measurements, measurementTemplates, customers } from "@/lib/mock-data";
import { Plus, History } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/measurements")({ component: Measurements });

function Measurements() {
  const [garment, setGarment] = useState("Shirt");
  const fields = measurementTemplates[garment] ?? [];

  return (
    <>
      <PageHeader
        title="Measurements"
        description="Manage garment measurement templates and customer records with version history."
        actions={
          <Dialog>
            <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" />New Measurement</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Record Measurements</DialogTitle></DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label>Customer</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Choose customer" /></SelectTrigger>
                      <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Garment Type</Label>
                    <Select value={garment} onValueChange={setGarment}><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.keys(measurementTemplates).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {fields.map(f => (
                    <div key={f} className="grid gap-1.5"><Label className="text-xs">{f} (in)</Label><Input type="number" step="0.25" /></div>
                  ))}
                </div>
                <div className="grid gap-1.5"><Label>Notes</Label><Input placeholder="Special instructions…" /></div>
              </div>
              <DialogFooter><Button onClick={() => toast.success("Measurements saved")}>Save Record</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {Object.keys(measurementTemplates).map(t => (
            <Card key={t} className={`cursor-pointer transition hover:border-primary ${garment === t ? "border-primary ring-2 ring-primary/20" : ""}`} onClick={() => setGarment(t)}>
              <CardContent className="p-4 text-center"><p className="text-sm font-medium">{t}</p><p className="text-xs text-muted-foreground">{measurementTemplates[t].length} fields</p></CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {measurements.map((m) => (
            <Card key={m.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle className="text-base">{m.customer}</CardTitle><p className="text-xs text-muted-foreground">{m.garment} · {m.date}</p></div>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs"><History className="h-3 w-3" />v{m.version}</span>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {Object.entries(m.fields).map(([k, v]) => (
                  <div key={k} className="rounded-md border border-border bg-muted/40 px-3 py-2">
                    <p className="text-xs text-muted-foreground">{k}</p>
                    <p className="font-medium">{v}"</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
