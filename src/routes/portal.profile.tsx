import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePortalAuth } from "@/lib/customer-auth";
import { customers } from "@/lib/mock-data";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/portal/profile")({ component: PortalProfile });

function PortalProfile() {
  const { user } = usePortalAuth();
  const cust = customers.find((c) => c.id === user?.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Your account details and delivery address.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Account</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Full name</Label><Input value={user?.name ?? ""} readOnly /></div>
          <div className="space-y-1.5"><Label>Customer ID</Label><Input value={user?.id ?? ""} readOnly className="font-mono" /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input value={user?.email ?? ""} readOnly /></div>
          <div className="space-y-1.5"><Label>Mobile</Label><Input value={user?.mobile ?? ""} readOnly /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Delivery Address</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-md border border-border p-4 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{cust?.name ?? user?.name}</p>
              <p className="text-muted-foreground">{cust?.address ?? "No address on file"}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="h-3 w-3" />{user?.mobile}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{user?.email}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Need to update? Please contact the boutique.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Lifetime</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat label="Total orders" value={cust?.totalOrders?.toString() ?? "0"} />
          <Stat label="Last order" value={cust?.lastOrder ?? "—"} />
          <Stat label="Member since" value="2024" />
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
