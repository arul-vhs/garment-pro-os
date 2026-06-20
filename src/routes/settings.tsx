import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Globe } from "lucide-react";
import { LANGUAGES, Lang, useI18n, setUserLang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  const { lang, setLang } = useI18n();
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Settings" description="Business profile, taxation, users, and templates." />
      <div className="p-6">
        <Tabs defaultValue="business">
          <TabsList>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="prefs">Preferences</TabsTrigger>
          </TabsList>
          <TabsContent value="business" className="mt-4">
            <Card><CardHeader><CardTitle className="text-base">Business Profile</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5"><Label>Business Name</Label><Input defaultValue="Atelier Kumar Tailors" /></div>
                <div className="grid gap-1.5"><Label>GSTIN</Label><Input defaultValue="27ABCDE1234F1Z5" /></div>
                <div className="grid gap-1.5"><Label>Phone</Label><Input defaultValue="+91 22 4000 1234" /></div>
                <div className="grid gap-1.5"><Label>Email</Label><Input defaultValue="hello@atelierkumar.in" /></div>
                <div className="sm:col-span-2 grid gap-1.5"><Label>Address</Label><Input defaultValue="12 Linking Road, Bandra West, Mumbai 400050" /></div>
                <div className="sm:col-span-2"><Button onClick={() => toast.success("Profile saved")}>Save</Button></div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tax" className="mt-4">
            <Card><CardHeader><CardTitle className="text-base">Tax Settings</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5"><Label>CGST %</Label><Input type="number" defaultValue={9} /></div>
                <div className="grid gap-1.5"><Label>SGST %</Label><Input type="number" defaultValue={9} /></div>
                <div className="grid gap-1.5"><Label>IGST %</Label><Input type="number" defaultValue={18} /></div>
                <div className="grid gap-1.5"><Label>Default Currency</Label><Input defaultValue="INR (₹)" /></div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users" className="mt-4">
            <Card><CardHeader><CardTitle className="text-base">User Roles</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {["Admin","Receptionist","Tailor","Inventory Manager"].map(r => (
                  <div key={r} className="flex items-center justify-between rounded-md border border-border p-3">
                    <div><p className="font-medium">{r}</p><p className="text-xs text-muted-foreground">Role-based access control</p></div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="prefs" className="mt-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" />My language</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:max-w-sm">
                    <Label className="text-xs">Preferred language</Label>
                    <select
                      value={lang}
                      onChange={(e) => {
                        const l = e.target.value as Lang;
                        setLang(l);
                        if (user) setUserLang(user.id, l);
                        toast.success("Language updated");
                      }}
                      className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>{l.flag} {l.native} ({l.label})</option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">Overrides the tenant default and persists across sessions.</p>
                  </div>
                </CardContent>
              </Card>
              <Card><CardHeader><CardTitle className="text-base">System Preferences</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { k: "Email notifications", d: "Send order and payment alerts via email" },
                    { k: "Low stock alerts", d: "Notify when inventory drops below threshold" },
                    { k: "Auto-generate invoice", d: "Create an invoice when an order is delivered" },
                  ].map(p => (
                    <div key={p.k} className="flex items-center justify-between rounded-md border border-border p-3">
                      <div><p className="font-medium">{p.k}</p><p className="text-xs text-muted-foreground">{p.d}</p></div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
