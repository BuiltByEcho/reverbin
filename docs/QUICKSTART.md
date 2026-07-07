# Reverbin Quickstart

This guide is for humans building with Reverbin for the first time.

If you are an autonomous agent or a tool runtime, start with [`AGENTS.md`](AGENTS.md) or the root [`llms.txt`](../llms.txt) file.

## What you will build

In this quickstart you will:

1. Connect to the Reverbin API.
2. Create an inbox for an agent.
3. Register a signed webhook endpoint.
4. Read threads.
5. Reply to a thread.
6. Inspect delivery and audit logs.

## Prerequisites

You need:

- Node.js 18+.
- A Reverbin API key.
- A reachable HTTPS endpoint if you want to receive webhooks.
- An inbox domain that is already routed through the provider, for example `agents.reverbin.com`.

Use environment variables for secrets:

```sh
export REVERBIN_BASE_URL="https://api.reverbin.com"
export REVERBIN_API_KEY="..."
export REVERBIN_WEBHOOK_SECRET="generate-a-long-random-secret"
```

Do not hardcode API keys or webhook secrets in source code.

## Install

```sh
npm install @builtbyecho/reverbin
```

For local repository development:

```sh
git clone https://github.com/BuiltByEcho/reverbin.git
cd reverbin
cp .env.example .env
npm install
npm run migrate
npm run dev
```

## 1. Create a client

```ts
import { ReverbinClient } from '@builtbyecho/reverbin';

const reverbin = new ReverbinClient({
  baseUrl: process.env.REVERBIN_BASE_URL ?? 'https://api.reverbin.com',
  apiKey: process.env.REVERBIN_API_KEY,
});
```

## 2. Create an inbox

```ts
const inbox = await reverbin.inboxes.create({
  email_address: 'support-agent@agents.reverbin.com',
  display_name: 'Support Agent',
});

console.log(inbox.id, inbox.email_address);
```

The default inbox policy is intentionally low-friction for normal agent replies:

- new-recipient approvals are off by default;
- external-domain approvals are off by default;
- links are allowed by default;
- risk flags are still recorded for audit.

Use explicit policy settings when you need stricter behavior.

## 3. Register a webhook endpoint

```ts
await reverbin.webhooks.create({
  url: 'https://agent.example.com/reverbin/webhook',
  events: ['email.received', 'email.sent', 'approval.required'],
  secret: process.env.REVERBIN_WEBHOOK_SECRET,
});
```

Reverbin sends JSON `POST` requests to the endpoint. Verify each request before the agent acts on it.

Expected signing header:

```txt
x-echo-email-signature: sha256=<hmac_hex_digest>
```

HMAC input:

```txt
raw JSON request body
```

HMAC key:

```txt
the endpoint secret you provided to POST /v1/webhooks
```

## 4. Read threads

```ts
const threads = await reverbin.inboxes.threads(inbox.id);

for (const thread of threads.data) {
  console.log(thread.id, thread.subject);
}
```

Fetch a full thread with messages:

```ts
const thread = await reverbin.threads.get('thr_123');
console.log(thread.messages);
```

## 5. Reply to a thread

```ts
const result = await reverbin.threads.reply('thr_123', {
  text: 'Thanks — I can help with that.',
});

console.log(result.message_id ?? result.approval_id);
```

If policy allows the send, the response includes a `message_id`.

If policy requires approval, the response is `202` and includes:

```json
{
  "approval_id": "apr_...",
  "status": "pending"
}
```

## 6. Inspect operations

Delivery logs:

```ts
const deliveries = await reverbin.webhooks.deliveries();
console.log(deliveries.data[0]);
```

Audit logs:

```ts
const audit = await reverbin.auditLogs.list();
console.log(audit.data[0]);
```

## Operational dashboard

Browser dashboard:

```txt
https://reverbin.com/dashboard/login
```

The dashboard requires `DASHBOARD_TOKEN`. It shows inboxes, recent messages, webhook deliveries, and audit logs.

## Local health checks

```sh
curl http://127.0.0.1:8797/health
curl http://127.0.0.1:8797/readyz
```

Production health checks:

```sh
curl https://api.reverbin.com/health
curl https://api.reverbin.com/readyz
```

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `401` from `/v1/*` | Missing or wrong bearer token. |
| `404 target inbox not found` on inbound provider webhook | The inbound recipient does not match a created Reverbin inbox. |
| Webhook endpoint receives nothing | Confirm endpoint is active, event type is subscribed, and worker mode is running if queued. |
| Reply returns `202 pending` | The inbox policy requires approval for that send. |
| Reply returns `403 policy blocked send` | Policy blocked recipient/domain/content/rate. |
| Inbound mail never appears | Confirm domain MX/Resend receiving status and provider webhook configuration. |

## Next reads

- [`API.md`](API.md) for endpoint examples.
- [`AGENTS.md`](AGENTS.md) for agent-runtime behavior.
- [`../llms.txt`](../llms.txt) for compact machine-readable context.
