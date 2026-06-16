import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { notifications } from "@/lib/mock-data";
import { Bell, ShoppingBag, AlertTriangle, IndianRupee, Truck, BellOff } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/notifications")({ component: Notifications });

const iconMap = { order: ShoppingBag, stock: AlertTriangle, payment: IndianRupee, delivery: Truck } as const;

function Notifications() {
  const [items, setItems] = useState(notifications);
  const markAll = () => { setItems(items.map((n) => ({ ...n, read: true }))); toast.success("All notifications marked as read"); };
  return (
    <>
      <PageHeader
        title="Notifications"
        description="Order, stock, payment, and delivery alerts."
        actions={<Button variant="outline" onClick={markAll} disabled={items.every((n) => n.read)}>Mark all as read</Button>}
      />
      <div className="space-y-2 p-6">
        {items.length === 0 ? (
          <EmptyState
            icon={BellOff}
            title="You're all caught up"
            description="New alerts about orders, stock, payments, and deliveries will appear here."
          />
        ) : items.map((n) => {
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

