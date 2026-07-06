# Agent Email Layer

VPS-hosted control plane for seamless programmable inboxes for autonomous agents.

This is Option B groundwork: we own the API, Postgres schema, threading, friction-light policies, audit logs, webhook surface, and provider adapter boundary while using an external provider for actual email delivery.

## What is included now

- Fastify TypeScript API
- Postgres schema/migrations
- Redis-ready worker queue foundation
- Agent inbox CRUD
- Inbound provider webhook normalization endpoint
- Thread/message storage
- Deterministic policy engine
- Frictionless default sends/replies with risk flags retained for audit
- Optional approval queue for explicitly configured high-risk policies
- Agent webhook subscriptions and delivery logs
- Mock outbound provider for safe VPS bootstrapping
- Resend inbound/outbound adapter hooks
- Audit logs
- Basic operational HTML dashboard
- systemd-ready deploy files

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

Authenticated API calls require `Authorization: Bearer $ECHO_EMAIL_API_KEY` unless `ECHO_EMAIL_API_KEY` is unset.

The operational dashboard is app-token protected:

- Browser login: `GET /dashboard/login`, then enter `DASHBOARD_TOKEN`.
- Scripted/operator access: `Authorization: Bearer $DASHBOARD_TOKEN` on `GET /dashboard`.
- If `DASHBOARD_TOKEN` is unset, dashboard auth falls back to `ECHO_EMAIL_API_KEY`.

## MVP demo flow

1. `POST /v1/inboxes` creates an agent inbox with frictionless default policy.
2. `POST /internal/provider/inbound` or Resend inbound webhook receives provider JSON.
3. Reverbin stores the thread/message and emits `email.received` to subscribed webhooks.
4. `GET /v1/inboxes/:id/threads` shows stored threads.
5. `POST /v1/threads/:id/reply` sends immediately unless the inbox policy explicitly blocks or requires approval.
6. Successful sends emit `email.sent` to subscribed webhooks and write audit/message rows.

## API docs and SDK

- API reference: [`docs/API.md`](docs/API.md)
- TypeScript client: `ReverbinClient` exported from this package after `npm run build`
- Agent example: [`examples/hermes-agent.ts`](examples/hermes-agent.ts)

```ts
import { ReverbinClient } from '@builtbyecho/agent-email-layer';

const reverbin = new ReverbinClient({ apiKey: process.env.REVERBIN_API_KEY });
const inbox = await reverbin.inboxes.create({ email_address: 'agent@agents.reverbin.com' });
```

## VPS deploy shape

Runtime paths:

```txt
/opt/agent-email-layer
/etc/agent-email-layer/env
/var/lib/agent-email-layer/raw-mime
/var/lib/agent-email-layer/attachments
```

Service:

```txt
agent-email-layer.service
```

Default listener is `127.0.0.1:8797` for Caddy reverse proxy.

## Safety defaults

- Resend provider by default after DNS/domain verification
- reply-only policy supported as an opt-in constraint
- first-contact approvals supported only when explicitly enabled
- no raw secrets in repo/docs
- low send limits by default
- audit everything
