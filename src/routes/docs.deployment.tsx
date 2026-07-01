import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/deployment")({
  component: DeploymentDocs,
  head: () => ({ meta: [{ title: "Deployment — TailorERP docs" }] }),
});

function DeploymentDocs() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="text-3xl font-semibold tracking-tight">Deployment</h1>
      <p className="text-muted-foreground">Ship TailorERP to production with confidence.</p>

      <h2>Environment variables</h2>
      <pre><code>{`# Core
VITE_APP_NAME=TailorERP
VITE_API_URL=https://api.your-domain.com

# Auth
AUTH_JWT_SECRET=change-me
AUTH_SESSION_TTL=8h

# Database
DATABASE_URL=postgres://user:pass@host:5432/tailorerp

# Notifications
WHATSAPP_API_KEY=...
SMS_PROVIDER_KEY=...
SMTP_URL=smtps://user:pass@smtp:465
`}</code></pre>

      <h2>Database setup</h2>
      <ol>
        <li>Provision PostgreSQL 14+.</li>
        <li>Create database <code>tailorerp</code>.</li>
        <li>Run migrations: <code>pnpm db:migrate</code>.</li>
        <li>Seed defaults: <code>pnpm db:seed</code>.</li>
      </ol>

      <h2>Build commands</h2>
      <pre><code>{`pnpm install
pnpm build
pnpm preview # verify locally
`}</code></pre>

      <h2>Production checklist</h2>
      <ul>
        <li>HTTPS enforced on all domains</li>
        <li>Environment variables configured</li>
        <li>Database backups scheduled</li>
        <li>Error tracking connected</li>
        <li>Uptime monitoring enabled</li>
        <li>Custom domain verified</li>
        <li>Admin account created and MFA enabled</li>
        <li>Tenant branding and default language set</li>
      </ul>
    </article>
  );
}
