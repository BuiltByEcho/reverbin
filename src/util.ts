import { nanoid } from 'nanoid';

export function id(prefix: string) {
  return `${prefix}_${nanoid(16)}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function parseAddressDomain(email: string) {
  const [, domain = ''] = email.toLowerCase().split('@');
  return domain;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function arrayify<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}
