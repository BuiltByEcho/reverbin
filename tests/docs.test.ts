import * as assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), 'utf8');

test('API docs describe the five-minute agent flow and core endpoints', () => {
  assert.equal(existsSync(new URL('docs/API.md', root)), true);
  const docs = read('docs/API.md');

  assert.match(docs, /Programmable email inboxes for autonomous agents/);
  assert.match(docs, /POST \/v1\/inboxes/);
  assert.match(docs, /GET \/v1\/inboxes\/:id\/threads/);
  assert.match(docs, /POST \/v1\/threads\/:id\/reply/);
  assert.match(docs, /POST \/v1\/webhooks/);
  assert.match(docs, /GET \/v1\/webhook-deliveries/);
  assert.match(docs, /email\.received/);
  assert.match(docs, /email\.sent/);
  assert.match(docs, /x-echo-email-signature/);
  assert.equal(docs.includes('approvals dashboard'), false);
  assert.equal(docs.includes('change-me'), false);
});

test('agent quickstart example uses the SDK without hardcoded secrets', () => {
  assert.equal(existsSync(new URL('examples/hermes-agent.ts', root)), true);
  const example = read('examples/hermes-agent.ts');

  assert.match(example, /new ReverbinClient/);
  assert.match(example, /process\.env\.REVERBIN_API_KEY/);
  assert.match(example, /inboxes\.create/);
  assert.match(example, /threads\.reply/);
  assert.match(example, /webhooks\.create/);
  assert.equal(example.includes('sk_'), false);
  assert.equal(example.includes('change-me'), false);
});

test('webhook worker service is documented for queued delivery mode', () => {
  assert.equal(existsSync(new URL('deploy/agent-email-layer-webhook-worker.service', root)), true);
  const service = read('deploy/agent-email-layer-webhook-worker.service');
  const env = read('.env.example');

  assert.match(service, /Description=BuiltByEcho Agent Email Layer Webhook Worker/);
  assert.match(service, /ExecStart=\/usr\/local\/bin\/node \/opt\/agent-email-layer\/dist\/src\/webhook-worker\.js/);
  assert.match(env, /WEBHOOK_DELIVERY_MODE=sync/);
});
