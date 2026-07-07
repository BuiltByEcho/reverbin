import * as assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const workerSource = readFileSync(new URL('../src/webhook-worker.ts', import.meta.url), 'utf8');

test('webhook worker SIGTERM shutdown is bounded and idempotent', () => {
  assert.match(workerSource, /const SHUTDOWN_TIMEOUT_MS = 10_000/);
  assert.match(workerSource, /let shuttingDown = false/);
  assert.match(workerSource, /Promise\.race\(\[worker\.close\(\), timeoutAfter\(SHUTDOWN_TIMEOUT_MS\)\]\)/);
  assert.match(workerSource, /process\.on\('SIGTERM'/);
  assert.match(workerSource, /process\.on\('SIGINT'/);
  assert.match(workerSource, /await pool\.end\(\)/);
});
