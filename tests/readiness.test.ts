import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkReadiness } from '../src/readiness.js';

test('readyz reports only Postgres in sync webhook mode', async () => {
  const result = await checkReadiness({
    env: { WEBHOOK_DELIVERY_MODE: 'sync' },
    checkDb: async () => undefined,
    checkRedis: async () => { throw new Error('should not touch redis in sync mode'); },
  });

  assert.equal(result.statusCode, 200);
  assert.deepEqual(result.body, { ok: true, db: 'ok', webhook_delivery_mode: 'sync' });
});

test('readyz requires Redis when webhook delivery runs in queue mode', async () => {
  const result = await checkReadiness({
    env: { WEBHOOK_DELIVERY_MODE: 'queue', REDIS_URL: 'redis://127.0.0.1:6379/0' },
    checkDb: async () => undefined,
    checkRedis: async () => { throw new Error('ECONNREFUSED redis://secret@127.0.0.1'); },
  });

  assert.equal(result.statusCode, 503);
  assert.deepEqual(result.body, { ok: false, db: 'ok', redis: 'error', webhook_delivery_mode: 'queue' });
  assert.equal(JSON.stringify(result.body).includes('secret'), false);
});

test('readyz fails closed when queue mode is missing REDIS_URL', async () => {
  const result = await checkReadiness({
    env: { WEBHOOK_DELIVERY_MODE: 'queue' },
    checkDb: async () => undefined,
    checkRedis: async () => undefined,
  });

  assert.equal(result.statusCode, 503);
  assert.deepEqual(result.body, { ok: false, db: 'ok', redis: 'missing_config', webhook_delivery_mode: 'queue' });
});
