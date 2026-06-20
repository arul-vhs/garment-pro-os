import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTenant } from "@/lib/tenant";
import { useAudit } from "@/lib/audit";
import { useAuth } from "@/lib/auth";
import { validateAll, required, maxLen, email as emailV, phone as phoneV, numeric } from "@/lib/validation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Building2, Image as ImageIcon, Palette, Percent, Bell, Globe } from "lucide-react";
import { LANGUAGES, Lang, getTenantLang, setTenantLang, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/tenant-settings")({ component: TenantSettings });

const PREF_KEY = "tailorerp.tenantPrefs";

type TenantPrefs = {
  logoUrl: string;
  accent: string;
  gstNumber: string;
  taxRate: number;
  invoicePrefix: string;
  supportEmail: string;
  supportPhone: string;
  whatsappEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
};

const DEFAULTS: TenantPrefs = {
  logoUrl: "",
  accent: "#0f766e",
  gstNumber: "",
  taxRate: 18,
  invoicePrefix: "INV",
  supportEmail: "",
  supportPhone: "",
  whatsappEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
};

function loadAll(): Record<string, TenantPrefs> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(PREF_KEY) || "{}"); } catch { return {}; }
}
function saveAll(v: Record<string, TenantPrefs>) {
  if (typeof window !== "undefined") localStorage.setItem(PREF_KEY, JSON.stringify(v));
}

function TenantSettings() {
  const { activeOrg, updateOrg } = useTenant();
  const { user } = useAuth();
  const { log } = useAudit();
  const [name, setName] = useState(activeOrg?.name ?? "");
  const [industry, setIndustry] = useState(activeOrg?.industry ?? "");
  const [country, setCountry] = useState(activeOrg?.country ?? "");
  const [currency, setCurrency] = useState(activeOrg?.currency ?? "INR");
  const [prefs, setPrefs] = useState<TenantPrefs>(DEFAULTS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tenantLang, setTenantLangState] = useState<Lang>("en");
  const { setLang } = useI18n();

  useEffect(() => {
    if (!activeOrg) return;
    setName(activeOrg.name); setIndustry(activeOrg.industry);
    setCountry(activeOrg.country); setCurrency(activeOrg.currency);
    const all = loadAll();
    setPrefs({ ...DEFAULTS, ...(all[activeOrg.id] ?? {}) });
    setTenantLangState(getTenantLang(activeOrg.id) ?? "en");
  }, [activeOrg]);

  if (!activeOrg) {
    return <div className="p-6 text-sm text-muted-foreground">No active tenant.</div>;
  }

  const save = () => {
    const errs = validateAll(
      { name, industry, supportEmail: prefs.supportEmail, supportPhone: prefs.supportPhone, taxRate: String(prefs.taxRate) },
      {
        name: required("Business name is required."),
        industry: maxLen(80),
        supportEmail: emailV,
        supportPhone: phoneV,
        taxRate: numeric,
      },
    );
    setErrors(errs as Record<string, string>);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    const before = activeOrg.name;
    updateOrg(activeOrg.id, { name, industry, country, currency });
    const all = loadAll();
    all[activeOrg.id] = prefs;
    saveAll(all);
    setTenantLang(activeOrg.id, tenantLang);
    setLang(tenantLang);
    log({
      module: "TenantSettings", action: "update", target: activeOrg.id,
      before, after: `Updated profile + preferences (${name}) · lang=${tenantLang}`,
      userId: user?.id ?? "system", userName: user?.fullName ?? "System",
    });
    toast.success("Tenant settings saved.");
  };

  return (
    <>
      <PageHeader
        title="Tenant Settings"
        description="Manage your business profile, branding, tax, and communication preferences."
        actions={<Button onClick={save}>Save changes</Button>}
      />
      <div className="p-6">
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile"><Building2 className="mr-1.5 h-4 w-4" />Profile</TabsTrigger>
            <TabsTrigger value="branding"><Palette className="mr-1.5 h-4 w-4" />Branding</TabsTrigger>
            <TabsTrigger value="tax"><Percent className="mr-1.5 h-4 w-4" />Tax</TabsTrigger>
            <TabsTrigger value="comm"><Bell className="mr-1.5 h-4 w-4" />Communications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader><CardTitle className="text-base">Business profile</CardTitle></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field label="Business name" error={errors.name}>
                  <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
                </Field>
                <Field label="Industry" error={errors.industry}>
                  <Input value={industry} onChange={(e) => setIndustry(e.target.value)} maxLength={80} />
                </Field>
                <Field label="Country">
                  <Input value={country} onChange={(e) => setCountry(e.target.value)} maxLength={60} />
                </Field>
                <Field label="Currency">
                  <Input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} maxLength={6} />
                </Field>
                <Field label="Default language">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={tenantLang}
                      onChange={(e) => setTenantLangState(e.target.value as Lang)}
                      className="h-9 flex-1 rounded-md border border-input bg-background px-2 text-sm"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>{l.flag} {l.native} ({l.label})</option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">New users inherit this language by default.</p>
                </Field>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader><CardTitle className="text-base">Brand identity</CardTitle></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field label="Logo URL">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <Input value={prefs.logoUrl} onChange={(e) => setPrefs({ ...prefs, logoUrl: e.target.value })} placeholder="https://…" />
                  </div>
                </Field>
                <Field label="Accent color">
                  <div className="flex items-center gap-2">
                    <input type="color" value={prefs.accent} onChange={(e) => setPrefs({ ...prefs, accent: e.target.value })} className="h-9 w-12 cursor-pointer rounded border border-input bg-background" />
                    <Input value={prefs.accent} onChange={(e) => setPrefs({ ...prefs, accent: e.target.value })} />
                  </div>
                </Field>
                {prefs.logoUrl && (
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-muted-foreground">Preview</Label>
                    <div className="mt-2 flex h-20 items-center justify-center rounded-md border border-dashed border-border bg-muted/30">
                      <img src={prefs.logoUrl} alt="Tenant logo" className="max-h-16" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tax">
            <Card>
              <CardHeader><CardTitle className="text-base">Tax & invoicing</CardTitle></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field label="GST / Tax registration number">
                  <Input value={prefs.gstNumber} onChange={(e) => setPrefs({ ...prefs, gstNumber: e.target.value.toUpperCase() })} maxLength={20} />
                </Field>
                <Field label="Default tax rate (%)" error={errors.taxRate}>
                  <Input type="number" min={0} max={100} value={prefs.taxRate} onChange={(e) => setPrefs({ ...prefs, taxRate: Number(e.target.value) })} />
                </Field>
                <Field label="Invoice prefix">
                  <Input value={prefs.invoicePrefix} onChange={(e) => setPrefs({ ...prefs, invoicePrefix: e.target.value.toUpperCase() })} maxLength={8} />
                </Field>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comm">
            <Card>
              <CardHeader><CardTitle className="text-base">Customer communications</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Support email" error={errors.supportEmail}>
                    <Input value={prefs.supportEmail} onChange={(e) => setPrefs({ ...prefs, supportEmail: e.target.value })} placeholder="support@example.com" />
                  </Field>
                  <Field label="Support phone" error={errors.supportPhone}>
                    <Input value={prefs.supportPhone} onChange={(e) => setPrefs({ ...prefs, supportPhone: e.target.value })} placeholder="+91 …" />
                  </Field>
                </div>
                <ToggleRow label="WhatsApp notifications" checked={prefs.whatsappEnabled} onChange={(v) => setPrefs({ ...prefs, whatsappEnabled: v })} />
                <ToggleRow label="Email notifications" checked={prefs.emailEnabled} onChange={(v) => setPrefs({ ...prefs, emailEnabled: v })} />
                <ToggleRow label="SMS notifications" checked={prefs.smsEnabled} onChange={(v) => setPrefs({ ...prefs, smsEnabled: v })} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border p-3">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
