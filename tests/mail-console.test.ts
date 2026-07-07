import * as assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { renderMailPage } from '../src/public-pages.js';

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
  assert.match(html, /Inbox/);
  assert.match(html, /Sent/);
  assert.match(html, /Webhooks/);
  assert.match(html, /Settings/);
  assert.match(html, /support@reverbin\.com/);
  assert.match(html, /customer@example\.com/);
  assert.match(html, /Can a human read this in Reverbin\?/);
  assert.match(html, /Yes — the human mail console is live\./);
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

test('mail console route contract keeps human mail separate from ops dashboard', () => {
  const server = read('src/server.ts');
  const publicPages = read('src/public-pages.ts');

  assert.match(server, /renderMailPage/);
  assert.match(server, /app\.get<\{ Querystring: \{ inbox_id\?: string; thread_id\?: string; notice\?: string \} \}>\('\/mail'/);
  assert.match(server, /app\.post<\{ Params: \{ id: string \} \}>\('\/mail\/threads\/:id\/reply'/);
  assert.match(server, /requireDashboardAuth/);
  assert.match(server, /sendThreadReply/);
  assert.match(server, /reply\.redirect\(`\/mail\?thread_id=\$\{encodeURIComponent\(req\.params\.id\)\}&notice=reply_sent`\)/);
  assert.match(publicPages, /data-surface-id="human-mail-console"/);
  assert.match(publicPages, /Gmail-style/);
  assert.match(publicPages, /\/dashboard/);
});
