import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n, LANGUAGES, Lang, setUserLang, setTenantLang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useTenant } from "@/lib/tenant";

type Props = {
  variant?: "default" | "compact" | "ghost";
  align?: "start" | "end" | "center";
  /** When true, also persists the choice to user profile (default) and active tenant. */
  persistScope?: "session" | "user" | "user+tenant";
};

export function LanguageSwitcher({ variant = "default", align = "end", persistScope = "user" }: Props) {
  const { lang, setLang } = useI18n();
  const { user } = useAuth();
  // Tenant context is optional — Login & Portal use this component without a tenant.
  let activeOrgId: string | null = null;
  try {
    activeOrgId = useTenant().activeOrg?.id ?? null;
  } catch {
    activeOrgId = null;
  }
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  const pick = (code: Lang) => {
    setLang(code);
    if (persistScope !== "session") {
      if (user) setUserLang(user.id, code);
      if (persistScope === "user+tenant" && activeOrgId) setTenantLang(activeOrgId, code);
    }
  };

  const triggerSize = variant === "compact" ? "sm" : "sm";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === "ghost" ? "ghost" : "outline"}
          size={triggerSize}
          aria-label="Change language"
          className="h-8 gap-1.5 px-2 text-xs font-medium"
        >
          <Globe className="h-3.5 w-3.5" />
          <span aria-hidden>{current.flag}</span>
          {variant !== "compact" && <span>{current.native}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        <DropdownMenuLabel className="text-xs">Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => pick(l.code)}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden>{l.flag}</span>
              <span>{l.native}</span>
              <span className="text-xs text-muted-foreground">{l.label}</span>
            </span>
            {l.code === lang && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
