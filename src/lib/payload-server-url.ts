function normalizeServerUrl(url: string): string {
  return url.trim().replace(/\/$/, '')
}

function expandProtocolVariants(url: string): string[] {
  const normalized = normalizeServerUrl(url)
  try {
    const parsed = new URL(normalized)
    const host = parsed.host
    return [...new Set([normalized, `http://${host}`, `https://${host}`].map(normalizeServerUrl))]
  } catch {
    return [normalized]
  }
}

/** Public origins used for Payload serverURL, CSRF, and CORS. */
export function getServerURLs(): string[] {
  const values = [
    process.env.PAYLOAD_SERVER_URL,
    process.env.NEXT_PUBLIC_SERVER_URL,
    process.env.PAYLOAD_EXTRA_CSRF_ORIGINS,
    'http://localhost:3000',
    'http://localhost:3002',
  ]

  const urls = values
    .flatMap((value) => {
      if (typeof value !== 'string' || !value.trim()) return []
      return value.split(',').flatMap((part) => expandProtocolVariants(part))
    })
    .map(normalizeServerUrl)

  return [...new Set(urls)]
}

export function getPrimaryServerURL(): string {
  const configured =
    process.env.PAYLOAD_SERVER_URL?.trim() ||
    process.env.NEXT_PUBLIC_SERVER_URL?.trim()

  if (configured) return normalizeServerUrl(configured)
  return 'http://localhost:3000'
}

/** Whether auth cookies should use the Secure flag (required for HTTPS-only cookies). */
export function getPayloadCookieSecure(): boolean {
  if (process.env.PAYLOAD_COOKIE_SECURE === 'true') return true
  if (process.env.PAYLOAD_COOKIE_SECURE === 'false') return false
  return getPrimaryServerURL().startsWith('https://')
}
