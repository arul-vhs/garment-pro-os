import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/roles")({ component: Roles });

const MODULES = ["Dashboard", "Customers", "Measurements", "Orders", "Designs", "Inventory", "Production", "Billing", "Employees", "Reports", "Communications", "Audit Logs", "Branches", "Organization", "Subscription"];
const ACTIONS = ["View", "Create", "Edit", "Delete", "Export"];

type Role = { id: string; name: string; permissions: Record<string, Record<string, boolean>> };

const SEED: Role[] = [
  { id: "admin", name: "Administrator", permissions: Object.fromEntries(MODULES.map((m) => [m, Object.fromEntries(ACTIONS.map((a) => [a, true]))])) },
  { id: "manager", name: "Branch Manager", permissions: Object.fromEntries(MODULES.map((m) => [m, Object.fromEntries(ACTIONS.map((a) => [a, ["View", "Create", "Edit", "Export"].includes(a)]))])) },
  { id: "tailor", name: "Tailor", permissions: Object.fromEntries(MODULES.map((m) => [m, Object.fromEntries(ACTIONS.map((a) => [a, ["Orders", "Production", "Dashboard"].includes(m) && ["View", "Edit"].includes(a)]))])) },
];

function Roles() {
  const [roles, setRoles] = useState<Role[]>(SEED);
  const [activeId, setActiveId] = useState(roles[0].id);
  const [newRole, setNewRole] = useState("");
  const active = roles.find((r) => r.id === activeId)!;

  const toggle = (mod: string, act: string) => {
    setRoles((rs) => rs.map((r) => r.id !== activeId ? r : { ...r, permissions: { ...r.permissions, [mod]: { ...r.permissions[mod], [act]: !r.permissions[mod][act] } } }));
  };

  const addRole = () => {
    if (!newRole.trim()) return;
    const id = newRole.toLowerCase().replace(/\s+/g, "-");
    if (roles.some((r) => r.id === id)) return toast.error("Role already exists");
    setRoles([...roles, { id, name: newRole, permissions: Object.fromEntries(MODULES.map((m) => [m, Object.fromEntries(ACTIONS.map((a) => [a, false]))])) }]);
    setNewRole(""); setActiveId(id); toast.success("Role created");
  };

  return (
    <>
      <PageHeader title="Roles & Permissions" description="Custom role builder with module-level access control." actions={
        <div className="flex items-center gap-2"><Input value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="New role name" className="h-9 w-44" /><Button onClick={addRole}><Plus className="mr-1 h-4 w-4" />Add</Button></div>
      } />
      <div className="grid gap-4 p-6 lg:grid-cols-[220px,1fr]">
        <Card>
          <CardContent className="p-2">
            {roles.map((r) => (
              <button key={r.id} onClick={() => setActiveId(r.id)} className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${activeId === r.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                <ShieldCheck className="h-4 w-4" /> {r.name}
              </button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">{active.name} — permission matrix</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr><th className="px-4 py-2 text-left">Module</th>{ACTIONS.map((a) => <th key={a} className="px-3 py-2">{a}</th>)}</tr>
              </thead>
              <tbody>
                {MODULES.map((m) => (
                  <tr key={m} className="border-t border-border">
                    <td className="px-4 py-2 font-medium">{m}</td>
                    {ACTIONS.map((a) => (
                      <td key={a} className="px-3 py-2 text-center">
                        <Checkbox checked={active.permissions[m]?.[a] ?? false} onCheckedChange={() => toggle(m, a)} disabled={active.id === "admin"} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
