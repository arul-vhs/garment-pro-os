import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { useTenant, PLANS, type Plan } from "@/lib/tenant";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Scissors, ArrowRight, Check, Building2, Loader2, Upload, Plus, Trash2, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

type Step = 1 | 2 | 3 | 4 | 5;

const DRAFT_KEY = "tailorerp.onboardingDraft";

function Onboarding() {
  const { user } = useAuth();
  const { createOrg } = useTenant();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  const initial = (() => {
    try { const raw = typeof window !== "undefined" && localStorage.getItem(DRAFT_KEY); if (raw) return JSON.parse(raw); } catch { /* noop */ }
    return null;
  })();

  const [form, setForm] = useState(initial ?? {
    name: "", ownerName: user?.fullName ?? "", email: user?.email ?? "", mobile: "",
    gst: "", address: "", logo: "" as string, currency: "INR", tax: "GST 18%", branchCount: 1,
    industry: "Bespoke Tailoring", country: "India", plan: "starter" as Plan,
    branches: [{ name: "Flagship", city: "" }] as { name: string; city: string }[],
    invites: [] as { email: string; role: string }[],
  });

  const saveDraft = (next: typeof form) => {
    setForm(next);
    if (typeof window !== "undefined") localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
  };

  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => saveDraft({ ...form, logo: reader.result as string });
    reader.readAsDataURL(f);
  };

  const goto = (s: Step) => setStep(s);

  const nextStep1 = (e: FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Business name is required");
    if (form.email.trim().length < 3) return toast.error("Email is required");
    goto(2);
  };
  const nextStep2 = (e: FormEvent) => { e.preventDefault(); goto(3); };
  const nextStep3 = (e: FormEvent) => { e.preventDefault(); goto(4); };
  const nextStep4 = (e: FormEvent) => { e.preventDefault(); goto(5); };

  const finish = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const org = createOrg({ name: form.name, industry: form.industry, country: form.country, currency: form.currency, plan: form.plan });
    if (typeof window !== "undefined") localStorage.removeItem(DRAFT_KEY);
    setLoading(false);
    toast.success(`${org.name} is ready`);
    navigate({ to: "/" });
  };

  if (!user) return null;

  const steps = ["Business", "Profile", "Branches", "Team", "Plan"];

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Scissors className="h-4 w-4" /></div>
          <div>
            <p className="text-sm font-semibold">TailorERP</p>
            <p className="text-xs text-muted-foreground">First-time setup wizard</p>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">Draft saved automatically</div>
        </div>

        <div className="mb-6 flex items-center gap-1 overflow-x-auto text-xs font-medium">
          {steps.map((label, i) => {
            const n = (i + 1) as Step;
            return (
              <div key={label} className="flex items-center gap-2">
                <button onClick={() => n <= step && goto(n)} className={`flex h-6 w-6 items-center justify-center rounded-full ${step >= n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {step > n ? <Check className="h-3.5 w-3.5" /> : n}
                </button>
                <span className={`${step >= n ? "text-foreground" : "text-muted-foreground"} whitespace-nowrap`}>{label}</span>
                {i < steps.length - 1 && <div className="mx-1 h-px w-8 bg-border" />}
              </div>
            );
          })}
        </div>

        <Card>
          <CardContent className="p-6">
            {step === 1 && (
              <form onSubmit={nextStep1} className="space-y-5">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Tell us about your business</h1>
                  <p className="mt-1 text-sm text-muted-foreground">This creates an isolated workspace for your data.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-1.5 sm:col-span-2"><Label>Business name *</Label><Input value={form.name} onChange={(e) => saveDraft({ ...form, name: e.target.value })} placeholder="e.g. Atelier Kumar Tailors" required /></div>
                  <div className="grid gap-1.5"><Label>Owner name</Label><Input value={form.ownerName} onChange={(e) => saveDraft({ ...form, ownerName: e.target.value })} /></div>
                  <div className="grid gap-1.5"><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => saveDraft({ ...form, email: e.target.value })} required /></div>
                  <div className="grid gap-1.5"><Label>Mobile</Label><Input value={form.mobile} onChange={(e) => saveDraft({ ...form, mobile: e.target.value })} placeholder="+91 ..." /></div>
                  <div className="grid gap-1.5"><Label>GST number</Label><Input value={form.gst} onChange={(e) => saveDraft({ ...form, gst: e.target.value })} placeholder="22AAAAA0000A1Z5" /></div>
                </div>
                <Button type="submit" className="w-full">Continue<ArrowRight className="ml-1.5 h-4 w-4" /></Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={nextStep2} className="space-y-5">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Business profile</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Logo, address and tax preferences appear on invoices.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/40 text-muted-foreground">
                    {form.logo ? <img src={form.logo} alt="logo" className="h-full w-full object-cover" /> : <Upload className="h-5 w-5" />}
                  </div>
                  <div>
                    <Label htmlFor="logo" className="cursor-pointer text-sm font-medium text-primary">Upload logo</Label>
                    <Input id="logo" type="file" accept="image/*" className="hidden" onChange={onLogo} />
                    <p className="mt-1 text-xs text-muted-foreground">PNG or JPG, square works best.</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-1.5 sm:col-span-2"><Label>Address</Label><Textarea value={form.address} onChange={(e) => saveDraft({ ...form, address: e.target.value })} rows={2} /></div>
                  <div className="grid gap-1.5"><Label>Currency</Label><Input value={form.currency} onChange={(e) => saveDraft({ ...form, currency: e.target.value })} /></div>
                  <div className="grid gap-1.5"><Label>Tax preference</Label><Input value={form.tax} onChange={(e) => saveDraft({ ...form, tax: e.target.value })} /></div>
                  <div className="grid gap-1.5"><Label>Industry</Label><Input value={form.industry} onChange={(e) => saveDraft({ ...form, industry: e.target.value })} /></div>
                  <div className="grid gap-1.5"><Label>Country</Label><Input value={form.country} onChange={(e) => saveDraft({ ...form, country: e.target.value })} /></div>
                </div>
                <div className="flex justify-between"><Button type="button" variant="outline" onClick={() => goto(1)}>Back</Button><Button type="submit">Continue</Button></div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={nextStep3} className="space-y-5">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Branches</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Add each location you operate from. You can add more anytime.</p>
                </div>
                <div className="space-y-2">
                  {form.branches.map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input placeholder="Branch name" value={b.name} onChange={(e) => { const next = [...form.branches]; next[i] = { ...next[i], name: e.target.value }; saveDraft({ ...form, branches: next, branchCount: next.length }); }} />
                      <Input placeholder="City" value={b.city} onChange={(e) => { const next = [...form.branches]; next[i] = { ...next[i], city: e.target.value }; saveDraft({ ...form, branches: next }); }} />
                      <Button type="button" variant="ghost" size="icon" disabled={form.branches.length === 1} onClick={() => saveDraft({ ...form, branches: form.branches.filter((_: unknown, idx: number) => idx !== i), branchCount: form.branches.length - 1 })}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => saveDraft({ ...form, branches: [...form.branches, { name: "", city: "" }], branchCount: form.branches.length + 1 })}><Plus className="mr-1 h-4 w-4" />Add branch</Button>
                </div>
                <div className="flex justify-between"><Button type="button" variant="outline" onClick={() => goto(2)}>Back</Button><Button type="submit">Continue</Button></div>
              </form>
            )}

            {step === 4 && (
              <form onSubmit={nextStep4} className="space-y-5">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Invite your team</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Add tailors, receptionists and managers. You can skip and invite later.</p>
                </div>
                <div className="space-y-2">
                  {form.invites.length === 0 && (
                    <p className="rounded-md border border-dashed border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">No invitations yet. Add one below or skip.</p>
                  )}
                  {form.invites.map((inv, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input placeholder="email@team.com" value={inv.email} onChange={(e) => { const next = [...form.invites]; next[i] = { ...next[i], email: e.target.value }; saveDraft({ ...form, invites: next }); }} />
                      <select value={inv.role} onChange={(e) => { const next = [...form.invites]; next[i] = { ...next[i], role: e.target.value }; saveDraft({ ...form, invites: next }); }} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                        <option value="admin">Admin</option><option value="receptionist">Receptionist</option><option value="tailor">Tailor</option><option value="inventory">Inventory</option>
                      </select>
                      <Button type="button" variant="ghost" size="icon" onClick={() => saveDraft({ ...form, invites: form.invites.filter((_: unknown, idx: number) => idx !== i) })}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => saveDraft({ ...form, invites: [...form.invites, { email: "", role: "tailor" }] })}><Plus className="mr-1 h-4 w-4" />Add invitation</Button>
                </div>
                <div className="flex justify-between"><Button type="button" variant="outline" onClick={() => goto(3)}>Back</Button><Button type="submit">Continue</Button></div>
              </form>
            )}

            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Choose a plan</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Start free, upgrade anytime.</p>
                </div>
                <div className="grid gap-3">
                  {(Object.keys(PLANS) as Plan[]).map((key) => {
                    const p = PLANS[key]; const active = form.plan === key;
                    return (
                      <button key={key} type="button" onClick={() => saveDraft({ ...form, plan: key })}
                        className={`flex items-start justify-between rounded-lg border p-4 text-left transition ${active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/40"}`}>
                        <div>
                          <p className="font-medium">{p.name} <span className="ml-1 text-xs font-normal text-muted-foreground">/ month</span></p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{p.features.join(" · ")}</p>
                        </div>
                        <div className="text-right"><p className="text-lg font-semibold">{p.price}</p><p className="text-xs text-muted-foreground">{p.seats} seats</p></div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between gap-3">
                  <Button variant="outline" onClick={() => goto(4)} disabled={loading}>Back</Button>
                  <Button onClick={finish} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Building2 className="mr-2 h-4 w-4" />}
                    Create organization
                  </Button>
                </div>
                {form.invites.length > 0 && (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Send className="h-3 w-3" /> {form.invites.length} invitation{form.invites.length > 1 ? "s" : ""} will be queued.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
