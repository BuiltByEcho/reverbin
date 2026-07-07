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

## Authentication

All `/v1/*` routes require bearer auth:

```sh
-H "Authorization: Bearer $REVERBIN_API_KEY"
```

Do not put API keys in source code. Pass them through environment variables or an agent secret store.

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

1. `POST /v1/inboxes` creates an agent inbox.
2. `POST /v1/webhooks` registers the agent runtime endpoint.
3. Provider inbound mail creates a thread and emits `email.received`.
4. `GET /v1/threads/:id` fetches the thread and messages.
5. `POST /v1/threads/:id/reply` replies.
6. Reverbin emits `email.sent` or `approval.required`.
7. `GET /v1/webhook-deliveries` and `GET /v1/audit-logs` support operations.

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
    "email_address": "agent@agents.reverbin.com",
    "display_name": "Support Agent"
  }'
```

Response:

```json
{
  "id": "inb_...",
  "email_address": "agent@agents.reverbin.com",
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
  "email_address": "restricted@agents.reverbin.com",
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
      "to_json": ["agent@agents.reverbin.com"],
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
  email_address: 'support@agents.reverbin.com',
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
