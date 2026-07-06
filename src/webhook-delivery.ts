export const WEBHOOK_DELIVERY_QUEUE = 'reverbin-webhook-deliveries';

export type StoredWebhookDelivery = {
  id: string;
  endpoint_id: string | null;
  url: string;
  secret?: string | null;
  event_type: string;
  payload_json: unknown;
};

export type WebhookDeliveryJob = {
  name: string;
  data: {
    delivery_id: string;
  };
  options: {
    attempts: number;
    backoff: { type: 'exponential'; delay: number };
    removeOnComplete: number;
    removeOnFail: number;
  };
};

export function buildWebhookDeliveryJob(delivery: StoredWebhookDelivery): WebhookDeliveryJob {
  return {
    name: `webhook-delivery:${delivery.id}`,
    data: { delivery_id: delivery.id },
    options: {
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 500,
      removeOnFail: 1000,
    },
  };
}

export function webhookDeliveryMode() {
  return process.env.WEBHOOK_DELIVERY_MODE === 'queue' ? 'queue' : 'sync';
}

export function redisConnectionOptions(redisUrl: string) {
  const parsed = new URL(redisUrl);
  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 6379,
    username: parsed.username ? decodeURIComponent(parsed.username) : undefined,
    password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
    db: parsed.pathname.length > 1 ? Number(parsed.pathname.slice(1)) : 0,
    maxRetriesPerRequest: null,
  };
}
