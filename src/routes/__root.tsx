import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Moon, Search, Sun } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n";

import appCss from "../styles.css?url";

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

const titles: Record<string, string> = {
  "/": "Dashboard", "/customers": "Customers", "/measurements": "Measurements",
  "/orders": "Orders", "/designs": "Designs", "/inventory": "Inventory",
  "/production": "Production", "/billing": "Billing", "/employees": "Employees",
  "/reports": "Reports", "/notifications": "Notifications", "/settings": "Settings",
};

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return (
    <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} aria-label="Toggle theme">
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

function LangToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <Button variant="outline" size="sm" onClick={() => setLang(lang === "en" ? "ta" : "en")} aria-label="Toggle language" className="h-8 px-2 text-xs font-medium">
      {t("lang.toggle")}
    </Button>
  );
}

function RootComponent() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const crumb = titles[path] ?? Object.entries(titles).find(([k]) => k !== "/" && path.startsWith(k))?.[1] ?? "";

  return (
    <I18nProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-14 items-center gap-3 border-b border-border bg-card/60 px-4 backdrop-blur">
              <SidebarTrigger />
              <div className="hidden text-sm text-muted-foreground sm:block">
                TailorERP <span className="mx-1.5 opacity-50">/</span>
                <span className="text-foreground">{crumb}</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="relative hidden md:block">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search orders, customers…" className="h-9 w-72 pl-8" />
                </div>
                <LangToggle />
                <ThemeToggle />
                <Button variant="ghost" size="icon" asChild><Link to="/notifications"><Bell className="h-4 w-4" /></Link></Button>
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-xs text-primary-foreground">AD</AvatarFallback></Avatar>
              </div>
            </header>
            <main className="flex-1">
              <Outlet />
            </main>
          </div>
          <Toaster />
        </div>
      </SidebarProvider>
    </I18nProvider>
  );
}
