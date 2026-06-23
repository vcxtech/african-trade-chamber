const MAX_JSON_BYTES = 256 * 1024
const MAX_FIELD_LENGTH = 10_000
const MAX_TOP_LEVEL_FIELDS = 80
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const HONEYPOT_FIELD = '_website'

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
export const MAX_SUPPORTING_DOCS = 5

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
])

const ALLOWED_MIME_PREFIXES = ['image/']
const ALLOWED_MIME_EXACT = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

export function sanitizeFormData(data: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {}
  const keys = Object.keys(data)

  if (keys.length > MAX_TOP_LEVEL_FIELDS) {
    throw new Error('Too many form fields')
  }

  for (const [key, value] of Object.entries(data)) {
    if (key === 'notifyEmail' || key === HONEYPOT_FIELD) continue
    cleaned[key] = sanitizeValue(value)
  }

  return cleaned
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    if (value.length > MAX_FIELD_LENGTH) {
      throw new Error('Field value too long')
    }
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean' || value == null) {
    return value
  }

  if (Array.isArray(value)) {
    if (value.length > MAX_SUPPORTING_DOCS + 2) {
      throw new Error('Too many values in field')
    }
    return value.map(sanitizeValue)
  }

  if (typeof value === 'object') {
    return value
  }

  return String(value).slice(0, MAX_FIELD_LENGTH)
}

export function validateSubmitEmail(email: string | undefined): void {
  if (!email) return
  if (email.length > 320 || !EMAIL_PATTERN.test(email)) {
    throw new Error('Invalid email address')
  }
}

export async function readJsonBodyWithLimit(request: Request): Promise<unknown> {
  const raw = await request.text()
  if (raw.length > MAX_JSON_BYTES) {
    throw new Error('Request body too large')
  }
  if (!raw.trim()) {
    throw new Error('Missing request body')
  }
  return JSON.parse(raw) as unknown
}

export function validateUploadFile(file: File, fallbackName: string): void {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('File too large (max 10 MB)')
  }

  const name = file instanceof File ? file.name : fallbackName
  const ext = pathExtension(name)
  const mime = file.type || 'application/octet-stream'

  if (!isAllowedUpload(mime, ext)) {
    throw new Error('File type not allowed')
  }
}

function pathExtension(filename: string): string {
  const idx = filename.lastIndexOf('.')
  if (idx === -1) return ''
  return filename.slice(idx).toLowerCase()
}

function isAllowedUpload(mime: string, ext: string): boolean {
  if (ALLOWED_MIME_EXACT.has(mime)) return true
  if (ALLOWED_MIME_PREFIXES.some((prefix) => mime.startsWith(prefix))) return true
  if (mime === 'application/octet-stream' && ext && ALLOWED_EXTENSIONS.has(ext)) {
    return true
  }
  return false
}
