import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Section, SectionHeader } from "@/components/marketing/Section";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LifeBuoy, Mail, MessageSquare, Wrench } from "lucide-react";

export const Route = createFileRoute("/help")({
  component: HelpCenter,
  head: () => ({
    meta: [
      { title: "Help center — TailorERP" },
      { name: "description", content: "FAQs, troubleshooting, and how to reach TailorERP support." },
    ],
  }),
});

const FAQS = [
  { q: "How do I reset my password?", a: "Use the Forgot password link on the sign-in page. You'll receive an email with reset instructions." },
  { q: "Why can't I see the Reports Center?", a: "Reports Center requires the Growth plan or above. Ask your admin to upgrade." },
  { q: "How do I invite a team member?", a: "Go to Roles & Permissions from the sidebar, click Invite, and choose a role." },
  { q: "How do customers access their portal?", a: "Send them the portal link. They sign in with the phone number on file and a one-time code." },
  { q: "Can I use TailorERP offline?", a: "TailorERP requires an internet connection. Data is cached briefly so short drops are handled gracefully." },
  { q: "How do I change the language?", a: "Use the language switcher in the top-right. Admins can set a tenant-wide default." },
];

const TROUBLESHOOTING = [
  { title: "Portal login not working", steps: ["Check the phone number is correct", "Request a new OTP", "If it still fails, contact your studio admin"] },
  { title: "Invoice PDF won't open", steps: ["Allow pop-ups for tailorerp.app", "Retry from the invoice list", "Contact support if the issue persists"] },
  { title: "Missing data after switching branch", steps: ["Confirm the correct branch in the branch switcher", "Refresh the page", "Verify your role has access to that branch"] },
];

function HelpCenter() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    if (!q.trim()) return { faqs: FAQS, tips: TROUBLESHOOTING };
    const t = q.toLowerCase();
    return {
      faqs: FAQS.filter((f) => (f.q + f.a).toLowerCase().includes(t)),
      tips: TROUBLESHOOTING.filter((f) => (f.title + f.steps.join(" ")).toLowerCase().includes(t)),
    };
  }, [q]);

  return (
    <MarketingLayout>
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">How can we help?</h1>
          <p className="mt-2 text-muted-foreground">Search the help center or contact our team.</p>
          <div className="relative mx-auto mt-6 max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search help articles…" className="h-11 pl-9" />
          </div>
        </div>
      </Section>

      <Section className="border-t border-border/60">
        <SectionHeader eyebrow="FAQs" title="Frequently asked questions" align="left" />
        <div className="mt-6 grid gap-3">
          {results.faqs.length === 0 && <p className="text-sm text-muted-foreground">No results. Try different keywords.</p>}
          {results.faqs.map((f, i) => (
            <details key={i} className="rounded-md border border-border/60 bg-card/50 p-4">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border/60">
        <SectionHeader eyebrow="Troubleshooting" title="Common issues" align="left" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {results.tips.map((t) => (
            <Card key={t.title} className="p-5">
              <div className="flex items-center gap-2 font-semibold">
                <Wrench className="h-4 w-4 text-primary" /> {t.title}
              </div>
              <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                {t.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border/60">
        <SectionHeader eyebrow="Support" title="Still need help?" align="left" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <Mail className="h-5 w-5 text-primary" />
            <div className="mt-3 font-semibold">Email support</div>
            <p className="mt-1 text-sm text-muted-foreground">Reach us at support@tailorerp.app — we reply within one business day.</p>
            <Button className="mt-4" variant="outline" asChild>
              <a href="mailto:support@tailorerp.app">Email us</a>
            </Button>
          </Card>
          <Card className="p-6">
            <MessageSquare className="h-5 w-5 text-primary" />
            <div className="mt-3 font-semibold">Talk to sales</div>
            <p className="mt-1 text-sm text-muted-foreground">Considering TailorERP for your studio? Book a walkthrough.</p>
            <Button className="mt-4" asChild>
              <Link to="/book-demo">Book demo</Link>
            </Button>
          </Card>
        </div>
      </Section>
    </MarketingLayout>
  );
}
