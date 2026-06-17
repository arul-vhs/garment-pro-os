import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Ruler, ShoppingBag, Palette, Boxes,
  Factory, Receipt, UserCog, BarChart3, Bell, Settings, Scissors, Building2,
  Coins, MessageCircle, ShieldCheck, GitBranch, CreditCard, Globe, FileClock, FileText,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

import { useI18n } from "@/lib/i18n";
import { useAuth, canAccess } from "@/lib/auth";

const mainItems = [
  { key: "nav.dashboard", url: "/", icon: LayoutDashboard },
  { key: "nav.customers", url: "/customers", icon: Users },
  { key: "nav.measurements", url: "/measurements", icon: Ruler },
  { key: "nav.orders", url: "/orders", icon: ShoppingBag },
  { key: "nav.designs", url: "/designs", icon: Palette },
  { key: "nav.inventory", url: "/inventory", icon: Boxes },
  { key: "nav.production", url: "/production", icon: Factory },
  { key: "nav.billing", url: "/billing", icon: Receipt },
  { key: "nav.finance", url: "/finance", icon: Coins },
];

const systemItems = [
  { key: "nav.employees", url: "/employees", icon: UserCog },
  { key: "nav.reports", url: "/reports", icon: BarChart3 },
  { key: "nav.reportsCenter", url: "/reports-center", icon: FileText },
  { key: "nav.communications", url: "/communications", icon: MessageCircle },
  { key: "nav.branches", url: "/branches", icon: GitBranch },
  { key: "nav.roles", url: "/roles", icon: ShieldCheck },
  { key: "nav.audit", url: "/audit-logs", icon: FileClock },
  { key: "nav.subscription", url: "/subscription", icon: CreditCard },
  { key: "nav.organization", url: "/organization", icon: Building2 },
  { key: "nav.superadmin", url: "/super-admin", icon: Globe },
  { key: "nav.notifications", url: "/notifications", icon: Bell },
  { key: "nav.settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { t } = useI18n();
  const { user } = useAuth();
  const role = user?.role;
  const isActive = (url: string) => (url === "/" ? path === "/" : path.startsWith(url));
  const visible = (url: string) => canAccess(role, url);

  const main = mainItems.filter((i) => visible(i.url));
  const system = systemItems.filter((i) => visible(i.url));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Scissors className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">{t("app.name")}</span>
              <span className="text-xs text-muted-foreground">{t("app.tagline")}</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {main.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("nav.workspace")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {main.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={t(item.key)}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.key)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {system.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("nav.system")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {system.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={t(item.key)}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.key)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
