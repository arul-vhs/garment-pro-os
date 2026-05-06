import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notifications } from "@/lib/mock-data";
import { Bell, ShoppingBag, AlertTriangle, IndianRupee, Truck } from "lucide-react";

export const Route = createFileRoute("/notifications")({ component: Notifications });

const iconMap = { order: ShoppingBag, stock: AlertTriangle, payment: IndianRupee, delivery: Truck } as const;

function Notifications() {
  return (
    <>
      <PageHeader
        title="Notifications"
        description="Order, stock, payment, and delivery alerts."
        actions={<Button variant="outline">Mark all as read</Button>}
      />
      <div className="space-y-2 p-6">
        {notifications.map((n) => {
          const Icon = (iconMap as any)[n.type] ?? Bell;
          return (
            <Card key={n.id} className={`flex items-center gap-3 p-4 ${!n.read ? "border-primary/30 bg-primary/5" : ""}`}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"><Icon className="h-4 w-4" /></div>
              <div className="flex-1"><p className="text-sm font-medium">{n.title}</p><p className="text-xs text-muted-foreground">{n.time}</p></div>
              {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
            </Card>
          );
        })}
      </div>
    </>
  );
}
