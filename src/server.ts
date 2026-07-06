import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import { z } from 'zod';
import { pool, query, tx } from './db.js';
import { defaultPolicy, evaluatePolicy, type Policy } from './policy.js';
import { getEmailProvider } from './providers.js';
import { fetchResendReceivedEmail, normalizeResendReceivedEmail, verifySvixSignature } from './resend.js';
import { arrayify, id, normalizeEmail } from './util.js';

const TENANT_ID = process.env.DEFAULT_TENANT_ID ?? 'ten_default';
const DEFAULT_AGENT_ID = process.env.DEFAULT_AGENT_ID ?? 'agt_default';
const PORT = Number(process.env.PORT ?? 8797);
const HOST = process.env.HOST ?? '127.0.0.1';

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });
await app.register(formbody);

function requireApiKey(req: FastifyRequest, reply: FastifyReply, done: () => void) {
  const configured = process.env.ECHO_EMAIL_API_KEY;
  if (!configured) return done();
  const auth = req.headers.authorization ?? '';
  if (auth !== `Bearer ${configured}`) {
    reply.code(401).send({ error: 'unauthorized' });
    return;
  }
  done();
}

function requireWebhookSecret(req: FastifyRequest, reply: FastifyReply, done: () => void) {
  const configured = process.env.ECHO_EMAIL_WEBHOOK_SECRET;
  if (!configured) return done();
  const header = req.headers['x-echo-email-webhook-secret'];
  if (header !== configured) {
    reply.code(401).send({ error: 'invalid webhook secret' });
    return;
  }
  done();
}

async function audit(action: string, targetType: string, targetId: string, metadata: Record<string, unknown> = {}, actorType = 'system', actorId?: string | null) {
  await query(
    `INSERT INTO audit_logs (id, tenant_id, actor_type, actor_id, action, target_type, target_id, metadata_json)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)`,
    [id('aud'), TENANT_ID, actorType, actorId ?? null, action, targetType, targetId, JSON.stringify(metadata)],
  );
}

async function getPolicy(inboxId: string): Promise<Policy> {
  const result = await query<any>('SELECT * FROM send_policies WHERE inbox_id = $1', [inboxId]);
  if (result.rowCount === 0) return defaultPolicy;
  const row = result.rows[0];
  return {
    reply_only: row.reply_only,
    require_approval_for_new_recipients: row.require_approval_for_new_recipients,
    require_approval_for_external_domains: row.require_approval_for_external_domains,
    max_outbound_per_hour: Number(row.max_outbound_per_hour),
    max_outbound_per_day: Number(row.max_outbound_per_day),
    allowed_domains: row.allowed_domains_json ?? [],
    blocked_domains: row.blocked_domains_json ?? [],
    allowed_recipients: row.allowed_recipients_json ?? [],
    blocked_recipients: row.blocked_recipients_json ?? [],
    allow_attachments: row.allow_attachments,
    allow_links: row.allow_links,
    risk_threshold: row.risk_threshold ?? 'medium',
  };
}

async function countOutbound(inboxId: string, interval: '1 hour' | '1 day') {
  const result = await query<{ count: string }>(
    `SELECT count(*)::text FROM messages WHERE inbox_id = $1 AND direction = 'outbound' AND created_at >= now() - $2::interval`,
    [inboxId, interval],
  );
  return Number(result.rows[0]?.count ?? 0);
}

async function knownRecipients(inboxId: string) {
  const result = await query<{ to_json: unknown }>(
    `SELECT to_json FROM messages WHERE inbox_id = $1 AND direction = 'outbound'`,
    [inboxId],
  );
  return result.rows.flatMap((row) => arrayify(row.to_json as string[])).map((item) => String(item).toLowerCase());
}

const InboxCreateSchema = z.object({
  email_address: z.string().email(),
  display_name: z.string().optional(),
  agent_id: z.string().optional(),
  policy: z.object({
    reply_only: z.boolean().optional(),
    require_approval_for_new_recipients: z.boolean().optional(),
    require_approval_for_external_domains: z.boolean().optional(),
    max_outbound_per_hour: z.number().int().positive().optional(),
    max_outbound_per_day: z.number().int().positive().optional(),
    allowed_domains: z.array(z.string()).optional(),
    blocked_domains: z.array(z.string()).optional(),
    allowed_recipients: z.array(z.string().email()).optional(),
    blocked_recipients: z.array(z.string().email()).optional(),
    allow_attachments: z.boolean().optional(),
    allow_links: z.boolean().optional(),
    risk_threshold: z.enum(['low', 'medium', 'high']).optional(),
  }).optional(),
});

const InboundSchema = z.object({
  inbox_id: z.string().optional(),
  email_address: z.string().email().optional(),
  provider: z.string().default('manual'),
  provider_message_id: z.string().optional(),
  from: z.object({ email: z.string().email(), name: z.string().optional() }),
  to: z.array(z.object({ email: z.string().email(), name: z.string().optional() })).min(1),
  cc: z.array(z.object({ email: z.string().email(), name: z.string().optional() })).optional(),
  bcc: z.array(z.object({ email: z.string().email(), name: z.string().optional() })).optional(),
  subject: z.string().default('(no subject)'),
  text: z.string().default(''),
  html: z.string().nullable().optional(),
  headers: z.record(z.string(), z.unknown()).optional(),
  raw_mime_storage_key: z.string().optional(),
});

const ReplySchema = z.object({
  to: z.array(z.string().email()).optional(),
  subject: z.string().optional(),
  text: z.string().min(1),
  html: z.string().nullable().optional(),
  attachments: z.array(z.unknown()).optional(),
});

type InboundEmail = z.infer<typeof InboundSchema>;

async function storeInboundEmail(body: InboundEmail) {
  const inboxResult = body.inbox_id
    ? await query<any>('SELECT * FROM inboxes WHERE id = $1', [body.inbox_id])
    : await query<any>('SELECT * FROM inboxes WHERE email_address = $1', [normalizeEmail(body.email_address ?? body.to[0].email)]);
  if (inboxResult.rowCount === 0) return null;
  const inbox = inboxResult.rows[0];
  const threadId = id('thr');
  const messageId = id('msg');
  await tx(async (client) => {
    await client.query(
      `INSERT INTO provider_events (id, provider, event_type, payload_json) VALUES ($1,$2,'email.received',$3::jsonb)`,
      [id('pevt'), body.provider, JSON.stringify(body)],
    );
    await client.query(
      `INSERT INTO threads (id, tenant_id, inbox_id, subject, last_message_at) VALUES ($1,$2,$3,$4,now())`,
      [threadId, TENANT_ID, inbox.id, body.subject],
    );
    await client.query(
      `INSERT INTO messages (id, tenant_id, inbox_id, thread_id, provider_message_id, direction, from_email, from_name, to_json, cc_json, bcc_json, subject, text_body, html_body, raw_mime_storage_key, headers_json, received_at)
       VALUES ($1,$2,$3,$4,$5,'inbound',$6,$7,$8::jsonb,$9::jsonb,$10::jsonb,$11,$12,$13,$14,$15::jsonb,now())`,
      [messageId, TENANT_ID, inbox.id, threadId, body.provider_message_id ?? null, normalizeEmail(body.from.email), body.from.name ?? null,
        JSON.stringify(body.to), JSON.stringify(body.cc ?? []), JSON.stringify(body.bcc ?? []), body.subject, body.text,
        body.html ?? null, body.raw_mime_storage_key ?? null, JSON.stringify(body.headers ?? {})],
    );
  });
  await audit('email.received', 'message', messageId, { inbox_id: inbox.id, thread_id: threadId, from: body.from.email });
  return { inbox_id: inbox.id, thread_id: threadId, message_id: messageId, event: 'email.received' };
}

app.get('/health', async () => ({
  ok: true,
  service: 'agent-email-layer',
  version: '0.1.0',
  provider: process.env.EMAIL_PROVIDER ?? 'mock',
  public_base_url: process.env.PUBLIC_BASE_URL ?? `http://${HOST}:${PORT}`,
}));

app.get('/readyz', async (req, reply) => {
  try {
    await query('SELECT 1');
    return { ok: true, db: 'ok' };
  } catch (error) {
    req.log.error(error);
    reply.code(503);
    return { ok: false, db: 'error' };
  }
});

app.get('/dashboard', async (_req, reply) => {
  const [inboxes, approvals, audits] = await Promise.all([
    query<any>('SELECT id, email_address, display_name, status, created_at FROM inboxes ORDER BY created_at DESC LIMIT 20'),
    query<any>('SELECT id, inbox_id, subject, status, risk_flags_json, created_at FROM approval_requests ORDER BY created_at DESC LIMIT 20'),
    query<any>('SELECT action, target_type, target_id, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 30'),
  ]);
  const html = `<!doctype html><html><head><title>Agent Email Layer</title><style>body{font-family:Inter,system-ui,sans-serif;margin:32px;background:#09090b;color:#f4f4f5}a{color:#93c5fd}.card{border:1px solid #27272a;border-radius:14px;padding:18px;margin:14px 0;background:#111113}code{background:#18181b;padding:2px 5px;border-radius:6px}li{margin:6px 0}</style></head><body><h1>Agent Email Layer</h1><p>VPS-hosted control plane for safe programmable agent inboxes.</p><div class="card"><h2>Inboxes</h2><ul>${inboxes.rows.map((row) => `<li><code>${row.email_address}</code> — ${row.status} — ${row.id}</li>`).join('')}</ul></div><div class="card"><h2>Approvals</h2><ul>${approvals.rows.map((row) => `<li><code>${row.status}</code> ${row.subject} — ${row.id} — risks: ${JSON.stringify(row.risk_flags_json)}</li>`).join('')}</ul></div><div class="card"><h2>Audit</h2><ul>${audits.rows.map((row) => `<li>${row.created_at.toISOString?.() ?? row.created_at}: <code>${row.action}</code> ${row.target_type}/${row.target_id}</li>`).join('')}</ul></div></body></html>`;
  reply.type('text/html').send(html);
});

app.register(async (privateRoutes) => {
  privateRoutes.addHook('preHandler', requireApiKey);

  privateRoutes.post('/v1/inboxes', async (req, reply) => {
    const body = InboxCreateSchema.parse(req.body);
    const inboxId = id('inb');
    const policyId = id('pol');
    const policy = { ...defaultPolicy, ...(body.policy ?? {}) };
    const email = normalizeEmail(body.email_address);
    await tx(async (client) => {
      await client.query(
        `INSERT INTO inboxes (id, tenant_id, agent_id, provider_id, email_address, display_name)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [inboxId, TENANT_ID, body.agent_id ?? DEFAULT_AGENT_ID, process.env.EMAIL_PROVIDER ?? 'mock', email, body.display_name ?? null],
      );
      await client.query(
        `INSERT INTO send_policies (id, tenant_id, inbox_id, reply_only, require_approval_for_new_recipients,
          require_approval_for_external_domains, max_outbound_per_hour, max_outbound_per_day, allowed_domains_json,
          blocked_domains_json, allowed_recipients_json, blocked_recipients_json, allow_attachments, allow_links, risk_threshold)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11::jsonb,$12::jsonb,$13,$14,$15)`,
        [policyId, TENANT_ID, inboxId, policy.reply_only, policy.require_approval_for_new_recipients,
          policy.require_approval_for_external_domains, policy.max_outbound_per_hour, policy.max_outbound_per_day,
          JSON.stringify(policy.allowed_domains), JSON.stringify(policy.blocked_domains), JSON.stringify(policy.allowed_recipients),
          JSON.stringify(policy.blocked_recipients), policy.allow_attachments, policy.allow_links, policy.risk_threshold],
      );
    });
    await audit('inbox.created', 'inbox', inboxId, { email_address: email }, 'api');
    reply.code(201).send({ id: inboxId, email_address: email, policy });
  });

  privateRoutes.get('/v1/inboxes', async () => {
    const result = await query('SELECT * FROM inboxes ORDER BY created_at DESC');
    return { data: result.rows };
  });

  privateRoutes.get<{ Params: { id: string } }>('/v1/inboxes/:id', async (req, reply) => {
    const result = await query('SELECT * FROM inboxes WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return reply.code(404).send({ error: 'inbox not found' });
    return result.rows[0];
  });

  privateRoutes.get<{ Params: { id: string } }>('/v1/inboxes/:id/threads', async (req) => {
    const result = await query('SELECT * FROM threads WHERE inbox_id = $1 ORDER BY last_message_at DESC', [req.params.id]);
    return { data: result.rows };
  });

  privateRoutes.get<{ Params: { id: string } }>('/v1/threads/:id', async (req, reply) => {
    const thread = await query('SELECT * FROM threads WHERE id = $1', [req.params.id]);
    if (thread.rowCount === 0) return reply.code(404).send({ error: 'thread not found' });
    const messages = await query('SELECT * FROM messages WHERE thread_id = $1 ORDER BY created_at ASC', [req.params.id]);
    return { ...thread.rows[0], messages: messages.rows };
  });

  privateRoutes.post<{ Params: { id: string } }>('/v1/threads/:id/reply', async (req, reply) => {
    const body = ReplySchema.parse(req.body);
    const threadResult = await query<any>('SELECT * FROM threads WHERE id = $1', [req.params.id]);
    if (threadResult.rowCount === 0) return reply.code(404).send({ error: 'thread not found' });
    const thread = threadResult.rows[0];
    const inboxResult = await query<any>('SELECT * FROM inboxes WHERE id = $1', [thread.inbox_id]);
    const inbox = inboxResult.rows[0];
    const recipients = body.to?.map(normalizeEmail) ?? (await query<any>(
      `SELECT from_email FROM messages WHERE thread_id = $1 AND direction = 'inbound' ORDER BY created_at DESC LIMIT 1`,
      [thread.id],
    )).rows.map((row) => normalizeEmail(row.from_email));
    if (recipients.length === 0) return reply.code(400).send({ error: 'no recipient available for reply' });

    const policy = await getPolicy(inbox.id);
    const decision = evaluatePolicy(policy, {
      to: recipients,
      bodyText: body.text,
      bodyHtml: body.html,
      attachments: body.attachments,
      isNewThread: false,
      knownRecipientEmails: await knownRecipients(inbox.id),
      sentLastHour: await countOutbound(inbox.id, '1 hour'),
      sentLastDay: await countOutbound(inbox.id, '1 day'),
    });

    if (decision.decision === 'block') {
      await audit('policy.blocked', 'thread', thread.id, { decision });
      return reply.code(403).send({ error: 'policy blocked send', ...decision });
    }

    if (decision.decision === 'require_approval') {
      const approvalId = id('apr');
      await query(
        `INSERT INTO approval_requests (id, tenant_id, inbox_id, agent_id, thread_id, proposed_to_json, subject, body_text, body_html, risk_flags_json, policy_reasons_json)
         VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9,$10::jsonb,$11::jsonb)`,
        [approvalId, TENANT_ID, inbox.id, inbox.agent_id, thread.id, JSON.stringify(recipients), body.subject ?? `Re: ${thread.subject}`,
          body.text, body.html ?? null, JSON.stringify(decision.risk_flags), JSON.stringify(decision.reasons)],
      );
      await audit('approval.required', 'approval', approvalId, { thread_id: thread.id, decision });
      return reply.code(202).send({ approval_id: approvalId, status: 'pending', ...decision });
    }

    const provider = getEmailProvider();
    const sendResult = await provider.sendEmail({
      from: process.env.RESEND_FROM_EMAIL || inbox.email_address || process.env.DEFAULT_FROM_EMAIL,
      to: recipients,
      subject: body.subject ?? `Re: ${thread.subject}`,
      text: body.text,
      html: body.html,
    });
    const messageId = id('msg');
    await query(
      `INSERT INTO messages (id, tenant_id, inbox_id, thread_id, provider_message_id, direction, from_email, to_json, subject, text_body, html_body, risk_flags_json, sent_at)
       VALUES ($1,$2,$3,$4,$5,'outbound',$6,$7::jsonb,$8,$9,$10,$11::jsonb,now())`,
      [messageId, TENANT_ID, inbox.id, thread.id, sendResult.provider_message_id, inbox.email_address, JSON.stringify(recipients), body.subject ?? `Re: ${thread.subject}`, body.text, body.html ?? null, JSON.stringify(decision.risk_flags)],
    );
    await audit('email.sent', 'message', messageId, { provider_result: sendResult });
    return { message_id: messageId, provider_result: sendResult };
  });

  privateRoutes.get('/v1/approvals', async () => {
    const result = await query('SELECT * FROM approval_requests ORDER BY created_at DESC LIMIT 100');
    return { data: result.rows };
  });

  privateRoutes.post<{ Params: { id: string } }>('/v1/approvals/:id/approve', async (req, reply) => {
    const approvalResult = await query<any>('SELECT * FROM approval_requests WHERE id = $1', [req.params.id]);
    if (approvalResult.rowCount === 0) return reply.code(404).send({ error: 'approval not found' });
    const approval = approvalResult.rows[0];
    if (approval.status !== 'pending') return reply.code(409).send({ error: `approval is ${approval.status}` });
    const inboxResult = await query<any>('SELECT * FROM inboxes WHERE id = $1', [approval.inbox_id]);
    const inbox = inboxResult.rows[0];
    const provider = getEmailProvider();
    const providerResult = await provider.sendEmail({
      from: process.env.RESEND_FROM_EMAIL || inbox.email_address || process.env.DEFAULT_FROM_EMAIL,
      to: approval.proposed_to_json,
      subject: approval.subject,
      text: approval.body_text,
      html: approval.body_html,
    });
    const messageId = id('msg');
    await tx(async (client) => {
      await client.query(
        `INSERT INTO messages (id, tenant_id, inbox_id, thread_id, provider_message_id, direction, from_email, to_json, subject, text_body, html_body, risk_flags_json, sent_at)
         VALUES ($1,$2,$3,$4,$5,'outbound',$6,$7::jsonb,$8,$9,$10,$11::jsonb,now())`,
        [messageId, TENANT_ID, inbox.id, approval.thread_id, providerResult.provider_message_id, inbox.email_address,
          JSON.stringify(approval.proposed_to_json), approval.subject, approval.body_text, approval.body_html, JSON.stringify(approval.risk_flags_json)],
      );
      await client.query('UPDATE approval_requests SET status = $1, provider_result_json = $2::jsonb, decided_at = now() WHERE id = $3',
        ['sent', JSON.stringify(providerResult), approval.id]);
    });
    await audit('approval.approved_and_sent', 'approval', approval.id, { message_id: messageId, provider_result: providerResult }, 'human');
    return { approval_id: approval.id, message_id: messageId, provider_result: providerResult };
  });

  privateRoutes.post<{ Params: { id: string } }>('/v1/approvals/:id/reject', async (req, reply) => {
    const result = await query('UPDATE approval_requests SET status = $1, decided_at = now() WHERE id = $2 AND status = $3 RETURNING *', ['rejected', req.params.id, 'pending']);
    if (result.rowCount === 0) return reply.code(404).send({ error: 'pending approval not found' });
    await audit('approval.rejected', 'approval', req.params.id, {}, 'human');
    return result.rows[0];
  });

  privateRoutes.get('/v1/audit-logs', async () => {
    const result = await query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200');
    return { data: result.rows };
  });
});

app.register(async (resendRoutes) => {
  resendRoutes.removeContentTypeParser('application/json');
  resendRoutes.addContentTypeParser('application/json', { parseAs: 'string' }, (_req, body, done) => {
    done(null, body);
  });

  resendRoutes.post('/internal/provider/resend/inbound', async (req, reply) => {
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    if (!webhookSecret) return reply.code(503).send({ error: 'resend webhook secret not configured' });

    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
    const headers = req.headers as Record<string, string | string[] | undefined>;
    if (!verifySvixSignature(rawBody, headers, webhookSecret)) {
      return reply.code(401).send({ error: 'invalid resend webhook signature' });
    }

    const event = JSON.parse(rawBody);
    let details;
    const emailId = event?.data?.email_id ?? event?.data?.id;
    if (process.env.RESEND_API_KEY && emailId) {
      try {
        details = await fetchResendReceivedEmail(String(emailId), process.env.RESEND_API_KEY);
      } catch (error) {
        req.log.warn({ error, email_id: emailId }, 'failed to fetch Resend received email body; storing webhook metadata only');
      }
    }

    const body = InboundSchema.parse(normalizeResendReceivedEmail(event, details));
    const result = await storeInboundEmail(body);
    if (!result) return reply.code(404).send({ error: 'target inbox not found' });
    reply.code(202).send({ ...result, provider: 'resend' });
  });
});

app.register(async (internalRoutes) => {
  internalRoutes.addHook('preHandler', requireWebhookSecret);

  internalRoutes.post('/internal/provider/inbound', async (req, reply) => {
    const body = InboundSchema.parse(req.body);
    const result = await storeInboundEmail(body);
    if (!result) return reply.code(404).send({ error: 'target inbox not found' });
    reply.code(202).send(result);
  });
});

app.setErrorHandler((error, req, reply) => {
  req.log.error(error);
  if (error instanceof z.ZodError) {
    reply.code(400).send({ error: 'validation_error', details: error.issues });
    return;
  }
  const message = error instanceof Error ? error.message : 'unknown error';
  reply.code(500).send({ error: 'internal_error', message });
});

async function main() {
  await app.listen({ host: HOST, port: PORT });
}

main().catch(async (error) => {
  app.log.error(error);
  await pool.end();
  process.exit(1);
});
