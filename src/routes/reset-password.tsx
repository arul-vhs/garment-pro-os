import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Scissors } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  component: ResetPage,
  head: () => ({ meta: [{ title: "Reset password — TailorERP" }] }),
});

function validate(pw: string): string | null {
  if (pw.length < 8) return "At least 8 characters.";
  if (!/[A-Z]/.test(pw)) return "Add an uppercase letter.";
  if (!/[0-9]/.test(pw)) return "Add a number.";
  return null;
}

function ResetPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const v = validate(pw);
    if (v) return setErr(v);
    if (pw !== confirm) return setErr("Passwords do not match.");
    setErr(null);
    setLoading(true);
    await resetPassword("token", pw);
    setLoading(false);
    toast.success("Password updated. Please sign in.");
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Scissors className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Set a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">Must be at least 8 characters with a number and an uppercase letter.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pw">New password</Label>
            <Input id="pw" type="password" required value={pw} onChange={(e) => setPw(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update password
          </Button>
          <Link to="/login" className="block text-center text-xs text-muted-foreground hover:text-foreground">
            Back to sign in
          </Link>
        </form>
      </div>
    </div>
  );
}
