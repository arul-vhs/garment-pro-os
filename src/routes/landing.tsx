import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Section, SectionHeader } from "@/components/marketing/Section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Users,
  Ruler,
  ShoppingBag,
  Package,
  Factory,
  Receipt,
  Building2,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Globe2,
  CheckCircle2,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/landing")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "TailorERP — Modern ERP for tailoring businesses" },
      {
        name: "description",
        content:
          "Manage customers, measurements, orders, inventory, billing, and production from a single platform built for tailoring studios and boutiques.",
      },
    ],
  }),
});

const features = [
  { icon: Users, title: "Customers & CRM", desc: "Rich profiles, family accounts, and history at a glance." },
  { icon: Ruler, title: "Digital measurements", desc: "Reusable templates with garment-specific fields." },
  { icon: ShoppingBag, title: "Order management", desc: "From order intake to trials, delivery, and follow-up." },
  { icon: Package, title: "Inventory & fabric", desc: "Rolls, cuts, and reorder alerts across branches." },
  { icon: Factory, title: "Production floor", desc: "Assignments, stages, and turnaround tracking." },
  { icon: Receipt, title: "Billing & finance", desc: "Invoices, payments, ledgers, and tax-ready reports." },
];

function LandingPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--primary)/0.12),transparent_70%)]"
        />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Built for tailoring studios, boutiques, and ateliers
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Modern ERP for tailoring businesses
            </h1>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg">
              Manage customers, measurements, orders, inventory, billing, and production from a
              single, elegant platform.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/book-demo">
                  Book demo <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Start free trial</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> No credit card required</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> English, Tamil & Telugu</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Multi-branch ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features overview */}
      <Section>
        <SectionHeader
          eyebrow="Everything you need"
          title="One platform for the entire atelier"
          description="Replace spreadsheets, notebooks, and disconnected tools with a purpose-built suite."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-semibold">{f.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link to="/features">Explore all features <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </Section>

      {/* Customer portal */}
      <Section className="border-t border-border/60">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Customer portal"
              title="A branded self-service experience for your customers"
              description="Customers view orders, measurements, and invoices, upload references, and stay updated — from any device."
            />
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Order status & trial reminders",
                "Saved measurements per family member",
                "Invoice downloads & online payments",
                "Multi-language: English, Tamil, Telugu",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <MockPanel title="portal.tailorerp.app">
            <div className="grid gap-3">
              {["Order #A-2841 · Silk kurta · In stitching", "Order #A-2792 · Suit · Ready for trial", "Invoice INV-118 · ₹4,200 · Paid"].map((t) => (
                <div key={t} className="rounded-md border border-border/60 bg-background p-3 text-sm">{t}</div>
              ))}
            </div>
          </MockPanel>
        </div>
      </Section>

      {/* Multi-branch */}
      <Section className="border-t border-border/60">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <MockPanel title="branches.tailorerp.app">
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "T. Nagar", orders: 142 },
                { name: "Anna Nagar", orders: 98 },
                { name: "Coimbatore", orders: 74 },
                { name: "Madurai", orders: 51 },
              ].map((b) => (
                <div key={b.name} className="rounded-md border border-border/60 bg-background p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="h-4 w-4 text-primary" /> {b.name}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{b.orders} active orders</div>
                </div>
              ))}
            </div>
          </MockPanel>
          <div>
            <SectionHeader
              align="left"
              eyebrow="Multi-branch"
              title="Run every branch from one control tower"
              description="Central inventory, per-branch P&L, transfers, and consolidated reporting."
            />
          </div>
        </div>
      </Section>

      {/* Reports */}
      <Section className="border-t border-border/60">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Reports & analytics"
              title="Executive-level insights, out of the box"
              description="Financial, operational, customer, and inventory reports with export to CSV and PDF."
            />
            <div className="mt-6 flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/features">See features</Link>
              </Button>
            </div>
          </div>
          <MockPanel title="reports.tailorerp.app">
            <div className="grid gap-3">
              <StatRow label="Revenue this month" value="₹8,42,300" delta="+12.4%" />
              <StatRow label="Orders completed" value="217" delta="+6.1%" />
              <StatRow label="Avg. turnaround" value="6.2 days" delta="-8.9%" positive />
            </div>
          </MockPanel>
        </div>
      </Section>

      {/* Pricing preview */}
      <Section className="border-t border-border/60">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple plans for growing ateliers"
          description="Start free. Scale when you need branches, roles, and advanced reporting."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { name: "Starter", price: "₹0", tag: "For a single tailor" },
            { name: "Growth", price: "₹1,999/mo", tag: "For growing studios", featured: true },
            { name: "Enterprise", price: "Custom", tag: "Multi-branch chains" },
          ].map((p) => (
            <Card key={p.name} className={`p-6 ${p.featured ? "border-primary shadow-lg" : ""}`}>
              <div className="text-sm text-muted-foreground">{p.tag}</div>
              <div className="mt-1 text-lg font-semibold">{p.name}</div>
              <div className="mt-3 text-3xl font-semibold tracking-tight">{p.price}</div>
              <Button className="mt-6 w-full" variant={p.featured ? "default" : "outline"} asChild>
                <Link to="/pricing">Compare plans</Link>
              </Button>
            </Card>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="border-t border-border/60">
        <SectionHeader eyebrow="Loved by studios" title="Trusted across South India" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { q: "We closed our spreadsheets in a week. Orders are on-time again.", a: "Priya · Chennai" },
            { q: "The portal alone brought us 30% repeat customers.", a: "Ravi · Coimbatore" },
            { q: "Finally, one place for measurements, cutting, and billing.", a: "Meera · Madurai" },
          ].map((t) => (
            <Card key={t.a} className="p-6">
              <p className="text-sm">“{t.q}”</p>
              <div className="mt-4 text-xs text-muted-foreground">{t.a}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="border-t border-border/60">
        <SectionHeader eyebrow="FAQ" title="Answers to common questions" />
        <div className="mx-auto mt-8 max-w-3xl">
          <Accordion type="single" collapsible>
            {[
              { q: "Do I need to install anything?", a: "No. TailorERP runs in your browser and on mobile." },
              { q: "Can my customers see their orders?", a: "Yes — every plan includes the branded customer portal." },
              { q: "Do you support Tamil and Telugu?", a: "Yes, the entire product is localized in English, Tamil, and Telugu." },
              { q: "Can I move my existing data?", a: "Our team helps import customers, measurements, and inventory during onboarding." },
            ].map((f, i) => (
              <AccordionItem key={i} value={`i${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to modernize your studio?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Book a 20-minute demo. We'll tailor it to your workflow.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/book-demo">Book demo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/pricing">See pricing</Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Tenant-isolated</span>
            <span className="inline-flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5" /> Multi-language</span>
            <span className="inline-flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Executive reports</span>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

function MockPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <span className="ml-2 font-mono">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function StatRow({ label, value, delta, positive }: { label: string; value: string; delta: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border/60 bg-background p-3">
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-lg font-semibold">{value}</div>
      </div>
      <span className={`text-xs font-medium ${positive || delta.startsWith("+") ? "text-emerald-600" : "text-muted-foreground"}`}>{delta}</span>
    </div>
  );
}
