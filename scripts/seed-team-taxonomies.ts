/**
 * Seed team member categories and fellow countries (idempotent).
 * Run: npm run seed:team-taxonomies
 *
 * Schema must already be applied (start `npm run dev` once and accept DB prompts).
 */

import './load-env.js'
import { requireEnv } from './load-env.js'
import { TEAM_CATEGORY_SEEDS, FELLOW_COUNTRY_SEEDS, upsertTeamTaxonomies } from '../src/lib/team-taxonomy-seeds'

async function main() {
  process.env.PAYLOAD_DB_PUSH = 'false'
  requireEnv('DATABASE_URI')
  requireEnv('PAYLOAD_SECRET')

  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config })

  const maps = await upsertTeamTaxonomies(payload)

  console.log(`Seeded ${TEAM_CATEGORY_SEEDS.length} categories, ${FELLOW_COUNTRY_SEEDS.length} countries`)
  console.log(`Category slugs: ${[...maps.categoryBySlug.keys()].join(', ')}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
