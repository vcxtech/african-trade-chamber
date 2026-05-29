import { defaultGetInvolvedPage } from '@/lib/get-involved-defaults'
import { getPayloadClient } from '@/lib/cms'
import { resolvePayloadMediaAlt, resolvePayloadMediaUrl } from '@/lib/payload-media'
import type { GetInvolvedCard, GetInvolvedPageData } from '@/types/get-involved-page'

function mapCard(row: Record<string, unknown>, fallback?: GetInvolvedCard): GetInvolvedCard {
  const title = String(row.title ?? fallback?.title ?? '')
  return {
    title,
    body: String(row.body ?? fallback?.body ?? ''),
    imageUrl:
      resolvePayloadMediaUrl(row.image, row.imageUrl as string | undefined, fallback?.imageUrl) ||
      fallback?.imageUrl ||
      '',
    imageAlt:
      resolvePayloadMediaAlt(row.image, row.imageAlt as string | undefined, title) ||
      fallback?.imageAlt ||
      '',
    ctaLabel: row.ctaLabel ? String(row.ctaLabel) : fallback?.ctaLabel,
    ctaHref: row.ctaHref ? String(row.ctaHref) : fallback?.ctaHref,
  }
}

export function getInvolvedPageToSeedData(data: GetInvolvedPageData) {
  return {
    intro: data.intro,
    cards: data.cards,
  }
}

export async function getGetInvolvedPage(): Promise<GetInvolvedPageData> {
  const fallback = defaultGetInvolvedPage
  try {
    const payload = await getPayloadClient()
    if (!payload) return fallback
    const global = await payload.findGlobal({ slug: 'get-involved-page', depth: 1 })
    if (!global) return fallback
    const raw = global as unknown as Record<string, unknown>
    const introRaw = (raw.intro as Record<string, unknown>) || {}
    const cardsRaw = (raw.cards as Array<Record<string, unknown>>) || []
    return {
      intro: mapCard(introRaw, fallback.intro),
      cards: cardsRaw.length
        ? cardsRaw.map((c, i) => mapCard(c, fallback.cards[i]))
        : fallback.cards,
    }
  } catch {
    return fallback
  }
}
