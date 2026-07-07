import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildWebhookDeliveryHeaders,
  buildWebhookEventPayload,
  isAllowedWebhookEvent,
  isAllowedWebhookUrl,
  shouldDeliverWebhookEvent,
  signWebhookPayload,
  type WebhookEndpointConfig,
} from '../src/webhooks.js';

const endpoint: WebhookEndpointConfig = {
  id: 'wh_123',
  url: 'https://example.com/webhook',
  secret: 'secret_123',
  events_json: ['email.received', 'email.sent'],
  status: 'active',
};

test('matches active webhook endpoint event subscriptions', () => {
  assert.equal(shouldDeliverWebhookEvent(endpoint, 'email.received'), true);
  assert.equal(shouldDeliverWebhookEvent(endpoint, 'approval.required'), false);
  assert.equal(shouldDeliverWebhookEvent({ ...endpoint, events_json: ['*'] }, 'approval.required'), true);
  assert.equal(shouldDeliverWebhookEvent({ ...endpoint, status: 'paused' }, 'email.received'), false);
});

test('builds stable agent webhook payloads', () => {
  const payload = buildWebhookEventPayload('email.received', { inbox_id: 'inb_1', message_id: 'msg_1' }, new Date('2026-07-06T17:30:00.000Z'));

  assert.equal(payload.type, 'email.received');
  assert.equal(payload.created_at, '2026-07-06T17:30:00.000Z');
  assert.deepEqual(payload.data, { inbox_id: 'inb_1', message_id: 'msg_1' });
});

test('validates webhook destination URLs and event names before storing endpoints', () => {
  assert.equal(isAllowedWebhookUrl('https://agent.example/hook'), true);
  assert.equal(isAllowedWebhookUrl('http://127.0.0.1:9911/hook'), true);
  assert.equal(isAllowedWebhookUrl('http://localhost:9911/hook'), true);
  assert.equal(isAllowedWebhookUrl('http://agent.example/hook'), false);
  assert.equal(isAllowedWebhookUrl('ftp://agent.example/hook'), false);
  assert.equal(isAllowedWebhookUrl('https://localhost/hook'), false);
  assert.equal(isAllowedWebhookUrl('https://127.0.0.1/hook'), false);
  assert.equal(isAllowedWebhookUrl('https://10.0.0.5/hook'), false);
  assert.equal(isAllowedWebhookUrl('https://172.20.0.5/hook'), false);
  assert.equal(isAllowedWebhookUrl('https://192.168.1.10/hook'), false);
  assert.equal(isAllowedWebhookUrl('https://169.254.169.254/latest/meta-data'), false);

  assert.equal(isAllowedWebhookEvent('*'), true);
  assert.equal(isAllowedWebhookEvent('email.received'), true);
  assert.equal(isAllowedWebhookEvent('email.sent'), true);
  assert.equal(isAllowedWebhookEvent('approval.required'), true);
  assert.equal(isAllowedWebhookEvent('unknown.event'), false);
});

test('signs webhook payloads and builds delivery headers without leaking the secret', () => {
  const payload = JSON.stringify(buildWebhookEventPayload('email.sent', { message_id: 'msg_2' }, new Date('2026-07-06T17:31:00.000Z')));
  const signature = signWebhookPayload('secret_123', payload);
  const headers = buildWebhookDeliveryHeaders({ eventType: 'email.sent', deliveryId: 'whd_1', payload, secret: 'secret_123' });

  assert.match(signature, /^sha256=[a-f0-9]{64}$/);
  assert.equal(headers['content-type'], 'application/json');
  assert.equal(headers['x-echo-email-event'], 'email.sent');
  assert.equal(headers['x-echo-email-delivery'], 'whd_1');
  assert.equal(headers['x-echo-email-signature'], signature);
  assert.ok(!Object.values(headers).includes('secret_123'));
});
