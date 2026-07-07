import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';

export type WebhookEventType = 'email.received' | 'email.sent' | 'approval.required' | 'approval.rejected' | string;

const ALLOWED_WEBHOOK_EVENTS = new Set(['*', 'email.received', 'email.sent', 'approval.required', 'approval.rejected']);

export function isAllowedWebhookEvent(event: string) {
  return ALLOWED_WEBHOOK_EVENTS.has(event);
}

function isLoopbackHost(hostname: string) {
  return ['localhost', '127.0.0.1', '::1'].includes(hostname);
}

function isPrivateOrLocalHost(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost')) return true;
  const version = isIP(host);
  if (version === 4) {
    const parts = host.split('.').map(Number);
    return parts[0] === 10
      || parts[0] === 127
      || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
      || (parts[0] === 192 && parts[1] === 168)
      || (parts[0] === 169 && parts[1] === 254)
      || parts[0] === 0;
  }
  if (version === 6) {
    return host === '::1'
      || host.startsWith('fc')
      || host.startsWith('fd')
      || host.startsWith('fe80:')
      || host === '::';
  }
  return false;
}

export function isAllowedWebhookUrl(input: string) {
  try {
    const parsed = new URL(input);
    if (parsed.protocol === 'https:') return !isPrivateOrLocalHost(parsed.hostname);
    return parsed.protocol === 'http:' && isLoopbackHost(parsed.hostname);
  } catch {
    return false;
  }
}

export type WebhookEndpointConfig = {
  id: string;
  url: string;
  secret?: string | null;
  events_json: unknown;
  status: string;
};

export type WebhookEventPayload = {
  type: WebhookEventType;
  created_at: string;
  data: Record<string, unknown>;
};

export function normalizeWebhookEvents(events: unknown): string[] {
  if (!Array.isArray(events)) return [];
  return events.map((event) => String(event).trim()).filter(Boolean);
}

export function shouldDeliverWebhookEvent(endpoint: WebhookEndpointConfig, eventType: WebhookEventType) {
  if (endpoint.status !== 'active') return false;
  const events = normalizeWebhookEvents(endpoint.events_json);
  return events.includes('*') || events.includes(eventType);
}

export function buildWebhookEventPayload(eventType: WebhookEventType, data: Record<string, unknown>, now = new Date()): WebhookEventPayload {
  return {
    type: eventType,
    created_at: now.toISOString(),
    data,
  };
}

export function signWebhookPayload(secret: string, payload: string) {
  const digest = createHmac('sha256', secret).update(payload).digest('hex');
  return `sha256=${digest}`;
}

export function buildWebhookDeliveryHeaders(input: { eventType: WebhookEventType; deliveryId: string; payload: string; secret?: string | null }) {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'user-agent': 'Reverbin-Agent-Email-Layer/0.1',
    'x-echo-email-event': input.eventType,
    'x-echo-email-delivery': input.deliveryId,
  };
  if (input.secret) {
    headers['x-echo-email-signature'] = signWebhookPayload(input.secret, input.payload);
  }
  return headers;
}
