import { createHmac, timingSafeEqual } from 'node:crypto';

export type InternalAddress = {
  email: string;
  name?: string;
};

export type NormalizedInboundEmail = {
  email_address: string;
  provider: 'resend';
  provider_message_id?: string;
  from: InternalAddress;
  to: InternalAddress[];
  cc?: InternalAddress[];
  bcc?: InternalAddress[];
  subject: string;
  text: string;
  html?: string | null;
  headers?: Record<string, unknown>;
  raw_mime_storage_key?: string;
};

type ResendReceivedEvent = {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    id?: string;
    from?: string;
    to?: string[];
    cc?: string[];
    bcc?: string[];
    received_for?: string[];
    message_id?: string;
    subject?: string;
    attachments?: unknown[];
    tags?: Record<string, string>;
    [key: string]: unknown;
  };
};

export type ResendReceivedEmailDetails = {
  from?: string;
  to?: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  text?: string | null;
  html?: string | null;
  headers?: Record<string, unknown> | null;
  received_for?: string[];
  message_id?: string;
  raw?: { download_url?: string; expires_at?: string } | null;
  attachments?: unknown[];
};

function firstHeaderValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseEmailAddress(input: string | undefined): InternalAddress {
  const value = (input ?? '').trim();
  const displayMatch = value.match(/^\s*"?([^"<]*)"?\s*<([^>]+)>\s*$/);
  if (displayMatch) {
    const name = displayMatch[1].trim();
    return name ? { email: displayMatch[2].trim().toLowerCase(), name } : { email: displayMatch[2].trim().toLowerCase() };
  }
  return { email: value.toLowerCase() };
}

function addressList(values: string[] | undefined): InternalAddress[] {
  return (values ?? []).filter(Boolean).map(parseEmailAddress);
}

export function normalizeResendReceivedEmail(
  event: ResendReceivedEvent,
  details?: ResendReceivedEmailDetails,
): NormalizedInboundEmail {
  if (event.type !== 'email.received') {
    throw new Error(`unsupported Resend event type: ${event.type}`);
  }
  const data = event.data ?? {};
  const to = details?.to ?? data.to ?? [];
  const cc = details?.cc ?? data.cc ?? [];
  const bcc = details?.bcc ?? data.bcc ?? [];
  const receivedFor = details?.received_for ?? data.received_for ?? [];
  const headers = { ...(details?.headers ?? {}) } as Record<string, unknown>;
  const emailId = String(data.email_id ?? data.id ?? '');
  const messageId = details?.message_id ?? data.message_id;
  const attachments = details?.attachments ?? data.attachments ?? [];

  if (emailId) headers['x-resend-email-id'] = emailId;
  if (messageId) headers['message-id'] = messageId;
  headers['x-resend-event-created-at'] = event.created_at ?? null;
  headers['x-resend-attachment-count'] = attachments.length;
  if (receivedFor.length > 0) headers['x-resend-received-for'] = receivedFor;

  return {
    email_address: (receivedFor[0] ?? to[0] ?? '').toLowerCase(),
    provider: 'resend',
    provider_message_id: emailId || messageId,
    from: parseEmailAddress(typeof headers.from === 'string' ? headers.from : (details?.from ?? data.from)),
    to: addressList(to),
    cc: addressList(cc),
    bcc: addressList(bcc),
    subject: details?.subject ?? data.subject ?? '(no subject)',
    text: details?.text ?? '',
    html: details?.html ?? null,
    headers,
    raw_mime_storage_key: details?.raw?.download_url,
  };
}

export function verifySvixSignature(
  rawBody: string,
  headers: Record<string, string | string[] | undefined>,
  secret: string,
  toleranceSeconds = 5 * 60,
): boolean {
  const id = firstHeaderValue(headers['svix-id']);
  const timestamp = firstHeaderValue(headers['svix-timestamp']);
  const signatureHeader = firstHeaderValue(headers['svix-signature']);
  if (!id || !timestamp || !signatureHeader || !secret.startsWith('whsec_')) return false;

  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber)) return false;
  const age = Math.abs(Math.floor(Date.now() / 1000) - timestampNumber);
  if (age > toleranceSeconds) return false;

  const secretPayload = secret.slice('whsec_'.length);
  let secretBytes: Buffer;
  try {
    secretBytes = Buffer.from(secretPayload, 'base64');
  } catch {
    return false;
  }
  if (secretBytes.length === 0) return false;

  const expected = createHmac('sha256', secretBytes).update(`${id}.${timestamp}.${rawBody}`).digest();
  for (const token of signatureHeader.split(/\s+/)) {
    const [, encoded] = token.split(',', 2);
    if (!encoded) continue;
    const provided = Buffer.from(encoded, 'base64');
    if (provided.length === expected.length && timingSafeEqual(provided, expected)) return true;
  }
  return false;
}

export async function fetchResendReceivedEmail(emailId: string, apiKey: string): Promise<ResendReceivedEmailDetails> {
  const response = await fetch(`https://api.resend.com/emails/receiving/${encodeURIComponent(emailId)}?html_format=cid`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Resend received email fetch failed: ${response.status} ${JSON.stringify(payload)}`);
  }
  return payload as ResendReceivedEmailDetails;
}
