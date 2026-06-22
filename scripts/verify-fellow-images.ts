/**
 * Quick check: fellow imageUrl paths and local file existence.
 * Usage: npx tsx scripts/verify-fellow-images.ts
 */

import './load-env.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { requireEnv } from './load-env.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_ROOT = path.resolve(__dirname, '../data/uploads')

async function main() {
  requireEnv('DATABASE_URI')
  requireEnv('PAYLOAD_SECRET')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config })

  const fellowCategory = await payload.find({
    collection: 'team-member-categories',
    where: { slug: { equals: 'fellow' } },
    limit: 1,
  })
  const fellowCategoryId = fellowCategory.docs[0]?.id
  if (!fellowCategoryId) {
    console.error('Fellow category not found — run npm run migrate:team-taxonomies')
    process.exit(1)
  }

  const result = await payload.find({
    collection: 'team-members',
    where: {
      and: [{ category: { equals: fellowCategoryId } }, { published: { equals: true } }],
    },
    limit: 10,
    sort: '-postDate',
  })

  let localUploads = 0
  let remoteWp = 0
  let missingFile = 0
  let noImage = 0

  for (const doc of result.docs) {
    const url = doc.imageUrl as string | undefined
    const slug = doc.slug as string
    if (!url) {
      noImage++
      console.log(`[no image] ${slug}`)
      continue
    }
    if (url.startsWith('/uploads/')) {
      localUploads++
      const rel = url.replace(/^\/uploads\//, '')
      const full = path.join(UPLOADS_ROOT, rel.replace(/\//g, path.sep))
      if (!fs.existsSync(full)) {
        missingFile++
        console.log(`[missing file] ${slug} -> ${url}`)
      }
    } else if (url.includes('africantradechamber.org')) {
      remoteWp++
      console.log(`[remote WP] ${slug} -> ${url}`)
    } else {
      console.log(`[other] ${slug} -> ${url}`)
    }
  }

  const all = await payload.find({
    collection: 'team-members',
    where: { category: { equals: fellowCategoryId } },
    limit: 0,
  })

  console.log('\nSummary (sample of 10, total fellows:', all.totalDocs, ')')
  console.log(`  /uploads/ paths: ${localUploads}`)
  console.log(`  remote WP URLs: ${remoteWp}`)
  console.log(`  missing local files: ${missingFile}`)
  console.log(`  no imageUrl: ${noImage}`)
  console.log(`  public/uploads exists: ${fs.existsSync(path.resolve(__dirname, '../public/uploads'))}`)

  process.exit(missingFile > 0 || remoteWp > 5 ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
