import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { useTenant, PLANS, type Plan } from "@/lib/tenant";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, ArrowRight, Check, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  const { user } = useAuth();
  const { createOrg } = useTenant();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    industry: "Bespoke Tailoring",
    country: "India",
    currency: "INR",
    plan: "starter" as Plan,
  });

  const next = (e: FormEvent) => { e.preventDefault(); if (form.name.trim().length < 2) return toast.error("Business name is required"); setStep(2); };

  const finish = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const org = createOrg(form);
    setLoading(false);
    toast.success(`${org.name} is ready`);
    navigate({ to: "/" });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Scissors className="h-4 w-4" /></div>
          <div>
            <p className="text-sm font-semibold">TailorERP</p>
            <p className="text-xs text-muted-foreground">Set up your organization</p>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2 text-xs font-medium">
          {[1, 2].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full ${step >= n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{step > n ? <Check className="h-3.5 w-3.5" /> : n}</div>
              <span className={step >= n ? "text-foreground" : "text-muted-foreground"}>{n === 1 ? "Business" : "Plan"}</span>
              {n === 1 && <div className="mx-2 h-px w-10 bg-border" />}
            </div>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            {step === 1 ? (
              <form onSubmit={next} className="space-y-5">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Tell us about your business</h1>
                  <p className="mt-1 text-sm text-muted-foreground">This creates an isolated workspace for your data.</p>
                </div>
                <div className="grid gap-1.5"><Label>Business name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Atelier Kumar Tailors" required /></div>
                <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-4">
                  <div className="grid gap-1.5"><Label>Industry</Label><Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></div>
                  <div className="grid gap-1.5"><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
                </div>
                <div className="grid gap-1.5"><Label>Default currency</Label><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} /></div>
                <Button type="submit" className="w-full">Continue<ArrowRight className="ml-1.5 h-4 w-4" /></Button>
              </form>
            ) : (
              <div className="space-y-5">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Choose a plan</h1>
                  <p className="mt-1 text-sm text-muted-foreground">You can change this anytime from Organization settings.</p>
                </div>
                <div className="grid gap-3">
                  {(Object.keys(PLANS) as Plan[]).map((key) => {
                    const p = PLANS[key];
                    const active = form.plan === key;
                    return (
                      <button key={key} type="button" onClick={() => setForm({ ...form, plan: key })}
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
                  <Button variant="outline" onClick={() => setStep(1)} disabled={loading}>Back</Button>
                  <Button onClick={finish} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Building2 className="mr-2 h-4 w-4" />}
                    Create organization
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
