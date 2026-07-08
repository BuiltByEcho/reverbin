import * as assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { test } from 'node:test';
import {
  normalizeResendReceivedEmail,
  verifySvixSignature,
} from '../src/resend.js';

const receivedEvent = {
  type: 'email.received',
  created_at: '2026-02-22T23:41:12.126Z',
  data: {
    email_id: '56761188-7520-42d8-8898-ff6fc54ce618',
    created_at: '2026-02-22T23:41:11.894719+00:00',
    from: 'sender@example.com',
    to: ['support@agents.reverbin.com'],
    cc: ['cc@example.com'],
    bcc: [],
    received_for: ['support@agents.reverbin.com'],
    message_id: '<111-222-333@email.example.com>',
    subject: 'Need help',
    attachments: [
      {
        id: 'att_123',
        filename: 'receipt.pdf',
        content_type: 'application/pdf',
        content_disposition: 'attachment',
        content_id: null,
        size: 4096,
        download_url: 'https://inbound-cdn.resend.com/email/attachments/att_123?signature=test',
        expires_at: '2026-10-17T14:29:41.521Z',
      },
    ],
  },
};

test('normalizes a Resend email.received event into internal inbound shape', () => {
  const normalized = normalizeResendReceivedEmail(receivedEvent, {
    text: 'Hello from the received email API',
    html: '<p>Hello from the received email API</p>',
    headers: {
      from: 'Sender Name <sender@example.com>',
      'message-id': '<111-222-333@email.example.com>',
    },
  });

  assert.equal(normalized.provider, 'resend');
  assert.equal(normalized.provider_message_id, '56761188-7520-42d8-8898-ff6fc54ce618');
  assert.equal(normalized.email_address, 'support@agents.reverbin.com');
  assert.deepEqual(normalized.from, { email: 'sender@example.com', name: 'Sender Name' });
  assert.deepEqual(normalized.to, [{ email: 'support@agents.reverbin.com' }]);
  assert.deepEqual(normalized.cc, [{ email: 'cc@example.com' }]);
  assert.equal(normalized.subject, 'Need help');
  assert.equal(normalized.text, 'Hello from the received email API');
  assert.equal(normalized.html, '<p>Hello from the received email API</p>');
  assert.equal(normalized.headers?.['message-id'], '<111-222-333@email.example.com>');
  assert.equal(normalized.headers?.['x-resend-attachment-count'], 1);
  assert.deepEqual(normalized.attachments, [
    {
      provider_attachment_id: 'att_123',
      filename: 'receipt.pdf',
      content_type: 'application/pdf',
      content_disposition: 'attachment',
      content_id: null,
      size_bytes: 4096,
      download_url: 'https://inbound-cdn.resend.com/email/attachments/att_123?signature=test',
      expires_at: '2026-10-17T14:29:41.521Z',
    },
  ]);
});

test('Resend normalization falls back to webhook metadata when body fetch is unavailable', () => {
  const normalized = normalizeResendReceivedEmail(receivedEvent);

  assert.equal(normalized.email_address, 'support@agents.reverbin.com');
  assert.equal(normalized.text, '');
  assert.equal(normalized.html, null);
  assert.equal(normalized.headers?.['x-resend-email-id'], '56761188-7520-42d8-8898-ff6fc54ce618');
});

test('verifies Svix/Resend webhook signatures using the raw body', () => {
  const rawBody = JSON.stringify(receivedEvent);
  const secretPayload = Buffer.from('test secret payload').toString('base64');
  const secret = `whsec_${secretPayload}`;
  const id = 'msg_test';
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = createHmac('sha256', Buffer.from(secretPayload, 'base64'))
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest('base64');

  assert.equal(verifySvixSignature(rawBody, {
    'svix-id': id,
    'svix-timestamp': timestamp,
    'svix-signature': `v1,${signature}`,
  }, secret), true);

  assert.equal(verifySvixSignature(`${rawBody} `, {
    'svix-id': id,
    'svix-timestamp': timestamp,
    'svix-signature': `v1,${signature}`,
  }, secret), false);
});
