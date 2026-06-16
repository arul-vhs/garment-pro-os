import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";
import { usePortalAuth } from "@/lib/customer-auth";
import { measurements } from "@/lib/mock-data";
import { Ruler } from "lucide-react";

export const Route = createFileRoute("/portal/measurements")({ component: PortalMeasurements });

function PortalMeasurements() {
  const { user } = usePortalAuth();
  const mine = measurements.filter((m) => m.customer === user?.name);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Measurements</h1>
        <p className="text-sm text-muted-foreground">Saved profiles per garment, versioned over time.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mine.map((m) => (
          <Card key={m.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Ruler className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm">{m.garment}</CardTitle>
                  <p className="text-[11px] text-muted-foreground">Updated {m.date}</p>
                </div>
              </div>
              <Badge variant="secondary">v{m.version}</Badge>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {Object.entries(m.fields).map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between border-b border-dashed border-border py-1">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-mono text-sm font-medium">{v}"</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        ))}
        {mine.length === 0 && (
          <div className="md:col-span-2">
            <EmptyState
              icon={Ruler}
              title="No measurements on file"
              description="Visit the boutique for your first measurement. We'll keep every version safely here."
            />
          </div>
        )}
      </div>
    </div>
  );
}
