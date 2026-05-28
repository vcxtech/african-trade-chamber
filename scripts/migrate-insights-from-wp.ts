/**
 * Import WordPress insight posts (standard posts with insight categories) into Payload.
 *
 * Usage:
 *   npm run migrate:insights -- data/africantradechamber.WordPress.2026-05-26.xml
 */

import './load-env.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { XMLParser } from 'fast-xml-parser'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { requireEnv } from './load-env.js'
import { wpUploadUrlToLocal } from '../src/lib/wp-uploads.js'
import type { InsightCategory } from '../src/types/insight-article.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../data')

const EXCERPT_MAX = 200

const WP_CATEGORY_TO_INSIGHT: Record<string, InsightCategory> = {
  'sector-reports': 'sector-report',
  'market-brief': 'trade-market-brief',
  'investment-landscape': 'investment-snapshot',
  'atc-policy-brief': 'policy-paper',
}

function resolveExportPath(): string {
  const arg = process.argv[2]
  if (arg) {
    const p = path.isAbsolute(arg) ? arg : path.resolve(process.cwd(), arg)
    if (fs.existsSync(p)) return p
    console.error(`Export file not found: ${p}`)
    process.exit(1)
  }

  const xmlFiles = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.xml'))
    .map((f) => {
      const full = path.join(DATA_DIR, f)
      return { full, size: fs.statSync(full).size, mtime: fs.statSync(full).mtimeMs }
    })
    .sort((a, b) => b.size - a.size || b.mtime - a.mtime)

  if (xmlFiles.length) return xmlFiles[0].full
  return path.join(DATA_DIR, 'wp-export.xml')
}

type WpInsightRow = {
  title: string
  slug: string
  excerpt?: string
  contentHtml?: string
  publishedAt?: string
  category: InsightCategory
  author?: string
  imageUrl?: string
  originalUrl?: string
}

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

function textVal(node: unknown): string {
  if (node == null) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node).trim()
  if (typeof node === 'object' && node !== null && '#text' in node) {
    return String((node as Record<string, unknown>)['#text']).trim()
  }
  return String(node).trim()
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function truncateExcerpt(text: string): string {
  const t = text.trim()
  if (t.length <= EXCERPT_MAX) return t
  return `${t.slice(0, EXCERPT_MAX)}...`
}

function parseWpDate(raw: string): string | undefined {
  if (!raw) return undefined
  const normalized = raw.trim().replace(' ', 'T')
  const d = new Date(normalized.includes('T') ? normalized : `${normalized}T12:00:00`)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}

function mapInsightCategory(item: Record<string, unknown>): InsightCategory | undefined {
  for (const c of asArray(item.category)) {
    const row = c as Record<string, unknown>
    const domain = String(row['@_domain'] ?? row.domain ?? '')
    if (domain && domain !== 'category') continue
    const nicename = String(row['@_nicename'] ?? '').toLowerCase()
    const mapped = WP_CATEGORY_TO_INSIGHT[nicename]
    if (mapped) return mapped
  }
  return undefined
}

function getMeta(item: Record<string, unknown>, key: string): string {
  for (const m of asArray(item['wp:postmeta'])) {
    const row = m as Record<string, unknown>
    if (textVal(row['wp:meta_key']) === key) return textVal(row['wp:meta_value'])
  }
  return ''
}

function parseItems(xml: string): { insights: WpInsightRow[]; attachments: Map<string, string> } {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    trimValues: true,
    parseTagValue: false,
    isArray: (name) =>
      name === 'item' ||
      name === 'wp:postmeta' ||
      name === 'category' ||
      name === 'content:encoded' ||
      name === 'excerpt:encoded',
  })

  const parsed = parser.parse(xml)
  const channel = parsed?.rss?.channel ?? parsed?.channel
  const items = asArray(channel?.item) as Record<string, unknown>[]

  const attachments = new Map<string, string>()
  const insights: WpInsightRow[] = []

  for (const item of items) {
    const postType = textVal(item['wp:post_type'])
    const postId = textVal(item['wp:post_id'])

    if (postType === 'attachment') {
      const url = textVal(item['wp:attachment_url']) || textVal(item['link'])
      if (postId && url) attachments.set(postId, url)
      continue
    }

    if (postType !== 'post') continue

    const status = textVal(item['wp:status'])
    if (status && status !== 'publish') continue

    const category = mapInsightCategory(item)
    if (!category) continue

    const title = textVal(item.title)
    const slug = textVal(item['wp:post_name'])
    if (!title || !slug) continue

    const contentHtml = textVal(item['content:encoded'])
    const wpExcerpt = stripHtml(textVal(item['excerpt:encoded']))
    const excerpt = wpExcerpt
      ? wpExcerpt
      : contentHtml
        ? truncateExcerpt(stripHtml(contentHtml))
        : undefined

    const publishedAt =
      parseWpDate(textVal(item['wp:post_date'])) || parseWpDate(textVal(item.pubDate))

    const thumbId = getMeta(item, '_thumbnail_id')
    const imageUrl = thumbId ? wpUploadUrlToLocal(attachments.get(thumbId)) : undefined

    insights.push({
      title,
      slug,
      excerpt,
      contentHtml: contentHtml || undefined,
      publishedAt,
      category,
      author: textVal(item['dc:creator']) || undefined,
      imageUrl,
      originalUrl: textVal(item.link) || undefined,
    })
  }

  return { insights, attachments }
}

async function main() {
  requireEnv('DATABASE_URI')
  requireEnv('PAYLOAD_SECRET')

  const exportPath = resolveExportPath()
  console.log('WordPress insights → Payload import')
  console.log('Using export:', exportPath)

  if (!fs.existsSync(exportPath)) {
    console.error('\nNo XML export found in data/')
    process.exit(1)
  }

  const xml = fs.readFileSync(exportPath, 'utf-8')
  const { insights } = parseItems(xml)
  console.log(`Parsed ${insights.length} published insight posts`)

  if (!insights.length) {
    console.log('No insight posts found.')
    process.exit(0)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config })

  const editorConfig = await editorConfigFactory.default({
    config: payload.config,
    parentIsLocalized: false,
  })

  const htmlToLexical = (html: string) => {
    if (!html.trim()) return undefined
    try {
      return convertHTMLToLexical({
        html,
        editorConfig,
        JSDOM: JSDOM as unknown as new (html: string) => { window: { document: Document } },
      })
    } catch (err) {
      console.warn('HTML → Lexical failed:', err instanceof Error ? err.message : err)
      return undefined
    }
  }

  let created = 0
  let updated = 0

  for (const row of insights) {
    const content = row.contentHtml ? htmlToLexical(row.contentHtml) : undefined

    const data = {
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      ...(content ? { content } : {}),
      category: row.category,
      publishedAt: row.publishedAt,
      author: row.author,
      imageUrl: row.imageUrl,
      originalUrl: row.originalUrl,
    }

    const existing = await payload.find({
      collection: 'insights',
      where: { slug: { equals: row.slug } },
      limit: 1,
    })

    if (existing.docs[0]) {
      try {
        await payload.update({
          collection: 'insights',
          id: existing.docs[0].id,
          data,
        })
        updated++
      } catch (err) {
        console.warn(`Failed to update insight "${row.slug}":`, err instanceof Error ? err.message : err)
      }
    } else {
      await payload.create({
        collection: 'insights',
        data,
      })
      created++
    }
  }

  console.log(`Done: ${created} created, ${updated} updated`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
