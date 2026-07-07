export type FixedWindowRateLimitResult = {
  allowed: boolean;
  remaining: number;
  retry_after_seconds: number;
};

export type FixedWindowRateLimiter = {
  check: (key: string) => FixedWindowRateLimitResult;
};

export function createFixedWindowRateLimiter(options: {
  limit: number;
  windowMs: number;
  now?: () => number;
}): FixedWindowRateLimiter {
  const now = options.now ?? Date.now;
  const entries = new Map<string, { count: number; resetAt: number }>();

  return {
    check(key: string) {
      const current = now();
      const existing = entries.get(key);
      const entry = existing && existing.resetAt > current
        ? existing
        : { count: 0, resetAt: current + options.windowMs };
      entry.count += 1;
      entries.set(key, entry);

      const retryAfter = Math.max(1, Math.ceil((entry.resetAt - current) / 1000));
      const remaining = Math.max(0, options.limit - entry.count);
      return {
        allowed: entry.count <= options.limit,
        remaining,
        retry_after_seconds: retryAfter,
      };
    },
  };
}
