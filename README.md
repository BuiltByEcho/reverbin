# Reverbin

Communication infrastructure for autonomous agents: real inboxes, signed webhooks, threaded conversations, delivery logs, and policy guardrails on production email rails.

Live site: https://reverbin.com
API base URL: https://api.reverbin.com

## What is included now

- Fastify TypeScript API
- Public Reverbin landing page and app-token protected operational dashboard
- Postgres schema/migrations
- Redis/BullMQ webhook worker
- Agent inbox CRUD
- Inbound provider webhook normalization endpoint
- Thread/message storage
- Deterministic policy engine
- Frictionless default sends/replies with risk flags retained for audit
- Optional approval queue for explicitly configured high-risk policies
- Agent webhook subscriptions and delivery logs
- Mock outbound provider for safe local bootstrapping
- Resend inbound/outbound adapter hooks
- Audit logs
- systemd-ready deploy files
- Brand direction and SVG drafts in [`brand/`](brand/)

## Local setup

```sh
cp .env.example .env
npm install
npm run migrate
npm run dev
```

Health:

```sh
curl http://127.0.0.1:8797/health
```

Authenticated API calls require:

```txt
Authorization: Bearer $ECHO_EMAIL_API_KEY
```

The operational dashboard is app-token protected:

- Browser login: `GET /dashboard/login`, then enter `DASHBOARD_TOKEN`.
- Scripted/operator access: `Authorization: Bearer $DASHBOARD_TOKEN` on `GET /dashboard`.
- If `DASHBOARD_TOKEN` is unset, dashboard auth falls back to `ECHO_EMAIL_API_KEY`.

## Five-minute agent flow

1. `POST /v1/inboxes` creates an agent inbox with a frictionless default policy.
2. `POST /internal/provider/inbound` or the Resend inbound webhook receives provider JSON.
3. Reverbin stores the thread/message and emits `email.received` to subscribed webhooks.
4. `GET /v1/inboxes/:id/threads` shows stored threads.
5. `POST /v1/threads/:id/reply` sends immediately unless the inbox policy explicitly blocks or requires approval.
6. Successful sends emit `email.sent` to subscribed webhooks and write audit/message rows.

## API docs and SDK

- API reference: [`docs/API.md`](docs/API.md)
- TypeScript client: `ReverbinClient` exported from this package after `npm run build`
- Agent example: [`examples/hermes-agent.ts`](examples/hermes-agent.ts)

```ts
import { ReverbinClient } from '@builtbyecho/reverbin';

const reverbin = new ReverbinClient({
  baseUrl: process.env.REVERBIN_BASE_URL,
  apiKey: process.env.REVERBIN_API_KEY,
});

const inbox = await reverbin.inboxes.create({
  email_address: 'agent@agents.reverbin.com',
});
```

## VPS deploy shape

Current live runtime paths retain the original service name for continuity:

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

Default listener is `127.0.0.1:8797` for Caddy reverse proxy.

## Safety defaults

- Resend provider by default after DNS/domain verification
- reply-only policy supported as an opt-in constraint
- first-contact approvals supported only when explicitly enabled
- no raw secrets in repo/docs
- low send limits by default
- audit everything
