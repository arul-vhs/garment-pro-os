import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { EVENTS, type Template, type DeliveryLog, loadTemplates, saveTemplates, loadLogs, dispatch } from "@/lib/notifications-service";
import { MessageCircle, Mail, Smartphone, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/communications")({ component: Communications });

const channelIcon = { whatsapp: MessageCircle, email: Mail, sms: Smartphone } as const;

function Communications() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [logs, setLogs] = useState<DeliveryLog[]>([]);
  const [editing, setEditing] = useState<Template | null>(null);

  useEffect(() => { setTemplates(loadTemplates()); setLogs(loadLogs()); }, []);

  const persist = (next: Template[]) => { setTemplates(next); saveTemplates(next); };
  const toggle = (id: string) => persist(templates.map((t) => t.id === id ? { ...t, enabled: !t.enabled } : t));
  const save = () => {
    if (!editing) return;
    persist(templates.map((t) => t.id === editing.id ? editing : t));
    toast.success("Template saved");
    setEditing(null);
  };

  const test = async (t: Template) => {
    await dispatch(t.event, { customer: "Demo User", order: "ORD-TEST", amount: 1200, date: "2026-06-01" }, t.channel === "email" ? "demo@example.com" : "+91 90000 00000");
    setLogs(loadLogs());
    toast.success(`Test ${t.channel} dispatched`);
  };

  return (
    <>
      <PageHeader title="Communications" description="WhatsApp, email and SMS automation. Reusable provider layer, no hardcoded APIs." />
      <div className="p-6">
        <Tabs defaultValue="rules">
          <TabsList>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="editor">Template Editor</TabsTrigger>
            <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="mt-4 space-y-3">
            {EVENTS.map((ev) => {
              const matching = templates.filter((t) => t.event === ev.key);
              return (
                <Card key={ev.key}>
                  <CardHeader><CardTitle className="text-sm">{ev.label}</CardTitle><p className="text-xs text-muted-foreground">{ev.description}</p></CardHeader>
                  <CardContent className="space-y-2">
                    {matching.map((t) => {
                      const Icon = channelIcon[t.channel];
                      return (
                        <div key={t.id} className="flex flex-wrap items-center gap-3 rounded-md border border-border p-3">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium uppercase tracking-wide">{t.channel}</span>
                          <span className="truncate text-sm text-muted-foreground flex-1 min-w-40">{t.body}</span>
                          <Switch checked={t.enabled} onCheckedChange={() => toggle(t.id)} />
                          <Button variant="outline" size="sm" onClick={() => setEditing(t)}>Edit</Button>
                          <Button variant="ghost" size="sm" onClick={() => test(t)}><Send className="mr-1 h-3.5 w-3.5" />Test</Button>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="editor" className="mt-4">
            <Card>
              <CardContent className="space-y-4 p-6">
                {!editing && <p className="text-sm text-muted-foreground">Select a template from the Rules tab to edit. Variables: <code className="text-xs">{`{{customer}} {{order}} {{amount}} {{date}}`}</code></p>}
                {editing && (
                  <>
                    <div className="flex items-center gap-3"><Badge>{editing.event}</Badge><Badge variant="secondary">{editing.channel}</Badge></div>
                    {editing.channel === "email" && (
                      <div className="grid gap-1.5"><Label>Subject</Label><Input value={editing.subject ?? ""} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} /></div>
                    )}
                    <div className="grid gap-1.5"><Label>Body</Label><Textarea rows={6} value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} /></div>
                    <div className="flex gap-2"><Button onClick={save}>Save</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="mt-4">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Event</TableHead><TableHead>Channel</TableHead><TableHead>To</TableHead><TableHead>Status</TableHead><TableHead>Preview</TableHead></TableRow></TableHeader>
                <TableBody>
                  {logs.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{new Date(l.ts).toLocaleString()}</TableCell>
                      <TableCell className="text-xs">{l.event}</TableCell>
                      <TableCell className="text-xs uppercase">{l.channel}</TableCell>
                      <TableCell className="font-mono text-xs">{l.to}</TableCell>
                      <TableCell><Badge variant={l.status === "sent" ? "default" : l.status === "failed" ? "destructive" : "secondary"}>{l.status}</Badge></TableCell>
                      <TableCell className="max-w-md truncate text-xs text-muted-foreground">{l.preview}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
