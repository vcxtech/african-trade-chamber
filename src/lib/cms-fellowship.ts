import {
  defaultFellowshipCohorts,
  defaultFellowshipPage,
} from '@/lib/fellowship-defaults'
import { getPayloadClient } from '@/lib/cms'
import { resolvePayloadMediaAlt, resolvePayloadMediaUrl } from '@/lib/payload-media'
import type {
  FellowTestimonial,
  FellowshipCohort,
  FellowshipCtaBlock,
  FellowshipCtaData,
  FellowshipCtaListItem,
  FellowshipPageData,
  ResourceTestimonial,
} from '@/types/fellowship'

function parseCohortYear(value: unknown, fallback?: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const parsed = Number.parseInt(String(value ?? ''), 10)
  if (Number.isFinite(parsed)) return parsed
  return fallback ?? 0
}

function mapFellowTestimonial(
  row: Record<string, unknown>,
  fallback?: FellowTestimonial,
): FellowTestimonial | null {
  const quote = String(row.quote ?? fallback?.quote ?? '').trim()
  const name = String(row.name ?? fallback?.name ?? '').trim()
  if (!quote || !name) return null
  return {
    quote,
    name,
    subtitle: String(row.subtitle ?? fallback?.subtitle ?? ''),
    initials: String(row.initials ?? fallback?.initials ?? ''),
  }
}

function mapResourceTestimonial(
  row: Record<string, unknown>,
  fallback?: ResourceTestimonial,
): ResourceTestimonial | null {
  const quote = String(row.quote ?? fallback?.quote ?? '').trim()
  const name = String(row.name ?? fallback?.name ?? '').trim()
  if (!quote || !name) return null
  const organization = String(row.organization ?? fallback?.organization ?? '').trim()
  return {
    quote,
    name,
    role: String(row.role ?? fallback?.role ?? ''),
    organization: organization || undefined,
  }
}

function mapListItem(row: Record<string, unknown>): FellowshipCtaListItem | null {
  const text = row.text as string | undefined
  const title = row.title as string | undefined
  const body = row.body as string | undefined
  if (title?.trim()) return { title: title.trim(), body: body?.trim() || undefined }
  if (text?.trim()) return text.trim()
  return null
}

function mapCtaBlock(
  row: Record<string, unknown>,
  fallback?: FellowshipCtaBlock,
): FellowshipCtaBlock {
  const paragraphsRaw = (row.paragraphs as Array<{ text?: string }> | undefined) || []
  const labeledRaw =
    (row.labeledParagraphs as Array<{ label?: string; text?: string }> | undefined) || []
  const listRaw = (row.listItems as Array<Record<string, unknown>> | undefined) || []

  const paragraphs = paragraphsRaw
    .map((p, i) => p.text?.trim() || fallback?.paragraphs?.[i] || '')
    .filter(Boolean)
  const labeledParagraphs = labeledRaw
    .map((p, i) => ({
      label: p.label || fallback?.labeledParagraphs?.[i]?.label || '',
      text: p.text || fallback?.labeledParagraphs?.[i]?.text || '',
    }))
    .filter((p) => p.label && p.text)
  const listItems = listRaw
    .map((item, i) => mapListItem(item) ?? fallback?.listItems?.[i])
    .filter((item): item is FellowshipCtaListItem => item != null)

  return {
    heading: (row.heading as string) || fallback?.heading || '',
    paragraphs: paragraphs.length ? paragraphs : fallback?.paragraphs,
    labeledParagraphs: labeledParagraphs.length ? labeledParagraphs : fallback?.labeledParagraphs,
    listItems: listItems.length ? listItems : fallback?.listItems,
  }
}

function mapCohort(row: Record<string, unknown>, fallback?: FellowshipCohort): FellowshipCohort {
  const cohortYear = parseCohortYear(row.cohortYear, fallback?.cohortYear)
  const yearKey = cohortYear || fallback?.cohortYear || 0

  const fellowRaw = (row.fellowTestimonials as Array<Record<string, unknown>> | undefined) || []
  const resourceRaw =
    (row.resourceTestimonials as Array<Record<string, unknown>> | undefined) || []

  const fellowTestimonials = fellowRaw
    .map((item, i) => mapFellowTestimonial(item, fallback?.fellowTestimonials[i]))
    .filter((item): item is FellowTestimonial => item != null)

  const resourceTestimonials = resourceRaw
    .map((item, i) => mapResourceTestimonial(item, fallback?.resourceTestimonials[i]))
    .filter((item): item is ResourceTestimonial => item != null)

  const defaultExploreUrl = yearKey ? `/fellowship/${yearKey}` : '#'

  return {
    cohortYear: yearKey,
    yearLabel: String(row.yearLabel ?? fallback?.yearLabel ?? ''),
    title: String(row.title ?? fallback?.title ?? ''),
    description: String(row.description ?? fallback?.description ?? ''),
    imageUrl:
      resolvePayloadMediaUrl(row.image, row.imageUrl as string | undefined, fallback?.imageUrl) ||
      fallback?.imageUrl ||
      '',
    imageAlt:
      resolvePayloadMediaAlt(
        row.image,
        row.imageAlt as string | undefined,
        String(row.title ?? fallback?.title ?? ''),
      ) ||
      fallback?.imageAlt ||
      '',
    exploreUrl: String(row.exploreUrl ?? fallback?.exploreUrl ?? defaultExploreUrl),
    exploreExternal: Boolean(row.exploreExternal ?? fallback?.exploreExternal),
    pageHeroTitle: String(row.pageHeroTitle ?? fallback?.pageHeroTitle ?? ''),
    pageHeroSubtitle: String(row.pageHeroSubtitle ?? fallback?.pageHeroSubtitle ?? ''),
    pageHeroImageUrl:
      resolvePayloadMediaUrl(
        row.pageHeroImage,
        row.pageHeroImageUrl as string | undefined,
        fallback?.pageHeroImageUrl,
      ) ||
      fallback?.pageHeroImageUrl ||
      '',
    pageHeroImageAlt: String(
      row.pageHeroImageAlt ??
        resolvePayloadMediaAlt(
          row.pageHeroImage,
          row.pageHeroImageAlt as string | undefined,
          fallback?.pageHeroImageAlt,
        ) ??
        fallback?.pageHeroImageAlt ??
        '',
    ),
    seoTitle: String(row.seoTitle ?? fallback?.seoTitle ?? ''),
    seoDescription: String(row.seoDescription ?? fallback?.seoDescription ?? ''),
    showTestimonials: Boolean(row.showTestimonials ?? fallback?.showTestimonials ?? true),
    fellowTestimonialsTitle: String(
      row.fellowTestimonialsTitle ?? fallback?.fellowTestimonialsTitle ?? 'Fellow Testimonials',
    ),
    fellowTestimonialsIntro: String(
      row.fellowTestimonialsIntro ?? fallback?.fellowTestimonialsIntro ?? '',
    ),
    resourceTestimonialsTitle: String(
      row.resourceTestimonialsTitle ??
        fallback?.resourceTestimonialsTitle ??
        'Resource Person Testimonials',
    ),
    resourceTestimonialsIntro: String(
      row.resourceTestimonialsIntro ?? fallback?.resourceTestimonialsIntro ?? '',
    ),
    fellowTestimonials: fellowTestimonials.length
      ? fellowTestimonials
      : (fallback?.fellowTestimonials ?? []),
    resourceTestimonials: resourceTestimonials.length
      ? resourceTestimonials
      : (fallback?.resourceTestimonials ?? []),
  }
}

function mapCta(
  raw: Record<string, unknown> | null | undefined,
  fallback: FellowshipCtaData,
): FellowshipCtaData {
  if (!raw) return fallback
  const sectionsRaw = (raw.sections as Array<Record<string, unknown>> | undefined) || []
  const footerRaw = (raw.footerParagraphs as Array<{ text?: string }> | undefined) || []

  const sections = sectionsRaw.map((row, i) => mapCtaBlock(row, fallback.sections[i]))

  return {
    eyebrow: (raw.eyebrow as string) || fallback.eyebrow,
    title: (raw.title as string) || fallback.title,
    tagline: (raw.tagline as string) || fallback.tagline,
    sections: sections.length ? sections : fallback.sections,
    footerParagraphs: footerRaw.length
      ? footerRaw.map((p, i) => p.text || fallback.footerParagraphs[i] || '').filter(Boolean)
      : fallback.footerParagraphs,
    applyUrl: (raw.applyUrl as string) || fallback.applyUrl,
    contactPhone: (raw.contactPhone as string) || fallback.contactPhone,
    contactEmail: (raw.contactEmail as string) || fallback.contactEmail,
  }
}

function findCohortFallback(year: number): FellowshipCohort | undefined {
  return defaultFellowshipCohorts.find((c) => c.cohortYear === year)
}

export function fellowshipCohortToSeedData(cohort: FellowshipCohort) {
  return {
    cohortYear: String(cohort.cohortYear) as '2025' | '2026',
    yearLabel: cohort.yearLabel,
    title: cohort.title,
    description: cohort.description,
    imageUrl: cohort.imageUrl,
    imageAlt: cohort.imageAlt,
    exploreUrl: cohort.exploreUrl,
    exploreExternal: cohort.exploreExternal,
    pageHeroTitle: cohort.pageHeroTitle,
    pageHeroSubtitle: cohort.pageHeroSubtitle,
    pageHeroImageUrl: cohort.pageHeroImageUrl,
    pageHeroImageAlt: cohort.pageHeroImageAlt,
    seoTitle: cohort.seoTitle,
    seoDescription: cohort.seoDescription,
    showTestimonials: cohort.showTestimonials,
    fellowTestimonialsTitle: cohort.fellowTestimonialsTitle,
    fellowTestimonialsIntro: cohort.fellowTestimonialsIntro,
    fellowTestimonials: cohort.fellowTestimonials,
    resourceTestimonialsTitle: cohort.resourceTestimonialsTitle,
    resourceTestimonialsIntro: cohort.resourceTestimonialsIntro,
    resourceTestimonials: cohort.resourceTestimonials,
  }
}

/** Shape fellowship hub global into seed-friendly JSON (no cohorts — those live in the collection). */
export function fellowshipHubToSeedData(data: FellowshipPageData) {
  return {
    heroImageUrl: data.heroImageUrl,
    introText: data.introText,
    cta: {
      ...data.cta,
      sections: data.cta.sections.map((s) => ({
        heading: s.heading,
        paragraphs: s.paragraphs?.map((text) => ({ text })),
        labeledParagraphs: s.labeledParagraphs,
        listItems: s.listItems?.map((item) =>
          typeof item === 'string' ? { text: item } : { title: item.title, body: item.body },
        ),
      })),
      footerParagraphs: data.cta.footerParagraphs.map((text) => ({ text })),
    },
  }
}

/** @deprecated Use fellowshipHubToSeedData for global; fellowshipCohortToSeedData for collection. */
export function fellowshipPageToSeedData(data: FellowshipPageData) {
  return {
    ...fellowshipHubToSeedData(data),
    cohorts: data.cohorts.map((cohort) => fellowshipCohortToSeedData(cohort)),
  }
}

function mapHubFromRaw(raw: Record<string, unknown>): Omit<FellowshipPageData, 'cohorts'> {
  const fallback = defaultFellowshipPage
  const ctaRaw = raw.cta as Record<string, unknown> | undefined

  return {
    heroImageUrl:
      resolvePayloadMediaUrl(
        raw.heroImage,
        raw.heroImageUrl as string | undefined,
        fallback.heroImageUrl,
      ) || fallback.heroImageUrl,
    introText: String(raw.introText ?? fallback.introText),
    cta: mapCta(ctaRaw, fallback.cta),
  }
}

async function loadCohortsFromCollection(
  payload: NonNullable<Awaited<ReturnType<typeof getPayloadClient>>>,
): Promise<FellowshipCohort[]> {
  const result = await payload.find({
    collection: 'fellowship-cohorts',
    sort: 'cohortYear',
    limit: 50,
    depth: 1,
  })

  if (result.docs.length === 0) return defaultFellowshipCohorts

  return result.docs.map((doc) => {
    const row = doc as unknown as Record<string, unknown>
    const year = parseCohortYear(row.cohortYear)
    const fallback = findCohortFallback(year)
    return mapCohort(row, fallback)
  })
}

export function fellowshipPageFromSeedShape(raw: Record<string, unknown>): FellowshipPageData {
  const hub = mapHubFromRaw(raw)
  const cohortsRaw = (raw.cohorts as Array<Record<string, unknown>> | undefined) || []

  const cohorts = cohortsRaw.length
    ? cohortsRaw.map((row, i) => {
        const year = parseCohortYear(row.cohortYear, defaultFellowshipCohorts[i]?.cohortYear)
        const cohortFallback =
          defaultFellowshipCohorts.find((c) => c.cohortYear === year) ??
          defaultFellowshipCohorts[i]
        return mapCohort(row, cohortFallback)
      })
    : defaultFellowshipCohorts

  return { ...hub, cohorts }
}

export async function getFellowshipPage(): Promise<FellowshipPageData> {
  const fallback = defaultFellowshipPage
  try {
    const payload = await getPayloadClient()
    if (!payload) return fallback

    const global = await payload.findGlobal({ slug: 'fellowship-page', depth: 1 })
    const hub = global
      ? mapHubFromRaw(global as unknown as Record<string, unknown>)
      : {
          heroImageUrl: fallback.heroImageUrl,
          introText: fallback.introText,
          cta: fallback.cta,
        }

    const cohorts = await loadCohortsFromCollection(payload)
    return { ...hub, cohorts }
  } catch {
    return fallback
  }
}

export async function getFellowshipCohortYears(): Promise<number[]> {
  try {
    const payload = await getPayloadClient()
    if (!payload) {
      return defaultFellowshipCohorts.map((c) => c.cohortYear).filter(Boolean)
    }

    const result = await payload.find({
      collection: 'fellowship-cohorts',
      sort: 'cohortYear',
      limit: 50,
      depth: 0,
    })

    if (result.docs.length === 0) {
      return defaultFellowshipCohorts.map((c) => c.cohortYear).filter(Boolean)
    }

    return result.docs
      .map((doc) => parseCohortYear((doc as { cohortYear?: unknown }).cohortYear))
      .filter(Boolean)
  } catch {
    return defaultFellowshipCohorts.map((c) => c.cohortYear).filter(Boolean)
  }
}

export async function getFellowshipCohortByYear(year: number): Promise<FellowshipCohort | null> {
  const fallback = findCohortFallback(year)
  try {
    const payload = await getPayloadClient()
    if (!payload) return fallback ?? null

    const result = await payload.find({
      collection: 'fellowship-cohorts',
      where: { cohortYear: { equals: String(year) } },
      limit: 1,
      depth: 1,
    })

    const doc = result.docs[0]
    if (!doc) return fallback ?? null

    return mapCohort(doc as unknown as Record<string, unknown>, fallback)
  } catch {
    return fallback ?? null
  }
}
