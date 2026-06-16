import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondary?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, secondary, className = "" }: Props) {
  return (
    <Card className={`flex flex-col items-center justify-center gap-3 p-10 text-center ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {description && <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>}
      </div>
      {(actionLabel || secondary) && (
        <div className="mt-2 flex items-center gap-2">
          {actionLabel && <Button size="sm" onClick={onAction}>{actionLabel}</Button>}
          {secondary}
        </div>
      )}
    </Card>
  );
}
