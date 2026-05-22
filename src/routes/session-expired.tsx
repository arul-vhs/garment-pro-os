import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/session-expired")({
  component: SessionExpiredPage,
  head: () => ({ meta: [{ title: "Session expired — TailorERP" }] }),
});

function SessionExpiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Your session has expired</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          For your security you have been signed out. Please sign in again to continue.
        </p>
        <Button asChild className="mt-6"><Link to="/login">Sign in again</Link></Button>
      </div>
    </div>
  );
}
