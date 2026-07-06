import { createHmac } from 'node:crypto';

export type WebhookEventType = 'email.received' | 'email.sent' | 'approval.required' | 'approval.rejected' | string;

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
