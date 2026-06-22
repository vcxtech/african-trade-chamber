/**
 * Merges cohort page fields (hero, SEO, testimonials) into an existing fellowship-page global.
 * Run after schema deploy when seed has already populated hub-only cohort rows.
 *
 *   npm run migrate:fellowship-cohorts
 */
import './load-env.js'
import { requireEnv } from './load-env.js'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { defaultFellowshipPage } from '../src/lib/fellowship-defaults'
import { fellowshipPageToSeedData } from '../src/lib/cms-fellowship'

type CohortRow = Record<string, unknown>

function stripNestedIds(row: CohortRow): CohortRow {
  const { id, fellowTestimonials, resourceTestimonials, ...rest } = row
  const clean: CohortRow = { ...rest }
  if (typeof id === 'string') clean.id = id
  if (Array.isArray(fellowTestimonials)) {
    clean.fellowTestimonials = fellowTestimonials.map(({ id: _id, ...item }) => item)
  }
  if (Array.isArray(resourceTestimonials)) {
    clean.resourceTestimonials = resourceTestimonials.map(({ id: _id, ...item }) => item)
  }
  return clean
}

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

  const defaults = defaultFellowshipPage.cohorts[index]
  return defaults ? String(defaults.cohortYear) : null
}

async function main() {
  process.env.PAYLOAD_DB_PUSH = 'false'
  requireEnv('DATABASE_URI')
  requireEnv('PAYLOAD_SECRET')

  const payload = await getPayload({ config })
  const global = await payload.findGlobal({ slug: 'fellowship-page', depth: 0 })
  const existingCohorts = ((global as { cohorts?: CohortRow[] }).cohorts ?? []) as CohortRow[]

  const defaultsByYear = new Map(
    defaultFellowshipPage.cohorts.map((c) => [String(c.cohortYear), c]),
  )
  const seedShape = fellowshipPageToSeedData(defaultFellowshipPage)
  const seedByYear = new Map(
    (seedShape.cohorts as CohortRow[]).map((c) => [String(c.cohortYear), c]),
  )

  if (existingCohorts.length === 0) {
    await payload.updateGlobal({
      slug: 'fellowship-page',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: seedShape as any,
    })
    console.log('No cohort rows found — wrote full fellowship-page defaults.')
    process.exit(0)
  }

  const mergedCohorts: CohortRow[] = existingCohorts.map((row, index) => {
    const year = inferCohortYear(row, index)
    const seedRow = year ? seedByYear.get(year) : undefined
    const defaultRow = year ? defaultsByYear.get(year) : undefined

    if (!seedRow) {
      return stripNestedIds({
        ...row,
        exploreUrl: year ? `/fellowship/${year}` : row.exploreUrl,
        exploreExternal: false,
      })
    }

    const hasPageHero = Boolean(String(row.pageHeroTitle ?? '').trim())
    const hasTestimonials =
      Array.isArray(row.fellowTestimonials) && row.fellowTestimonials.length > 0

    return stripNestedIds({
      ...row,
      cohortYear: year ?? seedRow.cohortYear,
      exploreUrl: year ? `/fellowship/${year}` : seedRow.exploreUrl,
      exploreExternal: false,
      pageHeroTitle: hasPageHero ? row.pageHeroTitle : seedRow.pageHeroTitle,
      pageHeroSubtitle: row.pageHeroSubtitle ?? seedRow.pageHeroSubtitle,
      pageHeroImageUrl: row.pageHeroImageUrl ?? seedRow.pageHeroImageUrl,
      pageHeroImageAlt: row.pageHeroImageAlt ?? seedRow.pageHeroImageAlt,
      seoTitle: row.seoTitle ?? seedRow.seoTitle,
      seoDescription: row.seoDescription ?? seedRow.seoDescription,
      showTestimonials:
        row.showTestimonials ?? (year === '2026' ? false : seedRow.showTestimonials),
      fellowTestimonialsTitle: row.fellowTestimonialsTitle ?? seedRow.fellowTestimonialsTitle,
      fellowTestimonialsIntro: row.fellowTestimonialsIntro ?? seedRow.fellowTestimonialsIntro,
      resourceTestimonialsTitle:
        row.resourceTestimonialsTitle ?? seedRow.resourceTestimonialsTitle,
      resourceTestimonialsIntro:
        row.resourceTestimonialsIntro ?? seedRow.resourceTestimonialsIntro,
      fellowTestimonials: hasTestimonials ? row.fellowTestimonials : seedRow.fellowTestimonials,
      resourceTestimonials:
        Array.isArray(row.resourceTestimonials) && row.resourceTestimonials.length > 0
          ? row.resourceTestimonials
          : seedRow.resourceTestimonials,
      yearLabel: row.yearLabel ?? defaultRow?.yearLabel,
      title: row.title ?? defaultRow?.title,
      description: row.description ?? defaultRow?.description,
      imageUrl: row.imageUrl ?? defaultRow?.imageUrl,
      imageAlt: row.imageAlt ?? defaultRow?.imageAlt,
    })
  })

  const existingYears = new Set(
    mergedCohorts
      .map((row, i) => inferCohortYear(row, i))
      .filter((y): y is string => Boolean(y)),
  )

  for (const [year, seedRow] of seedByYear) {
    if (!existingYears.has(year)) {
      mergedCohorts.push(stripNestedIds(seedRow))
      console.log(`Added missing ${year} cohort row`)
    }
  }

  await payload.updateGlobal({
    slug: 'fellowship-page',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { cohorts: mergedCohorts } as any,
  })

  console.log(`Updated fellowship-page with ${mergedCohorts.length} cohort row(s).`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
