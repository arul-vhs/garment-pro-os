import { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Scissors, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const NAV = [
  { to: "/landing", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/docs", label: "Docs" },
  { to: "/help", label: "Help" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function MarketingLayout({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link to="/landing" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Scissors className="h-4 w-4" />
            </span>
            <span className="tracking-tight">TailorERP</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  path === n.to || path.startsWith(n.to + "/")
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/book-demo">Book demo</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {open && (
          <div className="border-t border-border/60 md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col p-2">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Sign in
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60 bg-card/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Scissors className="h-3.5 w-3.5" />
              </span>
              TailorERP
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Modern ERP for tailoring businesses, boutiques, and garment studios.
            </p>
          </div>
          <FooterCol
            title="Product"
            links={[
              { to: "/features", label: "Features" },
              { to: "/pricing", label: "Pricing" },
              { to: "/book-demo", label: "Book demo" },
              { to: "/status", label: "System status" },
            ]}
          />
          <FooterCol
            title="Resources"
            links={[
              { to: "/docs", label: "Documentation" },
              { to: "/docs/api", label: "API reference" },
              { to: "/docs/deployment", label: "Deployment" },
              { to: "/help", label: "Help center" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
              { to: "/login", label: "Sign in" },
              { to: "/portal/login", label: "Customer portal" },
            ]}
          />
        </div>
        <div className="border-t border-border/60">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <span>© {new Date().getFullYear()} TailorERP. All rights reserved.</span>
            <span>Made for atelier teams across South India.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
