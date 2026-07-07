import { webhookDeliveryMode } from './webhook-delivery.js';

export type ReadinessBody = {
  ok: boolean;
  db: 'ok' | 'error';
  redis?: 'ok' | 'error' | 'missing_config';
  webhook_delivery_mode: 'sync' | 'queue';
};

export type ReadinessResult = {
  statusCode: 200 | 503;
  body: ReadinessBody;
};

export type ReadinessCheckOptions = {
  env?: NodeJS.ProcessEnv | Record<string, string | undefined>;
  checkDb: () => Promise<unknown>;
  checkRedis: () => Promise<unknown>;
};

export async function checkReadiness(options: ReadinessCheckOptions): Promise<ReadinessResult> {
  const env = options.env ?? process.env;
  const mode = webhookDeliveryMode(env);
  const body: ReadinessBody = {
    ok: true,
    db: 'ok',
    webhook_delivery_mode: mode,
  };

  try {
    await options.checkDb();
  } catch {
    body.ok = false;
    body.db = 'error';
  }

  if (mode === 'queue') {
    if (!env.REDIS_URL) {
      body.ok = false;
      body.redis = 'missing_config';
    } else {
      try {
        await options.checkRedis();
        body.redis = 'ok';
      } catch {
        body.ok = false;
        body.redis = 'error';
      }
    }
  }

  return { statusCode: body.ok ? 200 : 503, body };
}
