/**
 * Import images from public/uploads and public/images into the Payload Media collection.
 *
 * Usage:
 *   npm run media:import-uploads
 *   npm run media:import-uploads -- --limit=50
 *   npm run media:import-uploads -- --dry-run
 */

import './load-env.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { requireEnv } from './load-env.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MEDIA_DIR = path.join(ROOT, 'media')

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg'])

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const limitFlagIndex = args.findIndex((a) => a === '--limit' || a.startsWith('--limit='))
let limit = 0
if (limitFlagIndex >= 0) {
  const flag = args[limitFlagIndex]
  const fromEquals = flag.includes('=') ? flag.split('=')[1] : args[limitFlagIndex + 1]
  limit = Number.parseInt(fromEquals ?? '', 10) || 0
}

function slugAlt(filename: string): string {
  const base = path.basename(filename, path.extname(filename))
  return base.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim() || 'Image'
}

function isImageFile(filePath: string): boolean {
  return IMAGE_EXT.has(path.extname(filePath).toLowerCase())
}

function walkImages(dir: string, prefix: string, out: Array<{ abs: string; key: string; publicPath: string }>) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkImages(abs, `${prefix}/${entry.name}`, out)
      continue
    }
    if (!isImageFile(abs)) continue
    const rel = `${prefix}/${entry.name}`.replace(/\\/g, '/')
    out.push({ abs, key: rel, publicPath: rel })
  }
}

function safeDestName(key: string, used: Set<string>): string {
  const base = path.basename(key)
  if (!used.has(base)) {
    used.add(base)
    return base
  }
  const ext = path.extname(base)
  const stem = path.basename(base, ext)
  const flat = key.replace(/[/\\]/g, '__')
  let candidate = flat.includes('.') ? flat : `${flat}${ext}`
  let n = 1
  while (used.has(candidate)) {
    candidate = `${stem}-${n}${ext}`
    n += 1
  }
  used.add(candidate)
  return candidate
}

async function loadExistingFilenames(payload: Awaited<ReturnType<typeof getPayload>>) {
  const filenames = new Set<string>()
  const keys = new Set<string>()
  let page = 1
  const pageSize = 200
  for (;;) {
    const result = await payload.find({
      collection: 'media',
      limit: pageSize,
      page,
      overrideAccess: true,
    })
    for (const doc of result.docs) {
      const row = doc as { filename?: string; alt?: string }
      if (row.filename) filenames.add(row.filename)
      if (row.alt?.startsWith('import:')) keys.add(row.alt.slice('import:'.length))
    }
    if (!result.hasNextPage) break
    page += 1
  }
  return { filenames, keys }
}

async function main() {
  requireEnv('DATABASE_URI')
  requireEnv('PAYLOAD_SECRET')

  if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true })

  const sources = [
    { root: path.join(ROOT, 'public', 'uploads'), prefix: '/uploads' },
    { root: path.join(ROOT, 'public', 'images'), prefix: '/images' },
  ]

  const files: Array<{ abs: string; key: string; publicPath: string }> = []
  for (const { root, prefix } of sources) {
    const batch: Array<{ abs: string; key: string; publicPath: string }> = []
    walkImages(root, prefix, batch)
    files.push(...batch)
  }

  files.sort((a, b) => a.key.localeCompare(b.key))
  const toProcess = limit > 0 ? files.slice(0, limit) : files

  console.log(`Found ${files.length} image(s); processing ${toProcess.length}${dryRun ? ' (dry run)' : ''}`)

  const payload = await getPayload({ config })
  const { filenames: existingFilenames, keys: existingKeys } = await loadExistingFilenames(payload)
  const usedDest = new Set(existingFilenames)

  let imported = 0
  let skipped = 0
  let failed = 0

  for (const file of toProcess) {
    if (existingKeys.has(file.key)) {
      skipped += 1
      continue
    }

    const destName = safeDestName(file.key, usedDest)
    const destPath = path.join(MEDIA_DIR, destName)

    if (dryRun) {
      console.log(`[dry-run] would import ${file.key} -> ${destName}`)
      imported += 1
      continue
    }

    try {
      fs.copyFileSync(file.abs, destPath)
      await payload.create({
        collection: 'media',
        data: {
          alt: `import:${file.key}`,
        },
        filePath: destPath,
        overrideAccess: true,
      })
      imported += 1
      if (imported % 100 === 0) console.log(`Imported ${imported}...`)
    } catch (err) {
      failed += 1
      console.error(`Failed ${file.key}:`, err instanceof Error ? err.message : err)
      if (fs.existsSync(destPath)) {
        try {
          fs.unlinkSync(destPath)
        } catch {
          /* ignore */
        }
      }
    }
  }

  console.log('\n--- Import summary ---')
  console.log(`Imported: ${imported}`)
  console.log(`Skipped (already imported): ${skipped}`)
  console.log(`Failed: ${failed}`)
  console.log(`Total in library: ${existingFilenames.size + imported - skipped}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
