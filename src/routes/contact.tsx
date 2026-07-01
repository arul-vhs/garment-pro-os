import { createFileRoute } from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Section, SectionHeader } from "@/components/marketing/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { validateAll, required, email as emailV, phone as phoneV, safeText, compose } from "@/lib/validation";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — TailorERP" },
      { name: "description", content: "Get in touch with the TailorERP team." },
    ],
  }),
});

type Form = { name: string; business: string; email: string; phone: string; message: string };

function ContactPage() {
  const [form, setForm] = useState<Form>({ name: "", business: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateAll(form, {
      name: compose(required(), safeText),
      email: compose(required(), emailV),
      phone: phoneV,
      message: compose(required(), safeText),
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    // Submission architecture: persist locally + surface via toast. Backend integration hookable later.
    const key = "tailorerp:contact-submissions";
    const list = JSON.parse(localStorage.getItem(key) ?? "[]");
    list.unshift({ ...form, at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
    setSent(true);
    toast.success("Message sent. We'll get back within one business day.");
  };

  return (
    <MarketingLayout>
      <Section>
        <SectionHeader eyebrow="Contact" title="We'd love to hear from you" description="Questions, feedback, or partnership ideas — reach out." />
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            <InfoRow icon={Mail} title="Email" value="hello@tailorerp.app" />
            <InfoRow icon={Phone} title="Phone" value="+91 90000 00000" />
            <InfoRow icon={MapPin} title="Head office" value="Chennai, Tamil Nadu" />
          </div>
          <Card className="p-6 lg:col-span-2">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircle2 className="h-10 w-10 text-primary" />
                <div className="text-lg font-semibold">Thanks — your message is on its way</div>
                <p className="text-sm text-muted-foreground">A team member will reply within one business day.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" error={errors.name}>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </Field>
                <Field label="Business">
                  <Input value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} />
                </Field>
                <Field label="Email" error={errors.email}>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </Field>
                <Field label="Message" error={errors.message} className="sm:col-span-2">
                  <Textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </Field>
                <div className="sm:col-span-2">
                  <Button type="submit">Send message</Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </Section>
    </MarketingLayout>
  );
}

function InfoRow({ icon: Icon, title, value }: { icon: any; title: string; value: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
        <div>
          <div className="text-xs text-muted-foreground">{title}</div>
          <div className="text-sm font-medium">{value}</div>
        </div>
      </div>
    </Card>
  );
}

function Field({ label, error, children, className = "" }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="mt-1">{children}</div>
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </div>
  );
}
