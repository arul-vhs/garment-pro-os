import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { usePortalAuth, PORTAL_DEMO } from "@/lib/customer-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Scissors, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/login")({ component: PortalLogin });

function PortalLogin() {
  const { login } = usePortalAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome, ${u.name.split(" ")[0]}`);
      navigate({ to: "/portal/dashboard" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const useDemo = (i: number) => {
    setEmail(PORTAL_DEMO[i].email);
    setPassword(PORTAL_DEMO[i].password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/40 via-background to-background px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Scissors className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Customer Portal</h1>
            <p className="text-sm text-muted-foreground">Track your orders, invoices & fittings.</p>
          </div>
        </div>
        <Card className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot?</Link>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Sign in
            </Button>
          </form>
        </Card>
        <Card className="border-dashed bg-muted/40 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Demo customers</p>
          <div className="grid gap-1.5">
            {PORTAL_DEMO.map((d, i) => (
              <button key={d.email} type="button" onClick={() => useDemo(i)}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-left text-xs hover:bg-background">
                <span className="font-medium">{d.name}</span>
                <span className="font-mono text-muted-foreground">{d.email}</span>
              </button>
            ))}
          </div>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          Staff member? <Link to="/login" className="font-medium text-primary hover:underline">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
