import * as assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { renderMailComposePage, renderMailForwardPage, renderMailPage, renderMailSettingsPage, renderMailWebhooksPage } from '../src/public-pages.js';

const root = new URL('../', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), 'utf8');

test('human mail console renders a Gmail-style three-pane inbox with reply controls', () => {
  const html = renderMailPage({
    inboxes: [
      { id: 'inb_1', email_address: 'support@reverbin.com', display_name: 'Support Team', status: 'active', thread_count: 2 },
      { id: 'inb_2', email_address: 'alerts@reverbin.com', display_name: 'Alerts', status: 'active', thread_count: 0 },
    ],
    selectedInboxId: 'inb_1',
    threads: [
      {
        id: 'thr_1',
        inbox_id: 'inb_1',
        subject: 'Need help <now>',
        last_message_at: new Date('2026-07-07T21:00:00Z'),
        last_from_email: 'customer@example.com',
        last_direction: 'inbound',
        last_preview: 'Can a human read this in Reverbin?',
        message_count: 2,
      },
    ],
    selectedThreadId: 'thr_1',
    messages: [
      {
        id: 'msg_1',
        thread_id: 'thr_1',
        direction: 'inbound',
        from_email: 'customer@example.com',
        from_name: 'Customer <Name>',
        to_json: [{ email: 'support@reverbin.com' }],
        subject: 'Need help <now>',
        text_body: 'Can a human read this in Reverbin?',
        created_at: new Date('2026-07-07T20:59:00Z'),
      },
      {
        id: 'msg_2',
        thread_id: 'thr_1',
        direction: 'outbound',
        from_email: 'support@reverbin.com',
        to_json: ['customer@example.com'],
        subject: 'Re: Need help <now>',
        text_body: 'Yes — the human mail console is live.',
        created_at: new Date('2026-07-07T21:00:00Z'),
      },
    ],
    selectedThread: { id: 'thr_1', inbox_id: 'inb_1', subject: 'Need help <now>', last_message_at: new Date('2026-07-07T21:00:00Z') },
    notice: 'Reply sent',
  });

  assert.match(html, /Reverbin Mail/);
  assert.match(html, /data-surface-id="human-mail-console"/);
  assert.match(html, /class="mail-shell"/);
  assert.match(html, /class="mail-sidebar"/);
  assert.match(html, /class="mail-thread-list"/);
  assert.match(html, /class="mail-reader"/);
  assert.match(html, /aria-label="Inbox folders"/);
  assert.match(html, /aria-label="Thread list"/);
  assert.match(html, /aria-label="Thread conversation"/);
  assert.match(html, /Search mail/);
  assert.match(html, /Compose/);
  assert.match(html, /href="\/mail\/compose\?inbox_id=inb_1"/);
  assert.doesNotMatch(html, /mailto:/);
  assert.match(html, /Inbox/);
  assert.match(html, /Sent/);
  assert.match(html, /Webhooks/);
  assert.match(html, /href="\/mail\/webhooks"/);
  assert.match(html, /Settings/);
  assert.match(html, /href="\/mail\/settings"/);
  assert.doesNotMatch(html, /Operations/);
  assert.doesNotMatch(html, /href="\/dashboard#webhooks"/);
  assert.doesNotMatch(html, /href="\/dashboard">Settings/);
  assert.match(html, /support@reverbin\.com/);
  assert.match(html, /customer@example\.com/);
  assert.match(html, /Can a human read this in Reverbin\?/);
  assert.match(html, /Yes — the human mail console is live\./);
  assert.match(html, /data-reader-layout="email-thread"/);
  assert.match(html, /class="email-message-card"/);
  assert.match(html, /class="email-message-meta"/);
  assert.match(html, /From/);
  assert.match(html, /To/);
  assert.match(html, /Date/);
  assert.doesNotMatch(html, /class="mail-message inbound"/);
  assert.doesNotMatch(html, /class="mail-message outbound"/);
  assert.doesNotMatch(html, /Agent connected · policy guarded/);
  assert.match(html, /class="mail-action-bar"/);
  assert.match(html, /href="\/mail\/threads\/thr_1\/forward"/);
  assert.match(html, />Forward<\/a>/);
  assert.match(html, /method="post" action="\/mail\/threads\/thr_1\/delete"/);
  assert.match(html, />Delete<\/button>/);
  assert.match(html, /action="\/mail\/threads\/thr_1\/reply"/);
  assert.match(html, /name="text"/);
  assert.match(html, /Reply sent/);
  assert.equal(html.includes('Need help <now>'), false);
  assert.match(html, /Need help &lt;now&gt;/);
  assert.match(html, /Customer &lt;Name&gt;/);
  assert.equal(html.includes('webhook_deliveries'), false);
  assert.equal(html.includes('audit_logs'), false);
  assert.equal(html.includes('provider_events'), false);
});

test('mail forward page lets tenants forward an existing email thread', () => {
  const html = renderMailForwardPage({
    inboxes: [
      { id: 'inb_1', email_address: 'support@reverbin.com', display_name: 'Support Team', status: 'active', thread_count: 2 },
    ],
    selectedInboxId: 'inb_1',
    thread: { id: 'thr_1', inbox_id: 'inb_1', subject: 'Need help <now>', last_message_at: new Date('2026-07-07T21:00:00Z') },
    messages: [
      {
        id: 'msg_1',
        thread_id: 'thr_1',
        direction: 'inbound',
        from_email: 'customer@example.com',
        from_name: 'Customer <Name>',
        to_json: [{ email: 'support@reverbin.com' }],
        subject: 'Need help <now>',
        text_body: 'Please forward this email.',
        created_at: new Date('2026-07-07T20:59:00Z'),
      },
    ],
    notice: 'forward_sent',
  });

  assert.match(html, /data-surface-id="mail-forward"/);
  assert.match(html, /Forward email/);
  assert.match(html, /action="\/mail\/threads\/thr_1\/forward"/);
  assert.match(html, /name="to"/);
  assert.match(html, /name="subject"/);
  assert.match(html, /value="Fwd: Need help &lt;now&gt;"/);
  assert.match(html, /name="text"/);
  assert.match(html, /Forwarded message/);
  assert.match(html, /Please forward this email\./);
  assert.match(html, /Forward sent/);
  assert.doesNotMatch(html, /mailto:/);
  assert.doesNotMatch(html, /Operations/);
});

test('mail compose page lets tenants start a new outbound thread in-app', () => {
  const html = renderMailComposePage({
    inboxes: [
      { id: 'inb_1', email_address: 'support@reverbin.com', display_name: 'Support Team', status: 'active', thread_count: 2 },
    ],
    selectedInboxId: 'inb_1',
    notice: 'compose_sent',
  });

  assert.match(html, /data-surface-id="mail-compose"/);
  assert.match(html, /Compose message/);
  assert.match(html, /support@reverbin\.com/);
  assert.match(html, /action="\/mail\/compose"/);
  assert.match(html, /name="inbox_id"/);
  assert.match(html, /value="inb_1"/);
  assert.match(html, /name="to"/);
  assert.match(html, /name="subject"/);
  assert.match(html, /name="text"/);
  assert.match(html, /Send message/);
  assert.match(html, /Message sent/);
  assert.doesNotMatch(html, /mailto:/);
  assert.doesNotMatch(html, /Operations/);
});

test('mail console route contract keeps human mail separate from ops dashboard', () => {
  const server = read('src/server.ts');
  const publicPages = read('src/public-pages.ts');

  assert.match(server, /renderMailPage/);
  assert.match(server, /app\.get<\{ Querystring: \{ inbox_id\?: string; thread_id\?: string; notice\?: string \} \}>\('\/mail'/);
  assert.match(server, /app\.post<\{ Params: \{ id: string \} \}>\('\/mail\/threads\/:id\/reply'/);
  assert.match(server, /requireDashboardAuth/);
  assert.match(server, /sendThreadReply/);
  assert.match(server, /reply\.redirect\(`\/mail\?thread_id=\$\{encodeURIComponent\(req\.params\.id\)\}&notice=reply_sent`\)/);
  assert.match(server, /app\.get<\{ Querystring: \{ inbox_id\?: string; notice\?: string \} \}>\('\/mail\/compose'/);
  assert.match(server, /app\.post\('\/mail\/compose'/);
  assert.match(server, /sendNewThread/);
  assert.match(server, /isNewThread: true/);
  assert.match(server, /reply\.redirect\(`\/mail\?thread_id=\$\{encodeURIComponent\(String\(result\.payload\.thread_id\)\)\}&notice=compose_sent`\)/);
  assert.match(server, /app\.get<\{ Params: \{ id: string \}; Querystring: \{ notice\?: string \} \}>\('\/mail\/threads\/:id\/forward'/);
  assert.match(server, /app\.post<\{ Params: \{ id: string \} \}>\('\/mail\/threads\/:id\/forward'/);
  assert.match(server, /app\.post<\{ Params: \{ id: string \} \}>\('\/mail\/threads\/:id\/delete'/);
  assert.match(server, /sendThreadForward/);
  assert.match(server, /deleteMailThread/);
  assert.match(server, /deleted_at IS NULL/);
  assert.match(publicPages, /data-surface-id="human-mail-console"/);
  assert.match(publicPages, /Gmail-style/);
  assert.match(publicPages, /href="\/mail\/webhooks"/);
  assert.match(publicPages, /href="\/mail\/settings"/);
  assert.doesNotMatch(publicPages, /href="\/dashboard#webhooks"/);
});

test('mail thread actions are backed by tenant-scoped soft-delete and forward routes', () => {
  const schema = read('sql/schema.sql');
  const migrate = read('src/migrate.ts');
  const server = read('src/server.ts');

  assert.match(schema, /deleted_at timestamptz/);
  assert.match(migrate, /ALTER TABLE threads\s+ADD COLUMN IF NOT EXISTS deleted_at timestamptz/);
  assert.match(server, /UPDATE threads\s+SET deleted_at = now\(\)/);
  assert.match(server, /AND tenant_id = \$2/);
  assert.match(server, /mail\.thread_deleted/);
  assert.match(server, /email\.forwarded/);
  assert.match(server, /notice=thread_deleted/);
  assert.match(server, /notice=forward_sent/);
});

test('mail settings page is simple, tenant scoped, and editable', () => {
  const html = renderMailSettingsPage({
    inboxes: [
      { id: 'inb_1', email_address: 'support@reverbin.com', display_name: 'Support Team', status: 'active', thread_count: 2 },
    ],
    selectedInboxId: 'inb_1',
    policy: {
      reply_only: false,
      require_approval_for_new_recipients: true,
      require_approval_for_external_domains: false,
      max_outbound_per_hour: 20,
      max_outbound_per_day: 100,
      allowed_domains: ['example.com'],
      blocked_domains: ['spam.test'],
      allowed_recipients: [],
      blocked_recipients: ['blocked@example.com'],
      allow_attachments: false,
      allow_links: true,
      risk_threshold: 'medium',
    },
    notice: 'settings_saved',
  });

  assert.match(html, /data-surface-id="mail-settings"/);
  assert.match(html, /Settings/);
  assert.match(html, /Simple inbox settings/);
  assert.match(html, /support@reverbin\.com/);
  assert.match(html, /action="\/mail\/settings"/);
  assert.match(html, /name="display_name"/);
  assert.match(html, /value="Support Team"/);
  assert.match(html, /<details class="advanced-settings">/);
  assert.match(html, /<summary>Advanced policy controls<\/summary>/);
  assert.doesNotMatch(html, /<details class="advanced-settings" open>/);
  const basicSettings = html.split('<details class="advanced-settings">')[0];
  assert.doesNotMatch(basicSettings, /Max outbound per hour/);
  assert.doesNotMatch(basicSettings, /Max outbound per day/);
  assert.doesNotMatch(basicSettings, /Risk threshold/);
  assert.doesNotMatch(basicSettings, /Allowed domains/);
  assert.doesNotMatch(basicSettings, /Blocked domains/);
  assert.doesNotMatch(basicSettings, /Blocked recipients/);
  assert.match(html, /name="max_outbound_per_hour"/);
  assert.match(html, /value="20"/);
  assert.match(html, /name="max_outbound_per_day"/);
  assert.match(html, /value="100"/);
  assert.match(html, /name="require_approval_for_new_recipients"/);
  assert.match(html, /name="allow_links"/);
  assert.match(html, /name="allowed_domains"/);
  assert.match(html, /example\.com/);
  assert.match(html, /Settings saved/);
  assert.doesNotMatch(html, /Webhook deliveries/);
  assert.doesNotMatch(html, /Audit trail/);
  assert.doesNotMatch(html, /provider_events/);
});

test('mail webhooks page lets tenants add webhook endpoints without the ops dashboard', () => {
  const html = renderMailWebhooksPage({
    inboxes: [
      { id: 'inb_1', email_address: 'support@reverbin.com', display_name: 'Support Team', status: 'active', thread_count: 2 },
    ],
    webhooks: [
      { id: 'wh_1', url: 'https://agent.example/hook', events_json: ['email.received', 'email.sent'], status: 'active', created_at: new Date('2026-07-08T12:00:00Z') },
    ],
    notice: 'webhook_created',
  });

  assert.match(html, /data-surface-id="mail-webhooks"/);
  assert.match(html, /Webhooks/);
  assert.match(html, /Simple webhook setup/);
  assert.match(html, /action="\/mail\/webhooks"/);
  assert.match(html, /name="url"/);
  assert.match(html, /name="secret"/);
  assert.match(html, /name="events"/);
  assert.match(html, /email\.received/);
  assert.match(html, /email\.sent/);
  assert.match(html, /approval\.required/);
  assert.match(html, /https:\/\/agent\.example\/hook/);
  assert.match(html, /Webhook added/);
  assert.doesNotMatch(html, /Webhook deliveries/);
  assert.doesNotMatch(html, /Audit trail/);
  assert.doesNotMatch(html, /provider_events/);
});

test('mail settings and webhook routes stay separate from operator operations dashboard', () => {
  const server = read('src/server.ts');

  assert.match(server, /renderMailSettingsPage/);
  assert.match(server, /renderMailWebhooksPage/);
  assert.match(server, /app\.get<\{ Querystring: \{ inbox_id\?: string; notice\?: string \} \}>\('\/mail\/settings'/);
  assert.match(server, /app\.post\('\/mail\/settings'/);
  assert.match(server, /app\.get<\{ Querystring: \{ notice\?: string \} \}>\('\/mail\/webhooks'/);
  assert.match(server, /app\.post\('\/mail\/webhooks'/);
  assert.match(server, /UPDATE inboxes\s+SET display_name/);
  assert.match(server, /UPDATE send_policies/);
  assert.match(server, /INSERT INTO webhook_endpoints/);
  assert.match(server, /tenantIdFor\(req\)/);
  assert.match(server, /reply\.redirect\('\/mail\/settings\?notice=settings_saved'\)/);
  assert.match(server, /reply\.redirect\('\/mail\/webhooks\?notice=webhook_created'\)/);
});
