import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, ShoppingBag, Receipt, Ruler, User, LogOut, Scissors } from "lucide-react";
import { usePortalAuth } from "@/lib/customer-auth";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const nav = [
  { url: "/portal/dashboard",    icon: LayoutDashboard, key: "portal.nav.home" },
  { url: "/portal/orders",       icon: ShoppingBag,     key: "portal.nav.orders" },
  { url: "/portal/invoices",     icon: Receipt,         key: "portal.nav.invoices" },
  { url: "/portal/measurements", icon: Ruler,           key: "portal.nav.sizes" },
  { url: "/portal/profile",      icon: User,            key: "portal.nav.profile" },
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { user, logout } = usePortalAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur">
        <Link to="/portal/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Scissors className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">{t("portal.brand.title")}</p>
            <p className="text-[10px] text-muted-foreground">{t("portal.brand.subtitle")}</p>
          </div>
        </Link>
        <nav className="ml-6 hidden gap-1 md:flex">
          {nav.map((n) => {
            const active = path.startsWith(n.url);
            return (
              <Link key={n.url} to={n.url}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {t(n.key)}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher persistScope="session" align="end" variant="compact" />
          {user && (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">{t("portal.hi")}, {user.name.split(" ")[0]}</span>
              <Button size="sm" variant="outline" onClick={() => { logout(); navigate({ to: "/portal/login" }); }}>
                <LogOut className="mr-1.5 h-3.5 w-3.5" />{t("common.actions.signOut")}
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
              {t(n.key)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
