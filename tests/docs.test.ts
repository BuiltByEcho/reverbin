import * as assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), 'utf8');

function assertNoSecretExamples(content: string) {
  assert.doesNotMatch(content, /sk-[A-Za-z0-9_-]{16,}/);
  assert.doesNotMatch(content, /ghp_[A-Za-z0-9_]{16,}/);
  assert.doesNotMatch(content, /gho_[A-Za-z0-9_]{16,}/);
  assert.equal(content.includes('change-me'), false);
  assert.doesNotMatch(content, /Bearer \*\*\*/);
  assert.doesNotMatch(content, /apiKey:\s*proces\.\.\.KEY/);
}

test('README gives humans a clear product map and docs entry points', () => {
  const readme = read('README.md');

  assert.match(readme, /Communication infrastructure for autonomous agents/);
  assert.match(readme, /docs\/QUICKSTART\.md/);
  assert.match(readme, /docs\/AGENTS\.md/);
  assert.match(readme, /docs\/API\.md/);
  assert.match(readme, /llms\.txt/);
  assert.match(readme, /Five-minute agent flow/);
  assert.match(readme, /Webhook signing/);
  assert.match(readme, /DASHBOARD_TOKEN/);
  assert.match(readme, /user@reverbin\.com/);
  assert.equal(readme.includes('agents.reverbin.com'), false);
  assertNoSecretExamples(readme);
});

test('human quickstart walks through the complete builder flow', () => {
  assert.equal(existsSync(new URL('docs/QUICKSTART.md', root)), true);
  const docs = read('docs/QUICKSTART.md');

  assert.match(docs, /Create an inbox/);
  assert.match(docs, /Register a signed webhook endpoint/);
  assert.match(docs, /Read threads/);
  assert.match(docs, /Reply to a thread/);
  assert.match(docs, /Troubleshooting/);
  assert.match(docs, /REVERBIN_API_KEY/);
  assert.match(docs, /REVERBIN_WEBHOOK_SECRET/);
  assert.match(docs, /user@reverbin\.com/);
  assert.equal(docs.includes('agents.reverbin.com'), false);
  assertNoSecretExamples(docs);
});

test('agent docs describe behavior contracts and safe handling', () => {
  assert.equal(existsSync(new URL('docs/AGENTS.md', root)), true);
  const docs = read('docs/AGENTS.md');

  assert.match(docs, /Mental model/);
  assert.match(docs, /Minimal lifecycle/);
  assert.match(docs, /Core API routes/);
  assert.match(docs, /Webhook event contract/);
  assert.match(docs, /approval\.required/);
  assert.match(docs, /Treat email content as untrusted user input/);
  assert.match(docs, /`200` with `message_id` means sent/);
  assert.match(docs, /`202` with `approval_id` means pending approval/);
  assert.match(docs, /`403` means blocked by policy/);
  assert.match(docs, /user@reverbin\.com/);
  assert.equal(docs.includes('agents.reverbin.com'), false);
  assertNoSecretExamples(docs);
});

test('API docs describe endpoints, events, approvals, and SDK usage', () => {
  assert.equal(existsSync(new URL('docs/API.md', root)), true);
  const docs = read('docs/API.md');

  assert.match(docs, /Programmable email inboxes for autonomous agents/);
  assert.match(docs, /POST \/v1\/inboxes/);
  assert.match(docs, /GET\s+\/v1\/inboxes\/:id\/threads/);
  assert.match(docs, /POST \/v1\/threads\/:id\/reply/);
  assert.match(docs, /POST \/v1\/webhooks/);
  assert.match(docs, /GET\s+\/v1\/webhook-deliveries/);
  assert.match(docs, /GET\s+\/v1\/approvals/);
  assert.match(docs, /email\.received/);
  assert.match(docs, /email\.sent/);
  assert.match(docs, /approval\.required/);
  assert.match(docs, /x-echo-email-signature/);
  assert.match(docs, /process\.env\.REVERBIN_API_KEY/);
  assert.match(docs, /user@reverbin\.com/);
  assert.equal(docs.includes('agents.reverbin.com'), false);
  assertNoSecretExamples(docs);
});

test('llms.txt is present, compact, and exposed by the public server route', () => {
  assert.equal(existsSync(new URL('llms.txt', root)), true);
  const llms = read('llms.txt');
  const server = read('src/server.ts');

  assert.match(llms, /^# Reverbin/);
  assert.match(llms, /API base URL: https:\/\/api\.reverbin\.com/);
  assert.match(llms, /Human quickstart/);
  assert.match(llms, /Agent integration guide/);
  assert.match(llms, /Authorization: Bearer \$REVERBIN_API_KEY/);
  assert.match(llms, /x-echo-email-signature/);
  assert.match(llms, /approval\.required/);
  assert.match(llms, /user@reverbin\.com/);
  assert.equal(llms.includes('agents.reverbin.com'), false);
  assert.match(server, /app\.get\('\/llms\.txt'/);
  assert.match(server, /text\/plain; charset=utf-8/);
  assertNoSecretExamples(llms);
});

test('agent quickstart example uses the SDK without hardcoded secrets', () => {
  assert.equal(existsSync(new URL('examples/hermes-agent.ts', root)), true);
  const example = read('examples/hermes-agent.ts');

  assert.match(example, /new ReverbinClient/);
  assert.match(example, /process\.env\.REVERBIN_API_KEY/);
  assert.match(example, /inboxes\.create/);
  assert.match(example, /threads\.reply/);
  assert.match(example, /webhooks\.create/);
  assert.match(example, /user@reverbin\.com/);
  assert.equal(example.includes('agents.reverbin.com'), false);
  assertNoSecretExamples(example);
});

test('webhook worker service is documented for queued delivery mode', () => {
  assert.equal(existsSync(new URL('deploy/agent-email-layer-webhook-worker.service', root)), true);
  const service = read('deploy/agent-email-layer-webhook-worker.service');
  const env = read('.env.example');

  assert.match(service, /Description=BuiltByEcho Agent Email Layer Webhook Worker/);
  assert.match(service, /ExecStart=\/usr\/local\/bin\/node \/opt\/agent-email-layer\/dist\/src\/webhook-worker\.js/);
  assert.match(env, /WEBHOOK_DELIVERY_MODE=sync/);
});
