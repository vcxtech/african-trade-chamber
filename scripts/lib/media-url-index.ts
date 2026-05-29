import type { Payload } from 'payload'
import { wpUploadUrlToLocal } from '../../src/lib/wp-uploads.js'

export type MediaPathIndex = {
  byPath: Map<string, number>
  byFilename: Map<string, number>
}

/** Normalize legacy URL strings to local public paths like /uploads/... or /images/... */
export function normalizeLegacyUrl(url?: string | null): string | undefined {
  if (!url) return undefined
  const trimmed = url.trim()
  if (!trimmed) return undefined

  const local = wpUploadUrlToLocal(trimmed)
  let path: string | undefined

  if (local?.startsWith('/')) {
    path = local
  } else {
    try {
      const parsed = new URL(trimmed)
      const pathname = parsed.pathname
      if (pathname.startsWith('/uploads/') || pathname.startsWith('/images/')) path = pathname
      const wpMatch = pathname.match(/\/wp-content\/uploads\/(.+)$/i)
      if (wpMatch) path = `/uploads/${wpMatch[1]}`
    } catch {
      /* not a full URL */
    }

    if (!path && (trimmed.startsWith('/uploads/') || trimmed.startsWith('/images/'))) {
      path = trimmed
    }
  }

  if (!path) return local

  try {
    return decodeURIComponent(path)
  } catch {
    return path
  }
}

export async function buildMediaPathIndex(payload: Payload): Promise<MediaPathIndex> {
  const byPath = new Map<string, number>()
  const byFilename = new Map<string, number>()

  let page = 1
  const pageSize = 500

  for (;;) {
    const result = await payload.find({
      collection: 'media',
      limit: pageSize,
      page,
      overrideAccess: true,
    })

    for (const doc of result.docs) {
      const row = doc as { id: number; alt?: string; filename?: string }
      const id = row.id

      if (row.alt?.startsWith('import:')) {
        const path = row.alt.slice('import:'.length)
        if (path) byPath.set(path, id)
      }

      if (row.filename) {
        const base = row.filename.split(/[/\\]/).pop() ?? row.filename
        if (!byFilename.has(base)) byFilename.set(base, id)
      }
    }

    if (!result.hasNextPage) break
    page += 1
  }

  return { byPath, byFilename }
}

export function resolveMediaId(
  url: string | null | undefined,
  index: MediaPathIndex,
): number | null {
  const normalized = normalizeLegacyUrl(url)
  if (!normalized) return null

  const fromPath = index.byPath.get(normalized)
  if (fromPath != null) return fromPath

  const basename = normalized.split('/').pop()
  if (basename) {
    const fromFilename = index.byFilename.get(basename)
    if (fromFilename != null) return fromFilename
  }

  return null
}

export function isUploadEmpty(value: unknown): boolean {
  if (value == null || value === '') return true
  if (typeof value === 'number') return false
  if (typeof value === 'object' && value !== null && 'id' in value) return false
  return true
}
