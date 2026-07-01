import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/api")({
  component: ApiDocs,
  head: () => ({ meta: [{ title: "API reference — TailorERP docs" }] }),
});

type Endpoint = { method: "GET" | "POST" | "PATCH" | "DELETE"; path: string; desc: string; example?: string };
type Group = { title: string; base: string; endpoints: Endpoint[] };

const GROUPS: Group[] = [
  {
    title: "Auth",
    base: "/api/auth",
    endpoints: [
      { method: "POST", path: "/login", desc: "Exchange credentials for a session token.", example: `{ "email": "you@studio.com", "password": "..." }` },
      { method: "POST", path: "/logout", desc: "Invalidate the current session." },
      { method: "POST", path: "/forgot-password", desc: "Request a password reset link." },
    ],
  },
  {
    title: "Customers",
    base: "/api/customers",
    endpoints: [
      { method: "GET", path: "/", desc: "List customers (paginated)." },
      { method: "POST", path: "/", desc: "Create a customer.", example: `{ "name": "Priya", "phone": "+919...", "email": "..." }` },
      { method: "GET", path: "/:id", desc: "Retrieve a single customer." },
      { method: "PATCH", path: "/:id", desc: "Update customer fields." },
    ],
  },
  {
    title: "Orders",
    base: "/api/orders",
    endpoints: [
      { method: "GET", path: "/", desc: "List orders with filters." },
      { method: "POST", path: "/", desc: "Create an order.", example: `{ "customerId": "cus_1", "items": [{ "type": "kurta" }] }` },
      { method: "PATCH", path: "/:id/stage", desc: "Advance production stage." },
    ],
  },
  {
    title: "Inventory",
    base: "/api/inventory",
    endpoints: [
      { method: "GET", path: "/items", desc: "List fabric & material items." },
      { method: "POST", path: "/items", desc: "Add an inventory item." },
      { method: "POST", path: "/transfers", desc: "Transfer stock between branches." },
    ],
  },
  {
    title: "Finance",
    base: "/api/finance",
    endpoints: [
      { method: "GET", path: "/invoices", desc: "List invoices." },
      { method: "POST", path: "/invoices", desc: "Create an invoice." },
      { method: "POST", path: "/payments", desc: "Record a payment." },
    ],
  },
];

const METHOD_STYLE: Record<Endpoint["method"], string> = {
  GET: "bg-emerald-500/10 text-emerald-600",
  POST: "bg-blue-500/10 text-blue-600",
  PATCH: "bg-amber-500/10 text-amber-600",
  DELETE: "bg-destructive/10 text-destructive",
};

function ApiDocs() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="text-3xl font-semibold tracking-tight">API reference</h1>
      <p className="text-muted-foreground">
        REST over HTTPS. Authenticate with a bearer token issued by <code>/api/auth/login</code>.
      </p>

      <div className="not-prose mt-6 rounded-md border border-border/60 bg-muted/30 p-4 font-mono text-xs">
        <div className="text-muted-foreground">Base URL</div>
        <div className="mt-1">https://api.your-domain.com</div>
        <div className="mt-3 text-muted-foreground">Authentication</div>
        <div className="mt-1">Authorization: Bearer &lt;token&gt;</div>
      </div>

      {GROUPS.map((g) => (
        <section key={g.title} className="mt-10">
          <h2>{g.title}</h2>
          <p className="text-sm text-muted-foreground">Base: <code>{g.base}</code></p>
          <div className="not-prose mt-4 space-y-3">
            {g.endpoints.map((e) => (
              <div key={e.method + e.path} className="rounded-md border border-border/60 bg-card/50 p-4">
                <div className="flex items-center gap-2 font-mono text-sm">
                  <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${METHOD_STYLE[e.method]}`}>{e.method}</span>
                  <span>{g.base}{e.path}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{e.desc}</p>
                {e.example && (
                  <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs"><code>{e.example}</code></pre>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
