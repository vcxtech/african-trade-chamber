import { resolveImageUrl } from '@/lib/image-url'

export type PayloadMediaSize = 'thumbnail' | 'heroBg' | 'heroSide' | 'card'

/** Strip server origin so CMS URLs stay relative (/api/media/file/...). */
export function normalizePayloadMediaUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const parsed = new URL(url)
      if (parsed.pathname.startsWith('/api/media/file/')) {
        return `${parsed.pathname}${parsed.search}`
      }
    } catch {
      // fall through
    }
  }
  if (url.startsWith('/')) return url
  return `/${url}`
}

/** Resolve a Payload media upload (populated or ID) to a public URL. */
export function payloadMediaUrl(media: unknown, size?: PayloadMediaSize): string | undefined {
  if (!media || typeof media === 'number') return undefined
  const row = media as Record<string, unknown>

  if (size) {
    const sizes = row.sizes as Record<string, { url?: string }> | undefined
    const sizedUrl = sizes?.[size]?.url
    if (typeof sizedUrl === 'string' && sizedUrl) {
      return normalizePayloadMediaUrl(sizedUrl)
    }
  }

  const url = row.url as string | undefined
  if (!url) return undefined
  return normalizePayloadMediaUrl(url)
}

export function payloadMediaAlt(media: unknown, fallback = ''): string {
  if (!media || typeof media === 'number') return fallback
  const row = media as Record<string, unknown>
  const alt = typeof row.alt === 'string' ? row.alt.trim() : ''
  return alt || fallback
}

/** Prefer uploaded media; fall back to legacy URL string and code defaults. */
export function resolvePayloadMediaUrl(
  media: unknown,
  legacyUrl?: string | null,
  fallback?: string,
  size?: PayloadMediaSize,
): string | undefined {
  const fromUpload = payloadMediaUrl(media, size)
  if (fromUpload) return fromUpload
  const legacy = legacyUrl ? String(legacyUrl).trim() : ''
  if (legacy) {
    const resolved = resolveImageUrl(legacy, fallback)
    if (resolved && (resolved.startsWith('http://') || resolved.startsWith('https://'))) {
      return normalizePayloadMediaUrl(resolved)
    }
    return resolved
  }
  return fallback
}

export function resolvePayloadMediaAlt(
  media: unknown,
  explicitAlt?: string | null,
  titleFallback = '',
): string {
  const explicit = explicitAlt?.trim()
  if (explicit) return explicit
  const fromMedia = payloadMediaAlt(media)
  if (fromMedia) return fromMedia
  return titleFallback
}
