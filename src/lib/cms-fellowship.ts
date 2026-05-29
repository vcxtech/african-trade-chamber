import { defaultFellowshipPage } from '@/lib/fellowship-defaults'
import { getPayloadClient } from '@/lib/cms'
import { resolvePayloadMediaAlt, resolvePayloadMediaUrl } from '@/lib/payload-media'
import type {
  FellowshipCohort,
  FellowshipCtaBlock,
  FellowshipCtaData,
  FellowshipCtaListItem,
  FellowshipPageData,
} from '@/types/fellowship'

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
  return {
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
    exploreUrl: String(row.exploreUrl ?? fallback?.exploreUrl ?? '#'),
    exploreExternal: Boolean(row.exploreExternal ?? fallback?.exploreExternal),
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

/** Shape CMS fellowship-page global into seed-friendly JSON (paragraphs as string arrays). */
export function fellowshipPageToSeedData(data: FellowshipPageData) {
  return {
    heroImageUrl: data.heroImageUrl,
    introText: data.introText,
    cohorts: data.cohorts,
    cta: {
      ...data.cta,
      sections: data.cta.sections.map((s) => ({
        heading: s.heading,
        paragraphs: s.paragraphs?.map((text) => ({ text })),
        labeledParagraphs: s.labeledParagraphs,
        listItems: s.listItems?.map((item) =>
          typeof item === 'string'
            ? { text: item }
            : { title: item.title, body: item.body },
        ),
      })),
      footerParagraphs: data.cta.footerParagraphs.map((text) => ({ text })),
    },
  }
}

export function fellowshipPageFromSeedShape(raw: Record<string, unknown>): FellowshipPageData {
  const fallback = defaultFellowshipPage
  const cohortsRaw = (raw.cohorts as Array<Record<string, unknown>> | undefined) || []
  const ctaRaw = raw.cta as Record<string, unknown> | undefined

  const ctaSectionsRaw = (ctaRaw?.sections as Array<Record<string, unknown>> | undefined) || []
  const cta: FellowshipCtaData = {
    eyebrow: String(ctaRaw?.eyebrow ?? fallback.cta.eyebrow),
    title: String(ctaRaw?.title ?? fallback.cta.title),
    tagline: String(ctaRaw?.tagline ?? fallback.cta.tagline),
    sections: ctaSectionsRaw.map((row, i) => {
      const paragraphsRaw = (row.paragraphs as Array<{ text?: string }> | undefined) || []
      const listRaw = (row.listItems as Array<Record<string, unknown>> | undefined) || []
      return mapCtaBlock(
        {
          ...row,
          paragraphs: paragraphsRaw.map((p) => ({ text: p.text })),
          listItems: listRaw,
        },
        fallback.cta.sections[i],
      )
    }),
    footerParagraphs:
      ((ctaRaw?.footerParagraphs as Array<{ text?: string }> | undefined) || []).map(
        (p) => p.text || '',
      ).filter(Boolean).length > 0
        ? ((ctaRaw?.footerParagraphs as Array<{ text?: string }>) || []).map((p) => p.text || '')
        : fallback.cta.footerParagraphs,
    applyUrl: String(ctaRaw?.applyUrl ?? fallback.cta.applyUrl),
    contactPhone: String(ctaRaw?.contactPhone ?? fallback.cta.contactPhone),
    contactEmail: String(ctaRaw?.contactEmail ?? fallback.cta.contactEmail),
  }

  return {
    heroImageUrl:
      resolvePayloadMediaUrl(
        raw.heroImage,
        raw.heroImageUrl as string | undefined,
        fallback.heroImageUrl,
      ) || fallback.heroImageUrl,
    introText: String(raw.introText ?? fallback.introText),
    cohorts: cohortsRaw.length
      ? cohortsRaw.map((row, i) => mapCohort(row, fallback.cohorts[i]))
      : fallback.cohorts,
    cta,
  }
}

export async function getFellowshipPage(): Promise<FellowshipPageData> {
  const fallback = defaultFellowshipPage
  try {
    const payload = await getPayloadClient()
    if (!payload) return fallback
    const global = await payload.findGlobal({ slug: 'fellowship-page', depth: 1 })
    if (!global) return fallback
    return fellowshipPageFromSeedShape(global as unknown as Record<string, unknown>)
  } catch {
    return fallback
  }
}
