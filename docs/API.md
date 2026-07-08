# Reverbin API Reference

Programmable email inboxes for autonomous agents.

Reverbin gives agents a small email control plane: create an inbox, receive real mail, read the thread, reply through policy controls, and subscribe the agent runtime to signed webhook events.

## Base URL

```txt
https://api.reverbin.com
```

For local development:

```txt
http://127.0.0.1:8797
```

## Receiving domains

Public examples use the live root-domain address shape, such as `user@reverbin.com`. During beta, create inboxes on the domain included with your API key when testing real mail.

## Authentication

`POST /v1/agent-signups` is the public self-serve provisioning route. It returns a tenant-scoped API key once.

All other `/v1/*` routes require bearer auth:

```sh
-H "Authorization: Bearer $REVERBIN_API_KEY"
```

Do not put API keys in source code. Pass them through environment variables or an agent secret store. Self-serve API keys are scoped to the tenant created during signup, so one agent cannot list another builder's inboxes, threads, webhooks, deliveries, or audit logs.

Beta quota: self-serve accounts get **2 inboxes per self-serve agent**. Signup creates the first inbox. The generated API key can create one more with `POST /v1/inboxes`. Further inbox creation returns `403` with `inbox_quota_exceeded` and `max_inboxes: 2`.

## Health routes

These do not require API-key auth.

```txt
GET /health
GET /readyz
```

Example:

```sh
curl https://api.reverbin.com/health
```

## Response conventions

List routes return:

```json
{
  "data": []
}
```

Errors return JSON:

```json
{
  "error": "validation_error"
}
```

Common statuses:

| Status | Meaning |
| --- | --- |
| `200` | Success. |
| `201` | Created. |
| `202` | Accepted/pending approval. |
| `400` | Invalid input. |
| `401` | Missing or invalid auth. |
| `403` | Policy blocked action. |
| `404` | Inbox/thread/approval not found. |
| `409` | Approval already decided. |
| `500` | Server error. |

## Five-minute agent flow

1. `POST /v1/agent-signups` self-serves a tenant, root-domain inbox, API key, and optional webhook.
2. Store the returned `api_key.token` and webhook secret immediately; secrets are returned once.
3. Send mail to the returned `inbox.email_address`.
4. `GET /v1/inboxes/:id/threads` lists threads for that tenant-scoped API key.
5. `GET /v1/threads/:id` fetches the thread and messages.
6. `POST /v1/threads/:id/reply` replies.
7. Reverbin emits `email.received`, `email.sent`, or `approval.required` to registered webhooks.
8. `GET /v1/webhook-deliveries` and `GET /v1/audit-logs` support operations.

## Self-serve agent signup

### Provision an agent inbox

```txt
POST /v1/agent-signups
```

This route is public and automated. It creates a tenant, agent, root-domain inbox, tenant-scoped API key, default send policy, signup audit row, and optional webhook endpoint. The API key token and webhook secret are returned once; store them in the agent's secret store.

Request:

```sh
curl -X POST https://api.reverbin.com/v1/agent-signups \
  -H "content-type: application/json" \
  -d '{
    "requester_email": "builder@example.com",
    "agent_name": "Support Agent",
    "agent_use_case": "Handle customer support replies and escalate unusual requests.",
    "preferred_inbox_name": "support-agent",
    "webhook_url": "https://agent.example.com/reverbin/webhook"
  }'
```

Response:

```json
{
  "status": "provisioned",
  "signup_request_id": "sgr_...",
  "tenant_id": "ten_...",
  "agent": {
    "id": "agt_...",
    "name": "Support Agent"
  },
  "inbox": {
    "id": "inb_...",
    "email_address": "support-agent@reverbin.com",
    "display_name": "Support Agent",
    "status": "active"
  },
  "api_key": {
    "id": "key_...",
    "token": "rvb_live_...",
    "scopes": ["inboxes:read", "inboxes:write", "threads:read", "threads:reply", "webhooks:read"],
    "returned_once": true
  },
  "webhook": {
    "id": "wh_...",
    "url": "https://agent.example.com/reverbin/webhook",
    "events": ["email.received", "email.sent", "approval.required"],
    "secret": "rvb_whsec_...",
    "secret_returned_once": true,
    "status": "active"
  },
  "quickstart": {
    "base_url": "https://api.reverbin.com",
    "inbox_email": "support-agent@reverbin.com",
    "next_steps": [
      "Store the API key in your agent secret store.",
      "Send an email to the inbox.",
      "Use GET /v1/inboxes/:id/threads and POST /v1/threads/:id/reply."
    ]
  }
}
```

A `409` means the requested root-domain inbox name is already taken. Pick a different `preferred_inbox_name`.

## Billing and plan upgrades

Reverbin uses hosted **Stripe Checkout** for paid subscriptions. Stripe displays **Link** inside Checkout when Link is enabled for the Stripe account, so Reverbin never collects card numbers, CVCs, or expiry fields.

| Plan | Price | Inboxes | Emails/month | Webhooks |
| --- | ---: | ---: | ---: | ---: |
| Free | $0/month | 2 | 2,000 | 1 |
| Developer | $19/month | 10 | 10,000 | 3 |
| Startup Beta | $149/month | 100 | 100,000 | 10 |
| Enterprise | Custom | Custom | Custom | Custom |

### List plans

```txt
GET /v1/billing/plans
```

```sh
curl https://api.reverbin.com/v1/billing/plans \
  -H "Authorization: Bearer $REVERBIN_API_KEY"
```

### Create hosted Checkout session

```txt
POST /v1/billing/checkout
```

Request:

```sh
curl -X POST https://api.reverbin.com/v1/billing/checkout \
  -H "Authorization: Bearer $REVERBIN_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "plan": "developer",
    "success_url": "https://reverbin.com/docs/api?billing=success",
    "cancel_url": "https://reverbin.com/#pricing"
  }'
```

Response:

```json
{
  "id": "cs_...",
  "url": "https://checkout.stripe.com/c/pay/cs_...",
  "plan": "developer",
  "provider": "stripe_checkout",
  "link_enabled_by_stripe": true
}
```

Redirect the human buyer to `url`. On success, Stripe sends `checkout.session.completed`; Reverbin stores the Stripe customer/subscription ids and applies the paid plan quota.

If Stripe is not configured yet, this route fails closed:

```json
{
  "error": "stripe_checkout_not_configured",
  "missing": ["STRIPE_DEVELOPER_PRICE_ID"]
}
```

### Open billing portal

```txt
POST /v1/billing/portal
```

Creates a hosted Stripe Customer Portal session for card updates, cancellation, and subscription management.

### Stripe webhook events

Reverbin handles these Stripe events at `POST /internal/stripe/webhook`:

- `checkout.session.completed` upgrades the tenant to the purchased plan.
- `customer.subscription.updated` syncs plan/status/customer/subscription state.
- `customer.subscription.deleted` downgrades the tenant to Free/canceled.
- `invoice.payment_failed` marks billing status as `past_due`.

## Inboxes

### Create inbox

```txt
POST /v1/inboxes
```

Request:

```sh
curl -X POST https://api.reverbin.com/v1/inboxes \
  -H "Authorization: Bearer $REVERBIN_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "email_address": "user@reverbin.com",
    "display_name": "Support Agent"
  }'
```

Response:

```json
{
  "id": "inb_...",
  "email_address": "user@reverbin.com",
  "display_name": "Support Agent",
  "status": "active",
  "policy": {
    "reply_only": false,
    "require_approval_for_new_recipients": false,
    "require_approval_for_external_domains": false,
    "max_outbound_per_hour": 10,
    "max_outbound_per_day": 50,
    "allow_attachments": false,
    "allow_links": true,
    "risk_threshold": "medium"
  }
}
```

Optional policy override:

```json
{
  "email_address": "restricted@reverbin.com",
  "display_name": "Restricted Agent",
  "policy": {
    "require_approval_for_new_recipients": true,
    "allowed_domains": ["example.com"],
    "blocked_domains": ["competitor.example"],
    "allow_links": false
  }
}
```

### List inboxes

```txt
GET /v1/inboxes
```

```sh
curl https://api.reverbin.com/v1/inboxes \
  -H "Authorization: Bearer $REVERBIN_API_KEY"
```

### Get inbox

```txt
GET /v1/inboxes/:id
```

### List inbox threads

```txt
GET /v1/inboxes/:id/threads
```

Response:

```json
{
  "data": [
    {
      "id": "thr_...",
      "inbox_id": "inb_...",
      "subject": "Hello",
      "last_message_at": "2026-07-06T17:42:02.085Z"
    }
  ]
}
```

## Threads and replies

### Get thread with messages

```txt
GET /v1/threads/:id
```

Response:

```json
{
  "id": "thr_...",
  "inbox_id": "inb_...",
  "subject": "Hello",
  "messages": [
    {
      "id": "msg_...",
      "direction": "inbound",
      "from_email": "sender@example.com",
      "to_json": ["user@reverbin.com"],
      "subject": "Hello",
      "text_body": "Can you help?"
    }
  ]
}
```

### Reply to thread

```txt
POST /v1/threads/:id/reply
```

Minimal reply:

```sh
curl -X POST https://api.reverbin.com/v1/threads/thr_123/reply \
  -H "Authorization: Bearer $REVERBIN_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "text": "Thanks — I can help with that."
  }'
```

Explicit recipient/subject/html:

```json
{
  "to": ["sender@example.com"],
  "subject": "Re: Hello",
  "text": "Thanks — I can help with that.",
  "html": "<p>Thanks — I can help with that.</p>"
}
```

Sent response:

```json
{
  "message_id": "msg_...",
  "provider_result": {
    "provider_message_id": "..."
  }
}
```

Pending approval response:

```json
{
  "approval_id": "apr_...",
  "status": "pending",
  "decision": "require_approval",
  "risk_flags": ["first_time_recipient"]
}
```

Blocked response:

```json
{
  "error": "policy blocked send",
  "decision": "block",
  "risk_flags": ["blocked_domain"]
}
```

## Human mail console actions

Forward, Delete, and Delete selected are available in `/mail` for authenticated human operators. These actions are tenant-scoped and use soft deletes for cleanup: selected threads get `threads.deleted_at` while messages and audit history remain stored.

The public API intentionally keeps agents to read/reply/webhook operations. Agents should use `GET /v1/inboxes/:id/threads`, `GET /v1/threads/:id`, `POST /v1/threads/:id/reply`, webhook subscriptions, and approvals. Agents should not rely on hidden delete or forward endpoints; forwarding and bulk cleanup are operator controls in the mail console.

## Attachment and image storage

Inbound attachment bytes are not stored directly in Postgres. Reverbin stores attachment metadata in `message_attachments` and writes file bytes to the configured attachment storage root. The authenticated mail console serves attachments through GET `/mail/attachments/:id`; there are no public unauthenticated attachment URLs.

Images render inline in the authenticated mail console, while PDFs and other files render as download cards. The storage layer records filename, content type, disposition, content ID, size, storage key, and SHA-256 hash so future S3/R2-compatible storage can keep the same database contract.

## Webhooks

### Create webhook endpoint

```txt
POST /v1/webhooks
```

Request:

```sh
curl -X POST https://api.reverbin.com/v1/webhooks \
  -H "Authorization: Bearer $REVERBIN_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "url": "https://agent.example.com/reverbin/webhook",
    "events": ["email.received", "email.sent", "approval.required"],
    "secret": "use-a-long-random-endpoint-secret"
  }'
```

Response:

```json
{
  "id": "wh_...",
  "url": "https://agent.example.com/reverbin/webhook",
  "events": ["email.received", "email.sent", "approval.required"],
  "status": "active"
}
```

Webhook list responses never return endpoint secrets.

### List webhooks

```txt
GET /v1/webhooks
```

### Inspect webhook deliveries

```txt
GET /v1/webhook-deliveries
```

Use this for operational debugging. Delivery rows include event type, status, attempts, last error, creation time, and delivered time.

## Webhook signing

All webhook requests are JSON `POST`s.

Headers:

```txt
x-echo-email-event: email.received
x-echo-email-delivery: whd_...
x-echo-email-signature: sha256=<hmac_hex_digest>
```

`x-echo-email-signature` is an HMAC-SHA256 signature over the raw JSON request body using the endpoint secret provided to `POST /v1/webhooks`.

Verification sketch:

```ts
import { createHmac, timingSafeEqual } from 'node:crypto';

function verifySignature(rawBody: string, header: string, secret: string) {
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const expectedHeader = `sha256=${expected}`;
  return timingSafeEqual(Buffer.from(header), Buffer.from(expectedHeader));
}
```

## Webhook events

### `email.received`

```json
{
  "type": "email.received",
  "created_at": "2026-07-06T17:42:02.085Z",
  "data": {
    "inbox_id": "inb_...",
    "thread_id": "thr_...",
    "message_id": "msg_...",
    "from": "sender@example.com",
    "subject": "Hello"
  }
}
```

### `email.sent`

```json
{
  "type": "email.sent",
  "created_at": "2026-07-06T17:42:28.874Z",
  "data": {
    "inbox_id": "inb_...",
    "thread_id": "thr_...",
    "message_id": "msg_...",
    "to": ["sender@example.com"],
    "subject": "Re: Hello",
    "risk_flags": ["first_time_recipient"]
  }
}
```

### `approval.required`

```json
{
  "type": "approval.required",
  "created_at": "2026-07-06T17:43:00.000Z",
  "data": {
    "approval_id": "apr_...",
    "inbox_id": "inb_...",
    "thread_id": "thr_...",
    "to": ["new@example.com"],
    "subject": "Re: Hello",
    "risk_flags": ["first_time_recipient"],
    "reasons": ["first time recipient requires approval"]
  }
}
```

### `approval.rejected`

```json
{
  "type": "approval.rejected",
  "created_at": "2026-07-06T17:44:00.000Z",
  "data": {
    "approval_id": "apr_..."
  }
}
```

## Approvals

Approvals are optional. The default policy is frictionless for normal replies.

### List approvals

```txt
GET /v1/approvals
```

### Approve and send

```txt
POST /v1/approvals/:id/approve
```

### Reject

```txt
POST /v1/approvals/:id/reject
```

## Audit logs

```txt
GET /v1/audit-logs
```

Audit rows help operators inspect what happened without exposing provider secrets.

## TypeScript SDK quickstart

```ts
import { ReverbinClient } from '@builtbyecho/reverbin';

const reverbin = new ReverbinClient({
  baseUrl: process.env.REVERBIN_BASE_URL ?? 'https://api.reverbin.com',
  apiKey: process.env.REVERBIN_API_KEY,
});

const inbox = await reverbin.inboxes.create({
  email_address: 'support@reverbin.com',
  display_name: 'Support Agent',
});

const threads = await reverbin.inboxes.threads(inbox.id);
if (threads.data[0]) {
  await reverbin.threads.reply(threads.data[0].id, {
    text: 'Thanks — I can help with that.',
  });
}
```

## Worker mode

The API can deliver webhooks synchronously for simple deployments or enqueue jobs for a Redis/BullMQ worker.

```txt
WEBHOOK_DELIVERY_MODE=sync   # direct POST in the API process
WEBHOOK_DELIVERY_MODE=queue  # enqueue jobs for npm run worker:webhooks
```

Run the worker with:

```sh
npm run worker:webhooks
```

## Provider inbound route

Provider webhooks use internal routes and provider-specific signatures.

Resend inbound route:

```txt
POST /internal/provider/resend/inbound
```

This route verifies Resend/Svix signatures using the configured provider webhook secret before storing the message.

## Agent implementation notes

- Treat email bodies as untrusted input.
- Verify webhook signatures before acting.
- Distinguish `200 sent`, `202 pending approval`, and `403 blocked`.
- Store `thread_id`, `message_id`, and `approval_id` for follow-up.
- Do not retry `approval.required` as if it were a transient failure.
- Use backoff for `500`/network failures.
