import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useBranches } from "@/lib/branches";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Plus, Trash2, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/branches")({ component: Branches });

function Branches() {
  const { branches, activeBranch, setActiveBranch, addBranch, updateBranch, removeBranch } = useBranches();
  const [form, setForm] = useState({ name: "", city: "", address: "", manager: "" });
  const [open, setOpen] = useState(false);

  const submit = () => {
    if (!form.name.trim()) return toast.error("Branch name required");
    addBranch({ ...form, active: true });
    setForm({ name: "", city: "", address: "", manager: "" });
    setOpen(false);
    toast.success("Branch added");
  };

  return (
    <>
      <PageHeader title="Branches" description="Manage all your locations from one place. Switch branch context anywhere from the header." actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" />New Branch</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add a branch</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-1.5"><Label>Branch name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
                <div className="grid gap-1.5"><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                <div className="grid gap-1.5"><Label>Manager</Label><Input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} /></div>
              </div>
              <div className="grid gap-1.5"><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={submit}>Add</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      } />
      <div className="grid gap-3 p-6 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((b) => {
          const isActive = activeBranch?.id === b.id;
          return (
            <Card key={b.id} className={isActive ? "ring-1 ring-primary" : ""}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                <div>
                  <CardTitle className="text-base">{b.name}</CardTitle>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{b.city || "—"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={b.active} onCheckedChange={(v) => updateBranch(b.id, { active: v })} />
                  {isActive && <Badge>Active</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-muted-foreground">
                  <p>{b.address || "No address"}</p>
                  <p className="mt-1">Manager: <span className="text-foreground">{b.manager || "Unassigned"}</span></p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" disabled={isActive} onClick={() => setActiveBranch(b.id)}><Building2 className="mr-1.5 h-3.5 w-3.5" />{isActive ? "Active" : "Switch"}</Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (confirm(`Remove ${b.name}?`)) removeBranch(b.id); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
