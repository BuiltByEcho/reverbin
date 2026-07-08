import { createHash, randomBytes } from 'node:crypto';
import { id } from './util.js';

export const SELF_SERVE_API_KEY_SCOPES = [
  'inboxes:read',
  'threads:read',
  'threads:reply',
  'webhooks:read',
  'webhooks:write',
] as const;

const RESERVED_LOCAL_PARTS = new Set([
  'abuse',
  'admin',
  'api',
  'app',
  'demo',
  'dustin',
  'hello',
  'help',
  'postmaster',
  'root',
  'security',
  'support',
  'www',
]);

export type SelfServeApiKeyRecord = {
  id: string;
  tenant_id: string;
  name: string;
  token: string;
  key_hash: string;
  scopes: string[];
};

export function hashApiKeyToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function generateApiKeyToken() {
  return `rvb_live_${randomBytes(32).toString('base64url')}`;
}

export function buildApiKeyRecord(input: { tenantId: string; name: string }): SelfServeApiKeyRecord {
  const token = generateApiKeyToken();
  return {
    id: id('key'),
    tenant_id: input.tenantId,
    name: input.name,
    token,
    key_hash: hashApiKeyToken(token),
    scopes: [...SELF_SERVE_API_KEY_SCOPES],
  };
}

export function normalizeSelfServeInboxLocalPart(input: string) {
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  if (normalized.length < 3 || normalized.length > 48) {
    throw new Error('preferred_inbox_name must normalize to between 3 and 48 characters');
  }
  if (RESERVED_LOCAL_PARTS.has(normalized)) {
    throw new Error(`${normalized} is a reserved Reverbin inbox name`);
  }
  return normalized;
}
