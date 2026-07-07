import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { createFixedWindowRateLimiter } from '../src/rate-limit.js';

test('fixed-window limiter blocks after the configured attempt budget', () => {
  let now = 1_000;
  const limiter = createFixedWindowRateLimiter({ limit: 2, windowMs: 10_000, now: () => now });

  assert.deepEqual(limiter.check('ip:1'), { allowed: true, remaining: 1, retry_after_seconds: 10 });
  assert.deepEqual(limiter.check('ip:1'), { allowed: true, remaining: 0, retry_after_seconds: 10 });
  assert.deepEqual(limiter.check('ip:1'), { allowed: false, remaining: 0, retry_after_seconds: 10 });

  now = 11_001;
  assert.deepEqual(limiter.check('ip:1'), { allowed: true, remaining: 1, retry_after_seconds: 10 });
});

test('fixed-window limiter keeps scopes and clients isolated', () => {
  const limiter = createFixedWindowRateLimiter({ limit: 1, windowMs: 60_000, now: () => 0 });

  assert.equal(limiter.check('dashboard:1.2.3.4').allowed, true);
  assert.equal(limiter.check('dashboard:1.2.3.4').allowed, false);
  assert.equal(limiter.check('api:1.2.3.4').allowed, true);
  assert.equal(limiter.check('dashboard:5.6.7.8').allowed, true);
});
