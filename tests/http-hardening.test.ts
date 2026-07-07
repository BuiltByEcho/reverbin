import * as assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  allowedCorsOrigins,
  configuredSecret,
  internalErrorPayload,
  isCorsOriginAllowed,
  webhookDeliveryTimeoutMs,
} from '../src/http-hardening.js';

const serverSource = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');

test('CORS only allows first-party origins by default, with local dev exception', () => {
  assert.deepEqual(allowedCorsOrigins({}), [
    'https://reverbin.com',
    'https://www.reverbin.com',
    'https://app.reverbin.com',
    'https://api.reverbin.com',
    'https://reverbin.vercel.app',
  ]);
  assert.equal(isCorsOriginAllowed('https://reverbin.com', { NODE_ENV: 'production' }), true);
  assert.equal(isCorsOriginAllowed('https://evil.example', { NODE_ENV: 'production' }), false);
  assert.equal(isCorsOriginAllowed('http://localhost:5173', { NODE_ENV: 'development' }), true);
  assert.equal(isCorsOriginAllowed('http://localhost:5173', { NODE_ENV: 'production' }), false);
  assert.equal(isCorsOriginAllowed(undefined, { NODE_ENV: 'production' }), true);
});

test('configured secrets fail closed when blank', () => {
  assert.equal(configuredSecret(undefined), null);
  assert.equal(configuredSecret('   '), null);
  assert.equal(configuredSecret('secret-token'), 'secret-token');
});

test('webhook delivery timeout is bounded', () => {
  assert.equal(webhookDeliveryTimeoutMs({}), 10_000);
  assert.equal(webhookDeliveryTimeoutMs({ WEBHOOK_DELIVERY_TIMEOUT_MS: '50' }), 1_000);
  assert.equal(webhookDeliveryTimeoutMs({ WEBHOOK_DELIVERY_TIMEOUT_MS: '120000' }), 60_000);
  assert.equal(webhookDeliveryTimeoutMs({ WEBHOOK_DELIVERY_TIMEOUT_MS: '2500' }), 2_500);
});

test('internal error payload does not leak exception messages', () => {
  assert.deepEqual(internalErrorPayload(), { error: 'internal_error' });
});

test('server hardening contract fails closed for missing secrets and hides internal errors', () => {
  assert.match(serverSource, /api_auth_not_configured/);
  assert.match(serverSource, /internal_webhook_auth_not_configured/);
  assert.match(serverSource, /reply\.code\(500\)\.send\(internalErrorPayload\(\)\)/);
  assert.doesNotMatch(serverSource, /send\(\{ error: 'internal_error', message \}\)/);
  assert.doesNotMatch(serverSource, /register\(cors, \{ origin: true \}\)/);
});

test('auth-sensitive routes have fixed-window brute-force controls', () => {
  assert.match(serverSource, /dashboardLoginLimiter = createFixedWindowRateLimiter\(\{ limit: 8, windowMs: 15 \* 60_000 \}\)/);
  assert.match(serverSource, /apiAuthLimiter = createFixedWindowRateLimiter\(\{ limit: 60, windowMs: 60_000 \}\)/);
  assert.match(serverSource, /rateLimitKey\(req, 'dashboard-login'\)/);
  assert.match(serverSource, /rateLimitKey\(req, 'api-auth'\)/);
  assert.match(serverSource, /reply\.header\('retry-after'/);
  assert.match(serverSource, /error: 'rate_limited'/);
});
