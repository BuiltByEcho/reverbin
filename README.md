# Agent Email Layer

VPS-hosted control plane for safe programmable inboxes for autonomous agents.

This is Option B groundwork: we own the API, Postgres schema, threading, policies, approvals, audit logs, webhook surface, and provider adapter boundary while using an external provider for actual email delivery.

## What is included now

- Fastify TypeScript API
- Postgres schema/migrations
- Redis-ready worker queue foundation
- Agent inbox CRUD
- Inbound provider webhook normalization endpoint
- Thread/message storage
- Deterministic policy engine
- First-contact/link/attachment/rate-limit checks
- Approval queue
- Mock outbound provider for safe VPS bootstrapping
- Resend outbound adapter hook for later
- Audit logs
- Basic HTML dashboard
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

## MVP demo flow

1. `POST /v1/inboxes` creates an agent inbox.
2. `POST /internal/provider/inbound` simulates/receives provider inbound JSON.
3. `GET /v1/inboxes/:id/threads` shows stored threads.
4. `POST /v1/threads/:id/reply` runs policy checks.
5. First-time recipient/link/attachment/rate-limit can create `approval.required`.
6. `POST /v1/approvals/:id/approve` sends via configured provider and writes audit/message rows.

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

- mock outbound provider first
- reply-only policy supported
- first-contact approval supported
- no raw secrets in repo/docs
- low send limits by default
- audit everything
