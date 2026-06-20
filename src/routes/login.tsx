import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { useAuth, DEMO_CREDENTIALS, roleHome } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Scissors, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — TailorERP" }] }),
});

function LoginPage() {
  const { login, user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    navigate({ to: roleHome(user.role) });
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const u = await login(email, password, remember);
      toast.success(`Welcome back, ${u.fullName.split(" ")[0]}`);
      navigate({ to: roleHome(u.role) });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const useDemo = (i: number) => {
    setEmail(DEMO_CREDENTIALS[i].email);
    setPassword(DEMO_CREDENTIALS[i].password);
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/70 p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px),radial-gradient(circle_at_80%_60%,white_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/15 backdrop-blur">
            <Scissors className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">TailorERP</span>
        </div>
        <div className="relative space-y-6">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Run your atelier<br />like a modern studio.
          </h1>
          <p className="max-w-md text-base text-primary-foreground/80">
            End-to-end orders, measurements, production, billing and inventory — built for boutique tailors and bespoke garment houses.
          </p>
          <div className="grid max-w-md grid-cols-3 gap-3 pt-4">
            {["Orders", "Production", "Billing"].map((s) => (
              <div key={s} className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-2 text-xs font-medium backdrop-blur">
                {s}
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} TailorERP · Atelier Management Suite
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-6 py-10">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Scissors className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold">TailorERP</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Sign in to your workspace</h2>
            <p className="text-sm text-muted-foreground">Welcome back. Please enter your details.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" placeholder="you@studio.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
              Remember me for 30 days
            </label>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign in
              {!loading && <ArrowRight className="ml-1.5 h-4 w-4" />}
            </Button>
          </form>

          <Card className="border-dashed bg-muted/40 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Demo accounts</p>
            <div className="grid gap-1.5">
              {DEMO_CREDENTIALS.map((d, i) => (
                <button key={d.email} type="button" onClick={() => useDemo(i)}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-left text-xs hover:bg-background">
                  <span className="font-medium capitalize">{d.role}</span>
                  <span className="font-mono text-muted-foreground">{d.email}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
