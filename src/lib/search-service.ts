// Reusable cross-entity search service with debounce + fuzzy/partial matching.
import { customers, orders, invoices, employees, inventory } from "@/lib/mock-data";

export type SearchKind = "customer" | "order" | "invoice" | "employee" | "inventory" | "branch" | "page";

export type SearchHit = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle?: string;
  to: string;
  score: number;
};

const PAGES: Array<{ title: string; to: string; subtitle?: string }> = [
  { title: "Dashboard", to: "/" },
  { title: "Customers", to: "/customers" },
  { title: "Orders", to: "/orders" },
  { title: "Measurements", to: "/measurements" },
  { title: "Designs", to: "/designs" },
  { title: "Inventory", to: "/inventory" },
  { title: "Production", to: "/production" },
  { title: "Billing", to: "/billing" },
  { title: "Finance & Profit", to: "/finance" },
  { title: "Employees", to: "/employees" },
  { title: "Reports", to: "/reports" },
  { title: "Reports Center", to: "/reports-center" },
  { title: "Communications", to: "/communications" },
  { title: "Branches", to: "/branches" },
  { title: "Roles & Permissions", to: "/roles" },
  { title: "Audit Logs", to: "/audit-logs" },
  { title: "Subscription", to: "/subscription" },
  { title: "Organization", to: "/organization" },
  { title: "Super Admin", to: "/super-admin" },
  { title: "Notifications", to: "/notifications" },
  { title: "Settings", to: "/settings" },
  { title: "Customer Portal", to: "/portal" },
];

// Lightweight fuzzy: subsequence match + bonus for contiguous/prefix.
function fuzzyScore(text: string, q: string): number {
  if (!q) return 0;
  const t = text.toLowerCase();
  const query = q.toLowerCase();
  if (t === query) return 1000;
  if (t.startsWith(query)) return 600 - (t.length - query.length);
  const idx = t.indexOf(query);
  if (idx >= 0) return 400 - idx;
  // subsequence
  let i = 0, j = 0, score = 0, gap = 0;
  while (i < t.length && j < query.length) {
    if (t[i] === query[j]) { score += 8 - Math.min(gap, 6); j++; gap = 0; }
    else gap++;
    i++;
  }
  return j === query.length ? score : 0;
}

export function search(q: string, limit = 30): Record<SearchKind, SearchHit[]> {
  const buckets: Record<SearchKind, SearchHit[]> = {
    page: [], customer: [], order: [], invoice: [], employee: [], inventory: [], branch: [],
  };
  if (!q.trim()) return buckets;

  const push = (kind: SearchKind, id: string, fields: string[], title: string, subtitle: string, to: string) => {
    const score = Math.max(...fields.map((f) => fuzzyScore(f, q)));
    if (score > 0) buckets[kind].push({ id, kind, title, subtitle, to, score });
  };

  PAGES.forEach((p) => push("page", p.to, [p.title], p.title, p.subtitle ?? "Navigate", p.to));
  customers.forEach((c) =>
    push("customer", c.id, [c.name, c.mobile, c.email, c.id], c.name, `${c.id} · ${c.mobile}`, `/customers/${c.id}`),
  );
  orders.forEach((o) =>
    push("order", o.id, [o.id, o.customer, o.garment, o.status, o.tailor], `${o.id} · ${o.garment}`, `${o.customer} · ${o.status}`, `/orders/${o.id}`),
  );
  invoices.forEach((inv) =>
    push("invoice", inv.id, [inv.id, inv.customer, inv.order, inv.status], inv.id, `${inv.customer} · ₹${inv.total.toLocaleString()}`, `/billing`),
  );
  employees.forEach((e) => push("employee", e.id, [e.name, e.role, e.id, e.contact], e.name, `${e.role} · ${e.id}`, `/employees`));
  inventory.forEach((it) =>
    push("inventory", it.id, [it.name, it.category, it.supplier, it.id], it.name, `${it.category} · ${it.qty} ${it.unit}`, `/inventory`),
  );

  (Object.keys(buckets) as SearchKind[]).forEach((k) => {
    buckets[k].sort((a, b) => b.score - a.score);
    buckets[k] = buckets[k].slice(0, limit);
  });
  return buckets;
}

export function useDebouncedValue<T>(value: T, delay = 150) {
  // standalone helper hook
  const { useState, useEffect } = require("react") as typeof import("react");
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
