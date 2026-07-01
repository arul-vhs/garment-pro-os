import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/docs/")({
  component: DocsHome,
});

function DocsHome() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="text-3xl font-semibold tracking-tight">TailorERP documentation</h1>
      <p className="text-muted-foreground">
        Everything you need to run TailorERP — from your first order to multi-branch operations.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <ShortcutCard to="/docs/api" title="API reference" desc="Endpoints for orders, customers, inventory, finance." />
        <ShortcutCard to="/docs/deployment" title="Deployment" desc="Environment, build, and production checklist." />
      </div>

      <section id="quickstart" className="mt-10">
        <h2>Quickstart</h2>
        <ol>
          <li>Create your organization and add branches.</li>
          <li>Invite your team and assign roles.</li>
          <li>Add your first customer and take a measurement.</li>
          <li>Create an order, assign to production, and issue an invoice.</li>
        </ol>
      </section>

      <section id="concepts" className="mt-10">
        <h2>Concepts</h2>
        <ul>
          <li><strong>Tenant</strong> — every business's data is fully isolated.</li>
          <li><strong>Branch</strong> — physical location with its own inventory and staff.</li>
          <li><strong>Order</strong> — a customer request tied to measurements, designs, and production stages.</li>
          <li><strong>Portal</strong> — self-service space for your customers.</li>
        </ul>
      </section>

      <section id="user-guide" className="mt-10">
        <h2>User guide</h2>
        <h3>Customers & measurements</h3>
        <p>Create rich customer profiles and reuse measurement templates for each garment type.</p>
        <h3>Orders & production</h3>
        <p>Track orders through intake, cutting, stitching, finishing, trial, and delivery.</p>
        <h3>Billing</h3>
        <p>Generate GST-ready invoices, take payments, and issue credit notes.</p>
      </section>

      <section id="admin-guide" className="mt-10">
        <h2>Admin guide</h2>
        <p>Manage roles, branches, subscription, and audit logs. Configure tenant branding, language, and tax defaults.</p>
      </section>

      <section id="portal-guide" className="mt-10">
        <h2>Customer portal guide</h2>
        <p>Invite customers via SMS or email. They can view orders, download invoices, and access measurements from any device.</p>
      </section>

      <section id="faq" className="mt-10">
        <h2>FAQ</h2>
        <details className="rounded-md border border-border/60 p-4">
          <summary className="cursor-pointer font-medium">Can I import my existing customer data?</summary>
          <p className="mt-2 text-sm text-muted-foreground">Yes — during onboarding our team helps import customers, measurements, and inventory.</p>
        </details>
        <details className="mt-3 rounded-md border border-border/60 p-4">
          <summary className="cursor-pointer font-medium">Is my data isolated from other businesses?</summary>
          <p className="mt-2 text-sm text-muted-foreground">Yes. Every tenant's data is fully separated with server-enforced access control.</p>
        </details>
      </section>
    </article>
  );
}

function ShortcutCard({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link to={to}>
      <Card className="p-5 transition-colors hover:border-primary">
        <div className="font-semibold">{title}</div>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </Card>
    </Link>
  );
}
