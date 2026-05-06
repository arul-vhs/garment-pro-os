import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  "Created": "bg-muted text-muted-foreground",
  "Measurement Confirmed": "bg-info/15 text-info",
  "Cutting": "bg-warning/20 text-warning-foreground",
  "Stitching": "bg-warning/20 text-warning-foreground",
  "Quality Check": "bg-info/15 text-info",
  "Trial Ready": "bg-info/15 text-info",
  "Alteration": "bg-destructive/15 text-destructive",
  "Ready for Delivery": "bg-success/15 text-success",
  "Delivered": "bg-success/15 text-success",
  "Paid": "bg-success/15 text-success",
  "Pending": "bg-warning/20 text-warning-foreground",
  "Partial": "bg-info/15 text-info",
  "In Stock": "bg-success/15 text-success",
  "Low Stock": "bg-destructive/15 text-destructive",
  "High": "bg-destructive/15 text-destructive",
  "Medium": "bg-warning/20 text-warning-foreground",
  "Low": "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      map[status] ?? "bg-muted text-muted-foreground",
      className,
    )}>
      {status}
    </span>
  );
}
