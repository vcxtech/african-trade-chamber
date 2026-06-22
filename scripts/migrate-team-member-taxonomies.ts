/**
 * Seed taxonomies and migrate existing team-members to relationship fields.
 * Run: npm run migrate:team-taxonomies
 *
 * Schema must already be applied (start `npm run dev` once and accept DB prompts).
 */

import './load-env.js'
import { requireEnv } from './load-env.js'
import {
  legacyCategorySlug,
  normalizeCohortYear,
  resolveCategoryId,
  resolveCountryId,
  upsertTeamTaxonomies,
} from '../src/lib/team-taxonomy-seeds'

async function main() {
  process.env.PAYLOAD_DB_PUSH = 'false'
  requireEnv('DATABASE_URI')
  requireEnv('PAYLOAD_SECRET')

  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config })

  console.log('Upserting team taxonomies…')
  const maps = await upsertTeamTaxonomies(payload)

  const boardCategoryId = maps.categoryBySlug.get('board')
  const allMembers = await payload.find({
    collection: 'team-members',
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  })

  let updated = 0
  let skipped = 0
  const unmatchedCountries: string[] = []

  for (const doc of allMembers.docs) {
    const row = doc as Record<string, unknown>
    const legacySlug = legacyCategorySlug(row.category)
    const categoryId =
      resolveCategoryId(maps, row.category) ??
      (legacySlug ? maps.categoryBySlug.get(legacySlug) : undefined) ??
      boardCategoryId

    const countryId = resolveCountryId(maps, row.country)
    if (typeof row.country === 'string' && row.country.trim() && countryId == null) {
      unmatchedCountries.push(`${row.slug}: "${row.country}"`)
    }

    const cohortYear = normalizeCohortYear(row.cohortYear)
    const patch: Record<string, unknown> = {}

    if (categoryId != null && row.category !== categoryId) {
      patch.category = categoryId
    }
    if (countryId != null && row.country !== countryId) {
      patch.country = countryId
    } else if (typeof row.country === 'string' && row.country.trim() && !countryId) {
      if (legacySlug === 'fellow') {
        patch.country = null
      }
    }
    if (cohortYear != null && row.cohortYear !== cohortYear) {
      patch.cohortYear = cohortYear
    } else if (legacySlug === 'fellow' && row.cohortYear == null) {
      patch.cohortYear = '2025'
    }

    if (Object.keys(patch).length === 0) {
      skipped++
      continue
    }

    await payload.update({
      collection: 'team-members',
      id: doc.id,
      data: patch,
      overrideAccess: true,
    })
    updated++
  }

  console.log(`Team members: ${updated} updated, ${skipped} unchanged (${allMembers.totalDocs} total)`)
  if (unmatchedCountries.length) {
    console.warn('Unmatched fellow countries (set manually in admin):')
    for (const line of unmatchedCountries) console.warn(`  - ${line}`)
  }
  process.exit(0)
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err)
  if (message.includes('team_member_categories') && message.includes('does not exist')) {
    console.error(
      '\nDatabase schema is not updated yet. Start `npm run dev`, accept Payload’s DB prompts in the terminal, then re-run:\n  npm run migrate:team-taxonomies\n',
    )
  }
  console.error(err)
  process.exit(1)
})
