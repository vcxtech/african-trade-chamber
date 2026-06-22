/**
 * Move cohort rows from fellowship-page global array into fellowship-cohorts collection.
 *
 *   npm run apply:fellowship-cohorts-schema
 *   npm run migrate:fellowship-cohorts-collection
 */

import './load-env.js'
import { requireEnv } from './load-env.js'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { defaultFellowshipCohorts } from '../src/lib/fellowship-defaults'
import {
  fellowshipCohortToSeedData,
  fellowshipHubToSeedData,
} from '../src/lib/cms-fellowship'
import { defaultFellowshipPage } from '../src/lib/fellowship-defaults'

type CohortRow = Record<string, unknown>

function inferCohortYear(row: CohortRow, index: number): string | null {
  const explicit = row.cohortYear
  if (explicit === '2025' || explicit === '2026' || explicit === 2025 || explicit === 2026) {
    return String(explicit)
  }
  const exploreUrl = String(row.exploreUrl ?? '')
  const match = exploreUrl.match(/\/fellowship\/(\d{4})/)
  if (match) return match[1]
  const yearLabel = String(row.yearLabel ?? '')
  const labelMatch = yearLabel.match(/(\d{4})/)
  if (labelMatch) return labelMatch[1]
  const defaults = defaultFellowshipCohorts[index]
  return defaults ? String(defaults.cohortYear) : null
}

function stripNestedIds(row: CohortRow): CohortRow {
  const { id, fellowTestimonials, resourceTestimonials, ...rest } = row
  const clean: CohortRow = { ...rest }
  if (Array.isArray(fellowTestimonials)) {
    clean.fellowTestimonials = fellowTestimonials.map(({ id: _id, ...item }) => item)
  }
  if (Array.isArray(resourceTestimonials)) {
    clean.resourceTestimonials = resourceTestimonials.map(({ id: _id, ...item }) => item)
  }
  return clean
}

function mergeCohortRow(row: CohortRow, year: string, index: number): CohortRow {
  const defaultRow = defaultFellowshipCohorts.find((c) => String(c.cohortYear) === year)
  const seedRow = defaultRow ? fellowshipCohortToSeedData(defaultRow) : null
  const stripped = stripNestedIds(row)

  if (!seedRow) {
    return {
      ...stripped,
      cohortYear: year,
      exploreUrl: `/fellowship/${year}`,
      exploreExternal: false,
    }
  }

  const hasPageHero = Boolean(String(stripped.pageHeroTitle ?? '').trim())
  const hasFellowTestimonials =
    Array.isArray(stripped.fellowTestimonials) && stripped.fellowTestimonials.length > 0
  const hasResourceTestimonials =
    Array.isArray(stripped.resourceTestimonials) && stripped.resourceTestimonials.length > 0

  return {
    cohortYear: year,
    exploreUrl: `/fellowship/${year}`,
    exploreExternal: false,
    yearLabel: stripped.yearLabel ?? seedRow.yearLabel,
    title: stripped.title ?? seedRow.title,
    description: stripped.description ?? seedRow.description,
    imageUrl: stripped.imageUrl ?? seedRow.imageUrl,
    imageAlt: stripped.imageAlt ?? seedRow.imageAlt,
    pageHeroTitle: hasPageHero ? stripped.pageHeroTitle : seedRow.pageHeroTitle,
    pageHeroSubtitle: stripped.pageHeroSubtitle ?? seedRow.pageHeroSubtitle,
    pageHeroImageUrl: stripped.pageHeroImageUrl ?? seedRow.pageHeroImageUrl,
    pageHeroImageAlt: stripped.pageHeroImageAlt ?? seedRow.pageHeroImageAlt,
    seoTitle: stripped.seoTitle ?? seedRow.seoTitle,
    seoDescription: stripped.seoDescription ?? seedRow.seoDescription,
    showTestimonials:
      hasFellowTestimonials || hasResourceTestimonials
        ? true
        : (stripped.showTestimonials ?? seedRow.showTestimonials),
    fellowTestimonialsTitle: stripped.fellowTestimonialsTitle ?? seedRow.fellowTestimonialsTitle,
    fellowTestimonialsIntro: stripped.fellowTestimonialsIntro ?? seedRow.fellowTestimonialsIntro,
    resourceTestimonialsTitle:
      stripped.resourceTestimonialsTitle ?? seedRow.resourceTestimonialsTitle,
    resourceTestimonialsIntro:
      stripped.resourceTestimonialsIntro ?? seedRow.resourceTestimonialsIntro,
    fellowTestimonials: hasFellowTestimonials
      ? stripped.fellowTestimonials
      : seedRow.fellowTestimonials,
    resourceTestimonials: hasResourceTestimonials
      ? stripped.resourceTestimonials
      : seedRow.resourceTestimonials,
  }
}

async function main() {
  process.env.PAYLOAD_DB_PUSH = 'false'
  requireEnv('DATABASE_URI')
  requireEnv('PAYLOAD_SECRET')

  const payload = await getPayload({ config })
  const global = await payload.findGlobal({ slug: 'fellowship-page', depth: 2 })
  const globalRaw = global as unknown as Record<string, unknown>
  const existingCohorts = (globalRaw.cohorts as CohortRow[] | undefined) ?? []

  const migratedYears = new Set<string>()

  for (let i = 0; i < existingCohorts.length; i++) {
    const row = existingCohorts[i]
    const year = inferCohortYear(row, i)
    if (!year) continue

    const data = mergeCohortRow(row, year, i)
    const found = await payload.find({
      collection: 'fellowship-cohorts',
      where: { cohortYear: { equals: year } },
      limit: 1,
      depth: 0,
    })

    if (found.docs[0]) {
      await payload.update({
        collection: 'fellowship-cohorts',
        id: found.docs[0].id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
      })
      console.log(`Updated fellowship-cohorts/${year}`)
    } else {
      await payload.create({
        collection: 'fellowship-cohorts',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
      })
      console.log(`Created fellowship-cohorts/${year}`)
    }
    migratedYears.add(year)
  }

  for (const defaultRow of defaultFellowshipCohorts) {
    const year = String(defaultRow.cohortYear)
    if (migratedYears.has(year)) continue

    const found = await payload.find({
      collection: 'fellowship-cohorts',
      where: { cohortYear: { equals: year } },
      limit: 1,
      depth: 0,
    })

    const data = fellowshipCohortToSeedData(defaultRow)
    if (found.docs[0]) {
      await payload.update({
        collection: 'fellowship-cohorts',
        id: found.docs[0].id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
      })
    } else {
      await payload.create({
        collection: 'fellowship-cohorts',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
      })
    }
    console.log(`Seeded missing fellowship-cohorts/${year}`)
  }

  await payload.updateGlobal({
    slug: 'fellowship-page',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: fellowshipHubToSeedData(defaultFellowshipPage) as any,
  })
  console.log('Slimmed fellowship-page global to hub-only fields.')

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
