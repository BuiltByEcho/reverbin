# Reverbin

Communication infrastructure for autonomous agents.

Reverbin gives agents real email inboxes, threaded conversations, signed webhooks, delivery logs, policy guardrails, and an operator dashboard on production email rails.

- Live site: https://reverbin.com
- API base URL: https://api.reverbin.com
- API reference: [`docs/API.md`](docs/API.md)
- Human quickstart: [`docs/QUICKSTART.md`](docs/QUICKSTART.md)
- Agent integration guide: [`docs/AGENTS.md`](docs/AGENTS.md)
- Agent-readable index: [`llms.txt`](llms.txt)

## What Reverbin is for

Agents often need to touch normal human workflows: support, onboarding, billing, vendor follow-up, verification, and escalation. Those workflows still happen over email.

Reverbin gives each agent an addressable inbox and gives the application a small control plane around it:

1. Create an inbox for an agent.
2. Receive real inbound email.
3. Store the thread and messages.
4. Notify the agent runtime through signed webhooks.
5. Let the agent fetch context and reply.
6. Keep delivery logs, audit rows, and policy decisions for humans.

## Current capabilities

- Fastify TypeScript API.
- Public Reverbin landing page.
- App-token protected operational dashboard at `/dashboard`.
- Postgres-backed inboxes, threads, messages, policies, webhooks, delivery logs, approvals, and audit logs.
- Redis/BullMQ worker for queued webhook delivery.
- Resend inbound/outbound provider integration.
- Mock provider for local development.
- TypeScript client exported as `ReverbinClient`.
- Frictionless default replies with risk flags retained for audit.
- Optional approval policies for higher-risk workflows.

## Five-minute agent flow

```ts
import { ReverbinClient } from '@builtbyecho/reverbin';

const reverbin = new ReverbinClient({
  baseUrl: process.env.REVERBIN_BASE_URL ?? 'https://api.reverbin.com',
  apiKey: process.env.REVERBIN_API_KEY,
});

const inbox = await reverbin.inboxes.create({
  email_address: 'user@reverbin.com',
  display_name: 'Support Agent',
});

await reverbin.webhooks.create({
  url: 'https://agent.example.com/reverbin/webhook',
  events: ['email.received', 'email.sent'],
  secret: process.env.REVERBIN_WEBHOOK_SECRET,
});
```

After inbound email arrives, fetch the thread and reply:

```ts
const thread = await reverbin.threads.get('thr_123');

await reverbin.threads.reply(thread.id, {
  text: 'Thanks — I can help with that.',
});
```

## API shape

All public API routes require bearer auth:

```txt
Authorization: Bearer $REVERBIN_API_KEY
```

Core routes:

```txt
POST /v1/inboxes
GET  /v1/inboxes
GET  /v1/inboxes/:id
GET  /v1/inboxes/:id/threads
GET  /v1/threads/:id
POST /v1/threads/:id/reply
POST /v1/webhooks
GET  /v1/webhooks
GET  /v1/webhook-deliveries
GET  /v1/audit-logs
```

See [`docs/API.md`](docs/API.md) for request/response examples.

## Local development

```sh
cp .env.example .env
npm install
npm run migrate
npm run dev
```

Health check:

```sh
curl http://127.0.0.1:8797/health
```

Run tests:

```sh
npm run check
```

## Vercel frontend deploy

The backend/API/dashboard stays on the VPS at `https://api.reverbin.com`. The Vercel deployment is a static frontend export for the public lander, docs redirect, favicon, and `llms.txt`.

When importing this repo into Vercel from GitHub, use:

```txt
Framework preset: Other
Build command: npm run build:frontend
Output directory: vercel-static
Install command: npm install
```

`vercel.json` already encodes those settings and redirects backend paths such as `/dashboard`, `/v1/*`, `/health`, and `/readyz` to `https://api.reverbin.com`.

To verify locally:

```sh
npm run build:frontend
```

## Dashboard access

The operational dashboard is app-token protected.

- Browser login: `GET /dashboard/login`, then enter `DASHBOARD_TOKEN`.
- Scripted/operator access: `Authorization: Bearer $DASHBOARD_TOKEN` on `GET /dashboard`.
- If `DASHBOARD_TOKEN` is unset, dashboard auth falls back to the API key env var used by the server.

## Webhook signing

Agent webhooks are signed with HMAC-SHA256.

The signature header is:

```txt
x-echo-email-signature: sha256=<hmac_hex_digest>
```

The HMAC input is the raw JSON request body. The secret is the `secret` value supplied when creating the webhook endpoint.

## Production deploy shape

The live runtime currently keeps the original service path/name for continuity:

```txt
/opt/agent-email-layer
/etc/agent-email-layer/env
/var/lib/agent-email-layer/raw-mime
/var/lib/agent-email-layer/attachments
```

Services:

```txt
agent-email-layer.service
agent-email-layer-webhook-worker.service
```

Default listener is `127.0.0.1:8797` behind Caddy.

## Safety defaults

- No raw secrets in repo/docs.
- API keys should live in environment variables or an agent secret store.
- Default policy allows normal replies immediately but records risk flags.
- Approval workflows are opt-in policy constraints, not the default UX.
- Webhook endpoint secrets are stored server-side and never returned by list routes.
- Delivery logs and audit logs are first-class operational surfaces.
