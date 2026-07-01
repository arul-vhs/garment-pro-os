import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Section, SectionHeader } from "@/components/marketing/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, Minus } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — TailorERP" },
      { name: "description", content: "Simple, transparent pricing for tailoring studios of any size." },
    ],
  }),
});

const PLANS = [
  {
    name: "Starter",
    tag: "For a single tailor or a small shop",
    monthly: 0,
    yearly: 0,
    cta: "Start free",
    highlights: ["Up to 50 orders / mo", "1 branch", "Customer portal", "Email support"],
  },
  {
    name: "Growth",
    tag: "For growing studios",
    monthly: 1999,
    yearly: 1499,
    cta: "Start Growth",
    featured: true,
    highlights: ["Unlimited orders", "Up to 3 branches", "Reports center", "WhatsApp notifications", "Priority support"],
  },
  {
    name: "Enterprise",
    tag: "For multi-branch chains",
    monthly: null,
    yearly: null,
    cta: "Contact sales",
    highlights: ["Unlimited branches", "SSO & advanced RBAC", "Custom reports", "Dedicated success manager"],
  },
];

const MATRIX: { label: string; values: (boolean | string)[] }[] = [
  { label: "Customers & measurements", values: [true, true, true] },
  { label: "Order & production management", values: [true, true, true] },
  { label: "Inventory & fabric tracking", values: ["Basic", true, true] },
  { label: "Invoicing & payments", values: [true, true, true] },
  { label: "Customer portal", values: [true, true, true] },
  { label: "Multi-branch", values: ["1 branch", "Up to 3", "Unlimited"] },
  { label: "Reports center", values: [false, true, true] },
  { label: "Roles & permissions", values: ["Basic", true, "Advanced"] },
  { label: "Audit logs", values: [false, true, true] },
  { label: "SSO", values: [false, false, true] },
  { label: "Priority support", values: [false, true, true] },
  { label: "Dedicated success manager", values: [false, false, true] },
];

function PricingPage() {
  const [yearly, setYearly] = useState(true);
  return (
    <MarketingLayout>
      <Section>
        <SectionHeader
          eyebrow="Pricing"
          title="Plans that scale with your studio"
          description="Start free. Upgrade when you need branches, reports, or advanced admin."
        />
        <div className="mt-8 flex items-center justify-center gap-3 text-sm">
          <span className={yearly ? "text-muted-foreground" : "font-medium"}>Monthly</span>
          <Switch checked={yearly} onCheckedChange={setYearly} />
          <span className={yearly ? "font-medium" : "text-muted-foreground"}>
            Yearly <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Save 25%</span>
          </span>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => {
            const price = yearly ? p.yearly : p.monthly;
            return (
              <Card key={p.name} className={`flex flex-col p-6 ${p.featured ? "border-primary shadow-lg" : ""}`}>
                <div className="text-sm text-muted-foreground">{p.tag}</div>
                <div className="mt-1 text-lg font-semibold">{p.name}</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight">
                  {price === null ? "Custom" : price === 0 ? "Free" : `₹${price.toLocaleString("en-IN")}`}
                  {price ? <span className="ml-1 text-sm font-normal text-muted-foreground">/mo</span> : null}
                </div>
                <ul className="mt-6 flex-1 space-y-2 text-sm">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-6" variant={p.featured ? "default" : "outline"} asChild>
                  <Link to={p.name === "Enterprise" ? "/contact" : "/book-demo"}>{p.cta}</Link>
                </Button>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section className="border-t border-border/60">
        <SectionHeader eyebrow="Compare" title="Full feature comparison" />
        <div className="mt-10 overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="p-3 text-left font-medium">Feature</th>
                {PLANS.map((p) => (
                  <th key={p.name} className="p-3 text-left font-medium">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row) => (
                <tr key={row.label} className="border-t border-border/60">
                  <td className="p-3 text-muted-foreground">{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className="p-3">
                      {typeof v === "boolean" ? (
                        v ? <Check className="h-4 w-4 text-primary" /> : <Minus className="h-4 w-4 text-muted-foreground/60" />
                      ) : (
                        <span>{v}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </MarketingLayout>
  );
}
