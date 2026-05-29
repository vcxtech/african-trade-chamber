/**
 * Link hidden legacy imageUrl fields to imported Media library documents.
 *
 * Usage:
 *   npm run media:link-legacy-urls
 *   npm run media:link-legacy-urls -- --dry-run
 *   npm run media:link-legacy-urls -- --verbose
 */

import './load-env.js'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { requireEnv } from './load-env.js'
import {
  buildMediaPathIndex,
  isUploadEmpty,
  resolveMediaId,
  type MediaPathIndex,
} from './lib/media-url-index.js'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const verbose = args.includes('--verbose')

type Pair = { upload: string; url: string }

type CollectionTarget = {
  kind: 'collection'
  slug: 'news' | 'insights' | 'team-members' | 'hero-slides'
  pairs: Pair[]
}

type GlobalTarget = {
  kind: 'global'
  slug:
    | 'wwd-homepage'
    | 'industry-councils-homepage'
    | 'cross-sector-councils-homepage'
    | 'membership-homepage'
    | 'insights-homepage'
    | 'event-homepage'
    | 'get-involved-homepage'
    | 'news-homepage'
    | 'membership-page'
    | 'partnerships-page'
    | 'get-involved-page'
    | 'fellowship-page'
    | 'contact-page'
  /** Dot path to object or array; empty string = root */
  paths: Array<{
    dataPath: string
    array?: boolean
    pairs: Pair[]
  }>
}

const TARGETS: Array<CollectionTarget | GlobalTarget> = [
  {
    kind: 'collection',
    slug: 'news',
    pairs: [{ upload: 'featuredImage', url: 'imageUrl' }],
  },
  {
    kind: 'collection',
    slug: 'insights',
    pairs: [{ upload: 'featuredImage', url: 'imageUrl' }],
  },
  {
    kind: 'collection',
    slug: 'team-members',
    pairs: [{ upload: 'photo', url: 'imageUrl' }],
  },
  {
    kind: 'collection',
    slug: 'hero-slides',
    pairs: [
      { upload: 'backgroundImage', url: 'backgroundImageUrl' },
      { upload: 'sideImage', url: 'sideImageUrl' },
    ],
  },
  {
    kind: 'global',
    slug: 'wwd-homepage',
    paths: [
      { dataPath: 'intro', pairs: [{ upload: 'image', url: 'imageUrl' }] },
      { dataPath: 'services', array: true, pairs: [{ upload: 'image', url: 'imageUrl' }] },
    ],
  },
  {
    kind: 'global',
    slug: 'industry-councils-homepage',
    paths: [
      { dataPath: 'intro', pairs: [{ upload: 'image', url: 'imageUrl' }] },
      { dataPath: 'councils', array: true, pairs: [{ upload: 'image', url: 'imageUrl' }] },
    ],
  },
  {
    kind: 'global',
    slug: 'cross-sector-councils-homepage',
    paths: [
      { dataPath: 'intro', pairs: [{ upload: 'image', url: 'imageUrl' }] },
      { dataPath: 'councils', array: true, pairs: [{ upload: 'image', url: 'imageUrl' }] },
    ],
  },
  {
    kind: 'global',
    slug: 'membership-homepage',
    paths: [{ dataPath: 'cards', array: true, pairs: [{ upload: 'image', url: 'imageUrl' }] }],
  },
  {
    kind: 'global',
    slug: 'insights-homepage',
    paths: [{ dataPath: 'cards', array: true, pairs: [{ upload: 'image', url: 'imageUrl' }] }],
  },
  {
    kind: 'global',
    slug: 'event-homepage',
    paths: [{ dataPath: 'cards', array: true, pairs: [{ upload: 'image', url: 'imageUrl' }] }],
  },
  {
    kind: 'global',
    slug: 'get-involved-homepage',
    paths: [{ dataPath: 'cards', array: true, pairs: [{ upload: 'image', url: 'imageUrl' }] }],
  },
  {
    kind: 'global',
    slug: 'news-homepage',
    paths: [{ dataPath: 'cards', array: true, pairs: [{ upload: 'image', url: 'imageUrl' }] }],
  },
  {
    kind: 'global',
    slug: 'membership-page',
    paths: [
      { dataPath: 'whyJoin', pairs: [{ upload: 'image', url: 'imageUrl' }] },
      { dataPath: 'benefits', pairs: [{ upload: 'image', url: 'imageUrl' }] },
    ],
  },
  {
    kind: 'global',
    slug: 'partnerships-page',
    paths: [
      { dataPath: 'listCards', array: true, pairs: [{ upload: 'image', url: 'imageUrl' }] },
      { dataPath: 'getStarted', pairs: [{ upload: 'image', url: 'imageUrl' }] },
    ],
  },
  {
    kind: 'global',
    slug: 'get-involved-page',
    paths: [
      { dataPath: 'intro', pairs: [{ upload: 'image', url: 'imageUrl' }] },
      { dataPath: 'cards', array: true, pairs: [{ upload: 'image', url: 'imageUrl' }] },
    ],
  },
  {
    kind: 'global',
    slug: 'fellowship-page',
    paths: [
      { dataPath: '', pairs: [{ upload: 'heroImage', url: 'heroImageUrl' }] },
      { dataPath: 'cohorts', array: true, pairs: [{ upload: 'image', url: 'imageUrl' }] },
    ],
  },
  {
    kind: 'global',
    slug: 'contact-page',
    paths: [{ dataPath: '', pairs: [{ upload: 'introImage', url: 'introImageUrl' }] }],
  },
]

type Stats = {
  linked: number
  skippedLinked: number
  skippedNoUrl: number
  unmatched: number
}

function emptyStats(): Stats {
  return { linked: 0, skippedLinked: 0, skippedNoUrl: 0, unmatched: 0 }
}

function getAtPath(obj: Record<string, unknown>, dataPath: string): unknown {
  if (!dataPath) return obj
  const parts = dataPath.split('.')
  let cur: unknown = obj
  for (const part of parts) {
    if (!cur || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[part]
  }
  return cur
}

function applyPairsToRow(
  row: Record<string, unknown>,
  pairs: Pair[],
  index: MediaPathIndex,
  stats: Stats,
  context: string,
): boolean {
  let changed = false

  for (const { upload, url } of pairs) {
    if (!isUploadEmpty(row[upload])) {
      stats.skippedLinked += 1
      continue
    }

    const legacyUrl = row[url]
    if (!legacyUrl || typeof legacyUrl !== 'string' || !legacyUrl.trim()) {
      stats.skippedNoUrl += 1
      continue
    }

    const mediaId = resolveMediaId(legacyUrl, index)
    if (mediaId == null) {
      stats.unmatched += 1
      if (verbose) console.warn(`  [unmatched] ${context} ${url}=${legacyUrl}`)
      continue
    }

    row[upload] = mediaId
    stats.linked += 1
    changed = true
    if (verbose) console.log(`  [linked] ${context} ${url} -> media#${mediaId}`)
  }

  return changed
}

async function linkCollection(
  payload: Payload,
  target: CollectionTarget,
  index: MediaPathIndex,
  stats: Stats,
) {
  let page = 1
  const pageSize = 100

  for (;;) {
    const result = await payload.find({
      collection: target.slug,
      limit: pageSize,
      page,
      overrideAccess: true,
    })

    for (const doc of result.docs) {
      const row = { ...(doc as unknown as Record<string, unknown>) }
      const id = row.id as number
      const changed = applyPairsToRow(row, target.pairs, index, stats, `${target.slug}#${id}`)

      if (changed && !dryRun) {
        const data: Record<string, unknown> = {}
        for (const { upload } of target.pairs) {
          if (row[upload] != null) data[upload] = row[upload]
        }
        await payload.update({
          collection: target.slug,
          id,
          data: data as never,
          overrideAccess: true,
        })
      }
    }

    if (!result.hasNextPage) break
    page += 1
  }
}

async function linkGlobal(
  payload: Payload,
  target: GlobalTarget,
  index: MediaPathIndex,
  stats: Stats,
) {
  const global = await payload.findGlobal({ slug: target.slug, overrideAccess: true })
  if (!global) return

  const data = { ...(global as unknown as Record<string, unknown>) }
  let changed = false

  for (const pathDef of target.paths) {
    const node = pathDef.dataPath ? getAtPath(data, pathDef.dataPath) : data

    if (pathDef.array) {
      if (!Array.isArray(node)) continue
      for (let i = 0; i < node.length; i++) {
        const row = node[i] as Record<string, unknown>
        if (applyPairsToRow(row, pathDef.pairs, index, stats, `${target.slug}.${pathDef.dataPath}[${i}]`)) {
          changed = true
        }
      }
    } else if (node && typeof node === 'object') {
      if (
        applyPairsToRow(
          node as Record<string, unknown>,
          pathDef.pairs,
          index,
          stats,
          `${target.slug}.${pathDef.dataPath || 'root'}`,
        )
      ) {
        changed = true
      }
    }
  }

  if (changed && !dryRun) {
    await payload.updateGlobal({
      slug: target.slug,
      data: data as never,
      overrideAccess: true,
    })
  }
}

async function main() {
  requireEnv('DATABASE_URI')
  requireEnv('PAYLOAD_SECRET')

  console.log(`Linking legacy image URLs to Media library${dryRun ? ' (dry run)' : ''}...`)

  const payload = await getPayload({ config })
  const index = await buildMediaPathIndex(payload)
  console.log(
    `Media index: ${index.byPath.size} path(s), ${index.byFilename.size} filename(s)`,
  )

  const stats = emptyStats()

  for (const target of TARGETS) {
    console.log(`Processing ${target.kind} ${target.slug}...`)
    if (target.kind === 'collection') {
      await linkCollection(payload, target, index, stats)
    } else {
      await linkGlobal(payload, target, index, stats)
    }
  }

  console.log('\n--- Link summary ---')
  console.log(`Linked:              ${stats.linked}`)
  console.log(`Already linked:      ${stats.skippedLinked}`)
  console.log(`No legacy URL:       ${stats.skippedNoUrl}`)
  console.log(`Unmatched URL:       ${stats.unmatched}`)
  if (dryRun) console.log('(dry run — no changes written)')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
