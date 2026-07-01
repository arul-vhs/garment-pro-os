import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Section, SectionHeader } from "@/components/marketing/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users, Ruler, ShoppingBag, Factory, Package, Receipt, DollarSign,
  Bell, MessageSquare, BarChart3, ShieldCheck, Building2, KeyRound, Globe2, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
  head: () => ({
    meta: [
      { title: "Features — TailorERP" },
      { name: "description", content: "Every capability needed to run a modern tailoring business." },
    ],
  }),
});

const GROUPS: { title: string; items: { icon: any; title: string; desc: string }[] }[] = [
  {
    title: "Operations",
    items: [
      { icon: Users, title: "Customer CRM", desc: "Rich profiles, family links, notes, and history." },
      { icon: Ruler, title: "Measurements", desc: "Reusable templates per garment, versioned per visit." },
      { icon: ShoppingBag, title: "Orders", desc: "Intake, deposits, trials, delivery, and follow-up." },
    ],
  },
  {
    title: "Production",
    items: [
      { icon: Factory, title: "Production board", desc: "Stages, assignments, and load balancing." },
      { icon: Sparkles, title: "Designs & references", desc: "Attach references, styles, and specifications." },
    ],
  },
  {
    title: "Inventory",
    items: [
      { icon: Package, title: "Fabric & materials", desc: "Rolls, cuts, wastage, and reorder alerts." },
      { icon: Building2, title: "Multi-branch stock", desc: "Central catalog with per-branch inventory." },
    ],
  },
  {
    title: "Finance",
    items: [
      { icon: Receipt, title: "Invoicing", desc: "GST-ready invoices, prefixes, and templates." },
      { icon: DollarSign, title: "Ledgers", desc: "Payments, refunds, credit notes, and reconciliation." },
    ],
  },
  {
    title: "Customer experience",
    items: [
      { icon: Bell, title: "Notifications", desc: "Automated updates for trials and readiness." },
      { icon: MessageSquare, title: "Communications", desc: "WhatsApp, SMS, and email — from one inbox." },
      { icon: Globe2, title: "Customer portal", desc: "Branded self-service in English, Tamil, Telugu." },
    ],
  },
  {
    title: "Analytics",
    items: [
      { icon: BarChart3, title: "Reports center", desc: "Financial, operations, customer, and inventory reports." },
    ],
  },
  {
    title: "Administration",
    items: [
      { icon: ShieldCheck, title: "Roles & permissions", desc: "Fine-grained RBAC with an audit trail." },
      { icon: KeyRound, title: "Tenant isolation", desc: "Every business's data stays fully separated." },
    ],
  },
];

function FeaturesPage() {
  return (
    <MarketingLayout>
      <Section>
        <SectionHeader
          eyebrow="Features"
          title="Everything a modern atelier needs"
          description="Grouped by workflow so teams find what they need — fast."
        />
      </Section>
      {GROUPS.map((g) => (
        <Section key={g.title} className="border-t border-border/60">
          <div className="mb-8 flex items-end justify-between">
            <h3 className="text-xl font-semibold tracking-tight">{g.title}</h3>
            <span className="text-xs text-muted-foreground">{g.items.length} capabilities</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((it) => (
              <Card key={it.title} className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <it.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-semibold">{it.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
              </Card>
            ))}
          </div>
        </Section>
      ))}
      <Section className="border-t border-border/60 text-center">
        <h3 className="text-2xl font-semibold tracking-tight">See it in your workflow</h3>
        <p className="mt-2 text-muted-foreground">Book a personalized demo tailored to your studio.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild><Link to="/book-demo">Book demo</Link></Button>
          <Button variant="outline" asChild><Link to="/pricing">See pricing</Link></Button>
        </div>
      </Section>
    </MarketingLayout>
  );
}
