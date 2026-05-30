// Reusable notification service layer. Backend-agnostic — swap providers
// (WhatsApp, Email, SMS) by registering new channels here.

export type Channel = "whatsapp" | "email" | "sms";
export type EventKey =
  | "order.created"
  | "order.trial_ready"
  | "order.delivery_ready"
  | "payment.reminder"
  | "balance.low";

export type Template = {
  id: string;
  event: EventKey;
  channel: Channel;
  subject?: string;
  body: string;     // supports {{customer}}, {{order}}, {{amount}}, {{date}}
  enabled: boolean;
};

export type DeliveryLog = {
  id: string;
  ts: number;
  event: EventKey;
  channel: Channel;
  to: string;
  status: "sent" | "queued" | "failed";
  preview: string;
};

const TPL_KEY = "tailorerp.notif.templates";
const LOG_KEY = "tailorerp.notif.logs";

export const EVENTS: { key: EventKey; label: string; description: string }[] = [
  { key: "order.created",         label: "Order Created",      description: "Sent when a new order is placed." },
  { key: "order.trial_ready",     label: "Trial Ready",        description: "Customer is invited for a trial fitting." },
  { key: "order.delivery_ready",  label: "Delivery Ready",     description: "Garment is ready for pickup or delivery." },
  { key: "payment.reminder",      label: "Payment Reminder",   description: "Outstanding invoice reminder." },
  { key: "balance.low",           label: "Low Balance Alert",  description: "Inventory item below threshold." },
];

export const DEFAULT_TEMPLATES: Template[] = [
  { id: "t1", event: "order.created",        channel: "whatsapp", body: "Hi {{customer}}, your order {{order}} is confirmed. Delivery by {{date}}. — TailorERP", enabled: true },
  { id: "t2", event: "order.trial_ready",    channel: "whatsapp", body: "Hi {{customer}}, your trial for {{order}} is ready. Please visit us at your convenience.", enabled: true },
  { id: "t3", event: "order.delivery_ready", channel: "whatsapp", body: "Hi {{customer}}, your order {{order}} is ready for pickup. Outstanding: ₹{{amount}}.", enabled: true },
  { id: "t4", event: "payment.reminder",     channel: "email",    subject: "Payment reminder — {{order}}", body: "Dear {{customer}},\n\nThis is a gentle reminder for ₹{{amount}} due on {{order}}.", enabled: true },
  { id: "t5", event: "balance.low",          channel: "email",    subject: "Low stock alert", body: "Inventory item is below threshold. Please reorder.", enabled: false },
  { id: "t6", event: "order.created",        channel: "sms",      body: "Order {{order}} confirmed. Track at /portal.", enabled: false },
];

export function loadTemplates(): Template[] {
  if (typeof window === "undefined") return DEFAULT_TEMPLATES;
  try {
    const raw = localStorage.getItem(TPL_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_TEMPLATES;
  } catch { return DEFAULT_TEMPLATES; }
}
export function saveTemplates(t: Template[]) {
  if (typeof window !== "undefined") localStorage.setItem(TPL_KEY, JSON.stringify(t));
}

export function loadLogs(): DeliveryLog[] {
  if (typeof window === "undefined") return seedLogs();
  try {
    const raw = localStorage.getItem(LOG_KEY);
    return raw ? JSON.parse(raw) : seedLogs();
  } catch { return seedLogs(); }
}
function seedLogs(): DeliveryLog[] {
  return [
    { id: "l1", ts: Date.now() - 1000 * 60 * 4,   event: "order.delivery_ready", channel: "whatsapp", to: "+91 90123 45678", status: "sent",   preview: "Hi Sneha, your order ORD-1049 is ready for pickup." },
    { id: "l2", ts: Date.now() - 1000 * 60 * 18,  event: "payment.reminder",     channel: "email",    to: "priya@example.com", status: "sent", preview: "Payment reminder — ORD-1043" },
    { id: "l3", ts: Date.now() - 1000 * 60 * 65,  event: "order.created",        channel: "whatsapp", to: "+91 98765 43210", status: "sent",   preview: "Hi Aarav, your order ORD-1050 is confirmed." },
    { id: "l4", ts: Date.now() - 1000 * 60 * 130, event: "order.trial_ready",    channel: "sms",      to: "+91 99988 77665", status: "failed", preview: "Trial ready for ORD-1046" },
  ];
}
export function appendLog(log: DeliveryLog) {
  const next = [log, ...loadLogs()].slice(0, 200);
  if (typeof window !== "undefined") localStorage.setItem(LOG_KEY, JSON.stringify(next));
}

// Provider abstraction — implementations are stubs for now.
type Provider = (to: string, payload: { subject?: string; body: string }) => Promise<{ ok: boolean }>;
const providers: Record<Channel, Provider> = {
  whatsapp: async () => ({ ok: true }),
  email:    async () => ({ ok: true }),
  sms:      async () => ({ ok: true }),
};

export function registerProvider(channel: Channel, fn: Provider) { providers[channel] = fn; }

export function renderTemplate(body: string, vars: Record<string, string | number>) {
  return body.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? `{{${k}}}`));
}

export async function dispatch(event: EventKey, vars: Record<string, string | number>, to: string) {
  const templates = loadTemplates().filter((t) => t.event === event && t.enabled);
  const results: DeliveryLog[] = [];
  for (const tpl of templates) {
    const body = renderTemplate(tpl.body, vars);
    const subject = tpl.subject ? renderTemplate(tpl.subject, vars) : undefined;
    const provider = providers[tpl.channel];
    let status: DeliveryLog["status"] = "queued";
    try {
      const res = await provider(to, { subject, body });
      status = res.ok ? "sent" : "failed";
    } catch { status = "failed"; }
    const log: DeliveryLog = { id: `l_${Date.now()}_${tpl.id}`, ts: Date.now(), event, channel: tpl.channel, to, status, preview: body.slice(0, 120) };
    appendLog(log);
    results.push(log);
  }
  return results;
}
