type RateLimitEntry = {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const WINDOW_MS = 60 * 60 * 1000
const MAX_REQUESTS = 10

function pruneExpired(now: number) {
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key)
    }
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

export function checkFormRateLimit(request: Request): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now()
  pruneExpired(now)

  const ip = getClientIp(request)
  const key = `form-submit:${ip}`
  const existing = store.get(key)

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true }
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    }
  }

  existing.count += 1
  return { allowed: true }
}
