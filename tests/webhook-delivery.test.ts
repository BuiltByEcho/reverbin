import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildWebhookDeliveryJob, WEBHOOK_DELIVERY_QUEUE, type StoredWebhookDelivery } from '../src/webhook-delivery.js';

const delivery: StoredWebhookDelivery = {
  id: 'whd_123',
  endpoint_id: 'wh_123',
  url: 'https://agent.example/hook',
  secret: 'secret_123',
  event_type: 'email.received',
  payload_json: { type: 'email.received', data: { message_id: 'msg_123' } },
};

test('builds stable webhook delivery queue jobs without leaking endpoint secret', () => {
  const job = buildWebhookDeliveryJob(delivery);

  assert.equal(WEBHOOK_DELIVERY_QUEUE, 'reverbin-webhook-deliveries');
  assert.equal(job.name, 'webhook-delivery:whd_123');
  assert.deepEqual(job.data, {
    delivery_id: 'whd_123',
  });
  assert.deepEqual(job.options, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 500,
    removeOnFail: 1000,
  });
  assert.equal(JSON.stringify(job).includes('secret_123'), false);
});
