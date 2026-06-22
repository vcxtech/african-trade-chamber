/** WordPress media host — often unreachable in local dev (DNS/firewall). */
export function isWpMediaUrl(url?: string | null): boolean {
  if (!url) return false
  return url.includes('africantradechamber.org')
}

export function isPayloadMediaUrl(url?: string | null): boolean {
  if (!url) return false
  if (url.startsWith('/api/media/')) return true
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      return new URL(url).pathname.startsWith('/api/media/file/')
    } catch {
      return false
    }
  }
  return false
}

/** Prefer local `/images/...` or non-WP URLs for next/image. */
export function resolveImageUrl(
  url: string | undefined,
  fallback?: string,
): string | undefined {
  if (!url) return fallback
  if (url.startsWith('/images/')) return url
  if (isWpMediaUrl(url)) return fallback
  return url
}

/** Static public paths (excludes Payload API URLs). */
export function isLocalImage(url: string): boolean {
  return url.startsWith('/') && !isPayloadMediaUrl(url)
}

/**
 * Paths eligible for Next.js image optimization (see next.config.mjs).
 * In development, Payload media is served directly to avoid the dev-server
 * self-fetch loop (/_next/image → localhost /api/media/file/ → timeout/retry storm).
 */
export function canOptimizeImage(url: string): boolean {
  if (!url) return false
  if (url.startsWith('/images/')) return true
  if (process.env.NODE_ENV === 'development') return false
  if (isPayloadMediaUrl(url)) return true
  return false
}

/** Build a /_next/image URL for preload hints (matches default Next.js loader). */
export function getNextImageSrc(url: string, width: number, quality = 75): string {
  if (!canOptimizeImage(url)) return url
  return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`
}
