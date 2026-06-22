/**
 * Enable showTestimonials on cohort docs that have testimonial rows but the flag is off.
 *
 * Usage: npm run fix:fellowship-show-testimonials
 */

import './load-env.js'
import { requireEnv } from './load-env.js'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import {
  applyFellowshipCohortBeforeChange,
  hasTestimonialContent,
} from '../src/lib/fellowship-cohort-utils'

async function main() {
  requireEnv('DATABASE_URI')
  requireEnv('PAYLOAD_SECRET')

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'fellowship-cohorts',
    limit: 50,
    depth: 1,
  })

  let updated = 0
  for (const doc of result.docs) {
    const row = doc as unknown as Record<string, unknown>
    const hasContent =
      hasTestimonialContent(row.fellowTestimonials) ||
      hasTestimonialContent(row.resourceTestimonials)
    const showTestimonials = Boolean(row.showTestimonials)

    if (!hasContent || showTestimonials) continue

    const data = { ...row }
    applyFellowshipCohortBeforeChange(data)
    await payload.update({
      collection: 'fellowship-cohorts',
      id: doc.id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { showTestimonials: data.showTestimonials } as any,
    })
    console.log(`Enabled showTestimonials for fellowship-cohorts/${row.cohortYear}`)
    updated++
  }

  console.log(updated ? `Fixed ${updated} cohort doc(s).` : 'No cohort docs needed fixing.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
