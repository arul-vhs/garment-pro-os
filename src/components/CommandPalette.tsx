import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard, Users, ShoppingBag, Receipt, UserCog, Boxes, GitBranch, BarChart3, Settings,
  CreditCard, Building2, Globe, MessageCircle, ShieldCheck, FileClock, Coins, Bell, Palette, Ruler, Factory,
  Plus, ArrowRight, Search as SearchIcon, FileText,
} from "lucide-react";
import { search, type SearchHit } from "@/lib/search-service";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

const PAGE_ITEMS = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Customers", to: "/customers", icon: Users },
  { label: "Measurements", to: "/measurements", icon: Ruler },
  { label: "Orders", to: "/orders", icon: ShoppingBag },
  { label: "Designs", to: "/designs", icon: Palette },
  { label: "Inventory", to: "/inventory", icon: Boxes },
  { label: "Production", to: "/production", icon: Factory },
  { label: "Billing", to: "/billing", icon: Receipt },
  { label: "Finance & Profit", to: "/finance", icon: Coins },
  { label: "Reports", to: "/reports", icon: BarChart3 },
  { label: "Reports Center", to: "/reports-center", icon: FileText },
  { label: "Employees", to: "/employees", icon: UserCog },
  { label: "Communications", to: "/communications", icon: MessageCircle },
  { label: "Branches", to: "/branches", icon: GitBranch },
  { label: "Roles & Permissions", to: "/roles", icon: ShieldCheck },
  { label: "Audit Logs", to: "/audit-logs", icon: FileClock },
  { label: "Subscription", to: "/subscription", icon: CreditCard },
  { label: "Organization", to: "/organization", icon: Building2 },
  { label: "Super Admin", to: "/super-admin", icon: Globe },
  { label: "Notifications", to: "/notifications", icon: Bell },
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Customer Portal", to: "/portal", icon: ArrowRight },
];

const ACTIONS = [
  { label: "Create Customer", to: "/customers", hint: "New" },
  { label: "Create Order", to: "/orders", hint: "New" },
  { label: "Create Invoice", to: "/billing", hint: "New" },
  { label: "Create Employee", to: "/employees", hint: "New" },
  { label: "Add Inventory Item", to: "/inventory", hint: "New" },
];

export function CommandPalette({ open, onOpenChange }: Props) {
  const [q, setQ] = useState("");
  const debounced = useDebouncedValue(q, 120);
  const navigate = useNavigate();

  useEffect(() => { if (!open) setQ(""); }, [open]);

  const results = useMemo(() => search(debounced, 6), [debounced]);
  const hasQuery = debounced.trim().length > 0;

  const go = (to: string) => { onOpenChange(false); navigate({ to }); };

  const renderGroup = (label: string, items: SearchHit[]) => {
    if (!items.length) return null;
    return (
      <CommandGroup heading={label}>
        {items.map((h) => (
          <CommandItem key={`${h.kind}-${h.id}`} value={`${h.kind} ${h.title} ${h.subtitle ?? ""}`} onSelect={() => go(h.to)}>
            <SearchIcon className="text-muted-foreground" />
            <div className="flex flex-1 flex-col">
              <span className="text-sm">{h.title}</span>
              {h.subtitle && <span className="text-xs text-muted-foreground">{h.subtitle}</span>}
            </div>
            <CommandShortcut>{h.kind}</CommandShortcut>
          </CommandItem>
        ))}
      </CommandGroup>
    );
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search or jump to… (Ctrl+K)" value={q} onValueChange={setQ} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {hasQuery && (
          <>
            {renderGroup("Customers", results.customer)}
            {renderGroup("Orders", results.order)}
            {renderGroup("Invoices", results.invoice)}
            {renderGroup("Employees", results.employee)}
            {renderGroup("Inventory", results.inventory)}
            {renderGroup("Pages", results.page)}
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Quick Actions">
          {ACTIONS.map((a) => (
            <CommandItem key={a.label} onSelect={() => go(a.to)}>
              <Plus />
              <span>{a.label}</span>
              <CommandShortcut>{a.hint}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        {!hasQuery && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Navigation">
              {PAGE_ITEMS.map((p) => {
                const Icon = p.icon;
                return (
                  <CommandItem key={p.to} onSelect={() => go(p.to)}>
                    <Icon />
                    <span>{p.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
