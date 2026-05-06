import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { orders, ORDER_STATUSES } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";

export const Route = createFileRoute("/production")({ component: Production });

function progressOf(status: string) {
  const i = ORDER_STATUSES.indexOf(status as any);
  return Math.round(((i + 1) / ORDER_STATUSES.length) * 100);
}

function Production() {
  const active = orders.filter(o => o.status !== "Delivered");
  return (
    <>
      <PageHeader title="Production" description="Tailor work queues, deadlines, and stage updates." />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {active.map((o) => (
            <Card key={o.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{o.customer}</CardTitle>
                  <p className="text-xs text-muted-foreground">{o.id} · {o.garment} · qty {o.qty}</p>
                </div>
                <StatusBadge status={o.priority} />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tailor</span>
                  <span className="font-medium">{o.tailor}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="font-medium">{o.delivery}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <StatusBadge status={o.status} />
                    <span className="text-muted-foreground">{progressOf(o.status)}%</span>
                  </div>
                  <Progress value={progressOf(o.status)} />
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => toast.success("Stage advanced")}>Advance Stage</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
