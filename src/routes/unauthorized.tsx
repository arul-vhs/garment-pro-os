import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/unauthorized")({
  component: UnauthorizedPage,
  head: () => ({ meta: [{ title: "Access denied — TailorERP" }] }),
});

function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
          <ShieldAlert className="h-8 w-8 text-warning-foreground" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your role does not have permission to view this page. Contact your administrator if you believe this is a mistake.
        </p>
        <Button asChild className="mt-6"><Link to="/">Back to dashboard</Link></Button>
      </div>
    </div>
  );
}
