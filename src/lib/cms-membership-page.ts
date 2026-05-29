import { defaultMembershipPage } from '@/lib/membership-page-defaults'
import { getMembershipCategories, getPayloadClient } from '@/lib/cms'
import { resolvePayloadMediaAlt, resolvePayloadMediaUrl } from '@/lib/payload-media'
import { wpUploadUrlToLocal } from '@/lib/wp-uploads'
import type { MemberTestimonial, MembershipPageData } from '@/types/membership-page'

function mapBenefitItems(
  raw: Array<{ text?: string }> | undefined,
  fallback: string[],
): string[] {
  if (!raw?.length) return fallback
  const items = raw.map((row, i) => row.text?.trim() || fallback[i] || '').filter(Boolean)
  return items.length ? items : fallback
}

export function membershipPageToSeedData(data: MembershipPageData) {
  return {
    headerTitle: data.headerTitle,
    headerSubtitle: data.headerSubtitle,
    whyJoin: data.whyJoin,
    benefits: {
      ...data.benefits,
      items: data.benefits.items.map((text) => ({ text })),
    },
    categoriesIntro: data.categoriesIntro,
    footerCtas: data.footerCtas,
    testimonialsHeaderTitle: data.testimonialsHeaderTitle,
    testimonialsHeaderSubtitle: data.testimonialsHeaderSubtitle,
  }
}

function mapGlobal(
  raw: Record<string, unknown>,
  categories: MembershipPageData['categories'],
  testimonials: MemberTestimonial[],
): MembershipPageData {
  const fallback = defaultMembershipPage
  const whyJoinRaw = (raw.whyJoin as Record<string, unknown>) || {}
  const benefitsRaw = (raw.benefits as Record<string, unknown>) || {}
  const categoriesIntroRaw = (raw.categoriesIntro as Record<string, unknown>) || {}
  const footerCtasRaw = (raw.footerCtas as Record<string, unknown>) || {}

  return {
    headerTitle: String(raw.headerTitle ?? fallback.headerTitle),
    headerSubtitle: String(raw.headerSubtitle ?? fallback.headerSubtitle),
    whyJoin: {
      title: String(whyJoinRaw.title ?? fallback.whyJoin.title),
      body: String(whyJoinRaw.body ?? fallback.whyJoin.body),
      imageUrl:
        resolvePayloadMediaUrl(
          whyJoinRaw.image,
          wpUploadUrlToLocal(whyJoinRaw.imageUrl as string | undefined) ||
            (whyJoinRaw.imageUrl as string | undefined),
          fallback.whyJoin.imageUrl,
        ) || fallback.whyJoin.imageUrl,
      imageAlt:
        resolvePayloadMediaAlt(
          whyJoinRaw.image,
          whyJoinRaw.imageAlt as string | undefined,
          fallback.whyJoin.title,
        ) || fallback.whyJoin.imageAlt,
      ctaLabel: String(whyJoinRaw.ctaLabel ?? fallback.whyJoin.ctaLabel),
      ctaHref: String(whyJoinRaw.ctaHref ?? fallback.whyJoin.ctaHref),
    },
    benefits: {
      title: String(benefitsRaw.title ?? fallback.benefits.title),
      intro: String(benefitsRaw.intro ?? fallback.benefits.intro),
      imageUrl:
        resolvePayloadMediaUrl(
          benefitsRaw.image,
          wpUploadUrlToLocal(benefitsRaw.imageUrl as string | undefined) ||
            (benefitsRaw.imageUrl as string | undefined),
          fallback.benefits.imageUrl,
        ) || fallback.benefits.imageUrl,
      imageAlt:
        resolvePayloadMediaAlt(
          benefitsRaw.image,
          benefitsRaw.imageAlt as string | undefined,
          fallback.benefits.title,
        ) || fallback.benefits.imageAlt,
      items: mapBenefitItems(
        benefitsRaw.items as Array<{ text?: string }> | undefined,
        fallback.benefits.items,
      ),
    },
    categoriesIntro: {
      title: String(categoriesIntroRaw.title ?? fallback.categoriesIntro.title),
      subtitle: String(categoriesIntroRaw.subtitle ?? fallback.categoriesIntro.subtitle),
    },
    footerCtas: {
      applyLabel: String(footerCtasRaw.applyLabel ?? fallback.footerCtas.applyLabel),
      applyHref: String(footerCtasRaw.applyHref ?? fallback.footerCtas.applyHref),
      guideLabel: String(footerCtasRaw.guideLabel ?? fallback.footerCtas.guideLabel),
      guideHref: String(footerCtasRaw.guideHref ?? fallback.footerCtas.guideHref),
    },
    testimonialsHeaderTitle: String(
      raw.testimonialsHeaderTitle ?? fallback.testimonialsHeaderTitle,
    ),
    testimonialsHeaderSubtitle: String(
      raw.testimonialsHeaderSubtitle ?? fallback.testimonialsHeaderSubtitle,
    ),
    categories,
    testimonials,
  }
}

async function getMemberTestimonials(): Promise<MemberTestimonial[]> {
  const fallback = defaultMembershipPage.testimonials
  try {
    const payload = await getPayloadClient()
    if (!payload) return fallback
    const result = await payload.find({
      collection: 'member-testimonials',
      sort: 'sortOrder',
      limit: 20,
    })
    if (!result.docs.length) return fallback
    return result.docs.map((doc) => ({
      id: String(doc.id),
      name: doc.name as string,
      position: doc.position as string,
      quote: doc.quote as string,
      sortOrder: (doc.sortOrder as number) ?? 0,
    }))
  } catch {
    return fallback
  }
}

export async function getMembershipPageData(): Promise<MembershipPageData> {
  const fallback = defaultMembershipPage
  try {
    const payload = await getPayloadClient()
    const [categories, testimonials] = await Promise.all([
      getMembershipCategories(),
      getMemberTestimonials(),
    ])
    if (!payload) {
      return { ...fallback, categories, testimonials }
    }
    const global = await payload.findGlobal({ slug: 'membership-page', depth: 1 })
    if (!global) {
      return { ...fallback, categories, testimonials }
    }
    return mapGlobal(global as unknown as Record<string, unknown>, categories, testimonials)
  } catch {
    return fallback
  }
}
