import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Section, SectionHeader } from "@/components/marketing/Section";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/status")({
  component: StatusPage,
  head: () => ({
    meta: [
      { title: "System status — TailorERP" },
      { name: "description", content: "Current health of TailorERP services." },
    ],
  }),
});

type Status = "operational" | "degraded" | "outage";

const SERVICES: { name: string; status: Status; uptime: string }[] = [
  { name: "Web application", status: "operational", uptime: "99.98%" },
  { name: "Customer portal", status: "operational", uptime: "99.97%" },
  { name: "API", status: "operational", uptime: "99.99%" },
  { name: "Notifications (WhatsApp / SMS)", status: "operational", uptime: "99.92%" },
  { name: "Reports engine", status: "operational", uptime: "99.95%" },
  { name: "File storage", status: "operational", uptime: "99.99%" },
];

const BADGES: Record<Status, { label: string; className: string }> = {
  operational: { label: "Operational", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  degraded: { label: "Degraded", className: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  outage: { label: "Outage", className: "bg-destructive/10 text-destructive border-destructive/30" },
};

function StatusPage() {
  const allOk = SERVICES.every((s) => s.status === "operational");
  const now = new Date().toLocaleString();

  return (
    <MarketingLayout>
      <Section>
        <SectionHeader eyebrow="Status" title="TailorERP system status" description={`Last updated: ${now}`} />
        <Card className={`mt-8 flex items-center gap-3 p-6 ${allOk ? "border-emerald-500/40" : "border-amber-500/40"}`}>
          {allOk ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          )}
          <div>
            <div className="font-semibold">{allOk ? "All systems operational" : "Some systems reporting issues"}</div>
            <div className="text-sm text-muted-foreground">Architecture ready for future monitoring integration.</div>
          </div>
        </Card>

        <div className="mt-8 overflow-hidden rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="p-3 font-medium">Service</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">30-day uptime</th>
              </tr>
            </thead>
            <tbody>
              {SERVICES.map((s) => {
                const b = BADGES[s.status];
                return (
                  <tr key={s.name} className="border-t border-border/60">
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${b.className}`}>{b.label}</span>
                    </td>
                    <td className="p-3 text-muted-foreground">{s.uptime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Subscribe to updates by emailing status@tailorerp.app — automated incident notifications are coming soon.
        </p>
      </Section>
    </MarketingLayout>
  );
}
