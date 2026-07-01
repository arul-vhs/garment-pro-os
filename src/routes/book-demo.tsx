import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Section, SectionHeader } from "@/components/marketing/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Calendar, Users, Building2 } from "lucide-react";
import { toast } from "sonner";
import { validateAll, required, email as emailV, phone as phoneV, numeric, compose } from "@/lib/validation";

export const Route = createFileRoute("/book-demo")({
  component: BookDemoPage,
  head: () => ({
    meta: [
      { title: "Book a demo — TailorERP" },
      { name: "description", content: "Book a personalized 20-minute demo tailored to your studio's workflow." },
    ],
  }),
});

type Form = {
  business: string; contactName: string; email: string; phone: string;
  employees: string; branches: string;
};

function BookDemoPage() {
  const [form, setForm] = useState<Form>({
    business: "", contactName: "", email: "", phone: "", employees: "", branches: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateAll(form, {
      business: required(),
      contactName: required(),
      email: compose(required(), emailV),
      phone: compose(required(), phoneV),
      employees: numeric,
      branches: numeric,
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const key = "tailorerp:demo-requests";
    const list = JSON.parse(localStorage.getItem(key) ?? "[]");
    list.unshift({ ...form, at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
    setDone(true);
    toast.success("Demo requested — check your inbox shortly.");
  };

  if (done) {
    return (
      <MarketingLayout>
        <Section>
          <Card className="mx-auto max-w-xl p-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">You're on the calendar</h1>
            <p className="mt-2 text-muted-foreground">
              Thanks {form.contactName?.split(" ")[0] || "there"} — a specialist will email {form.email} within one business day to confirm your slot.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild><Link to="/landing">Back to home</Link></Button>
              <Button variant="outline" asChild><Link to="/features">Explore features</Link></Button>
            </div>
          </Card>
        </Section>
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout>
      <Section>
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeader
              align="left"
              eyebrow="Book a demo"
              title="See TailorERP in your workflow"
              description="A 20-minute walkthrough with a specialist. Bring your questions."
            />
            <ul className="mt-6 space-y-3 text-sm">
              <Bullet icon={Calendar} text="Live, personalized to your studio" />
              <Bullet icon={Users} text="Bring your team — up to 5 attendees" />
              <Bullet icon={Building2} text="Multi-branch scenarios welcomed" />
            </ul>
          </div>
          <Card className="p-6 lg:col-span-3">
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
              <Field label="Business name" error={errors.business}>
                <Input value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} />
              </Field>
              <Field label="Contact name" error={errors.contactName}>
                <Input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
              </Field>
              <Field label="Email" error={errors.email}>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </Field>
              <Field label="Employees" error={errors.employees}>
                <Input type="number" min={0} value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })} />
              </Field>
              <Field label="Branches" error={errors.branches}>
                <Input type="number" min={0} value={form.branches} onChange={(e) => setForm({ ...form, branches: e.target.value })} />
              </Field>
              <div className="sm:col-span-2">
                <Button type="submit" className="w-full sm:w-auto">Request demo</Button>
              </div>
            </form>
          </Card>
        </div>
      </Section>
    </MarketingLayout>
  );
}

function Bullet({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <li className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 text-primary" />
      <span>{text}</span>
    </li>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="mt-1">{children}</div>
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </div>
  );
}
