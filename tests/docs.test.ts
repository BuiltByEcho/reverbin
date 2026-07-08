import * as assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { renderDocsPage, renderLandingPage, renderSignupPage } from '../src/public-pages.js';

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

test('public signup CTAs open the self-serve agent signup page', () => {
  const landing = renderLandingPage();
  const docs = renderDocsPage('overview');
  const signup = renderSignupPage();
  const server = read('src/server.ts');

  for (const html of [landing, docs]) {
    assert.match(html, /Sign up/);
    assert.match(html, /href="\/signup"/);
    assert.doesNotMatch(html, /mailto:hello@builtbyecho\.com\?subject=Reverbin%20access/);
    assert.doesNotMatch(html, /Opens a prefilled email/);
    assert.match(html, /API key/);
  }

  assert.match(server, /app\.get\('\/signup'/);
  assert.match(signup, /id="agent-signup-form"/);
  assert.match(signup, /fetch\('\/v1\/agent-signups'/);
  assert.match(signup, /Your API key is shown once/);
  assert.doesNotMatch(signup, /Webhook URL/);
  assert.doesNotMatch(signup, /Optional webhook/);
  assert.doesNotMatch(signup, /webhook_url/);
  assert.doesNotMatch(signup, /Webhook secret/);
  assert.doesNotMatch(signup, /Upgrade with Checkout/);
  assert.doesNotMatch(signup, /billing-and-plan-upgrades/);
});

test('builder docs disclose live root-domain inboxes without legacy beta-domain caveats', () => {
  for (const path of ['docs/QUICKSTART.md', 'docs/API.md', 'docs/AGENTS.md', 'llms.txt']) {
    const docs = read(path);
    assert.match(docs, /user@reverbin\.com/);
    assert.match(docs, /root-domain|root domain|Receiving domains|Receiving domain/i);
    assert.equal(docs.includes('agents.reverbin.com'), false);
    assert.equal(docs.includes('cutover is pending'), false);
  }
});

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
  assert.match(docs, /Human mail console actions/);
  assert.match(docs, /Forward and delete are human-operator mail console actions/);
  assert.match(docs, /Bulk delete selected threads/);
  assert.match(docs, /does not expose API routes for agents to bulk-delete or forward mail/);
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
  assert.match(docs, /Human mail console actions/);
  assert.match(docs, /Forward, Delete, and Delete selected are available in `\/mail`/);
  assert.match(docs, /The public API intentionally keeps agents to read\/reply\/webhook operations/);
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

test('versioned Postgres backup and restore-drill assets match the live hardening contract', () => {
  const backupScript = read('deploy/agent-email-layer-pg-backup.sh');
  const restoreScript = read('deploy/agent-email-layer-pg-restore-drill.sh');
  const backupService = read('deploy/agent-email-layer-pg-backup.service');
  const backupTimer = read('deploy/agent-email-layer-pg-backup.timer');
  const restoreService = read('deploy/agent-email-layer-pg-restore-drill.service');
  const restoreTimer = read('deploy/agent-email-layer-pg-restore-drill.timer');

  assert.match(backupScript, /set -euo pipefail/);
  assert.match(backupScript, /umask 077/);
  assert.match(backupScript, /pg_dump --dbname="\$DATABASE_URL" --format=custom --compress=9/);
  assert.match(backupScript, /sha256sum "\$out" > "\$out\.sha256"/);
  assert.match(backupScript, /AGENT_EMAIL_BACKUP_RETENTION_DAYS:-14/);

  assert.match(restoreScript, /pg_restore --exit-on-error/);
  assert.match(restoreScript, /expected_tables='agents,api_keys,approval_requests,audit_logs,inboxes,messages,provider_events,send_policies,signup_requests,tenants,threads,webhook_deliveries,webhook_endpoints'/);
  assert.match(restoreScript, /expected 13 Reverbin tables/);
  assert.match(restoreScript, /signup_requests=/);
  assert.match(restoreScript, /dropdb --if-exists/);

  assert.match(backupService, /ExecStart=\/usr\/local\/sbin\/agent-email-layer-pg-backup\.sh/);
  assert.match(backupService, /ProtectSystem=full/);
  assert.match(backupService, /ReadWritePaths=\/var\/backups\/agent-email-layer\/postgres/);
  assert.match(backupTimer, /OnCalendar=\*-\*-\* 03:15:00 UTC/);
  assert.match(backupTimer, /Persistent=true/);
  assert.match(restoreService, /ExecStart=\/usr\/local\/sbin\/agent-email-layer-pg-restore-drill\.sh/);
  assert.match(restoreTimer, /OnCalendar=Wed \*-\*-\* 03:45:00 UTC/);
  assert.match(restoreTimer, /Persistent=true/);
});

test('systemd services include restart limits and sandbox hardening', () => {
  const env = read('.env.example');
  assert.match(env, /WEBHOOK_DELIVERY_MODE=sync/);

  for (const file of ['deploy/agent-email-layer.service', 'deploy/agent-email-layer-webhook-worker.service']) {
    const service = read(file);

    assert.match(service, /Restart=always/);
    assert.match(service, /RestartSec=5/);
    assert.match(service, /StartLimitIntervalSec=120/);
    assert.match(service, /StartLimitBurst=20/);
    assert.match(service, /TimeoutStopSec=30/);
    assert.match(service, /LimitNOFILE=65536/);
    assert.match(service, /MemoryMax=512M/);
    assert.match(service, /UMask=0077/);
    assert.match(service, /NoNewPrivileges=true/);
    assert.match(service, /PrivateTmp=true/);
    assert.match(service, /PrivateDevices=true/);
    assert.match(service, /ProtectSystem=full/);
    assert.match(service, /ProtectHome=true/);
    assert.match(service, /ProtectKernelTunables=true/);
    assert.match(service, /ProtectKernelModules=true/);
    assert.match(service, /ProtectControlGroups=true/);
    assert.match(service, /RestrictSUIDSGID=true/);
    assert.match(service, /LockPersonality=true/);
    assert.match(service, /SystemCallArchitectures=native/);
    assert.match(service, /RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6/);
    assert.match(service, /ReadWritePaths=\/var\/lib\/agent-email-layer/);
  }
});
