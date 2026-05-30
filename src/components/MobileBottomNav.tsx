import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ShoppingBag, Factory, Bell, Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

const items = [
  { url: "/",              icon: LayoutDashboard, label: "Home" },
  { url: "/orders",        icon: ShoppingBag,     label: "Orders" },
  { url: "/production",    icon: Factory,         label: "Work" },
  { url: "/notifications", icon: Bell,            label: "Alerts" },
];

export function MobileBottomNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { toggleSidebar } = useSidebar();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-card/95 px-1 py-1.5 backdrop-blur md:hidden">
      {items.map((i) => {
        const active = i.url === "/" ? path === "/" : path.startsWith(i.url);
        return (
          <Link key={i.url} to={i.url} className={`flex flex-1 flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[10px] font-medium transition ${active ? "text-primary" : "text-muted-foreground"}`}>
            <i.icon className="h-5 w-5" />
            {i.label}
          </Link>
        );
      })}
      <button onClick={toggleSidebar} className="flex flex-1 flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
        <Menu className="h-5 w-5" />
        Menu
      </button>
    </nav>
  );
}
