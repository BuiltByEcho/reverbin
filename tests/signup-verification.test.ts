import * as assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { test } from 'node:test';
import {
  DEFAULT_SIGNUP_VERIFICATION_CHECKS,
  normalizeSignupRequestInput,
  summarizeSignupVerification,
  type SignupVerificationCheck,
} from '../src/signup-verification.js';

const read = (filePath: string) => readFileSync(path.resolve(filePath), 'utf8');

test('signup request normalization captures the verification checklist without secrets', () => {
  const request = normalizeSignupRequestInput({
    requester_email: ' Founder@Example.COM ',
    requester_name: 'Example Founder',
    agent_use_case: 'Route customer support mail to an agent runtime.',
    preferred_inbox_name: ' Support ',
    webhook_url: 'https://agent.example/webhook',
    notes: 'Please provision beta access.',
  });

  assert.equal(request.requester_email, 'founder@example.com');
  assert.equal(request.preferred_inbox_name, 'support');
  assert.equal(request.webhook_url, 'https://agent.example/webhook');
  assert.deepEqual(request.verification_json, DEFAULT_SIGNUP_VERIFICATION_CHECKS.map((check) => ({ ...check, status: 'pending' })));
  assert.equal(JSON.stringify(request).includes('Bearer '), false);
});

test('signup verification summary blocks provisioning until all required checks pass', () => {
  const pending: SignupVerificationCheck[] = DEFAULT_SIGNUP_VERIFICATION_CHECKS.map((check) => ({ ...check, status: 'pending' }));
  pending[0] = { ...pending[0], status: 'passed' };
  assert.deepEqual(summarizeSignupVerification(pending), {
    required: DEFAULT_SIGNUP_VERIFICATION_CHECKS.length,
    passed: 1,
    failed: 0,
    pending: DEFAULT_SIGNUP_VERIFICATION_CHECKS.length - 1,
    ready_to_provision: false,
  });

  const passed = DEFAULT_SIGNUP_VERIFICATION_CHECKS.map((check) => ({ ...check, status: 'passed' as const }));
  assert.equal(summarizeSignupVerification(passed).ready_to_provision, true);
});

test('signup verification is a first-class persisted operator workflow', () => {
  const schema = read('sql/schema.sql');
  const server = read('src/server.ts');
  const publicPages = read('src/public-pages.ts');

  assert.match(schema, /CREATE TABLE IF NOT EXISTS signup_requests/);
  assert.match(schema, /verification_json jsonb NOT NULL/);
  assert.match(schema, /status text NOT NULL DEFAULT 'pending'/);
  assert.match(schema, /CREATE INDEX IF NOT EXISTS idx_signup_requests_status_created/);

  assert.match(server, /privateRoutes\.post\('\/v1\/signup-requests'/);
  assert.match(server, /privateRoutes\.get\('\/v1\/signup-requests'/);
  assert.match(server, /privateRoutes\.patch<\{ Params: \{ id: string \} \}>\('\/v1\/signup-requests\/:id'/);
  assert.match(server, /summarizeSignupVerification/);
  assert.match(server, /signup\.requested/);
  assert.match(server, /signup\.verification_updated/);

  assert.match(publicPages, /Signup requests/);
  assert.match(publicPages, /ready_to_provision/);
  assert.match(publicPages, /No signup requests yet/);
});
