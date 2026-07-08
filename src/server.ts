import { createHash, randomBytes, randomInt } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import { z } from 'zod';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import { pool, query, tx } from './db.js';
import { defaultPolicy, evaluatePolicy, type Policy } from './policy.js';
import { getEmailProvider } from './providers.js';
import { fetchResendReceivedEmail, normalizeResendReceivedEmail, verifySvixSignature } from './resend.js';
import { buildWebhookDeliveryHeaders, buildWebhookEventPayload, isAllowedWebhookEvent, isAllowedWebhookUrl, shouldDeliverWebhookEvent, type WebhookEventType } from './webhooks.js';
import { clearDashboardCookie, dashboardCookie, dashboardTokenFromEnv, isDashboardRequestAuthorized, parseDashboardCookies } from './dashboard-auth.js';
import { renderDashboardLoginPage, renderDashboardPage, renderDashboardUnavailablePage, renderDocsPage, renderFaviconSvg, renderLandingPage, renderMailComposePage, renderMailForwardPage, renderMailPage, renderMailSettingsPage, renderMailWebhooksPage, renderSignupPage, type DocsPageKey } from './public-pages.js';
import { buildWebhookDeliveryJob, redisConnectionOptions, WEBHOOK_DELIVERY_QUEUE, webhookDeliveryMode } from './webhook-delivery.js';
import { buildPendingSignupVerification, normalizeSignupRequestInput, summarizeSignupVerification, type SignupRequestStatus, type SignupVerificationCheck } from './signup-verification.js';
import { BILLING_PLANS, createStripeBillingPortalSession, createStripeCheckoutSession, maxInboxesForPlan, maxWebhookEndpointsForPlan, normalizePlan, priceIdForPlan, verifyStripeWebhookSignature, type BillingPlan } from './billing.js';
import { checkReadiness } from './readiness.js';
import { configuredSecret, internalErrorPayload, isCorsOriginAllowed, webhookDeliveryTimeoutMs } from './http-hardening.js';
import { createFixedWindowRateLimiter } from './rate-limit.js';
import { arrayify, id, normalizeEmail } from './util.js';
import { buildApiKeyRecord, hashApiKeyToken, normalizeSelfServeInboxLocalPart } from './api-keys.js';

const TENANT_ID = process.env.DEFAULT_TENANT_ID ?? 'ten_default';
const DEFAULT_AGENT_ID = process.env.DEFAULT_AGENT_ID ?? 'agt_default';
const SELF_SERVE_INBOX_DOMAIN = process.env.SELF_SERVE_INBOX_DOMAIN ?? 'reverbin.com';
const SELF_SERVE_MAX_INBOXES_PER_AGENT = Number(process.env.SELF_SERVE_MAX_INBOXES_PER_AGENT ?? '2');
const PORT = Number(process.env.PORT ?? 8797);
const HOST = process.env.HOST ?? '127.0.0.1';
const LLMS_TXT_PATH = new URL('../../llms.txt', import.meta.url);
const DOCS_MARKDOWN_PATHS: Record<Exclude<DocsPageKey, 'overview'>, URL> = {
  quickstart: new URL('../../docs/QUICKSTART.md', import.meta.url),
  api: new URL('../../docs/API.md', import.meta.url),
  agents: new URL('../../docs/AGENTS.md', import.meta.url),
};

const app = Fastify({ logger: true });
await app.register(cors, {
  origin(origin, callback) {
    callback(null, isCorsOriginAllowed(origin));
  },
});
await app.register(formbody);

const dashboardLoginLimiter = createFixedWindowRateLimiter({ limit: 8, windowMs: 15 * 60_000 });
const apiAuthLimiter = createFixedWindowRateLimiter({ limit: 60, windowMs: 60_000 });
const automatedSignupLimiter = createFixedWindowRateLimiter({ limit: 5, windowMs: 60 * 60_000 });

type AuthContext = {
  tenantId: string;
  apiKeyId?: string;
  scopes: string[];
  operator: boolean;
};

type AuthedRequest = FastifyRequest & { authContext?: AuthContext };

function rateLimitKey(req: FastifyRequest, scope: string) {
  const forwardedFor = req.headers['x-forwarded-for'];
  const forwardedClient = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
  const client = forwardedClient?.split(',')[0]?.trim() || req.ip || 'unknown';
  return `${scope}:${client}`;
}

function sendRateLimited(reply: FastifyReply, retryAfterSeconds: number, html = false) {
  reply.header('retry-after', String(retryAfterSeconds)).code(429);
  if (html) {
    reply.type('text/html').send(renderDashboardLoginPage('Too many attempts. Try again shortly.'));
    return;
  }
  reply.send({ error: 'rate_limited', retry_after_seconds: retryAfterSeconds });
}

let webhookQueue: Queue | null = null;
function getWebhookQueue() {
  if (webhookQueue) return webhookQueue;
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) throw new Error('REDIS_URL is required when WEBHOOK_DELIVERY_MODE=queue');
  webhookQueue = new Queue(WEBHOOK_DELIVERY_QUEUE, { connection: redisConnectionOptions(redisUrl) });
  return webhookQueue;
}

async function authenticateApiToken(token: string): Promise<AuthContext | null> {
  if (!token) return null;
  const tokenHash = hashApiKeyToken(token);
  const apiKey = await query<{ id: string; tenant_id: string; name: string; scopes_json: unknown }>(
    'SELECT id, tenant_id, name, scopes_json FROM api_keys WHERE key_hash = $1 AND revoked_at IS NULL',
    [tokenHash],
  );
  if (apiKey.rows.length === 0) return null;
  const row = apiKey.rows[0];
  return {
    tenantId: row.tenant_id,
    apiKeyId: row.id,
    scopes: arrayify(row.scopes_json as string[]).map(String),
    operator: false,
  };
}

async function validateDashboardLoginToken(candidate: string): Promise<AuthContext | null> {
  const token = candidate.trim();
  if (!token) return null;
  const configuredToken = dashboardTokenFromEnv();
  if (configuredToken && isDashboardRequestAuthorized({ authorization: `Bearer ${token}` }, configuredToken)) {
    return { tenantId: TENANT_ID, scopes: ['*'], operator: true };
  }
  return authenticateApiToken(token);
}

async function requireDashboardAuth(req: FastifyRequest, reply: FastifyReply) {
  const token = dashboardTokenFromEnv();
  if (isDashboardRequestAuthorized({ authorization: req.headers.authorization, cookie: req.headers.cookie }, token)) {
    (req as AuthedRequest).authContext = { tenantId: TENANT_ID, scopes: ['*'], operator: true };
    return;
  }
  const auth = req.headers.authorization ?? '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length).trim() : '';
  const cookieToken = parseDashboardCookies(req.headers.cookie).reverbin_dashboard ?? '';
  const authContext = await authenticateApiToken(bearer || cookieToken);
  if (authContext) {
    (req as AuthedRequest).authContext = authContext;
    return;
  }
  const sessionContext = await authenticateDashboardSession(cookieToken);
  if (sessionContext) {
    (req as AuthedRequest).authContext = sessionContext;
    return;
  }
  const acceptsHtml = String(req.headers.accept ?? '').includes('text/html');
  if (acceptsHtml) {
    reply.redirect('/dashboard/login');
    return;
  }
  reply.code(401).send({ error: 'dashboard_auth_required' });
}

function dashboardCookieIsSecure() {
  return (process.env.PUBLIC_BASE_URL ?? '').startsWith('https://');
}

function hashLoginSecret(secret: string) {
  return createHash('sha256').update(secret).digest('hex');
}

function generateDashboardLoginCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

function generateDashboardSessionToken() {
  return `rvb_sess_${randomBytes(32).toString('base64url')}`;
}

function dashboardSessionCookie(token: string) {
  return dashboardCookie(token, { secure: dashboardCookieIsSecure(), maxAgeSeconds: 60 * 60 * 12 });
}

async function sendDashboardLoginCode(email: string, code: string) {
  const provider = getEmailProvider();
  const from = process.env.REVERBIN_LOGIN_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'Reverbin <login@reverbin.com>';
  await provider.sendEmail({
    from,
    to: [email],
    subject: 'Your Reverbin sign-in code',
    text: `Your Reverbin sign-in code is ${code}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
    html: `<p>Your Reverbin sign-in code is <strong>${code}</strong>.</p><p>It expires in 10 minutes. If you did not request this, you can ignore this email.</p>`,
  });
}

async function authenticateDashboardSession(token: string): Promise<AuthContext | null> {
  if (!token) return null;
  const sessionHash = hashLoginSecret(token);
  const session = await query<{ tenant_id: string }>(
    'SELECT tenant_id FROM dashboard_sessions WHERE session_hash = $1 AND revoked_at IS NULL AND expires_at > now()',
    [sessionHash],
  );
  if (session.rows.length === 0) return null;
  return { tenantId: session.rows[0].tenant_id, scopes: ['dashboard:read', 'mail:read', 'threads:reply'], operator: false };
}

async function requireApiKey(req: FastifyRequest, reply: FastifyReply) {
  const configured = configuredSecret(process.env.ECHO_EMAIL_API_KEY);
  const auth = req.headers.authorization ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length).trim() : '';
  if (configured && token === configured) {
    (req as AuthedRequest).authContext = { tenantId: TENANT_ID, scopes: ['*'], operator: true };
    return;
  }

  if (token) {
    const authContext = await authenticateApiToken(token);
    if (authContext) {
      (req as AuthedRequest).authContext = authContext;
      return;
    }
  }

  const limit = apiAuthLimiter.check(rateLimitKey(req, 'api-auth'));
  if (!limit.allowed) {
    sendRateLimited(reply, limit.retry_after_seconds);
    return;
  }
  if (!configured && !token) {
    reply.code(503).send({ error: 'api_auth_not_configured' });
    return;
  }
  reply.code(401).send({ error: 'unauthorized' });
}

function requireWebhookSecret(req: FastifyRequest, reply: FastifyReply, done: () => void) {
  const configured = configuredSecret(process.env.ECHO_EMAIL_WEBHOOK_SECRET);
  if (!configured) {
    reply.code(503).send({ error: 'internal_webhook_auth_not_configured' });
    return;
  }
  const header = req.headers['x-echo-email-webhook-secret'];
  if (header !== configured) {
    reply.code(401).send({ error: 'invalid webhook secret' });
    return;
  }
  done();
}

function tenantIdFor(req: FastifyRequest) {
  return (req as AuthedRequest).authContext?.tenantId ?? TENANT_ID;
}

type TenantBillingRow = {
  id: string;
  name: string;
  plan: string;
  billing_status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

async function getTenantBilling(tenantId: string) {
  const result = await query<TenantBillingRow>(
    'SELECT id, name, plan, billing_status, stripe_customer_id, stripe_subscription_id FROM tenants WHERE id = $1',
    [tenantId],
  );
  return result.rows[0] ?? null;
}

async function maxInboxesForTenant(tenantId: string) {
  const tenant = await getTenantBilling(tenantId);
  return maxInboxesForPlan(tenant?.plan ?? 'free');
}

async function maxWebhookEndpointsForTenant(tenantId: string) {
  const tenant = await getTenantBilling(tenantId);
  return maxWebhookEndpointsForPlan(tenant?.plan ?? 'free');
}

function defaultBillingSuccessUrl() {
  return process.env.STRIPE_SUCCESS_URL ?? `${process.env.PUBLIC_BASE_URL ?? 'https://api.reverbin.com'}/docs/quickstart?billing=success`;
}

function defaultBillingCancelUrl() {
  return process.env.STRIPE_CANCEL_URL ?? 'https://reverbin.com/#pricing';
}

function planFromStripePrice(priceId?: string | null): BillingPlan | null {
  if (priceId && priceId === process.env.STRIPE_DEVELOPER_PRICE_ID) return 'developer';
  if (priceId && priceId === process.env.STRIPE_STARTUP_PRICE_ID) return 'startup';
  return null;
}

async function syncStripeSubscriptionEvent(subscription: any, deleted = false) {
  const metadataPlan = normalizePlan(subscription?.metadata?.plan);
  const pricePlan = planFromStripePrice(subscription?.items?.data?.[0]?.price?.id);
  const tenantId = subscription?.metadata?.tenant_id;
  if (!tenantId) return false;
  const nextPlan = deleted ? 'free' : (pricePlan ?? metadataPlan);
  const currentPeriodEnd = typeof subscription?.current_period_end === 'number' ? new Date(subscription.current_period_end * 1000) : null;
  await query(
    `UPDATE tenants
     SET plan = $2,
         billing_status = $3,
         stripe_customer_id = COALESCE($4, stripe_customer_id),
         stripe_subscription_id = COALESCE($5, stripe_subscription_id),
         billing_current_period_end = $6
     WHERE id = $1`,
    [tenantId, nextPlan, deleted ? 'canceled' : String(subscription?.status ?? 'active'), subscription?.customer ?? null, subscription?.id ?? null, currentPeriodEnd],
  );
  await audit(deleted ? 'billing.subscription_deleted' : 'billing.subscription_updated', 'tenant', tenantId, { plan: nextPlan, stripe_subscription_id: subscription?.id, status: subscription?.status }, 'stripe', null, tenantId);
  return true;
}

async function audit(action: string, targetType: string, targetId: string, metadata: Record<string, unknown> = {}, actorType = 'system', actorId?: string | null, tenantId = TENANT_ID) {
  await query(
    `INSERT INTO audit_logs (id, tenant_id, actor_type, actor_id, action, target_type, target_id, metadata_json)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)`,
    [id('aud'), tenantId, actorType, actorId ?? null, action, targetType, targetId, JSON.stringify(metadata)],
  );
}

async function publishWebhookEvent(eventType: WebhookEventType, data: Record<string, unknown>, tenantId = TENANT_ID) {
  const endpoints = await query<WebhookEndpointRow>(
    `SELECT id, url, secret, events_json, status FROM webhook_endpoints WHERE tenant_id = $1 AND status = 'active'`,
    [tenantId],
  );
  const payload = buildWebhookEventPayload(eventType, data);
  const payloadJson = JSON.stringify(payload);

  await Promise.all(endpoints.rows.filter((endpoint) => shouldDeliverWebhookEvent(endpoint, eventType)).map(async (endpoint) => {
    const deliveryId = id('whd');
    await query(
      `INSERT INTO webhook_deliveries (id, tenant_id, endpoint_id, event_type, payload_json, status)
       VALUES ($1,$2,$3,$4,$5::jsonb,'pending')`,
      [deliveryId, tenantId, endpoint.id, eventType, payloadJson],
    );

    if (webhookDeliveryMode() === 'queue') {
      const job = buildWebhookDeliveryJob({
        id: deliveryId,
        endpoint_id: endpoint.id,
        url: endpoint.url,
        secret: endpoint.secret,
        event_type: eventType,
        payload_json: payload,
      });
      await getWebhookQueue().add(job.name, job.data, job.options);
      return;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), webhookDeliveryTimeoutMs());
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: buildWebhookDeliveryHeaders({ eventType, deliveryId, payload: payloadJson, secret: endpoint.secret }),
        body: payloadJson,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await query(
        `UPDATE webhook_deliveries SET status = 'delivered', attempts = attempts + 1, delivered_at = now(), last_error = NULL WHERE id = $1`,
        [deliveryId],
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown webhook delivery error';
      await query(
        `UPDATE webhook_deliveries SET status = 'failed', attempts = attempts + 1, last_error = $2 WHERE id = $1`,
        [deliveryId, message.slice(0, 500)],
      );
      app.log.warn({ delivery_id: deliveryId, endpoint_id: endpoint.id, event_type: eventType, error: message }, 'webhook delivery failed');
    }
  }));
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

const ComposeMessageSchema = z.object({
  inbox_id: z.string().min(1),
  to: z.array(z.string().email()).min(1),
  subject: z.string().trim().min(1).max(240),
  text: z.string().trim().min(1),
  html: z.string().nullable().optional(),
  attachments: z.array(z.unknown()).optional(),
});

const ForwardMessageSchema = z.object({
  to: z.array(z.string().email()).min(1),
  subject: z.string().trim().min(1).max(240),
  text: z.string().trim().min(1),
  html: z.string().nullable().optional(),
  attachments: z.array(z.unknown()).optional(),
});

const WebhookEndpointSchema = z.object({
  url: z.string().url().refine(isAllowedWebhookUrl, 'webhook url must use https, except loopback http for local testing'),
  events: z.array(z.string().min(1).refine(isAllowedWebhookEvent, 'unsupported webhook event')).default(['*']),
  secret: z.string().min(8).optional(),
});

const MailSettingsFormSchema = z.object({
  inbox_id: z.string().min(1),
  display_name: z.string().max(120).optional(),
  reply_only: z.boolean(),
  require_approval_for_new_recipients: z.boolean(),
  require_approval_for_external_domains: z.boolean(),
  max_outbound_per_hour: z.number().int().positive().max(10000),
  max_outbound_per_day: z.number().int().positive().max(100000),
  allowed_domains: z.array(z.string()),
  blocked_domains: z.array(z.string()),
  blocked_recipients: z.array(z.string().email()),
  allow_attachments: z.boolean(),
  allow_links: z.boolean(),
  risk_threshold: z.enum(['low', 'medium', 'high']),
});

const MailWebhookFormSchema = z.object({
  url: z.string().url().refine(isAllowedWebhookUrl, 'webhook url must use https, except loopback http for local testing'),
  events: z.array(z.string().min(1).refine(isAllowedWebhookEvent, 'unsupported webhook event')).min(1),
  secret: z.string().min(8).optional(),
});

function formField(value: unknown) {
  if (Array.isArray(value)) return String(value[0] ?? '').trim();
  return String(value ?? '').trim();
}

function formBool(value: unknown) {
  return value === true || value === 'true' || value === 'on' || value === '1';
}

function formList(value: unknown) {
  return formField(value).split(/[\n,]/).map((item) => item.trim().toLowerCase()).filter(Boolean);
}

function formEvents(value: unknown) {
  const raw = Array.isArray(value) ? value : [value];
  return raw.flatMap((item) => String(item ?? '').split(',')).map((item) => item.trim()).filter(Boolean);
}

function parseMailSettingsForm(body: unknown) {
  const input = (body ?? {}) as Record<string, unknown>;
  return MailSettingsFormSchema.parse({
    inbox_id: formField(input.inbox_id),
    display_name: formField(input.display_name),
    reply_only: formBool(input.reply_only),
    require_approval_for_new_recipients: formBool(input.require_approval_for_new_recipients),
    require_approval_for_external_domains: formBool(input.require_approval_for_external_domains),
    max_outbound_per_hour: Number(formField(input.max_outbound_per_hour)),
    max_outbound_per_day: Number(formField(input.max_outbound_per_day)),
    allowed_domains: formList(input.allowed_domains),
    blocked_domains: formList(input.blocked_domains),
    blocked_recipients: formList(input.blocked_recipients),
    allow_attachments: formBool(input.allow_attachments),
    allow_links: formBool(input.allow_links),
    risk_threshold: formField(input.risk_threshold) || 'medium',
  });
}

function parseMailWebhookForm(body: unknown) {
  const input = (body ?? {}) as Record<string, unknown>;
  const secret = formField(input.secret);
  return MailWebhookFormSchema.parse({
    url: formField(input.url),
    events: formEvents(input.events),
    secret: secret || undefined,
  });
}

function formRecipients(value: unknown) {
  return formField(value).split(/[\n,;]/).map((item) => normalizeEmail(item)).filter(Boolean);
}

function parseMailComposeForm(body: unknown) {
  const input = (body ?? {}) as Record<string, unknown>;
  const html = formField(input.html);
  return ComposeMessageSchema.parse({
    inbox_id: formField(input.inbox_id),
    to: formRecipients(input.to),
    subject: formField(input.subject),
    text: formField(input.text),
    html: html || undefined,
  });
}

function parseMailForwardForm(body: unknown) {
  const input = (body ?? {}) as Record<string, unknown>;
  const html = formField(input.html);
  return ForwardMessageSchema.parse({
    to: formRecipients(input.to),
    subject: formField(input.subject),
    text: formField(input.text),
    html: html || undefined,
  });
}

const BillingCheckoutSchema = z.object({
  plan: z.enum(['developer', 'startup']),
  success_url: z.string().url().optional(),
  cancel_url: z.string().url().optional(),
});

const BillingPortalSchema = z.object({
  return_url: z.string().url().optional(),
});

const SignupRequestSchema = z.object({
  requester_email: z.string().email(),
  requester_name: z.string().optional(),
  agent_use_case: z.string().min(8).max(2000),
  preferred_inbox_name: z.string().min(1).max(80).optional(),
  webhook_url: z.string().url().refine(isAllowedWebhookUrl, 'webhook url must use https, except loopback http for local testing').optional(),
  notes: z.string().max(2000).optional(),
});

const AutomatedAgentSignupSchema = z.object({
  requester_email: z.string().email(),
  agent_name: z.string().min(2).max(120),
  agent_use_case: z.string().min(8).max(2000),
  preferred_inbox_name: z.string().min(1).max(80),
  webhook_url: z.string().url().refine(isAllowedWebhookUrl, 'webhook url must use https, except loopback http for local testing').optional(),
});

const DashboardLoginCodeRequestSchema = z.object({
  email: z.string().email(),
});

const DashboardLoginCodeVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/),
});

const SignupVerificationCheckSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  required: z.boolean(),
  status: z.enum(['pending', 'passed', 'failed']),
  evidence: z.string().max(1000).optional(),
});

const SignupRequestUpdateSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'provisioned']).optional(),
  verification: z.array(SignupVerificationCheckSchema).optional(),
  notes: z.string().max(2000).optional(),
});

type WebhookEndpointRow = {
  id: string;
  url: string;
  secret: string | null;
  events_json: unknown;
  status: string;
};

type InboundEmail = z.infer<typeof InboundSchema>;

async function storeInboundEmail(body: InboundEmail) {
  const inboxResult = body.inbox_id
    ? await query<any>('SELECT * FROM inboxes WHERE id = $1', [body.inbox_id])
    : await query<any>('SELECT * FROM inboxes WHERE email_address = $1', [normalizeEmail(body.email_address ?? body.to[0].email)]);
  if (inboxResult.rowCount === 0) return null;
  const inbox = inboxResult.rows[0];
  const tenantId = inbox.tenant_id;
  const threadId = id('thr');
  const messageId = id('msg');
  await tx(async (client) => {
    await client.query(
      `INSERT INTO provider_events (id, provider, event_type, payload_json) VALUES ($1,$2,'email.received',$3::jsonb)`,
      [id('pevt'), body.provider, JSON.stringify(body)],
    );
    await client.query(
      `INSERT INTO threads (id, tenant_id, inbox_id, subject, last_message_at) VALUES ($1,$2,$3,$4,now())`,
      [threadId, tenantId, inbox.id, body.subject],
    );
    await client.query(
      `INSERT INTO messages (id, tenant_id, inbox_id, thread_id, provider_message_id, direction, from_email, from_name, to_json, cc_json, bcc_json, subject, text_body, html_body, raw_mime_storage_key, headers_json, received_at)
       VALUES ($1,$2,$3,$4,$5,'inbound',$6,$7,$8::jsonb,$9::jsonb,$10::jsonb,$11,$12,$13,$14,$15::jsonb,now())`,
      [messageId, tenantId, inbox.id, threadId, body.provider_message_id ?? null, normalizeEmail(body.from.email), body.from.name ?? null,
        JSON.stringify(body.to), JSON.stringify(body.cc ?? []), JSON.stringify(body.bcc ?? []), body.subject, body.text,
        body.html ?? null, body.raw_mime_storage_key ?? null, JSON.stringify(body.headers ?? {})],
    );
  });
  await audit('email.received', 'message', messageId, { inbox_id: inbox.id, thread_id: threadId, from: body.from.email }, 'system', null, tenantId);
  await publishWebhookEvent('email.received', { inbox_id: inbox.id, thread_id: threadId, message_id: messageId, from: normalizeEmail(body.from.email), subject: body.subject }, inbox.tenant_id);
  return { inbox_id: inbox.id, thread_id: threadId, message_id: messageId, event: 'email.received' };
}

type ThreadReplyBody = z.infer<typeof ReplySchema>;
type ComposeMessageBody = z.infer<typeof ComposeMessageSchema>;
type ForwardMessageBody = z.infer<typeof ForwardMessageSchema>;
type ThreadReplyResult = {
  statusCode: 200 | 202 | 400 | 403 | 404;
  payload: Record<string, unknown>;
};

async function sendThreadReply(threadId: string, body: ThreadReplyBody, authContext?: AuthContext): Promise<ThreadReplyResult> {
  const threadResult = authContext?.operator || !authContext
    ? await query<any>('SELECT * FROM threads WHERE id = $1 AND deleted_at IS NULL', [threadId])
    : await query<any>('SELECT * FROM threads WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL', [threadId, authContext.tenantId]);
  if (threadResult.rowCount === 0) return { statusCode: 404, payload: { error: 'thread not found' } };
  const thread = threadResult.rows[0];
  const inboxResult = await query<any>('SELECT * FROM inboxes WHERE id = $1', [thread.inbox_id]);
  const inbox = inboxResult.rows[0];
  const tenantId = inbox.tenant_id;
  const recipients = body.to?.map(normalizeEmail) ?? (await query<any>(
    `SELECT from_email FROM messages WHERE thread_id = $1 AND direction = 'inbound' ORDER BY created_at DESC LIMIT 1`,
    [thread.id],
  )).rows.map((row) => normalizeEmail(row.from_email));
  if (recipients.length === 0) return { statusCode: 400, payload: { error: 'no recipient available for reply' } };

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
    return { statusCode: 403, payload: { error: 'policy blocked send', ...decision } };
  }

  if (decision.decision === 'require_approval') {
    const approvalId = id('apr');
    await query(
      `INSERT INTO approval_requests (id, tenant_id, inbox_id, agent_id, thread_id, proposed_to_json, subject, body_text, body_html, risk_flags_json, policy_reasons_json)
       VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9,$10::jsonb,$11::jsonb)`,
      [approvalId, tenantId, inbox.id, inbox.agent_id, thread.id, JSON.stringify(recipients), body.subject ?? `Re: ${thread.subject}`,
        body.text, body.html ?? null, JSON.stringify(decision.risk_flags), JSON.stringify(decision.reasons)],
    );
    await audit('approval.required', 'approval', approvalId, { thread_id: thread.id, decision }, 'system', authContext?.apiKeyId, tenantId);
    await publishWebhookEvent('approval.required', { approval_id: approvalId, inbox_id: inbox.id, thread_id: thread.id, to: recipients, subject: body.subject ?? `Re: ${thread.subject}`, risk_flags: decision.risk_flags, reasons: decision.reasons }, tenantId);
    return { statusCode: 202, payload: { approval_id: approvalId, status: 'pending', ...decision } };
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
    [messageId, tenantId, inbox.id, thread.id, sendResult.provider_message_id, inbox.email_address, JSON.stringify(recipients), body.subject ?? `Re: ${thread.subject}`, body.text, body.html ?? null, JSON.stringify(decision.risk_flags)],
  );
  await audit('email.sent', 'message', messageId, { provider_result: sendResult }, authContext ? 'api' : 'human', authContext?.apiKeyId, tenantId);
  await publishWebhookEvent('email.sent', { inbox_id: inbox.id, thread_id: thread.id, message_id: messageId, to: recipients, subject: body.subject ?? `Re: ${thread.subject}`, risk_flags: decision.risk_flags }, inbox.tenant_id);
  return { statusCode: 200, payload: { message_id: messageId, provider_result: sendResult } };
}

async function sendThreadForward(threadId: string, body: ForwardMessageBody, authContext?: AuthContext): Promise<ThreadReplyResult> {
  const result = await sendThreadReply(threadId, { to: body.to, subject: body.subject, text: body.text, html: body.html, attachments: body.attachments }, authContext);
  if (result.statusCode === 200) {
    const tenantId = authContext?.tenantId;
    await audit('email.forwarded', 'thread', threadId, { message_id: result.payload.message_id, to: body.to, subject: body.subject }, 'human', authContext?.apiKeyId, tenantId);
  }
  return result;
}

async function deleteMailThread(threadId: string, authContext?: AuthContext) {
  const result = authContext?.operator || !authContext
    ? await query<any>(
      `UPDATE threads
       SET deleted_at = now(), updated_at = now()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, inbox_id, tenant_id`,
      [threadId],
    )
    : await query<any>(
      `UPDATE threads
       SET deleted_at = now(), updated_at = now()
       WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
       RETURNING id, inbox_id, tenant_id`,
      [threadId, authContext.tenantId],
    );
  if (result.rowCount === 0) return null;
  const thread = result.rows[0];
  await audit('mail.thread_deleted', 'thread', thread.id, { inbox_id: thread.inbox_id }, 'human', authContext?.apiKeyId, thread.tenant_id);
  return thread;
}

async function loadMailThreadForConsole(threadId: string, authContext?: AuthContext) {
  const threadResult = authContext?.operator || !authContext
    ? await query<any>('SELECT id, inbox_id, subject, last_message_at FROM threads WHERE id = $1 AND deleted_at IS NULL', [threadId])
    : await query<any>('SELECT id, inbox_id, subject, last_message_at FROM threads WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL', [threadId, authContext.tenantId]);
  if (threadResult.rowCount === 0) return null;
  const thread = threadResult.rows[0];
  const tenantId = authContext?.operator || !authContext ? undefined : authContext.tenantId;
  const messages = await query<any>(
    `SELECT id, thread_id, direction, from_email, from_name, to_json, subject, text_body, html_body, coalesce(sent_at, received_at, created_at) AS created_at
     FROM messages
     WHERE thread_id = $1${tenantId ? ' AND tenant_id = $2' : ''}
     ORDER BY created_at ASC`,
    tenantId ? [threadId, tenantId] : [threadId],
  );
  return { thread, messages: messages.rows };
}

async function sendNewThread(body: ComposeMessageBody, authContext?: AuthContext): Promise<ThreadReplyResult> {
  const inboxResult = authContext?.operator || !authContext
    ? await query<any>('SELECT * FROM inboxes WHERE id = $1', [body.inbox_id])
    : await query<any>('SELECT * FROM inboxes WHERE id = $1 AND tenant_id = $2', [body.inbox_id, authContext.tenantId]);
  if (inboxResult.rowCount === 0) return { statusCode: 404, payload: { error: 'inbox not found' } };

  const inbox = inboxResult.rows[0];
  const tenantId = inbox.tenant_id;
  const recipients = body.to.map(normalizeEmail);
  const policy = await getPolicy(inbox.id);
  const decision = evaluatePolicy(policy, {
    to: recipients,
    bodyText: body.text,
    bodyHtml: body.html,
    attachments: body.attachments,
    isNewThread: true,
    knownRecipientEmails: await knownRecipients(inbox.id),
    sentLastHour: await countOutbound(inbox.id, '1 hour'),
    sentLastDay: await countOutbound(inbox.id, '1 day'),
  });

  if (decision.decision === 'block') {
    await audit('policy.blocked', 'inbox', inbox.id, { decision, to: recipients, subject: body.subject }, 'human', authContext?.apiKeyId, tenantId);
    return { statusCode: 403, payload: { error: 'policy blocked send', ...decision } };
  }

  const threadId = id('thr');
  if (decision.decision === 'require_approval') {
    const approvalId = id('apr');
    await tx(async (client) => {
      await client.query(
        `INSERT INTO threads (id, tenant_id, inbox_id, subject, last_message_at) VALUES ($1,$2,$3,$4,now())`,
        [threadId, tenantId, inbox.id, body.subject],
      );
      await client.query(
        `INSERT INTO approval_requests (id, tenant_id, inbox_id, agent_id, thread_id, proposed_to_json, subject, body_text, body_html, risk_flags_json, policy_reasons_json)
         VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9,$10::jsonb,$11::jsonb)`,
        [approvalId, tenantId, inbox.id, inbox.agent_id, threadId, JSON.stringify(recipients), body.subject,
          body.text, body.html ?? null, JSON.stringify(decision.risk_flags), JSON.stringify(decision.reasons)],
      );
    });
    await audit('approval.required', 'approval', approvalId, { thread_id: threadId, decision }, 'system', authContext?.apiKeyId, tenantId);
    await publishWebhookEvent('approval.required', { approval_id: approvalId, inbox_id: inbox.id, thread_id: threadId, to: recipients, subject: body.subject, risk_flags: decision.risk_flags, reasons: decision.reasons }, tenantId);
    return { statusCode: 202, payload: { thread_id: threadId, approval_id: approvalId, status: 'pending', ...decision } };
  }

  const provider = getEmailProvider();
  const sendResult = await provider.sendEmail({
    from: process.env.RESEND_FROM_EMAIL || inbox.email_address || process.env.DEFAULT_FROM_EMAIL,
    to: recipients,
    subject: body.subject,
    text: body.text,
    html: body.html,
  });
  const messageId = id('msg');
  await tx(async (client) => {
    await client.query(
      `INSERT INTO threads (id, tenant_id, inbox_id, subject, last_message_at) VALUES ($1,$2,$3,$4,now())`,
      [threadId, tenantId, inbox.id, body.subject],
    );
    await client.query(
      `INSERT INTO messages (id, tenant_id, inbox_id, thread_id, provider_message_id, direction, from_email, to_json, subject, text_body, html_body, risk_flags_json, sent_at)
       VALUES ($1,$2,$3,$4,$5,'outbound',$6,$7::jsonb,$8,$9,$10,$11::jsonb,now())`,
      [messageId, tenantId, inbox.id, threadId, sendResult.provider_message_id, inbox.email_address, JSON.stringify(recipients), body.subject, body.text, body.html ?? null, JSON.stringify(decision.risk_flags)],
    );
  });
  await audit('email.sent', 'message', messageId, { provider_result: sendResult, composed: true }, authContext ? 'api' : 'human', authContext?.apiKeyId, tenantId);
  await publishWebhookEvent('email.sent', { inbox_id: inbox.id, thread_id: threadId, message_id: messageId, to: recipients, subject: body.subject, risk_flags: decision.risk_flags }, tenantId);
  return { statusCode: 200, payload: { thread_id: threadId, message_id: messageId, provider_result: sendResult } };
}

app.get('/health', async () => ({
  ok: true,
  service: 'agent-email-layer',
  version: '0.1.0',
  provider: process.env.EMAIL_PROVIDER ?? 'mock',
  public_base_url: process.env.PUBLIC_BASE_URL ?? `http://${HOST}:${PORT}`,
}));

async function checkRedisReady() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) throw new Error('REDIS_URL is required when WEBHOOK_DELIVERY_MODE=queue');
  const redis = new Redis(redisConnectionOptions(redisUrl));
  try {
    await redis.ping();
  } finally {
    redis.disconnect();
  }
}

app.get('/readyz', async (req, reply) => {
  const result = await checkReadiness({
    checkDb: () => query('SELECT 1'),
    checkRedis: checkRedisReady,
  });
  if (result.statusCode !== 200) {
    req.log.warn({ readyz: result.body }, 'readiness check failed');
    reply.code(result.statusCode);
  }
  return result.body;
});

app.get('/', async (_req, reply) => {
  reply.type('text/html').send(renderLandingPage());
});

app.get('/signup', async (_req, reply) => {
  reply.type('text/html').send(renderSignupPage());
});

app.get('/favicon.ico', async (_req, reply) => {
  reply.header('cache-control', 'public, max-age=86400').type('image/svg+xml').send(renderFaviconSvg());
});

app.get('/favicon.svg', async (_req, reply) => {
  reply.header('cache-control', 'public, max-age=86400').type('image/svg+xml').send(renderFaviconSvg());
});

app.get('/llms.txt', async (_req, reply) => {
  const body = await readFile(LLMS_TXT_PATH, 'utf8');
  reply.header('cache-control', 'public, max-age=300').type('text/plain; charset=utf-8').send(body);
});

async function sendDocsPage(reply: FastifyReply, page: DocsPageKey) {
  const markdown = page === 'overview' ? undefined : await readFile(DOCS_MARKDOWN_PATHS[page], 'utf8');
  reply.header('cache-control', 'public, max-age=300').type('text/html').send(renderDocsPage(page, markdown));
}

app.get('/docs', async (_req, reply) => {
  await sendDocsPage(reply, 'overview');
});

app.get('/docs/quickstart', async (_req, reply) => {
  await sendDocsPage(reply, 'quickstart');
});

app.get('/docs/api', async (_req, reply) => {
  await sendDocsPage(reply, 'api');
});

app.get('/docs/agents', async (_req, reply) => {
  await sendDocsPage(reply, 'agents');
});

app.get('/dashboard/login', async (_req, reply) => {
  reply.type('text/html').send(renderDashboardLoginPage());
});

app.post('/dashboard/login/request-code', async (req, reply) => {
  const limit = dashboardLoginLimiter.check(rateLimitKey(req, 'dashboard-login-code'));
  if (!limit.allowed) {
    sendRateLimited(reply, limit.retry_after_seconds, true);
    return;
  }
  const parsed = DashboardLoginCodeRequestSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    reply.code(400).type('text/html').send(renderDashboardLoginPage('Enter the email address you used to sign up.'));
    return;
  }
  const email = normalizeEmail(parsed.data.email);
  const signup = await query<{ tenant_id: string; requester_email: string }>(
    "SELECT tenant_id, requester_email FROM signup_requests WHERE requester_email = $1 AND status = 'provisioned' ORDER BY created_at DESC LIMIT 1",
    [email],
  );
  if (signup.rows.length > 0) {
    const tenantId = signup.rows[0].tenant_id;
    const code = generateDashboardLoginCode();
    await query(
      `INSERT INTO dashboard_login_codes (id, tenant_id, requester_email, code_hash, expires_at)
       VALUES ($1,$2,$3,$4,now() + interval '10 minutes')`,
      [id('dlc'), tenantId, email, hashLoginSecret(code)],
    );
    await sendDashboardLoginCode(email, code);
    await audit('dashboard.login_code_requested', 'tenant', tenantId, { requester_email: email }, 'human', null, tenantId);
  }
  reply.type('text/html').send(renderDashboardLoginPage('', 'If that email has a Reverbin account, we sent a sign-in code.', email));
});

app.post('/dashboard/login/verify', async (req, reply) => {
  const limit = dashboardLoginLimiter.check(rateLimitKey(req, 'dashboard-login-verify'));
  if (!limit.allowed) {
    sendRateLimited(reply, limit.retry_after_seconds, true);
    return;
  }
  const parsed = DashboardLoginCodeVerifySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    reply.code(400).type('text/html').send(renderDashboardLoginPage('Enter the six-digit code from your email.'));
    return;
  }
  const email = normalizeEmail(parsed.data.email);
  const codeHash = hashLoginSecret(parsed.data.code);
  const codeResult = await query<{ id: string; tenant_id: string }>(
    `SELECT id, tenant_id FROM dashboard_login_codes
     WHERE requester_email = $1 AND code_hash = $2 AND used_at IS NULL AND expires_at > now()
     ORDER BY created_at DESC LIMIT 1`,
    [email, codeHash],
  );
  if (codeResult.rows.length === 0) {
    reply.code(401).type('text/html').send(renderDashboardLoginPage('Invalid or expired sign-in code.', '', email));
    return;
  }
  const codeRow = codeResult.rows[0];
  const used = await query('UPDATE dashboard_login_codes SET used_at = now() WHERE id = $1 AND used_at IS NULL', [codeRow.id]);
  if (used.rowCount !== 1) {
    reply.code(401).type('text/html').send(renderDashboardLoginPage('Invalid or expired sign-in code.', '', email));
    return;
  }
  const sessionToken = generateDashboardSessionToken();
  await query(
    `INSERT INTO dashboard_sessions (id, tenant_id, session_hash, expires_at)
     VALUES ($1,$2,$3,now() + interval '12 hours')`,
    [id('ds'), codeRow.tenant_id, hashLoginSecret(sessionToken)],
  );
  await audit('dashboard.login_code_verified', 'tenant', codeRow.tenant_id, { requester_email: email }, 'human', null, codeRow.tenant_id);
  reply.header('set-cookie', dashboardSessionCookie(sessionToken));
  reply.redirect('/mail');
});

app.post('/dashboard/login', async (req, reply) => {
  const body = req.body as { token?: string } | undefined;
  const candidate = body?.token ?? '';
  const authContext = await validateDashboardLoginToken(candidate);
  if (authContext) {
    reply.header('set-cookie', dashboardCookie(candidate, { secure: dashboardCookieIsSecure() }));
    reply.redirect(authContext.operator ? '/dashboard' : '/mail');
    return;
  }
  const limit = dashboardLoginLimiter.check(rateLimitKey(req, 'dashboard-login'));
  if (!limit.allowed) {
    sendRateLimited(reply, limit.retry_after_seconds, true);
    return;
  }
  reply.code(401).type('text/html').send(renderDashboardLoginPage('Invalid API key or operator token.'));
});

app.get('/dashboard/logout', async (_req, reply) => {
  reply.header('set-cookie', clearDashboardCookie());
  reply.redirect('/dashboard/login');
});

app.get<{ Querystring: { inbox_id?: string; thread_id?: string; notice?: string } }>('/mail', { preHandler: requireDashboardAuth }, async (req, reply) => {
  try {
    const authContext = (req as AuthedRequest).authContext;
    const mailTenantId = authContext?.operator ? undefined : authContext?.tenantId;
    const inboxes = mailTenantId ? await query<any>(
      `SELECT i.id, i.email_address, i.display_name, i.status, count(t.id)::int AS thread_count
       FROM inboxes i
       LEFT JOIN threads t ON t.inbox_id = i.id AND t.tenant_id = i.tenant_id AND t.deleted_at IS NULL
       WHERE i.tenant_id = $1
       GROUP BY i.id, i.email_address, i.display_name, i.status, i.created_at
       ORDER BY i.created_at DESC
       LIMIT 50`,
      [mailTenantId],
    ) : await query<any>(
      `SELECT i.id, i.email_address, i.display_name, i.status, count(t.id)::int AS thread_count
       FROM inboxes i
       LEFT JOIN threads t ON t.inbox_id = i.id AND t.deleted_at IS NULL
       GROUP BY i.id, i.email_address, i.display_name, i.status, i.created_at
       ORDER BY i.created_at DESC
       LIMIT 50`,
    );

    const threadFromQuery = req.query.thread_id
      ? mailTenantId
        ? await query<any>('SELECT id, inbox_id, subject, last_message_at FROM threads WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL', [req.query.thread_id, mailTenantId])
        : await query<any>('SELECT id, inbox_id, subject, last_message_at FROM threads WHERE id = $1 AND deleted_at IS NULL', [req.query.thread_id])
      : null;
    const selectedThreadFromQuery = threadFromQuery?.rows[0] ?? null;
    const selectedInboxId = req.query.inbox_id ?? selectedThreadFromQuery?.inbox_id ?? inboxes.rows[0]?.id ?? null;

    const threads = selectedInboxId
      ? await query<any>(
        `SELECT t.id,
                t.inbox_id,
                t.subject,
                t.last_message_at,
                lm.from_email AS last_from_email,
                lm.direction AS last_direction,
                left(coalesce(lm.text_body, lm.html_body, ''), 180) AS last_preview,
                count(m.id)::int AS message_count
         FROM threads t
         LEFT JOIN LATERAL (
           SELECT from_email, direction, text_body, html_body, created_at
           FROM messages
           WHERE thread_id = t.id${mailTenantId ? ' AND tenant_id = $2' : ''}
           ORDER BY created_at DESC
           LIMIT 1
         ) lm ON true
         LEFT JOIN messages m ON m.thread_id = t.id${mailTenantId ? ' AND m.tenant_id = t.tenant_id' : ''}
         WHERE t.inbox_id = $1 AND t.deleted_at IS NULL${mailTenantId ? ' AND t.tenant_id = $2' : ''}
         GROUP BY t.id, t.inbox_id, t.subject, t.last_message_at, lm.from_email, lm.direction, lm.text_body, lm.html_body
         ORDER BY t.last_message_at DESC
         LIMIT 100`,
        mailTenantId ? [selectedInboxId, mailTenantId] : [selectedInboxId],
      )
      : { rows: [] };

    const selectedThreadId = req.query.thread_id ?? threads.rows[0]?.id ?? null;
    const selectedThread = threads.rows.find((thread: any) => thread.id === selectedThreadId) ?? selectedThreadFromQuery;
    const messages = selectedThreadId
      ? await query<any>(
        `SELECT id, thread_id, direction, from_email, from_name, to_json, subject, text_body, html_body, coalesce(sent_at, received_at, created_at) AS created_at
         FROM messages
         WHERE thread_id = $1${mailTenantId ? ' AND tenant_id = $2' : ''}
         ORDER BY created_at ASC`,
        mailTenantId ? [selectedThreadId, mailTenantId] : [selectedThreadId],
      )
      : { rows: [] };

    reply.type('text/html').send(renderMailPage({
      inboxes: inboxes.rows,
      selectedInboxId,
      threads: threads.rows,
      selectedThreadId,
      selectedThread,
      messages: messages.rows,
      notice: req.query.notice,
    }));
  } catch (error) {
    req.log.error(error, 'mail console database query failed');
    reply.code(503).type('text/html').send(renderDashboardUnavailablePage('mail console unavailable'));
  }
});

app.get<{ Querystring: { inbox_id?: string; notice?: string } }>('/mail/compose', { preHandler: requireDashboardAuth }, async (req, reply) => {
  try {
    const tenantId = tenantIdFor(req);
    const inboxes = await query<any>(
      `SELECT i.id, i.email_address, i.display_name, i.status, count(t.id)::int AS thread_count
       FROM inboxes i
       LEFT JOIN threads t ON t.inbox_id = i.id AND t.tenant_id = i.tenant_id AND t.deleted_at IS NULL
       WHERE i.tenant_id = $1
       GROUP BY i.id, i.email_address, i.display_name, i.status, i.created_at
       ORDER BY i.created_at DESC
       LIMIT 50`,
      [tenantId],
    );
    const selectedInboxId = req.query.inbox_id ?? inboxes.rows[0]?.id ?? null;
    reply.type('text/html').send(renderMailComposePage({
      inboxes: inboxes.rows,
      selectedInboxId,
      notice: req.query.notice,
    }));
  } catch (error) {
    req.log.error(error, 'mail compose database query failed');
    reply.code(503).type('text/html').send(renderDashboardUnavailablePage('mail compose unavailable'));
  }
});

app.post('/mail/compose', { preHandler: requireDashboardAuth }, async (req, reply) => {
  const body = parseMailComposeForm(req.body);
  const result = await sendNewThread(body, (req as AuthedRequest).authContext);
  if (result.statusCode === 200) {
    reply.redirect(`/mail?thread_id=${encodeURIComponent(String(result.payload.thread_id))}&notice=compose_sent`);
    return;
  }
  if (result.statusCode === 202) {
    reply.redirect(`/mail?thread_id=${encodeURIComponent(String(result.payload.thread_id))}&notice=compose_pending`);
    return;
  }
  reply.code(result.statusCode).type('text/html').send(renderDashboardUnavailablePage('compose unavailable'));
});

app.get<{ Params: { id: string }; Querystring: { notice?: string } }>('/mail/threads/:id/forward', { preHandler: requireDashboardAuth }, async (req, reply) => {
  try {
    const authContext = (req as AuthedRequest).authContext;
    const loaded = await loadMailThreadForConsole(req.params.id, authContext);
    if (!loaded) {
      reply.code(404).type('text/html').send(renderDashboardUnavailablePage('thread not found'));
      return;
    }
    const tenantId = tenantIdFor(req);
    const inboxes = await query<any>(
      `SELECT i.id, i.email_address, i.display_name, i.status, count(t.id)::int AS thread_count
       FROM inboxes i
       LEFT JOIN threads t ON t.inbox_id = i.id AND t.tenant_id = i.tenant_id AND t.deleted_at IS NULL
       WHERE i.tenant_id = $1
       GROUP BY i.id, i.email_address, i.display_name, i.status, i.created_at
       ORDER BY i.created_at DESC
       LIMIT 50`,
      [tenantId],
    );
    reply.type('text/html').send(renderMailForwardPage({
      inboxes: inboxes.rows,
      selectedInboxId: loaded.thread.inbox_id,
      thread: loaded.thread,
      messages: loaded.messages,
      notice: req.query.notice,
    }));
  } catch (error) {
    req.log.error(error, 'mail forward database query failed');
    reply.code(503).type('text/html').send(renderDashboardUnavailablePage('mail forward unavailable'));
  }
});

app.post<{ Params: { id: string } }>('/mail/threads/:id/forward', { preHandler: requireDashboardAuth }, async (req, reply) => {
  const body = parseMailForwardForm(req.body);
  const result = await sendThreadForward(req.params.id, body, (req as AuthedRequest).authContext);
  if (result.statusCode === 200) {
    reply.redirect(`/mail?thread_id=${encodeURIComponent(req.params.id)}&notice=forward_sent`);
    return;
  }
  if (result.statusCode === 202) {
    reply.redirect(`/mail/threads/${encodeURIComponent(req.params.id)}/forward?notice=forward_pending`);
    return;
  }
  reply.code(result.statusCode).type('text/html').send(renderDashboardUnavailablePage('forward unavailable'));
});

app.post<{ Params: { id: string } }>('/mail/threads/:id/delete', { preHandler: requireDashboardAuth }, async (req, reply) => {
  const deleted = await deleteMailThread(req.params.id, (req as AuthedRequest).authContext);
  if (!deleted) {
    reply.code(404).type('text/html').send(renderDashboardUnavailablePage('thread not found'));
    return;
  }
  reply.redirect(`/mail?inbox_id=${encodeURIComponent(deleted.inbox_id)}&notice=thread_deleted`);
});

app.get<{ Querystring: { inbox_id?: string; notice?: string } }>('/mail/settings', { preHandler: requireDashboardAuth }, async (req, reply) => {
  try {
    const tenantId = tenantIdFor(req);
    const inboxes = await query<any>(
      `SELECT i.id, i.email_address, i.display_name, i.status, count(t.id)::int AS thread_count
       FROM inboxes i
       LEFT JOIN threads t ON t.inbox_id = i.id AND t.tenant_id = i.tenant_id AND t.deleted_at IS NULL
       WHERE i.tenant_id = $1
       GROUP BY i.id, i.email_address, i.display_name, i.status, i.created_at
       ORDER BY i.created_at DESC
       LIMIT 50`,
      [tenantId],
    );
    const selectedInboxId = req.query.inbox_id ?? inboxes.rows[0]?.id ?? null;
    const selectedInbox = selectedInboxId
      ? await query<any>('SELECT id FROM inboxes WHERE id = $1 AND tenant_id = $2', [selectedInboxId, tenantId])
      : { rowCount: 0 };
    const policy = selectedInboxId && selectedInbox.rowCount ? await getPolicy(selectedInboxId) : defaultPolicy;
    reply.type('text/html').send(renderMailSettingsPage({
      inboxes: inboxes.rows,
      selectedInboxId,
      policy,
      notice: req.query.notice,
    }));
  } catch (error) {
    req.log.error(error, 'mail settings database query failed');
    reply.code(503).type('text/html').send(renderDashboardUnavailablePage('mail settings unavailable'));
  }
});

app.post('/mail/settings', { preHandler: requireDashboardAuth }, async (req, reply) => {
  const tenantId = tenantIdFor(req);
  const body = parseMailSettingsForm(req.body);
  const existing = await query<any>('SELECT id FROM inboxes WHERE id = $1 AND tenant_id = $2', [body.inbox_id, tenantId]);
  if (existing.rowCount === 0) {
    reply.code(404).type('text/html').send(renderDashboardUnavailablePage('inbox not found'));
    return;
  }
  await tx(async (client) => {
    await client.query(
      `UPDATE inboxes
       SET display_name = NULLIF($2, ''), updated_at = now()
       WHERE id = $1 AND tenant_id = $3`,
      [body.inbox_id, body.display_name ?? '', tenantId],
    );
    await client.query(
      `UPDATE send_policies
       SET reply_only = $2,
           require_approval_for_new_recipients = $3,
           require_approval_for_external_domains = $4,
           max_outbound_per_hour = $5,
           max_outbound_per_day = $6,
           allowed_domains_json = $7::jsonb,
           blocked_domains_json = $8::jsonb,
           blocked_recipients_json = $9::jsonb,
           allow_attachments = $10,
           allow_links = $11,
           risk_threshold = $12,
           updated_at = now()
       WHERE inbox_id = $1 AND tenant_id = $13`,
      [body.inbox_id, body.reply_only, body.require_approval_for_new_recipients,
        body.require_approval_for_external_domains, body.max_outbound_per_hour, body.max_outbound_per_day,
        JSON.stringify(body.allowed_domains), JSON.stringify(body.blocked_domains), JSON.stringify(body.blocked_recipients),
        body.allow_attachments, body.allow_links, body.risk_threshold, tenantId],
    );
  });
  await audit('mail.settings_updated', 'inbox', body.inbox_id, { display_name: body.display_name, policy: body }, 'human', null, tenantId);
  reply.redirect('/mail/settings?notice=settings_saved');
});

app.get<{ Querystring: { notice?: string } }>('/mail/webhooks', { preHandler: requireDashboardAuth }, async (req, reply) => {
  try {
    const tenantId = tenantIdFor(req);
    const inboxes = await query<any>(
      `SELECT i.id, i.email_address, i.display_name, i.status, count(t.id)::int AS thread_count
       FROM inboxes i
       LEFT JOIN threads t ON t.inbox_id = i.id AND t.tenant_id = i.tenant_id AND t.deleted_at IS NULL
       WHERE i.tenant_id = $1
       GROUP BY i.id, i.email_address, i.display_name, i.status, i.created_at
       ORDER BY i.created_at DESC
       LIMIT 50`,
      [tenantId],
    );
    const webhooks = await query<any>('SELECT id, url, events_json, status, created_at FROM webhook_endpoints WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 50', [tenantId]);
    reply.type('text/html').send(renderMailWebhooksPage({
      inboxes: inboxes.rows,
      webhooks: webhooks.rows,
      notice: req.query.notice,
    }));
  } catch (error) {
    req.log.error(error, 'mail webhooks database query failed');
    reply.code(503).type('text/html').send(renderDashboardUnavailablePage('mail webhooks unavailable'));
  }
});

app.post('/mail/webhooks', { preHandler: requireDashboardAuth }, async (req, reply) => {
  const body = parseMailWebhookForm(req.body);
  const tenantId = tenantIdFor(req);
  const authContext = (req as AuthedRequest).authContext;
  if (!authContext?.operator) {
    const quota = await query<{ webhook_count: number }>("SELECT count(*)::int AS webhook_count FROM webhook_endpoints WHERE tenant_id = $1 AND status = 'active'", [tenantId]);
    const webhookCount = Number(quota.rows[0]?.webhook_count ?? 0);
    const maxWebhooks = await maxWebhookEndpointsForTenant(tenantId);
    if (webhookCount >= maxWebhooks) {
      reply.code(403).type('text/html').send(renderDashboardUnavailablePage('webhook quota exceeded'));
      return;
    }
  }
  const webhookId = id('wh');
  await query(
    `INSERT INTO webhook_endpoints (id, tenant_id, url, secret, events_json)
     VALUES ($1,$2,$3,$4,$5::jsonb)`,
    [webhookId, tenantId, body.url, body.secret ?? null, JSON.stringify(body.events)],
  );
  await audit('webhook.created', 'webhook', webhookId, { url: body.url, events: body.events }, 'human', null, tenantId);
  reply.redirect('/mail/webhooks?notice=webhook_created');
});

app.post<{ Params: { id: string } }>('/mail/threads/:id/reply', { preHandler: requireDashboardAuth }, async (req, reply) => {
  const body = req.body as { text?: string } | undefined;
  const result = await sendThreadReply(req.params.id, ReplySchema.parse({ text: body?.text ?? '' }), (req as AuthedRequest).authContext);
  if (result.statusCode === 200) {
    reply.redirect(`/mail?thread_id=${encodeURIComponent(req.params.id)}&notice=reply_sent`);
    return;
  }
  if (result.statusCode === 202) {
    reply.redirect(`/mail?thread_id=${encodeURIComponent(req.params.id)}&notice=approval_pending`);
    return;
  }
  reply.code(result.statusCode).type('text/html').send(renderDashboardUnavailablePage('reply unavailable'));
});

app.post<{ Params: { id: string } }>('/dashboard/signup-requests/:id/checks', { preHandler: requireDashboardAuth }, async (req, reply) => {
  const body = req.body as { check_key?: string; check_status?: string; status?: string } | undefined;
  const authContext = (req as AuthedRequest).authContext;
  if (!authContext?.operator) {
    reply.code(403).type('text/html').send(renderDashboardUnavailablePage('operator access required'));
    return;
  }
  const existing = await query<any>('SELECT * FROM signup_requests WHERE id = $1', [req.params.id]);
  if (existing.rowCount === 0) {
    reply.code(404).type('text/html').send(renderDashboardUnavailablePage('signup request not found'));
    return;
  }

  const current = existing.rows[0];
  let nextVerification = (current.verification_json ?? []) as SignupVerificationCheck[];
  if (body?.check_key || body?.check_status) {
    const checkKey = z.string().min(1).parse(body?.check_key);
    const checkStatus = z.enum(['pending', 'passed', 'failed']).parse(body?.check_status);
    if (!nextVerification.some((check) => check.key === checkKey)) {
      reply.code(400).type('text/html').send(renderDashboardUnavailablePage('signup verification check not found'));
      return;
    }
    nextVerification = nextVerification.map((check) => check.key === checkKey ? { ...check, status: checkStatus } : check);
  }

  const nextStatus = body?.status
    ? z.enum(['pending', 'approved', 'rejected', 'provisioned']).parse(body.status) as SignupRequestStatus
    : current.status as SignupRequestStatus;
  const summary = summarizeSignupVerification(nextVerification);
  await query(
    `UPDATE signup_requests
     SET status = $2,
         verification_json = $3::jsonb,
         updated_at = now(),
         decided_at = CASE WHEN $2 IN ('approved', 'rejected', 'provisioned') THEN COALESCE(decided_at, now()) ELSE decided_at END
     WHERE id = $1`,
    [req.params.id, nextStatus, JSON.stringify(nextVerification)],
  );
  await audit('signup.dashboard_verification_updated', 'signup_request', req.params.id, { status: nextStatus, summary }, 'human');
  reply.redirect('/dashboard');
});

app.get('/dashboard', { preHandler: requireDashboardAuth }, async (req, reply) => {
  try {
    const authContext = (req as AuthedRequest).authContext;
    const dashboardTenantId = authContext?.operator ? undefined : authContext?.tenantId;
    const [inboxes, messages, deliveries, audits, signupRequests] = dashboardTenantId ? await Promise.all([
      query<any>('SELECT id, email_address, display_name, status, created_at FROM inboxes WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 20', [dashboardTenantId]),
      query<any>('SELECT id, inbox_id, thread_id, direction, from_email, subject, created_at FROM messages WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 20', [dashboardTenantId]),
      query<any>('SELECT id, endpoint_id, event_type, status, attempts, created_at, delivered_at FROM webhook_deliveries WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 20', [dashboardTenantId]),
      query<any>('SELECT action, target_type, target_id, created_at FROM audit_logs WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 30', [dashboardTenantId]),
      query<any>('SELECT id, requester_email, preferred_inbox_name, status, verification_json, created_at FROM signup_requests WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 20', [dashboardTenantId]),
    ]) : await Promise.all([
      query<any>('SELECT id, email_address, display_name, status, created_at FROM inboxes ORDER BY created_at DESC LIMIT 20'),
      query<any>('SELECT id, inbox_id, thread_id, direction, from_email, subject, created_at FROM messages ORDER BY created_at DESC LIMIT 20'),
      query<any>('SELECT id, endpoint_id, event_type, status, attempts, created_at, delivered_at FROM webhook_deliveries ORDER BY created_at DESC LIMIT 20'),
      query<any>('SELECT action, target_type, target_id, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 30'),
      query<any>('SELECT id, requester_email, preferred_inbox_name, status, verification_json, created_at FROM signup_requests ORDER BY created_at DESC LIMIT 20'),
    ]);
    reply.type('text/html').send(renderDashboardPage({
      inboxes: inboxes.rows,
      messages: messages.rows,
      deliveries: deliveries.rows,
      audits: audits.rows,
      signupRequests: signupRequests.rows.map((row: any) => ({ ...row, verification_summary: summarizeSignupVerification(row.verification_json ?? []) })),
    }));
  } catch (error) {
    req.log.error(error, 'dashboard database query failed');
    const message = error instanceof Error ? error.message : 'dashboard unavailable';
    reply.code(503).type('text/html').send(renderDashboardUnavailablePage(message));
  }
});

app.post('/v1/agent-signups', async (req, reply) => {
  const limit = automatedSignupLimiter.check(rateLimitKey(req, 'agent-signup'));
  if (!limit.allowed) {
    sendRateLimited(reply, limit.retry_after_seconds);
    return;
  }
  const body = AutomatedAgentSignupSchema.parse(req.body);
  const localPart = normalizeSelfServeInboxLocalPart(body.preferred_inbox_name);
  const emailAddress = `${localPart}@${SELF_SERVE_INBOX_DOMAIN}`;
  const tenantId = id('ten');
  const agentId = id('agt');
  const signupId = id('sgr');
  const inboxId = id('inb');
  const policyId = id('pol');
  const apiKey = buildApiKeyRecord({ tenantId, name: `${body.agent_name} API key` });
  const webhookId = body.webhook_url ? id('wh') : null;
  const webhookSecret = body.webhook_url ? `rvb_whsec_${randomBytes(24).toString('base64url')}` : null;
  const verification = buildPendingSignupVerification().map((check) => ({
    ...check,
    status: 'passed' as const,
    evidence: 'Automated self-serve provisioning completed.',
  }));
  const policy = defaultPolicy;

  try {
    await tx(async (client) => {
      await client.query('INSERT INTO tenants (id, name) VALUES ($1,$2)', [tenantId, body.agent_name]);
      await client.query('INSERT INTO agents (id, tenant_id, name) VALUES ($1,$2,$3)', [agentId, tenantId, body.agent_name]);
      await client.query(
        `INSERT INTO signup_requests (id, tenant_id, requester_email, requester_name, agent_use_case, preferred_inbox_name, webhook_url, status, verification_json, notes, decided_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'provisioned',$8::jsonb,$9,now())`,
        [signupId, tenantId, normalizeEmail(body.requester_email), body.agent_name, body.agent_use_case, localPart, body.webhook_url ?? null, JSON.stringify(verification), 'Automated self-serve agent signup.'],
      );
      await client.query(
        `INSERT INTO inboxes (id, tenant_id, agent_id, provider_id, email_address, display_name)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [inboxId, tenantId, agentId, process.env.EMAIL_PROVIDER ?? 'mock', emailAddress, body.agent_name],
      );
      await client.query(
        `INSERT INTO send_policies (id, tenant_id, inbox_id, reply_only, require_approval_for_new_recipients,
          require_approval_for_external_domains, max_outbound_per_hour, max_outbound_per_day, allowed_domains_json,
          blocked_domains_json, allowed_recipients_json, blocked_recipients_json, allow_attachments, allow_links, risk_threshold)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11::jsonb,$12::jsonb,$13,$14,$15)`,
        [policyId, tenantId, inboxId, policy.reply_only, policy.require_approval_for_new_recipients,
          policy.require_approval_for_external_domains, policy.max_outbound_per_hour, policy.max_outbound_per_day,
          JSON.stringify(policy.allowed_domains), JSON.stringify(policy.blocked_domains), JSON.stringify(policy.allowed_recipients),
          JSON.stringify(policy.blocked_recipients), policy.allow_attachments, policy.allow_links, policy.risk_threshold],
      );
      await client.query(
        `INSERT INTO api_keys (id, tenant_id, name, key_hash, scopes_json)
         VALUES ($1,$2,$3,$4,$5::jsonb)`,
        [apiKey.id, tenantId, apiKey.name, apiKey.key_hash, JSON.stringify(apiKey.scopes)],
      );
      if (body.webhook_url && webhookId && webhookSecret) {
        await client.query(
          `INSERT INTO webhook_endpoints (id, tenant_id, url, secret, events_json)
           VALUES ($1,$2,$3,$4,$5::jsonb)`,
          [webhookId, tenantId, body.webhook_url, webhookSecret, JSON.stringify(['email.received', 'email.sent', 'approval.required'])],
        );
      }
    });
  } catch (error: any) {
    if (error?.code === '23505') {
      reply.code(409).send({ error: 'inbox_name_unavailable', email_address: emailAddress });
      return;
    }
    throw error;
  }

  await audit('agent_signup.provisioned', 'signup_request', signupId, { inbox_id: inboxId, email_address: emailAddress, webhook_id: webhookId }, 'api', apiKey.id, tenantId);
  reply.code(201).send({
    status: 'provisioned',
    signup_request_id: signupId,
    tenant_id: tenantId,
    agent: { id: agentId, name: body.agent_name },
    inbox: { id: inboxId, email_address: emailAddress, display_name: body.agent_name, status: 'active' },
    api_key: { id: apiKey.id, token: apiKey.token, scopes: apiKey.scopes, returned_once: true },
    webhook: webhookId ? { id: webhookId, url: body.webhook_url, events: ['email.received', 'email.sent', 'approval.required'], secret: webhookSecret, secret_returned_once: true, status: 'active' } : null,
    quickstart: {
      base_url: process.env.PUBLIC_BASE_URL ?? `http://${HOST}:${PORT}`,
      inbox_email: emailAddress,
      next_steps: ['Store the API key in your agent secret store.', 'Send an email to the inbox.', 'Use GET /v1/inboxes/:id/threads and POST /v1/threads/:id/reply.'],
    },
  });
});

app.register(async (privateRoutes) => {
  privateRoutes.addHook('preHandler', requireApiKey);

  privateRoutes.get('/v1/billing/plans', async () => ({ data: Object.values(BILLING_PLANS) }));

  privateRoutes.post('/v1/billing/checkout', async (req, reply) => {
    const body = BillingCheckoutSchema.parse(req.body);
    const tenantId = tenantIdFor(req);
    const tenant = await getTenantBilling(tenantId);
    if (!tenant) return reply.code(404).send({ error: 'tenant not found' });

    const secretKey = configuredSecret(process.env.STRIPE_SECRET_KEY);
    const priceId = priceIdForPlan(body.plan);
    const missing = [
      !secretKey ? 'STRIPE_SECRET_KEY' : null,
      !priceId ? body.plan === 'developer' ? 'STRIPE_DEVELOPER_PRICE_ID' : 'STRIPE_STARTUP_PRICE_ID' : null,
    ].filter(Boolean);
    if (!secretKey || !priceId) {
      return reply.code(503).send({ error: 'stripe_checkout_not_configured', missing });
    }

    const requester = await query<{ requester_email: string }>(
      'SELECT requester_email FROM signup_requests WHERE tenant_id = $1 ORDER BY created_at ASC LIMIT 1',
      [tenantId],
    );
    const session = await createStripeCheckoutSession({
      secretKey,
      plan: body.plan,
      tenantId,
      priceId,
      customerId: tenant.stripe_customer_id,
      customerEmail: requester.rows[0]?.requester_email ?? null,
      successUrl: body.success_url ?? defaultBillingSuccessUrl(),
      cancelUrl: body.cancel_url ?? defaultBillingCancelUrl(),
    });
    await audit('billing.checkout_created', 'tenant', tenantId, { plan: body.plan, stripe_checkout_session_id: session.id }, 'api', (req as AuthedRequest).authContext?.apiKeyId, tenantId);
    if (session.customer) {
      await query('UPDATE tenants SET stripe_customer_id = COALESCE(stripe_customer_id, $2) WHERE id = $1', [tenantId, session.customer]);
    }
    return { id: session.id, url: session.url, plan: body.plan, provider: 'stripe_checkout', link_enabled_by_stripe: true };
  });

  privateRoutes.post('/v1/billing/portal', async (req, reply) => {
    const body = BillingPortalSchema.parse(req.body ?? {});
    const tenantId = tenantIdFor(req);
    const tenant = await getTenantBilling(tenantId);
    const secretKey = configuredSecret(process.env.STRIPE_SECRET_KEY);
    if (!secretKey) return reply.code(503).send({ error: 'stripe_portal_not_configured', missing: ['STRIPE_SECRET_KEY'] });
    if (!tenant?.stripe_customer_id) return reply.code(409).send({ error: 'stripe_customer_missing' });
    const session = await createStripeBillingPortalSession({
      secretKey,
      customerId: tenant.stripe_customer_id,
      returnUrl: body.return_url ?? 'https://reverbin.com/docs',
    });
    await audit('billing.portal_created', 'tenant', tenantId, { stripe_portal_session_id: session.id }, 'api', (req as AuthedRequest).authContext?.apiKeyId, tenantId);
    return { id: session.id, url: session.url, provider: 'stripe_customer_portal' };
  });

  privateRoutes.post('/v1/signup-requests', async (req, reply) => {
    const normalized = normalizeSignupRequestInput(SignupRequestSchema.parse(req.body));
    const tenantId = tenantIdFor(req);
    const signupId = id('sgr');
    const summary = summarizeSignupVerification(normalized.verification_json);
    const result = await query(
      `INSERT INTO signup_requests (id, tenant_id, requester_email, requester_name, agent_use_case, preferred_inbox_name, webhook_url, status, verification_json, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10)
       RETURNING *`,
      [signupId, tenantId, normalized.requester_email, normalized.requester_name ?? null, normalized.agent_use_case,
        normalized.preferred_inbox_name ?? null, normalized.webhook_url ?? null, normalized.status,
        JSON.stringify(normalized.verification_json), normalized.notes ?? null],
    );
    await audit('signup.requested', 'signup_request', signupId, { requester_email: normalized.requester_email, summary }, 'api', (req as AuthedRequest).authContext?.apiKeyId, tenantId);
    reply.code(201).send({ ...result.rows[0], verification_summary: summary });
  });

  privateRoutes.get('/v1/signup-requests', async (req) => {
    const tenantId = tenantIdFor(req);
    const result = await query('SELECT * FROM signup_requests WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100', [tenantId]);
    return { data: result.rows.map((row: any) => ({ ...row, verification_summary: summarizeSignupVerification(row.verification_json ?? []) })) };
  });

  privateRoutes.patch<{ Params: { id: string } }>('/v1/signup-requests/:id', async (req, reply) => {
    const body = SignupRequestUpdateSchema.parse(req.body);
    const tenantId = tenantIdFor(req);
    const existing = await query<any>('SELECT * FROM signup_requests WHERE id = $1 AND tenant_id = $2', [req.params.id, tenantId]);
    if (existing.rowCount === 0) return reply.code(404).send({ error: 'signup request not found' });
    const nextVerification = (body.verification ?? existing.rows[0].verification_json) as SignupVerificationCheck[];
    const nextStatus = (body.status ?? existing.rows[0].status) as SignupRequestStatus;
    const summary = summarizeSignupVerification(nextVerification);
    const result = await query(
      `UPDATE signup_requests
       SET status = $2,
           verification_json = $3::jsonb,
           notes = COALESCE($4, notes),
           updated_at = now(),
           decided_at = CASE WHEN $2 IN ('approved', 'rejected', 'provisioned') THEN COALESCE(decided_at, now()) ELSE decided_at END
       WHERE id = $1 AND tenant_id = $5
       RETURNING *`,
      [req.params.id, nextStatus, JSON.stringify(nextVerification), body.notes ?? null, tenantId],
    );
    await audit('signup.verification_updated', 'signup_request', req.params.id, { status: nextStatus, summary }, 'api', (req as AuthedRequest).authContext?.apiKeyId, tenantId);
    return { ...result.rows[0], verification_summary: summary };
  });

  privateRoutes.post('/v1/inboxes', async (req, reply) => {
    const body = InboxCreateSchema.parse(req.body);
    const authContext = (req as AuthedRequest).authContext;
    const tenantId = tenantIdFor(req);
    if (!authContext?.operator) {
      const quota = await query<{ inbox_count: number }>('SELECT count(*)::int AS inbox_count FROM inboxes WHERE tenant_id = $1', [tenantId]);
      const inboxCount = Number(quota.rows[0]?.inbox_count ?? 0);
      const maxInboxes = await maxInboxesForTenant(tenantId);
      if (inboxCount >= maxInboxes) {
        return reply.code(403).send({
          error: 'inbox_quota_exceeded',
          max_inboxes: maxInboxes,
          current_inboxes: inboxCount,
        });
      }
    }
    const inboxId = id('inb');
    const policyId = id('pol');
    const policy = { ...defaultPolicy, ...(body.policy ?? {}) };
    const email = normalizeEmail(body.email_address);
    await tx(async (client) => {
      await client.query(
        `INSERT INTO inboxes (id, tenant_id, agent_id, provider_id, email_address, display_name)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [inboxId, tenantId, authContext?.operator ? (body.agent_id ?? DEFAULT_AGENT_ID) : null, process.env.EMAIL_PROVIDER ?? 'mock', email, body.display_name ?? null],
      );
      await client.query(
        `INSERT INTO send_policies (id, tenant_id, inbox_id, reply_only, require_approval_for_new_recipients,
          require_approval_for_external_domains, max_outbound_per_hour, max_outbound_per_day, allowed_domains_json,
          blocked_domains_json, allowed_recipients_json, blocked_recipients_json, allow_attachments, allow_links, risk_threshold)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11::jsonb,$12::jsonb,$13,$14,$15)`,
        [policyId, tenantId, inboxId, policy.reply_only, policy.require_approval_for_new_recipients,
          policy.require_approval_for_external_domains, policy.max_outbound_per_hour, policy.max_outbound_per_day,
          JSON.stringify(policy.allowed_domains), JSON.stringify(policy.blocked_domains), JSON.stringify(policy.allowed_recipients),
          JSON.stringify(policy.blocked_recipients), policy.allow_attachments, policy.allow_links, policy.risk_threshold],
      );
    });
    await audit('inbox.created', 'inbox', inboxId, { email_address: email }, 'api', authContext?.apiKeyId, tenantId);
    reply.code(201).send({ id: inboxId, email_address: email, policy });
  });

  privateRoutes.get('/v1/inboxes', async (req) => {
    const result = await query('SELECT * FROM inboxes WHERE tenant_id = $1 ORDER BY created_at DESC', [tenantIdFor(req)]);
    return { data: result.rows };
  });

  privateRoutes.get<{ Params: { id: string } }>('/v1/inboxes/:id', async (req, reply) => {
    const result = await query('SELECT * FROM inboxes WHERE id = $1 AND tenant_id = $2', [req.params.id, tenantIdFor(req)]);
    if (result.rowCount === 0) return reply.code(404).send({ error: 'inbox not found' });
    return result.rows[0];
  });

  privateRoutes.get<{ Params: { id: string } }>('/v1/inboxes/:id/threads', async (req) => {
    const result = await query('SELECT * FROM threads WHERE inbox_id = $1 AND tenant_id = $2 ORDER BY last_message_at DESC', [req.params.id, tenantIdFor(req)]);
    return { data: result.rows };
  });

  privateRoutes.get<{ Params: { id: string } }>('/v1/threads/:id', async (req, reply) => {
    const tenantId = tenantIdFor(req);
    const thread = await query('SELECT * FROM threads WHERE id = $1 AND tenant_id = $2', [req.params.id, tenantId]);
    if (thread.rowCount === 0) return reply.code(404).send({ error: 'thread not found' });
    const messages = await query('SELECT * FROM messages WHERE thread_id = $1 AND tenant_id = $2 ORDER BY created_at ASC', [req.params.id, tenantId]);
    return { ...thread.rows[0], messages: messages.rows };
  });

  privateRoutes.post<{ Params: { id: string } }>('/v1/threads/:id/reply', async (req, reply) => {
    const body = ReplySchema.parse(req.body);
    const result = await sendThreadReply(req.params.id, body, (req as AuthedRequest).authContext);
    return reply.code(result.statusCode).send(result.payload);
  });

  privateRoutes.get('/v1/approvals', async (req) => {
    const result = await query('SELECT * FROM approval_requests WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100', [tenantIdFor(req)]);
    return { data: result.rows };
  });

  privateRoutes.post<{ Params: { id: string } }>('/v1/approvals/:id/approve', async (req, reply) => {
    const tenantId = tenantIdFor(req);
    const approvalResult = await query<any>('SELECT * FROM approval_requests WHERE id = $1 AND tenant_id = $2', [req.params.id, tenantId]);
    if (approvalResult.rowCount === 0) return reply.code(404).send({ error: 'approval not found' });
    const approval = approvalResult.rows[0];
    if (approval.status !== 'pending') return reply.code(409).send({ error: `approval is ${approval.status}` });
    const inboxResult = await query<any>('SELECT * FROM inboxes WHERE id = $1 AND tenant_id = $2', [approval.inbox_id, tenantId]);
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
        [messageId, tenantId, inbox.id, approval.thread_id, providerResult.provider_message_id, inbox.email_address,
          JSON.stringify(approval.proposed_to_json), approval.subject, approval.body_text, approval.body_html, JSON.stringify(approval.risk_flags_json)],
      );
      await client.query('UPDATE approval_requests SET status = $1, provider_result_json = $2::jsonb, decided_at = now() WHERE id = $3 AND tenant_id = $4',
        ['sent', JSON.stringify(providerResult), approval.id, tenantId]);
    });
    await audit('approval.approved_and_sent', 'approval', approval.id, { message_id: messageId, provider_result: providerResult }, 'api', (req as AuthedRequest).authContext?.apiKeyId, tenantId);
    await publishWebhookEvent('email.sent', { approval_id: approval.id, inbox_id: inbox.id, thread_id: approval.thread_id, message_id: messageId, to: approval.proposed_to_json, subject: approval.subject, risk_flags: approval.risk_flags_json }, tenantId);
    return { approval_id: approval.id, message_id: messageId, provider_result: providerResult };
  });

  privateRoutes.post<{ Params: { id: string } }>('/v1/approvals/:id/reject', async (req, reply) => {
    const tenantId = tenantIdFor(req);
    const result = await query('UPDATE approval_requests SET status = $1, decided_at = now() WHERE id = $2 AND tenant_id = $3 AND status = $4 RETURNING *', ['rejected', req.params.id, tenantId, 'pending']);
    if (result.rowCount === 0) return reply.code(404).send({ error: 'pending approval not found' });
    await audit('approval.rejected', 'approval', req.params.id, {}, 'api', (req as AuthedRequest).authContext?.apiKeyId, tenantId);
    await publishWebhookEvent('approval.rejected', { approval_id: req.params.id }, tenantId);
    return result.rows[0];
  });

  privateRoutes.get('/v1/webhooks', async (req) => {
    const result = await query('SELECT id, url, events_json, status, created_at FROM webhook_endpoints WHERE tenant_id = $1 ORDER BY created_at DESC', [tenantIdFor(req)]);
    return { data: result.rows };
  });

  privateRoutes.post('/v1/webhooks', async (req, reply) => {
    const body = WebhookEndpointSchema.parse(req.body);
    const tenantId = tenantIdFor(req);
    const authContext = (req as AuthedRequest).authContext;
    if (!authContext?.operator) {
      const quota = await query<{ webhook_count: number }>("SELECT count(*)::int AS webhook_count FROM webhook_endpoints WHERE tenant_id = $1 AND status = 'active'", [tenantId]);
      const webhookCount = Number(quota.rows[0]?.webhook_count ?? 0);
      const maxWebhooks = await maxWebhookEndpointsForTenant(tenantId);
      if (webhookCount >= maxWebhooks) {
        return reply.code(403).send({
          error: 'webhook_quota_exceeded',
          max_webhooks: maxWebhooks,
          current_webhooks: webhookCount,
        });
      }
    }
    const webhookId = id('wh');
    await query(
      `INSERT INTO webhook_endpoints (id, tenant_id, url, secret, events_json)
       VALUES ($1,$2,$3,$4,$5::jsonb)`,
      [webhookId, tenantId, body.url, body.secret ?? null, JSON.stringify(body.events)],
    );
    await audit('webhook.created', 'webhook', webhookId, { url: body.url, events: body.events }, 'api', (req as AuthedRequest).authContext?.apiKeyId, tenantId);
    reply.code(201).send({ id: webhookId, url: body.url, events: body.events, status: 'active' });
  });

  privateRoutes.get('/v1/webhook-deliveries', async (req) => {
    const result = await query('SELECT id, endpoint_id, event_type, payload_json, status, attempts, last_error, created_at, delivered_at FROM webhook_deliveries WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100', [tenantIdFor(req)]);
    return { data: result.rows };
  });

  privateRoutes.get('/v1/audit-logs', async (req) => {
    const result = await query('SELECT * FROM audit_logs WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 200', [tenantIdFor(req)]);
    return { data: result.rows };
  });
});

// app.post('/internal/stripe/webhook' uses a scoped raw JSON parser so Stripe signature checks see the signed payload.
app.register(async (stripeRoutes) => {
  stripeRoutes.removeContentTypeParser('application/json');
  stripeRoutes.addContentTypeParser('application/json', { parseAs: 'string' }, (_req, body, done) => {
    done(null, body);
  });

  stripeRoutes.post('/internal/stripe/webhook', async (req, reply) => {
    const webhookSecret = configuredSecret(process.env.STRIPE_WEBHOOK_SECRET);
    if (!webhookSecret) return reply.code(503).send({ error: 'stripe_webhook_not_configured' });
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
    if (!verifyStripeWebhookSignature({ rawBody, signatureHeader: req.headers['stripe-signature'], webhookSecret })) {
      return reply.code(401).send({ error: 'invalid_stripe_signature' });
    }
    const event = JSON.parse(rawBody);
    const object = event?.data?.object;
    if (event?.type === 'checkout.session.completed') {
      const tenantId = object?.metadata?.tenant_id ?? object?.client_reference_id;
      const plan = normalizePlan(object?.metadata?.plan);
      if (tenantId && (plan === 'developer' || plan === 'startup')) {
        await query(
          `UPDATE tenants
           SET plan = $2,
               billing_status = 'active',
               stripe_customer_id = COALESCE($3, stripe_customer_id),
               stripe_subscription_id = COALESCE($4, stripe_subscription_id)
           WHERE id = $1`,
          [tenantId, plan, object?.customer ?? null, object?.subscription ?? null],
        );
        await audit('billing.checkout_completed', 'tenant', tenantId, { plan, stripe_checkout_session_id: object?.id, stripe_subscription_id: object?.subscription }, 'stripe', null, tenantId);
      }
    } else if (event?.type === 'customer.subscription.updated') {
      await syncStripeSubscriptionEvent(object, false);
    } else if (event?.type === 'customer.subscription.deleted') {
      await syncStripeSubscriptionEvent(object, true);
    } else if (event?.type === 'invoice.payment_failed') {
      const subscriptionId = object?.subscription;
      if (subscriptionId) {
        await query("UPDATE tenants SET billing_status = 'past_due' WHERE stripe_subscription_id = $1", [subscriptionId]);
      }
    }
    reply.send({ received: true });
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
  if (error instanceof z.ZodError) {
    reply.code(400).send({ error: 'validation_error', details: error.issues });
    return;
  }
  req.log.error(error);
  reply.code(500).send(internalErrorPayload());
});

async function main() {
  await app.listen({ host: HOST, port: PORT });
}

main().catch(async (error) => {
  app.log.error(error);
  await pool.end();
  process.exit(1);
});
