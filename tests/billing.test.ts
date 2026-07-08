import * as assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { test } from 'node:test';
import {
  BILLING_PLANS,
  buildStripeCheckoutSessionForm,
  maxInboxesForPlan,
  maxWebhookEndpointsForPlan,
  normalizePlan,
  verifyStripeWebhookSignature,
} from '../src/billing.js';

const read = (filePath: string) => readFileSync(path.resolve(filePath), 'utf8');

test('billing plans match the Reverbin beta pricing decision', () => {
  assert.deepEqual(Object.keys(BILLING_PLANS), ['free', 'developer', 'startup', 'enterprise']);
  assert.equal(BILLING_PLANS.free.price_monthly_usd, 0);
  assert.equal(BILLING_PLANS.free.max_inboxes, 2);
  assert.equal(BILLING_PLANS.free.emails_per_month, 2000);
  assert.equal(BILLING_PLANS.free.max_webhooks, 1);

  assert.equal(BILLING_PLANS.developer.price_monthly_usd, 19);
  assert.equal(maxInboxesForPlan('developer'), 10);
  assert.equal(BILLING_PLANS.developer.emails_per_month, 10000);
  assert.equal(maxWebhookEndpointsForPlan('developer'), 3);

  assert.equal(BILLING_PLANS.startup.price_monthly_usd, 149);
  assert.equal(maxInboxesForPlan('startup'), 100);
  assert.equal(BILLING_PLANS.startup.emails_per_month, 100000);
  assert.equal(maxWebhookEndpointsForPlan('startup'), 10);

  assert.equal(maxInboxesForPlan('enterprise'), Number.MAX_SAFE_INTEGER);
  assert.equal(normalizePlan('STARTUP'), 'startup');
  assert.equal(normalizePlan('unknown'), 'free');
});

test('Stripe Checkout session form is subscription metadata-first and Link-compatible', () => {
  const form = buildStripeCheckoutSessionForm({
    plan: 'developer',
    tenantId: 'ten_123',
    priceId: 'price_developer_123',
    customerId: 'cus_123',
    successUrl: 'https://reverbin.com/billing/success?session_id={CHECKOUT_SESSION_ID}',
    cancelUrl: 'https://reverbin.com/pricing?canceled=1',
  });

  assert.equal(form.get('mode'), 'subscription');
  assert.equal(form.get('client_reference_id'), 'ten_123');
  assert.equal(form.get('customer'), 'cus_123');
  assert.equal(form.get('line_items[0][price]'), 'price_developer_123');
  assert.equal(form.get('line_items[0][quantity]'), '1');
  assert.equal(form.get('metadata[tenant_id]'), 'ten_123');
  assert.equal(form.get('metadata[plan]'), 'developer');
  assert.equal(form.get('subscription_data[metadata][tenant_id]'), 'ten_123');
  assert.equal(form.get('subscription_data[metadata][plan]'), 'developer');
  assert.equal(form.get('allow_promotion_codes'), 'true');
  assert.equal(form.get('managed_payments[enabled]'), 'true');
  assert.equal(form.has('payment_method_data[card][number]'), false);
});

test('Stripe API calls use the Managed Payments preview version specified by the blueprint', async () => {
  const calls: Array<{ url: string; headers: Record<string, string>; body: URLSearchParams }> = [];
  const fetchImpl = async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({
      url: String(url),
      headers: init?.headers as Record<string, string>,
      body: init?.body as URLSearchParams,
    });
    return new Response(JSON.stringify({ id: 'cs_test_123', url: 'https://checkout.stripe.com/c/pay/cs_test_123' }), { status: 200 });
  };

  const { createStripeCheckoutSession } = await import('../src/billing.js');
  await createStripeCheckoutSession({
    secretKey: 'STRIPE_SECRET_KEY_PLACEHOLDER',
    plan: 'developer',
    tenantId: 'ten_123',
    priceId: 'price_developer_123',
    successUrl: 'https://reverbin.com/mail/billing?notice=billing_success',
    cancelUrl: 'https://reverbin.com/mail/billing?notice=billing_canceled',
    fetchImpl: fetchImpl as typeof fetch,
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].headers['stripe-version'], '2026-02-25.preview');
  assert.equal(calls[0].body.get('managed_payments[enabled]'), 'true');
});

test('Stripe webhook signature verifier accepts signed raw payloads and rejects tampering', () => {
  const rawBody = JSON.stringify({ id: 'evt_123', type: 'checkout.session.completed' });
  const timestamp = Math.floor(Date.now() / 1000);
  const secret = 'whsec_test_secret';
  const signature = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  const header = `t=${timestamp},v1=${signature}`;

  assert.equal(verifyStripeWebhookSignature({ rawBody, signatureHeader: header, webhookSecret: secret }), true);
  assert.equal(verifyStripeWebhookSignature({ rawBody: `${rawBody} `, signatureHeader: header, webhookSecret: secret }), false);
  assert.equal(verifyStripeWebhookSignature({ rawBody, signatureHeader: 't=1,v1=bad', webhookSecret: secret }), false);
});

test('billing routes, schema, docs, and landing page expose paid checkout without custom card handling', () => {
  const schema = read('sql/schema.sql');
  const server = read('src/server.ts');
  const docs = read('docs/API.md');
  const publicPages = read('src/public-pages.ts');
  const envExample = read('.env.example');
  const setupProductsScript = read('scripts/setup-stripe-products.mjs');

  assert.match(schema, /plan text NOT NULL DEFAULT 'free'/);
  assert.match(schema, /stripe_customer_id text/);
  assert.match(schema, /stripe_subscription_id text/);
  assert.match(schema, /billing_status text NOT NULL DEFAULT 'active'/);

  assert.match(server, /app\.post\('\/internal\/stripe\/webhook'/);
  assert.match(server, /privateRoutes\.post\('\/v1\/billing\/checkout'/);
  assert.match(server, /privateRoutes\.post\('\/v1\/billing\/portal'/);
  assert.match(server, /checkout\.session\.completed/);
  assert.match(server, /customer\.subscription\.updated/);
  assert.match(server, /customer\.subscription\.deleted/);
  assert.match(server, /stripe_checkout_not_configured/);
  assert.match(server, /webhook_quota_exceeded/);
  assert.match(server, /inbox_quota_exceeded/);

  assert.match(docs, /POST \/v1\/billing\/checkout/);
  assert.match(docs, /Stripe Checkout/);
  assert.match(docs, /Link/);
  assert.match(docs, /Developer[\s\S]*\$19\/month/);
  assert.match(docs, /Startup Beta[\s\S]*\$149\/month/);

  assert.match(publicPages, /Developer/);
  assert.match(publicPages, /\$19\/mo/);
  assert.match(publicPages, /Startup Beta/);
  assert.match(publicPages, /\$149\/mo/);
  assert.match(publicPages, /Stripe Checkout/);
  assert.match(publicPages, /Link/);
  assert.doesNotMatch(publicPages, /card number|cvc|expiry/i);

  for (const key of ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_DEVELOPER_PRICE_ID', 'STRIPE_STARTUP_PRICE_ID']) {
    assert.match(envExample, new RegExp(`${key}=`));
  }

  assert.match(setupProductsScript, /STRIPE_SECRET_KEY/);
  assert.match(setupProductsScript, /STRIPE_PUBLISHABLE_KEY/);
  assert.match(setupProductsScript, /txcd_10103100/);
  assert.match(setupProductsScript, /2026-02-25\.preview/);
  assert.match(setupProductsScript, /default_price_data\[recurring\]\[interval\]/);
  assert.match(setupProductsScript, /STRIPE_DEVELOPER_PRICE_ID/);
  assert.match(setupProductsScript, /STRIPE_STARTUP_PRICE_ID/);
  assert.doesNotMatch(setupProductsScript, /sk_live_|pk_live_/);
});
