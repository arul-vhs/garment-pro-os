import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Section, SectionHeader } from "@/components/marketing/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Compass, Rocket } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — TailorERP" },
      { name: "description", content: "Our mission: bring modern software to traditional tailoring studios." },
    ],
  }),
});

function AboutPage() {
  return (
    <MarketingLayout>
      <Section>
        <SectionHeader
          eyebrow="About"
          title="Modern software for a timeless craft"
          description="We build TailorERP to help ateliers focus on their craft — not on spreadsheets."
        />
      </Section>
      <Section className="border-t border-border/60">
        <div className="grid gap-6 md:grid-cols-3">
          <Pillar icon={Compass} title="Vision" text="Every tailoring business runs on modern, dependable software — regardless of size or language." />
          <Pillar icon={Heart} title="Mission" text="Reduce the operational burden on studio owners so they spend more time on customers and craft." />
          <Pillar icon={Rocket} title="Product story" text="Started in Chennai after seeing studios juggling notebooks, WhatsApp, and Excel. We built one place for it all." />
        </div>
      </Section>
      <Section className="border-t border-border/60">
        <div className="mx-auto max-w-3xl space-y-4 text-sm text-muted-foreground">
          <p>
            TailorERP is designed alongside real ateliers across South India. Each module — from measurements
            to production and finance — comes from a workflow we watched in a real studio.
          </p>
          <p>
            We support English, Tamil, and Telugu because software should meet teams where they are.
            We take multi-branch and multi-tenant seriously so businesses can grow on the same platform they started with.
          </p>
          <p>
            If you run a tailoring business, we'd love to hear how you work today.
          </p>
        </div>
        <div className="mt-8 text-center">
          <Button asChild><Link to="/contact">Say hello</Link></Button>
        </div>
      </Section>
    </MarketingLayout>
  );
}

function Pillar({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <Card className="p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
      <div className="mt-4 text-lg font-semibold">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </Card>
  );
}
