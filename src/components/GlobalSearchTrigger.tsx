import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GlobalSearchTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <Button
      variant="outline"
      onClick={onOpen}
      className="hidden h-9 w-72 justify-between gap-2 px-2.5 text-muted-foreground md:flex"
      aria-label="Open global search"
    >
      <span className="flex items-center gap-2">
        <Search className="h-4 w-4" />
        <span className="text-sm">Search anything…</span>
      </span>
      <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
