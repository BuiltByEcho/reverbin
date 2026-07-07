import { timingSafeEqual } from 'node:crypto';

export type DashboardHeaders = {
  authorization?: string | string[];
  cookie?: string | string[];
};

export function dashboardTokenFromEnv(env: NodeJS.ProcessEnv = process.env) {
  return env.DASHBOARD_TOKEN || env.ECHO_EMAIL_API_KEY || '';
}

function firstHeader(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function parseDashboardCookies(cookieHeader: string | string[] | undefined) {
  const header = firstHeader(cookieHeader) ?? '';
  const cookies: Record<string, string> = {};
  for (const part of header.split(';')) {
    const [rawName, ...rawValue] = part.split('=');
    const name = rawName?.trim();
    if (!name) continue;
    const value = rawValue.join('=').trim();
    try {
      cookies[name] = decodeURIComponent(value);
    } catch {
      cookies[name] = value;
    }
  }
  return cookies;
}

export function isDashboardRequestAuthorized(headers: DashboardHeaders, configuredToken: string | undefined) {
  const token = configuredToken?.trim() ?? '';
  if (!token) return false;

  const auth = firstHeader(headers.authorization) ?? '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length).trim() : '';
  if (bearer && safeEqual(bearer, token)) return true;

  const cookies = parseDashboardCookies(headers.cookie);
  const cookieToken = cookies.reverbin_dashboard ?? '';
  return Boolean(cookieToken) && safeEqual(cookieToken, token);
}

export function dashboardCookie(token: string, options: { secure?: boolean; maxAgeSeconds?: number } = {}) {
  const maxAge = options.maxAgeSeconds ?? 60 * 60 * 12;
  const parts = [
    `reverbin_dashboard=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];
  if (options.secure ?? true) parts.push('Secure');
  return parts.join('; ');
}

export function clearDashboardCookie() {
  return 'reverbin_dashboard=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure';
}
