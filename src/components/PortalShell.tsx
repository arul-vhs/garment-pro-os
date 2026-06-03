import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, ShoppingBag, Receipt, Ruler, User, LogOut, Scissors } from "lucide-react";
import { usePortalAuth } from "@/lib/customer-auth";
import { Button } from "@/components/ui/button";

const nav = [
  { url: "/portal/dashboard",    icon: LayoutDashboard, label: "Home" },
  { url: "/portal/orders",       icon: ShoppingBag,     label: "Orders" },
  { url: "/portal/invoices",     icon: Receipt,         label: "Invoices" },
  { url: "/portal/measurements", icon: Ruler,           label: "Sizes" },
  { url: "/portal/profile",      icon: User,            label: "Profile" },
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { user, logout } = usePortalAuth();
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur">
        <Link to="/portal/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Scissors className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">My Atelier</p>
            <p className="text-[10px] text-muted-foreground">Customer Portal</p>
          </div>
        </Link>
        <nav className="ml-6 hidden gap-1 md:flex">
          {nav.map((n) => {
            const active = path.startsWith(n.url);
            return (
              <Link key={n.url} to={n.url}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {user && (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <Button size="sm" variant="outline" onClick={() => { logout(); navigate({ to: "/portal/login" }); }}>
                <LogOut className="mr-1.5 h-3.5 w-3.5" />Sign out
              </Button>
            </>
          )}
        </div>
      </header>
      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">{children}</div>
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-card/95 px-1 py-1.5 backdrop-blur md:hidden">
        {nav.map((n) => {
          const active = path.startsWith(n.url);
          return (
            <Link key={n.url} to={n.url}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
              <n.icon className="h-5 w-5" />
              {n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
