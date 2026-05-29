import { resolveImageUrl } from '@/lib/image-url'

/** Resolve a Payload media upload (populated or ID) to a public URL. */
export function payloadMediaUrl(media: unknown): string | undefined {
  if (!media || typeof media === 'number') return undefined
  const row = media as Record<string, unknown>
  const url = row.url as string | undefined
  if (!url) return undefined
  if (url.startsWith('http')) return url
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002').replace(/\/$/, '')
  return `${base}${url.startsWith('/') ? url : `/${url}`}`
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
): string | undefined {
  const fromUpload = payloadMediaUrl(media)
  if (fromUpload) return fromUpload
  const legacy = legacyUrl ? String(legacyUrl).trim() : ''
  if (legacy) return resolveImageUrl(legacy, fallback)
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
