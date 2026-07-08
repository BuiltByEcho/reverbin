#!/usr/bin/env node

const STRIPE_MANAGED_PAYMENTS_API_VERSION = '2026-02-25.preview';
const STRIPE_PRODUCT_TAX_CODE = 'txcd_10103100';

const plans = [
  {
    envName: 'STRIPE_DEVELOPER_PRICE_ID',
    name: 'Reverbin Developer',
    description: 'Developer subscription for Reverbin agent mailboxes',
    unitAmount: 1900,
  },
  {
    envName: 'STRIPE_STARTUP_PRICE_ID',
    name: 'Reverbin Startup Beta',
    description: 'Startup Beta subscription for Reverbin agent mailboxes',
    unitAmount: 14900,
  },
];

function requireStripeSecretKey() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error('Missing STRIPE_SECRET_KEY. Obtain it from Stripe Dashboard → Developers → API keys, then run:');
    console.error('  STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY npm run setup:stripe-products');
    console.error('Do not paste real keys into .env.example or source files.');
    process.exit(1);
  }
  return secretKey;
}

function printPublishableKeyReminder() {
  if (!process.env.STRIPE_PUBLISHABLE_KEY) {
    console.error('Note: STRIPE_PUBLISHABLE_KEY is not required by Reverbin hosted Checkout, but if another Stripe CLI step asks for it, obtain it from Stripe Dashboard → Developers → API keys.');
  }
}

async function createSubscriptionProduct(secretKey, plan) {
  const form = new URLSearchParams();
  form.set('name', plan.name);
  form.set('description', plan.description);
  form.set('tax_code', STRIPE_PRODUCT_TAX_CODE);
  form.set('default_price_data[unit_amount]', String(plan.unitAmount));
  form.set('default_price_data[currency]', 'usd');
  form.set('default_price_data[recurring][interval]', 'month');

  const response = await fetch('https://api.stripe.com/v1/products', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${secretKey}`,
      'content-type': 'application/x-www-form-urlencoded',
      'stripe-version': STRIPE_MANAGED_PAYMENTS_API_VERSION,
    },
    body: form,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body?.error?.message === 'string' ? body.error.message : `Stripe product creation failed with HTTP ${response.status}`;
    throw new Error(`${plan.name}: ${message}`);
  }
  if (!body.default_price) throw new Error(`${plan.name}: Stripe response did not include default_price`);
  return body;
}

async function main() {
  const secretKey = requireStripeSecretKey();
  printPublishableKeyReminder();

  console.log('# Created Stripe products/prices. Add these to /etc/agent-email-layer/env:');
  for (const plan of plans) {
    const product = await createSubscriptionProduct(secretKey, plan);
    console.log(`${plan.envName}=${product.default_price}`);
  }
  console.log('# Also set STRIPE_WEBHOOK_SECRET=whsec_... after creating the webhook endpoint in Stripe Dashboard.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
