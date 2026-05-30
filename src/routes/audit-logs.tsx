import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAudit } from "@/lib/audit";
import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/audit-logs")({ component: AuditLogs });

function AuditLogs() {
  const { entries, clear } = useAudit();
  const [q, setQ] = useState("");
  const [module, setModule] = useState("all");
  const modules = Array.from(new Set(entries.map((e) => e.module)));
  const filtered = entries.filter((e) => {
    if (module !== "all" && e.module !== module) return false;
    if (!q) return true;
    const s = `${e.userName} ${e.action} ${e.target ?? ""} ${e.before ?? ""} ${e.after ?? ""}`.toLowerCase();
    return s.includes(q.toLowerCase());
  });
  return (
    <>
      <PageHeader title="Audit Logs" description="Tamper-evident record of every change across modules." actions={
        <Button variant="outline" onClick={clear}><Trash2 className="mr-1.5 h-4 w-4" />Clear</Button>
      } />
      <div className="p-6 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search user, target, value…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select value={module} onChange={(e) => setModule(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            <option value="all">All modules</option>
            {modules.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <Card className="overflow-hidden">
          <Table>
            <TableHeader><TableRow>
              <TableHead>When</TableHead><TableHead>User</TableHead><TableHead>Module</TableHead>
              <TableHead>Action</TableHead><TableHead>Target</TableHead><TableHead>Before</TableHead><TableHead>After</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{new Date(e.ts).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{e.userName}</TableCell>
                  <TableCell><Badge variant="secondary">{e.module}</Badge></TableCell>
                  <TableCell className="text-xs">{e.action}</TableCell>
                  <TableCell className="font-mono text-xs">{e.target ?? "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{e.before ?? "—"}</TableCell>
                  <TableCell className="text-xs">{e.after ?? "—"}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No entries match.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
}
