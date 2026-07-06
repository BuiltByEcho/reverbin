# Reverbin API

Programmable email inboxes for autonomous agents.

Reverbin gives agents a small email control plane: create an inbox, receive real mail, read the thread, reply immediately, and subscribe your runtime to signed webhook events.

Base URL:

```txt
https://api.reverbin.com
```

Authentication:

```sh
Authorization: Bearer $REVERBIN_API_KEY
```

Do not put API keys in source code. Pass them through environment variables or your agent secret store.

## Five-minute agent flow

1. Create an inbox for the agent.
2. Register a webhook endpoint for `email.received` and `email.sent`.
3. Wait for inbound email on the inbox address.
4. Fetch the thread and decide what to do.
5. Reply through Reverbin. The default policy is frictionless: normal replies send immediately while risk flags are retained for audit.

## Endpoints

### Create inbox

`POST /v1/inboxes`

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
  "policy": {
    "reply_only": false,
    "require_approval_for_new_recipients": false,
    "require_approval_for_external_domains": false,
    "allow_links": true
  }
}
```

### List inboxes

`GET /v1/inboxes`

### Get inbox

`GET /v1/inboxes/:id`

### List inbox threads

`GET /v1/inboxes/:id/threads`

### Get thread with messages

`GET /v1/threads/:id`

### Reply to thread

`POST /v1/threads/:id/reply`

```sh
curl -X POST https://api.reverbin.com/v1/threads/thr_123/reply \
  -H "Authorization: Bearer $REVERBIN_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "text": "Thanks — I can help with that."
  }'
```

If the inbox policy allows the send, the response includes `message_id` and provider details. If the inbox explicitly requires approval for this send, the response returns `202` with `approval_id` and `status: "pending"`.

### Create webhook endpoint

`POST /v1/webhooks`

```sh
curl -X POST https://api.reverbin.com/v1/webhooks \
  -H "Authorization: Bearer $REVERBIN_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "url": "https://agent.example.com/reverbin/webhook",
    "events": ["email.received", "email.sent"],
    "secret": "use-a-long-random-endpoint-secret"
  }'
```

### List webhooks

`GET /v1/webhooks`

Webhook list responses never return the endpoint secret.

### Inspect webhook deliveries

`GET /v1/webhook-deliveries`

Use this for operational debugging. Delivery rows include event type, status, attempts, last error, creation time, and delivered time.

### Audit logs

`GET /v1/audit-logs`

## Webhook events

All webhook requests are JSON `POST`s. Common headers:

```txt
x-echo-email-event: email.received
x-echo-email-delivery: whd_...
x-echo-email-signature: sha256=<hmac_hex_digest>
```

`x-echo-email-signature` is an HMAC-SHA256 signature over the raw JSON request body using the endpoint secret you provided to `POST /v1/webhooks`.

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

## TypeScript SDK quickstart

```ts
import { ReverbinClient } from '@builtbyecho/agent-email-layer';

const reverbin = new ReverbinClient({
  baseUrl: process.env.REVERBIN_BASE_URL,
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

The API can deliver webhooks synchronously for simple deployments or enqueue delivery jobs for a Redis/BullMQ worker:

```txt
WEBHOOK_DELIVERY_MODE=sync   # default
WEBHOOK_DELIVERY_MODE=queue  # enqueue jobs for npm run worker:webhooks
```

Run the worker with:

```sh
npm run worker:webhooks
```
