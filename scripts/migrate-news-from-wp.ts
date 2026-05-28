/**
 * Import WordPress news posts from WXR export into Payload.
 *
 * 1. WordPress: Tools → Export → News (or All content)
 * 2. Save as: data/wp-export.xml
 * 3. docker compose up -d postgres
 * 4. npm run migrate:news
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

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../data')

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
      return { name: f, full, size: fs.statSync(full).size, mtime: fs.statSync(full).mtimeMs }
    })
    .sort((a, b) => b.size - a.size || b.mtime - a.mtime)

  if (xmlFiles.length) return xmlFiles[0].full

  return path.join(DATA_DIR, 'wp-export.xml')
}

const EXCERPT_MAX = 120

type WpNewsRow = {
  title: string
  slug: string
  excerpt?: string
  contentHtml?: string
  publishedAt?: string
  category: 'chamber' | 'member' | 'press' | 'media' | 'newsletter'
  newsSource?: string
  newsAuthor?: string
  newsDate?: string
  originalUrl?: string
  featured: boolean
  priority: 'low' | 'medium' | 'high'
  expiryDate?: string
  imageUrl?: string
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
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
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

function mapCategory(item: Record<string, unknown>, unmapped: Set<string>): WpNewsRow['category'] {
  for (const c of asArray(item.category)) {
    const row = c as Record<string, unknown>
    const domain = String(row['@_domain'] ?? row.domain ?? '')
    if (domain && domain !== 'news_category' && domain !== 'category') continue
    const nicename = String(row['@_nicename'] ?? '').toLowerCase()
    const label = textVal(c).toLowerCase()
    const hay = `${nicename} ${label}`
    if (hay.includes('newsletter')) return 'newsletter'
    if (hay.includes('media')) return 'media'
    if (hay.includes('member')) return 'member'
    if (hay.includes('press')) return 'press'
    if (hay.includes('chamber')) return 'chamber'
    if (nicename || label) unmapped.add(`${nicename || label}`)
  }

  const link = textVal(item.link).toLowerCase()
  if (link.includes('newsletter')) return 'newsletter'
  if (link.includes('media-coverage')) return 'media'

  return 'chamber'
}

function getMeta(item: Record<string, unknown>, key: string): string {
  for (const m of asArray(item['wp:postmeta'])) {
    const row = m as Record<string, unknown>
    if (textVal(row['wp:meta_key']) === key) return textVal(row['wp:meta_value'])
  }
  return ''
}

function parsePriority(raw: string): 'low' | 'medium' | 'high' {
  const v = raw.toLowerCase()
  if (v === 'low' || v === 'high') return v
  return 'medium'
}

function parseItems(xml: string): { news: WpNewsRow[]; attachments: Map<string, string> } {
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
  const unmappedCategories = new Set<string>()
  const news: WpNewsRow[] = []

  for (const item of items) {
    const postType = textVal(item['wp:post_type'])
    const postId = textVal(item['wp:post_id'])

    if (postType === 'attachment') {
      const url = textVal(item['wp:attachment_url']) || textVal(item['link'])
      if (postId && url) attachments.set(postId, url)
      continue
    }

    if (postType !== 'news') continue

    const status = textVal(item['wp:status'])
    if (status && status !== 'publish') continue

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
    const imageUrl = thumbId ? attachments.get(thumbId) : undefined

    const featuredRaw = getMeta(item, '_featured_news')
    const featured = featuredRaw === '1' || featuredRaw === 'yes'

    const newsDateRaw = getMeta(item, '_news_date')
    const expiryRaw = getMeta(item, '_news_expiry_date')

    news.push({
      title,
      slug,
      excerpt,
      contentHtml: contentHtml || undefined,
      publishedAt,
      category: mapCategory(item, unmappedCategories),
      newsSource: getMeta(item, '_news_source') || undefined,
      newsAuthor: getMeta(item, '_news_author') || undefined,
      newsDate: newsDateRaw ? newsDateRaw.slice(0, 10) : undefined,
      originalUrl: getMeta(item, '_news_url') || textVal(item.link) || undefined,
      featured,
      priority: parsePriority(getMeta(item, '_news_priority')),
      expiryDate: expiryRaw ? expiryRaw.slice(0, 10) : undefined,
      imageUrl,
    })
  }

  if (unmappedCategories.size) {
    console.log('Category notes (defaulted to chamber):', [...unmappedCategories].join(', '))
  }

  return { news, attachments }
}

async function main() {
  requireEnv('DATABASE_URI')
  requireEnv('PAYLOAD_SECRET')

  const exportPath = resolveExportPath()

  console.log('WordPress news → Payload import')
  console.log('Using export:', exportPath)

  if (!fs.existsSync(exportPath)) {
    console.error('\nNo XML export found in data/')
    console.error('Place your WordPress export in data/ (e.g. data/wp-export.xml)')
    process.exit(1)
  }

  const xml = fs.readFileSync(exportPath, 'utf-8')
  const { news } = parseItems(xml)
  console.log(`Parsed ${news.length} published news posts`)

  if (!news.length) {
    console.log('No news items found. Export should include post_type "news".')
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
  let contentSkipped = 0

  for (const row of news) {
    const content = row.contentHtml ? htmlToLexical(row.contentHtml) : undefined
    if (row.contentHtml && !content) contentSkipped++

    const data = {
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      ...(content ? { content } : {}),
      category: row.category,
      publishedAt: row.publishedAt,
      newsSource: row.newsSource,
      newsAuthor: row.newsAuthor,
      newsDate: row.newsDate,
      originalUrl: row.originalUrl,
      featured: row.featured,
      priority: row.priority,
      expiryDate: row.expiryDate,
      imageUrl: row.imageUrl,
    }

    const existing = await payload.find({
      collection: 'news',
      where: { slug: { equals: row.slug } },
      limit: 1,
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'news',
        id: existing.docs[0].id,
        data,
      })
      updated++
    } else {
      await payload.create({
        collection: 'news',
        data,
      })
      created++
    }
  }

  if (contentSkipped) {
    console.log(`Warning: ${contentSkipped} posts had HTML but Lexical conversion failed`)
  }
  console.log(`Done: ${created} created, ${updated} updated`)
  console.log('Browse http://localhost:3002/news')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
