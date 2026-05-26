import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { useTenant, PLANS, type Plan } from "@/lib/tenant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Building2, Users, CreditCard, Sparkles } from "lucide-react";

export const Route = createFileRoute("/organization")({ component: OrganizationSettings });

function OrganizationSettings() {
  const { activeOrg, updateOrg, setPlan, orgs, setActive } = useTenant();
  const navigate = useNavigate();

  if (!activeOrg) {
    return (
      <div className="p-6">
        <Card><CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <Building2 className="h-8 w-8 text-muted-foreground" />
          <div><p className="font-medium">No organization yet</p><p className="text-sm text-muted-foreground">Create one to get started.</p></div>
          <Button onClick={() => navigate({ to: "/onboarding" })}>Create organization</Button>
        </CardContent></Card>
      </div>
    );
  }

  const [form, setForm] = useState({ name: activeOrg.name, industry: activeOrg.industry, country: activeOrg.country, currency: activeOrg.currency });

  return (
    <>
      <PageHeader title="Organization" description="Manage your workspace, members, and subscription." />
      <div className="space-y-4 p-6">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Building2 className="h-5 w-5" /></div>
              <div>
                <p className="font-medium">{activeOrg.name}</p>
                <p className="text-xs text-muted-foreground">{activeOrg.slug} · {activeOrg.industry} · {activeOrg.country}</p>
              </div>
            </div>
            <Badge variant="secondary" className="capitalize"><Sparkles className="mr-1 h-3 w-3" />{activeOrg.plan} plan</Badge>
          </CardContent>
        </Card>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="billing">Subscription</TabsTrigger>
            <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            <Card><CardHeader><CardTitle className="text-base">Organization profile</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="grid gap-1.5"><Label>Industry</Label><Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></div>
                <div className="grid gap-1.5"><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
                <div className="grid gap-1.5"><Label>Currency</Label><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} /></div>
                <div className="sm:col-span-2">
                  <Button onClick={() => { updateOrg(activeOrg.id, form); toast.success("Organization updated"); }}>Save changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="mt-4">
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" />Members</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {activeOrg.members.map((m) => (
                  <div key={m.userId} className="flex items-center justify-between rounded-md border border-border p-3">
                    <div><p className="text-sm font-medium">{m.userId}</p><p className="text-xs text-muted-foreground">Role: {m.role}</p></div>
                    <Badge variant="outline" className="capitalize">{m.role}</Badge>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <Input placeholder="teammate@email.com" />
                  <Button onClick={() => toast.success("Invitation sent")}>Invite</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="mt-4">
            <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" />Subscription</CardTitle></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                {(Object.keys(PLANS) as Plan[]).map((key) => {
                  const p = PLANS[key];
                  const active = activeOrg.plan === key;
                  return (
                    <div key={key} className={`rounded-lg border p-4 ${active ? "border-primary bg-primary/5" : "border-border"}`}>
                      <div className="flex items-center justify-between"><p className="font-medium">{p.name}</p>{active && <Badge variant="default" className="text-xs"><Check className="mr-1 h-3 w-3" />Current</Badge>}</div>
                      <p className="mt-2 text-2xl font-semibold">{p.price}<span className="ml-1 text-xs font-normal text-muted-foreground">/mo</span></p>
                      <ul className="mt-3 space-y-1 text-xs text-muted-foreground">{p.features.map((f) => <li key={f} className="flex items-start gap-1.5"><Check className="mt-0.5 h-3 w-3 text-primary" />{f}</li>)}</ul>
                      <Button size="sm" variant={active ? "outline" : "default"} className="mt-4 w-full" disabled={active}
                        onClick={() => { setPlan(activeOrg.id, key); toast.success(`Switched to ${p.name}`); }}>
                        {active ? "Current plan" : "Switch"}
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workspaces" className="mt-4">
            <Card><CardHeader><CardTitle className="text-base">Your workspaces</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {orgs.map((o) => (
                  <div key={o.id} className="flex items-center justify-between rounded-md border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">{o.name}{o.id === activeOrg.id && <Badge variant="secondary" className="ml-2 text-xs">Active</Badge>}</p>
                      <p className="text-xs text-muted-foreground">{o.slug} · {PLANS[o.plan].name}</p>
                    </div>
                    <Button size="sm" variant="outline" disabled={o.id === activeOrg.id} onClick={() => { setActive(o.id); toast.success(`Switched to ${o.name}`); }}>Switch</Button>
                  </div>
                ))}
                <Button variant="outline" className="mt-2 w-full" onClick={() => navigate({ to: "/onboarding" })}>+ Create new organization</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
