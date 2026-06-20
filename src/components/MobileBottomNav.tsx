import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ShoppingBag, Factory, Bell, Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useI18n } from "@/lib/i18n";

const items = [
  { url: "/",              icon: LayoutDashboard, key: "nav.home" },
  { url: "/orders",        icon: ShoppingBag,     key: "nav.orders" },
  { url: "/production",    icon: Factory,         key: "nav.work" },
  { url: "/notifications", icon: Bell,            key: "nav.alerts" },
];

export function MobileBottomNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { toggleSidebar } = useSidebar();
  const { t } = useI18n();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-card/95 px-1 py-1.5 backdrop-blur md:hidden">
      {items.map((i) => {
        const active = i.url === "/" ? path === "/" : path.startsWith(i.url);
        return (
          <Link key={i.url} to={i.url} className={`flex flex-1 flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[10px] font-medium transition ${active ? "text-primary" : "text-muted-foreground"}`}>
            <i.icon className="h-5 w-5" />
            {t(i.key)}
          </Link>
        );
      })}
      <button onClick={toggleSidebar} className="flex flex-1 flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
        <Menu className="h-5 w-5" />
        {t("nav.menu")}
      </button>
    </nav>
  );
}
