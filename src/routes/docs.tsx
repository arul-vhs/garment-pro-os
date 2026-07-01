import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const Route = createFileRoute("/docs")({
  component: DocsLayout,
  head: () => ({
    meta: [
      { title: "Documentation — TailorERP" },
      { name: "description", content: "Guides, API reference, and deployment for TailorERP." },
    ],
  }),
});

const NAV: { group: string; items: { to: string; label: string }[] }[] = [
  {
    group: "Getting started",
    items: [
      { to: "/docs", label: "Overview" },
      { to: "/docs#quickstart", label: "Quickstart" },
      { to: "/docs#concepts", label: "Concepts" },
    ],
  },
  {
    group: "Guides",
    items: [
      { to: "/docs#user-guide", label: "User guide" },
      { to: "/docs#admin-guide", label: "Admin guide" },
      { to: "/docs#portal-guide", label: "Customer portal guide" },
      { to: "/docs#faq", label: "FAQ" },
    ],
  },
  {
    group: "Reference",
    items: [
      { to: "/docs/api", label: "API reference" },
      { to: "/docs/deployment", label: "Deployment" },
    ],
  },
];

function DocsLayout() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return NAV;
    const term = q.toLowerCase();
    return NAV.map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(term)) }))
      .filter((g) => g.items.length);
  }, [q]);

  return (
    <MarketingLayout>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search docs…"
              className="pl-8"
            />
          </div>
          <nav className="space-y-6 text-sm">
            {filtered.map((g) => (
              <div key={g.group}>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {g.group}
                </div>
                <ul className="space-y-1">
                  {g.items.map((it) => {
                    const active = path === it.to.split("#")[0];
                    return (
                      <li key={it.to}>
                        <Link
                          to={it.to.split("#")[0]}
                          hash={it.to.split("#")[1]}
                          className={`block rounded-md px-2 py-1.5 ${
                            active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {it.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </MarketingLayout>
  );
}
