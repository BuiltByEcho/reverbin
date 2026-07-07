import { Worker, type Job } from 'bullmq';
import { pool, query } from './db.js';
import { buildWebhookDeliveryHeaders } from './webhooks.js';
import { WEBHOOK_DELIVERY_QUEUE, redisConnectionOptions } from './webhook-delivery.js';
import { webhookDeliveryTimeoutMs } from './http-hardening.js';

type DeliveryRow = {
  id: string;
  endpoint_id: string | null;
  event_type: string;
  payload_json: unknown;
  url: string;
  secret: string | null;
};

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error('REDIS_URL is required to run the Reverbin webhook worker');
}

const connection = redisConnectionOptions(redisUrl);

async function loadDelivery(deliveryId: string) {
  const result = await query<DeliveryRow>(
    `SELECT d.id, d.endpoint_id, d.event_type, d.payload_json, e.url, e.secret
     FROM webhook_deliveries d
     JOIN webhook_endpoints e ON e.id = d.endpoint_id
     WHERE d.id = $1 AND e.status = 'active'`,
    [deliveryId],
  );
  return result.rows[0] ?? null;
}

async function markDelivery(deliveryId: string, status: 'delivered' | 'pending' | 'failed', error?: string) {
  if (status === 'delivered') {
    await query(
      `UPDATE webhook_deliveries
       SET status = 'delivered', attempts = attempts + 1, delivered_at = now(), last_error = NULL
       WHERE id = $1`,
      [deliveryId],
    );
    return;
  }

  await query(
    `UPDATE webhook_deliveries
     SET status = $2, attempts = attempts + 1, last_error = $3
     WHERE id = $1`,
    [deliveryId, status, error?.slice(0, 500) ?? null],
  );
}

async function deliver(job: Job<{ delivery_id: string }>) {
  const delivery = await loadDelivery(job.data.delivery_id);
  if (!delivery) throw new Error(`webhook delivery ${job.data.delivery_id} not found or endpoint inactive`);

  const payload = JSON.stringify(delivery.payload_json);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), webhookDeliveryTimeoutMs());
    const response = await fetch(delivery.url, {
      method: 'POST',
      headers: buildWebhookDeliveryHeaders({
        eventType: delivery.event_type,
        deliveryId: delivery.id,
        payload,
        secret: delivery.secret,
      }),
      body: payload,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await markDelivery(delivery.id, 'delivered');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown webhook delivery error';
    const maxAttempts = typeof job.opts.attempts === 'number' ? job.opts.attempts : 1;
    const exhausted = job.attemptsMade + 1 >= maxAttempts;
    await markDelivery(delivery.id, exhausted ? 'failed' : 'pending', message);
    throw error;
  }
}

const worker = new Worker(WEBHOOK_DELIVERY_QUEUE, deliver, { connection });
const SHUTDOWN_TIMEOUT_MS = 10_000;
let shuttingDown = false;

function timeoutAfter(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms).unref();
  });
}

worker.on('completed', (job) => {
  console.log(`webhook delivery completed: ${job.data.delivery_id}`);
});

worker.on('failed', (job, error) => {
  console.warn(`webhook delivery failed: ${job?.data.delivery_id ?? 'unknown'} ${error.message}`);
});

async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  await Promise.race([worker.close(), timeoutAfter(SHUTDOWN_TIMEOUT_MS)]);
  await pool.end();
}

process.on('SIGTERM', () => {
  shutdown().then(() => process.exit(0), (error) => {
    console.warn(`webhook worker shutdown error: ${error instanceof Error ? error.message : 'unknown error'}`);
    process.exit(1);
  });
});
process.on('SIGINT', () => {
  shutdown().then(() => process.exit(0), (error) => {
    console.warn(`webhook worker shutdown error: ${error instanceof Error ? error.message : 'unknown error'}`);
    process.exit(1);
  });
});
