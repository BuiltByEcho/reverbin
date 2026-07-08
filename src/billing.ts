import { createHmac, timingSafeEqual } from 'node:crypto';

export const STRIPE_MANAGED_PAYMENTS_API_VERSION = '2026-02-25.preview';

export type BillingPlan = 'free' | 'developer' | 'startup' | 'enterprise';

export type BillingPlanDefinition = {
  key: BillingPlan;
  label: string;
  price_monthly_usd: number | null;
  max_inboxes: number;
  emails_per_month: number | null;
  max_webhooks: number;
};

export const BILLING_PLANS: Record<BillingPlan, BillingPlanDefinition> = {
  free: {
    key: 'free',
    label: 'Free',
    price_monthly_usd: 0,
    max_inboxes: 2,
    emails_per_month: 2_000,
    max_webhooks: 1,
  },
  developer: {
    key: 'developer',
    label: 'Developer',
    price_monthly_usd: 19,
    max_inboxes: 10,
    emails_per_month: 10_000,
    max_webhooks: 3,
  },
  startup: {
    key: 'startup',
    label: 'Startup Beta',
    price_monthly_usd: 149,
    max_inboxes: 100,
    emails_per_month: 100_000,
    max_webhooks: 10,
  },
  enterprise: {
    key: 'enterprise',
    label: 'Enterprise',
    price_monthly_usd: null,
    max_inboxes: Number.MAX_SAFE_INTEGER,
    emails_per_month: null,
    max_webhooks: Number.MAX_SAFE_INTEGER,
  },
};

export function normalizePlan(value: unknown): BillingPlan {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (normalized === 'developer' || normalized === 'startup' || normalized === 'enterprise') return normalized;
  return 'free';
}

export function maxInboxesForPlan(plan: unknown) {
  return BILLING_PLANS[normalizePlan(plan)].max_inboxes;
}

export function maxWebhookEndpointsForPlan(plan: unknown) {
  return BILLING_PLANS[normalizePlan(plan)].max_webhooks;
}

export function priceIdForPlan(plan: BillingPlan, env: NodeJS.ProcessEnv = process.env) {
  if (plan === 'developer') return env.STRIPE_DEVELOPER_PRICE_ID;
  if (plan === 'startup') return env.STRIPE_STARTUP_PRICE_ID;
  return undefined;
}

export type CheckoutFormInput = {
  plan: Exclude<BillingPlan, 'free' | 'enterprise'>;
  tenantId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerId?: string | null;
  customerEmail?: string | null;
};

export function buildStripeCheckoutSessionForm(input: CheckoutFormInput) {
  const form = new URLSearchParams();
  form.set('mode', 'subscription');
  form.set('client_reference_id', input.tenantId);
  form.set('line_items[0][price]', input.priceId);
  form.set('line_items[0][quantity]', '1');
  form.set('success_url', input.successUrl);
  form.set('cancel_url', input.cancelUrl);
  form.set('allow_promotion_codes', 'true');
  form.set('managed_payments[enabled]', 'true');
  form.set('metadata[tenant_id]', input.tenantId);
  form.set('metadata[plan]', input.plan);
  form.set('subscription_data[metadata][tenant_id]', input.tenantId);
  form.set('subscription_data[metadata][plan]', input.plan);
  if (input.customerId) form.set('customer', input.customerId);
  else if (input.customerEmail) form.set('customer_email', input.customerEmail);
  return form;
}

export type StripeCheckoutSession = {
  id: string;
  url: string | null;
  customer?: string | null;
  subscription?: string | null;
};

export async function createStripeCheckoutSession(input: CheckoutFormInput & { secretKey: string; fetchImpl?: typeof fetch }) {
  const response = await (input.fetchImpl ?? fetch)('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${input.secretKey}`,
      'content-type': 'application/x-www-form-urlencoded',
      'stripe-version': STRIPE_MANAGED_PAYMENTS_API_VERSION,
    },
    body: buildStripeCheckoutSessionForm(input),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body?.error?.message === 'string' ? body.error.message : `Stripe checkout failed with HTTP ${response.status}`;
    throw new Error(message);
  }
  return body as StripeCheckoutSession;
}

export async function createStripeBillingPortalSession(input: { secretKey: string; customerId: string; returnUrl: string; fetchImpl?: typeof fetch }) {
  const form = new URLSearchParams();
  form.set('customer', input.customerId);
  form.set('return_url', input.returnUrl);
  const response = await (input.fetchImpl ?? fetch)('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${input.secretKey}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: form,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body?.error?.message === 'string' ? body.error.message : `Stripe portal failed with HTTP ${response.status}`;
    throw new Error(message);
  }
  return body as { id: string; url: string };
}

export function verifyStripeWebhookSignature(input: { rawBody: string; signatureHeader?: string | null | string[]; webhookSecret: string; toleranceSeconds?: number }) {
  const header = Array.isArray(input.signatureHeader) ? input.signatureHeader[0] : input.signatureHeader;
  if (!header || !input.webhookSecret) return false;
  const parts = new Map(header.split(',').map((part) => {
    const [key, ...rest] = part.split('=');
    return [key, rest.join('=')];
  }));
  const timestamp = Number(parts.get('t'));
  const signature = parts.get('v1');
  if (!Number.isFinite(timestamp) || !signature) return false;
  const age = Math.abs(Math.floor(Date.now() / 1000) - timestamp);
  if (age > (input.toleranceSeconds ?? 300)) return false;
  const expected = createHmac('sha256', input.webhookSecret).update(`${timestamp}.${input.rawBody}`).digest('hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  const signatureBuffer = Buffer.from(signature, 'hex');
  if (expectedBuffer.length !== signatureBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, signatureBuffer);
}
