import { useTenant, PLANS } from "@/lib/tenant";
import { useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Building2, Check, ChevronsUpDown, Plus, Settings2 } from "lucide-react";

export function OrgSwitcher() {
  const { orgs, activeOrg, setActive } = useTenant();
  const navigate = useNavigate();
  if (!activeOrg) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 px-2 text-xs font-medium">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary"><Building2 className="h-3 w-3" /></div>
          <span className="max-w-[140px] truncate">{activeOrg.name}</span>
          <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Organizations</DropdownMenuLabel>
        {orgs.map((o) => (
          <DropdownMenuItem key={o.id} onClick={() => setActive(o.id)} className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm">{o.name}</p>
              <p className="truncate text-xs text-muted-foreground">{PLANS[o.plan].name}</p>
            </div>
            {o.id === activeOrg.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/onboarding" })}><Plus className="mr-2 h-4 w-4" />New organization</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/organization" })}><Settings2 className="mr-2 h-4 w-4" />Organization settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
