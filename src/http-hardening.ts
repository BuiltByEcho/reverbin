const DEFAULT_ALLOWED_CORS_ORIGINS = [
  'https://reverbin.com',
  'https://www.reverbin.com',
  'https://app.reverbin.com',
  'https://api.reverbin.com',
  'https://reverbin.vercel.app',
];

function splitOrigins(value: string | undefined) {
  return (value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function allowedCorsOrigins(env: NodeJS.ProcessEnv = process.env) {
  const configured = splitOrigins(env.CORS_ALLOWED_ORIGINS);
  return configured.length > 0 ? configured : DEFAULT_ALLOWED_CORS_ORIGINS;
}

function isLocalDevelopmentOrigin(origin: string, env: NodeJS.ProcessEnv) {
  if (env.NODE_ENV === 'production') return false;
  try {
    const parsed = new URL(origin);
    return ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname);
  } catch {
    return false;
  }
}

export function isCorsOriginAllowed(origin: string | undefined, env: NodeJS.ProcessEnv = process.env) {
  if (!origin) return true;
  if (allowedCorsOrigins(env).includes(origin)) return true;
  return isLocalDevelopmentOrigin(origin, env);
}

export function configuredSecret(value: string | undefined) {
  const trimmed = (value ?? '').trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function webhookDeliveryTimeoutMs(env: NodeJS.ProcessEnv = process.env) {
  const raw = Number(env.WEBHOOK_DELIVERY_TIMEOUT_MS ?? 10_000);
  if (!Number.isFinite(raw) || raw <= 0) return 10_000;
  return Math.min(Math.max(Math.trunc(raw), 1_000), 60_000);
}

export function internalErrorPayload() {
  return { error: 'internal_error' };
}
