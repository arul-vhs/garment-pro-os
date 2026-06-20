import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState, useNavigate, Navigate } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Sun } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AuthProvider, useAuth, canAccess } from "@/lib/auth";
import { TenantProvider, useTenant } from "@/lib/tenant";
import { AuditProvider } from "@/lib/audit";
import { BranchProvider } from "@/lib/branches";
import { SubscriptionProvider } from "@/lib/subscription";
import { PortalAuthProvider } from "@/lib/customer-auth";
import { UserMenu } from "@/components/UserMenu";
import { OrgSwitcher } from "@/components/OrgSwitcher";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { CommandPalette } from "@/components/CommandPalette";
import { GlobalSearchTrigger } from "@/components/GlobalSearchTrigger";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import appCss from "../styles.css?url";

const PUBLIC_PATHS = ["/login", "/forgot-password", "/reset-password", "/session-expired", "/unauthorized"];
const NO_ORG_REQUIRED = [...PUBLIC_PATHS, "/onboarding"];

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-4 text-muted-foreground">Page not found</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Go home</Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TailorERP — Atelier Management Suite" },
      { name: "description", content: "Professional ERP for tailoring businesses, boutiques, and garment customization." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeadContent />
      {children}
      <Scripts />
    </>
  );
}

const titleKeys: Record<string, string> = {
  "/": "nav.dashboard", "/customers": "nav.customers", "/measurements": "nav.measurements",
  "/orders": "nav.orders", "/designs": "nav.designs", "/inventory": "nav.inventory",
  "/production": "nav.production", "/billing": "nav.billing", "/employees": "nav.employees",
  "/reports": "nav.reports", "/reports-center": "nav.reportsCenter", "/notifications": "nav.notifications",
  "/settings": "nav.settings", "/finance": "nav.finance", "/communications": "nav.communications",
  "/branches": "nav.branches", "/roles": "nav.roles", "/audit-logs": "nav.audit",
  "/subscription": "nav.subscription", "/organization": "nav.organization",
  "/super-admin": "nav.superadmin", "/tenant-settings": "nav.tenantSettings",
};

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  return (
    <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} aria-label="Toggle theme">
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

function AppShell() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { user, loading } = useAuth();
  const { orgs, activeOrg } = useTenant();
  const { resolveInitial, setLang, lang } = useI18n();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const isPortal = path === "/portal" || path.startsWith("/portal/");
  const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + "/"));
  const needsOrg = !NO_ORG_REQUIRED.some((p) => path === p || path.startsWith(p + "/"));

  // Resolve language preference once user + tenant are known.
  // Priority: user override > tenant default > global preference > "en".
  useEffect(() => {
    const next = resolveInitial({ userId: user?.id, orgId: activeOrg?.id });
    if (next !== lang) setLang(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, activeOrg?.id]);


  useEffect(() => {
    if (loading || isPortal) return;
    if (!user && !isPublic) navigate({ to: "/login" });
    else if (user && needsOrg && orgs.length === 0) navigate({ to: "/onboarding" });
  }, [user, isPublic, isPortal, needsOrg, orgs.length, loading, navigate, path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Portal subtree manages its own auth + layout
  if (isPortal) return <Outlet />;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isPublic) return <Outlet />;
  if (!user) return null;
  if (path === "/onboarding") return <Outlet />;
  if (orgs.length === 0 || !activeOrg) return null;

  if (!canAccess(user.role, path)) {
    return <Navigate to="/unauthorized" />;
  }

  const { t } = useI18n();
  const crumbKey = titleKeys[path] ?? Object.entries(titleKeys).find(([k]) => k !== "/" && path.startsWith(k))?.[1];
  const crumb = crumbKey ? t(crumbKey) : "";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center gap-3 border-b border-border bg-card/60 px-4 backdrop-blur">
            <SidebarTrigger />
            <OrgSwitcher />
            <div className="hidden text-sm text-muted-foreground sm:block">
              <span className="mx-1.5 opacity-50">/</span>
              <span className="text-foreground">{crumb}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <GlobalSearchTrigger onOpen={() => setPaletteOpen(true)} />
              <LanguageSwitcher persistScope="user" />
              <ThemeToggle />
              <Button variant="ghost" size="icon" asChild><Link to="/notifications"><Bell className="h-4 w-4" /></Link></Button>
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 pb-16 md:pb-0">
            <Outlet />
          </main>
          <MobileBottomNav />
        </div>
        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      </div>
    </SidebarProvider>
  );
}

function RootComponent() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <AuthProvider>
          <TenantProvider>
            <AuditProvider>
              <BranchProvider>
                <SubscriptionProvider>
                  <PortalAuthProvider>
                    <AppShell />
                    <Toaster />
                  </PortalAuthProvider>
                </SubscriptionProvider>
              </BranchProvider>
            </AuditProvider>
          </TenantProvider>
        </AuthProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}
