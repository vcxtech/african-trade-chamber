const INVISIBLE_CHAR =
  /[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF\u00AD]/g

/**
 * Normalize env values from Coolify/Docker/shell exports.
 * Strips surrounding quotes, invisible characters, and trailing whitespace.
 */
export function sanitizeEnvValue(raw: string): string {
  let value = raw.replace(/^\uFEFF/, '')

  while (
    (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
    (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
  ) {
    value = value.slice(1, -1)
  }

  value = value.replace(INVISIBLE_CHAR, '').trim()

  return value
}

export function readEnv(name: string): string | undefined {
  const raw = process.env[name]
  if (raw == null || typeof raw !== 'string') return undefined
  const sanitized = sanitizeEnvValue(raw)
  return sanitized || undefined
}

/** Safe diagnostic for secret env vars (never logs the value). */
export function describeSecretEnv(name: string, value: string): string {
  const raw = process.env[name]
  const rawLen = typeof raw === 'string' ? raw.length : 0
  const sanitizedLen = value.length
  const parts = [`${name} sanitized length=${sanitizedLen}`]

  if (rawLen !== sanitizedLen) {
    parts.push(`raw length=${rawLen}`)
  }

  if (sanitizedLen > 0) {
    parts.push(
      `firstCharCode=${value.charCodeAt(0)} lastCharCode=${value.charCodeAt(sanitizedLen - 1)}`,
    )
  }

  const invisibleInRaw =
    typeof raw === 'string' ? (raw.match(INVISIBLE_CHAR) ?? []).length : 0
  if (invisibleInRaw > 0) {
    parts.push(`removed ${invisibleInRaw} invisible character(s) from raw value`)
  }

  return parts.join(', ')
}

/**
 * Warn when a password looks like a known value with accidental extra characters.
 */
export function warnIfPasswordHasExtraSuffix(password: string, reference: string): void {
  if (!password.startsWith(reference) || password.length <= reference.length) return
  console.warn(
    `SEED_ADMIN_PASSWORD starts with "${reference}" but is ${password.length} characters (${password.length - reference.length} extra). ` +
      `Delete SEED_ADMIN_PASSWORD in Coolify, type ${reference} manually, save, and redeploy.`,
  )
}
