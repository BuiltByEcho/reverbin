import * as assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { test } from 'node:test';
import {
  buildApiKeyRecord,
  hashApiKeyToken,
  normalizeSelfServeInboxLocalPart,
  SELF_SERVE_API_KEY_SCOPES,
} from '../src/api-keys.js';

const read = (filePath: string) => readFileSync(path.resolve(filePath), 'utf8');

test('self-serve signup helpers create one-time root-domain credentials without storing raw secrets', () => {
  const record = buildApiKeyRecord({ tenantId: 'ten_agent_123', name: 'Support Agent' });

  assert.match(record.id, /^key_/);
  assert.equal(record.tenant_id, 'ten_agent_123');
  assert.equal(record.name, 'Support Agent');
  assert.match(record.token, /^rvb_live_[A-Za-z0-9_-]{32,}$/);
  assert.match(record.key_hash, /^[a-f0-9]{64}$/);
  assert.equal(record.key_hash, hashApiKeyToken(record.token));
  assert.notEqual(record.key_hash.includes(record.token), true);
  assert.deepEqual(record.scopes, SELF_SERVE_API_KEY_SCOPES);
  assert.ok(record.scopes.includes('threads:reply'));
});

test('self-serve inbox local parts are normalized and block reserved product addresses', () => {
  assert.equal(normalizeSelfServeInboxLocalPart(' Support Agent '), 'support-agent');
  assert.equal(normalizeSelfServeInboxLocalPart('agent.v2'), 'agent-v2');
  assert.throws(() => normalizeSelfServeInboxLocalPart('api'), /reserved/);
  assert.throws(() => normalizeSelfServeInboxLocalPart('abuse'), /reserved/);
  assert.throws(() => normalizeSelfServeInboxLocalPart('x'), /between 3 and 48/);
});

test('public automated agent signup provisions tenant-scoped inbox, API key, and optional webhook', () => {
  const schema = read('sql/schema.sql');
  const server = read('src/server.ts');
  const client = read('src/client.ts');
  const docs = read('docs/API.md');

  assert.match(schema, /CREATE TABLE IF NOT EXISTS api_keys/);
  assert.match(schema, /key_hash text NOT NULL/);
  assert.doesNotMatch(schema, /raw_key|api_key text/i);

  assert.match(server, /app\.post\('\/v1\/agent-signups'/);
  assert.match(server, /AutomatedAgentSignupSchema/);
  assert.match(server, /buildApiKeyRecord/);
  assert.match(server, /normalizeSelfServeInboxLocalPart/);
  assert.match(server, /status = 'provisioned'|status: 'provisioned'/);
  assert.match(server, /api_key: \{[\s\S]*token/);
  assert.match(server, /quickstart/);
  assert.match(server, /SELF_SERVE_INBOX_DOMAIN/);

  assert.match(server, /hashApiKeyToken/);
  assert.match(server, /SELECT id, tenant_id, name, scopes_json FROM api_keys WHERE key_hash = \$1 AND revoked_at IS NULL/);
  assert.match(server, /authContext/);
  assert.match(server, /WHERE tenant_id = \$1/);
  assert.match(server, /publishWebhookEvent\('email\.received',[\s\S]*inbox\.tenant_id/);
  assert.match(server, /publishWebhookEvent\('email\.sent',[\s\S]*inbox\.tenant_id/);

  assert.match(client, /readonly signups =/);
  assert.match(client, /agent-signups/);

  assert.match(docs, /POST \/v1\/agent-signups/);
  assert.match(docs, /self-serve/i);
  assert.match(docs, /api_key/);
  assert.match(docs, /returned once/i);
});

test('self-serve agents are capped at two inboxes during beta', () => {
  const server = read('src/server.ts');
  const docs = read('docs/API.md');

  assert.match(server, /SELF_SERVE_MAX_INBOXES_PER_AGENT\s*=\s*Number\(process\.env\.SELF_SERVE_MAX_INBOXES_PER_AGENT \?\? '2'\)/);
  assert.match(server, /SELECT count\(\*\)::int AS inbox_count FROM inboxes WHERE tenant_id = \$1/);
  assert.match(server, /inbox_quota_exceeded/);
  assert.match(server, /max_inboxes/);
  assert.match(server, /authContext\?\.operator/);

  assert.match(docs, /2 inboxes per self-serve agent/i);
  assert.match(docs, /inbox_quota_exceeded/);
});

test('dashboard login accepts self-serve API keys and tenant-scopes dashboard data', () => {
  const server = read('src/server.ts');
  const publicPages = read('src/public-pages.ts');

  assert.match(server, /authenticateApiToken/);
  assert.match(server, /app\.post\('\/dashboard\/login'/);
  assert.match(server, /validateDashboardLoginToken\(candidate\)/);
  assert.match(server, /dashboardCookie\(candidate/);
  assert.match(server, /authContext\?\.operator \? undefined : authContext\?\.tenantId/);
  assert.match(server, /SELECT id, email_address, display_name, status, created_at FROM inboxes WHERE tenant_id = \$1 ORDER BY created_at DESC LIMIT 20/);
  assert.match(server, /SELECT id, inbox_id, thread_id, direction, from_email, subject, created_at FROM messages WHERE tenant_id = \$1 ORDER BY created_at DESC LIMIT 20/);
  assert.match(server, /SELECT id, endpoint_id, event_type, status, attempts, created_at, delivered_at FROM webhook_deliveries WHERE tenant_id = \$1 ORDER BY created_at DESC LIMIT 20/);
  assert.match(server, /SELECT action, target_type, target_id, created_at FROM audit_logs WHERE tenant_id = \$1 ORDER BY created_at DESC LIMIT 30/);
  assert.match(server, /SELECT id, requester_email, preferred_inbox_name, status, verification_json, created_at FROM signup_requests WHERE tenant_id = \$1 ORDER BY created_at DESC LIMIT 20/);
  assert.match(publicPages, /Sign in with your API key/);
});
