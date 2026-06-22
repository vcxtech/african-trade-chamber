/**
 * Import WordPress TeamPress members (ex_team) from WXR export into Payload.
 *
 * Leadership (About page):
 *   npm run migrate:team -- data/africantradechamber.WordPress.2026-05-26.xml
 *
 * Fellows (2025 cohort page):
 *   npm run migrate:team -- data/africantradechamber.WordPress.2026-05-26.xml --fellows-only
 */

import './load-env.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { XMLParser } from 'fast-xml-parser'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { requireEnv } from './load-env.js'
import { wpUploadUrlToLocal } from '../src/lib/wp-uploads.js'
import { normalizeCountryKey, resolveCountrySeedName, upsertTeamTaxonomies } from '../src/lib/team-taxonomy-seeds.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../data')

const FELLOWS_ONLY = process.argv.includes('--fellows-only')
const DEFAULT_FELLOW_POSITION = '2025 Future Trade Leaders Fellow'

function resolveExportPath(): string {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
  const arg = args[0]
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

type LeadershipCategorySlug = 'advisory' | 'board' | 'secretariat'

type LeadershipRow = {
  name: string
  slug: string
  position?: string
  categorySlug: LeadershipCategorySlug
  bio?: string
  imageUrl?: string
  sortOrder: number
}

type FellowRow = {
  name: string
  slug: string
  position?: string
  categorySlug: 'fellow'
  country?: string
  memberCode?: string
  cohortYear: '2025' | '2026'
  bio?: string
  imageUrl?: string
  postDate: string
  sortOrder: number
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

function getMeta(item: Record<string, unknown>, key: string): string {
  for (const m of asArray(item['wp:postmeta'])) {
    const row = m as Record<string, unknown>
    if (textVal(row['wp:meta_key']) === key) return textVal(row['wp:meta_value'])
  }
  return ''
}

const BOARD_CATEGORY_RULES: { category: LeadershipCategorySlug; match: (hay: string) => boolean }[] = [
  { category: 'secretariat', match: (h) => h.includes('secretariat') },
  { category: 'board', match: (h) => h.includes('board of director') || h.includes('board-of-director') },
  { category: 'advisory', match: (h) => h.includes('advisory board') || h.includes('advisory-board') },
]

function categoryHaystack(item: Record<string, unknown>): string[] {
  const rows: string[] = []
  for (const c of asArray(item.category)) {
    const row = c as Record<string, unknown>
    const domain = String(row['@_domain'] ?? row.domain ?? '')
    if (domain && domain !== 'extp_cat') continue
    const nicename = String(row['@_nicename'] ?? '').toLowerCase()
    const label = textVal(c).toLowerCase()
    rows.push(`${nicename} ${label}`)
  }
  return rows
}

function isFellowOnly(item: Record<string, unknown>): boolean {
  const rows = categoryHaystack(item)
  const hasFellows = rows.some((h) => h.includes('fellow'))
  const hasLeadership = rows.some((h) =>
    BOARD_CATEGORY_RULES.some((rule) => rule.match(h)),
  )
  return hasFellows && !hasLeadership
}

function mapTeamCategory(item: Record<string, unknown>): LeadershipCategorySlug | null {
  for (const rule of BOARD_CATEGORY_RULES) {
    for (const hay of categoryHaystack(item)) {
      if (rule.match(hay)) return rule.category
    }
  }
  return null
}

function parseCountry(item: Record<string, unknown>): string | undefined {
  for (const c of asArray(item.category)) {
    const row = c as Record<string, unknown>
    const domain = String(row['@_domain'] ?? row.domain ?? '')
    if (domain && domain !== 'extp_cat') continue
    const nicename = String(row['@_nicename'] ?? '').toLowerCase()
    const label = textVal(c)
    if (nicename.includes('fellow')) continue
    if (label) return label
  }
  return undefined
}

function slugToMemberCode(slug: string): string {
  let code = slug.replace(/-\d+$/, '').toUpperCase()
  if (!code.startsWith('ATC-')) {
    code = code.replace(/^atc-/, 'ATC-')
  }
  return code
}

function parseLeadership(xml: string): { team: LeadershipRow[] } {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    trimValues: true,
    parseTagValue: false,
    isArray: (name) =>
      name === 'item' || name === 'wp:postmeta' || name === 'category' || name === 'content:encoded',
  })

  const parsed = parser.parse(xml)
  const channel = parsed?.rss?.channel ?? parsed?.channel
  const items = asArray(channel?.item) as Record<string, unknown>[]

  const attachments = new Map<string, string>()
  const team: LeadershipRow[] = []

  for (const item of items) {
    const postType = textVal(item['wp:post_type'])
    const postId = textVal(item['wp:post_id'])

    if (postType === 'attachment') {
      const url = textVal(item['wp:attachment_url']) || textVal(item['link'])
      if (postId && url) attachments.set(postId, url)
      continue
    }

    if (postType !== 'ex_team') continue
    if (textVal(item['wp:status']) !== 'publish' && textVal(item['wp:status'])) continue
    if (isFellowOnly(item)) continue

    const category = mapTeamCategory(item)
    if (!category) continue

    const name = textVal(item.title)
    const slug = textVal(item['wp:post_name'])
    if (!name || !slug) continue

    const thumbId = getMeta(item, '_thumbnail_id')
    const rawImage = thumbId ? attachments.get(thumbId) : undefined
    const extpOrder = parseInt(getMeta(item, 'extp_order'), 10)

    team.push({
      name,
      slug,
      position: getMeta(item, 'extp_position') || undefined,
      categorySlug: category,
      bio: textVal(item['content:encoded']) || textVal(item['excerpt:encoded']) || undefined,
      imageUrl: wpUploadUrlToLocal(rawImage),
      sortOrder: Number.isFinite(extpOrder) ? extpOrder : team.length,
    })
  }

  return { team }
}

function parseFellows(xml: string): { fellows: FellowRow[] } {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    trimValues: true,
    parseTagValue: false,
    isArray: (name) =>
      name === 'item' || name === 'wp:postmeta' || name === 'category' || name === 'content:encoded',
  })

  const parsed = parser.parse(xml)
  const channel = parsed?.rss?.channel ?? parsed?.channel
  const items = asArray(channel?.item) as Record<string, unknown>[]

  const attachments = new Map<string, string>()
  const fellows: FellowRow[] = []

  for (const item of items) {
    const postType = textVal(item['wp:post_type'])
    const postId = textVal(item['wp:post_id'])

    if (postType === 'attachment') {
      const url = textVal(item['wp:attachment_url']) || textVal(item['link'])
      if (postId && url) attachments.set(postId, url)
      continue
    }

    if (postType !== 'ex_team') continue
    if (textVal(item['wp:status']) !== 'publish' && textVal(item['wp:status'])) continue
    if (!isFellowOnly(item)) continue

    const name = textVal(item.title)
    const slug = textVal(item['wp:post_name'])
    if (!name || !slug) continue

    const thumbId = getMeta(item, '_thumbnail_id')
    const rawImage = thumbId ? attachments.get(thumbId) : undefined
    const postDate = textVal(item['wp:post_date']) || textVal(item['wp:post_date_gmt'])

    fellows.push({
      name,
      slug,
      position: getMeta(item, 'extp_position') || DEFAULT_FELLOW_POSITION,
      categorySlug: 'fellow',
      country: parseCountry(item),
      memberCode: slugToMemberCode(slug),
      cohortYear: '2025',
      bio: textVal(item['content:encoded']) || textVal(item['excerpt:encoded']) || undefined,
      imageUrl: wpUploadUrlToLocal(rawImage),
      postDate,
      sortOrder: fellows.length,
    })
  }

  return { fellows }
}

async function main() {
  requireEnv('DATABASE_URI')
  requireEnv('PAYLOAD_SECRET')

  const exportPath = resolveExportPath()
  console.log(FELLOWS_ONLY ? 'WordPress fellows → Payload import' : 'WordPress team → Payload import')
  console.log('Using export:', exportPath)

  if (!fs.existsSync(exportPath)) {
    console.error('\nNo XML export found in data/')
    process.exit(1)
  }

  const xml = fs.readFileSync(exportPath, 'utf-8')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config })

  console.log('Ensuring team taxonomies…')
  const taxonomyMaps = await upsertTeamTaxonomies(payload)
  const fellowCategoryId = taxonomyMaps.categoryBySlug.get('fellow')

  if (FELLOWS_ONLY) {
    const { fellows } = parseFellows(xml)
    console.log(`Parsed ${fellows.length} fellows`)

    if (!fellows.length) {
      console.log('No fellow ex_team items found.')
      process.exit(0)
    }

    let created = 0
    let updated = 0

    for (const row of fellows) {
      const categoryId = taxonomyMaps.categoryBySlug.get(row.categorySlug)
      const countryName = row.country ? resolveCountrySeedName(row.country) ?? row.country : undefined
      const countryId = countryName
        ? taxonomyMaps.countryByName.get(normalizeCountryKey(countryName))
        : undefined

      const data = {
        name: row.name,
        slug: row.slug,
        position: row.position,
        category: categoryId ?? fellowCategoryId,
        country: countryId,
        memberCode: row.memberCode,
        cohortYear: row.cohortYear,
        bio: row.bio,
        imageUrl: row.imageUrl,
        postDate: row.postDate,
        sortOrder: row.sortOrder,
        published: true,
      }

      const existing = await payload.find({
        collection: 'team-members',
        where: { slug: { equals: row.slug } },
        limit: 1,
      })

      if (existing.docs[0]) {
        await payload.update({
          collection: 'team-members',
          id: existing.docs[0].id,
          data,
        })
        updated++
      } else {
        await payload.create({ collection: 'team-members', data })
        created++
      }
    }

    console.log(`Done: ${created} created, ${updated} updated`)
    console.log('Browse http://localhost:3002/fellowship/2025')
    process.exit(0)
  }

  const { team } = parseLeadership(xml)
  console.log(`Parsed ${team.length} leadership members (Fellows excluded)`)

  if (!team.length) {
    console.log('No leadership ex_team items found.')
    process.exit(0)
  }

  let created = 0
  let updated = 0

  for (const row of team) {
    const categoryId = taxonomyMaps.categoryBySlug.get(row.categorySlug)
    const data = {
      name: row.name,
      slug: row.slug,
      position: row.position,
      category: categoryId,
      bio: row.bio,
      imageUrl: row.imageUrl,
      sortOrder: row.sortOrder,
      published: true,
    }

    const existing = await payload.find({
      collection: 'team-members',
      where: { slug: { equals: row.slug } },
      limit: 1,
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'team-members',
        id: existing.docs[0].id,
        data,
      })
      updated++
    } else {
      await payload.create({ collection: 'team-members', data })
      created++
    }
  }

  const importedSlugs = new Set(team.map((row) => row.slug))
  const all = await payload.find({ collection: 'team-members', limit: 500, depth: 1 })
  let unpublished = 0
  for (const doc of all.docs) {
    const cat = doc.category
    const isFellow =
      typeof cat === 'object' &&
      cat !== null &&
      ((cat as { slug?: string; isFellow?: boolean }).slug === 'fellow' ||
        (cat as { isFellow?: boolean }).isFellow === true)
    if (isFellow) continue
    if (importedSlugs.has(doc.slug) || !doc.published) continue
    await payload.update({
      collection: 'team-members',
      id: doc.id,
      data: { published: false },
    })
    unpublished++
  }

  console.log(`Done: ${created} created, ${updated} updated, ${unpublished} unpublished (non-leadership)`)
  console.log('Browse http://localhost:3002/about')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
