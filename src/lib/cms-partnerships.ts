import { defaultPartnershipsPage } from '@/lib/partnerships-defaults'
import { getPayloadClient } from '@/lib/cms'
import { resolvePayloadMediaAlt, resolvePayloadMediaUrl } from '@/lib/payload-media'
import type { PartnershipListCard, PartnershipsPageData } from '@/types/partnerships-page'

function mapListCard(row: Record<string, unknown>, fallback?: PartnershipListCard): PartnershipListCard {
  const itemsRaw = (row.items as Array<{ text?: string }> | undefined) || []
  const title = String(row.title ?? fallback?.title ?? '')
  return {
    id: String(row.id ?? fallback?.id ?? ''),
    title,
    imageUrl:
      resolvePayloadMediaUrl(row.image, row.imageUrl as string | undefined, fallback?.imageUrl) ||
      fallback?.imageUrl ||
      '',
    imageAlt: resolvePayloadMediaAlt(row.image, row.imageAlt as string | undefined, title) ||
      fallback?.imageAlt ||
      '',
    items: itemsRaw.length
      ? itemsRaw.map((i, idx) => i.text || fallback?.items[idx] || '').filter(Boolean)
      : fallback?.items || [],
  }
}

export function partnershipsPageToSeedData(data: PartnershipsPageData) {
  return {
    headerTitle: data.headerTitle,
    introText: data.introText,
    listCards: data.listCards.map((c) => ({
      ...c,
      items: c.items.map((text) => ({ text })),
    })),
    getStarted: data.getStarted,
  }
}

export async function getPartnershipsPage(): Promise<PartnershipsPageData> {
  const fallback = defaultPartnershipsPage
  try {
    const payload = await getPayloadClient()
    if (!payload) return fallback
    const global = await payload.findGlobal({ slug: 'partnerships-page', depth: 1 })
    if (!global) return fallback
    const raw = global as unknown as Record<string, unknown>
    const gs = (raw.getStarted as Record<string, unknown>) || {}
    const listRaw = (raw.listCards as Array<Record<string, unknown>>) || []
    return {
      headerTitle: String(raw.headerTitle ?? fallback.headerTitle),
      introText: String(raw.introText ?? fallback.introText),
      listCards: listRaw.length
        ? listRaw.map((c, i) => mapListCard(c, fallback.listCards[i]))
        : fallback.listCards,
      getStarted: {
        id: String(gs.id ?? fallback.getStarted.id),
        title: String(gs.title ?? fallback.getStarted.title),
        body: String(gs.body ?? fallback.getStarted.body),
        imageUrl:
          resolvePayloadMediaUrl(
            gs.image,
            gs.imageUrl as string | undefined,
            fallback.getStarted.imageUrl,
          ) || fallback.getStarted.imageUrl,
        imageAlt:
          resolvePayloadMediaAlt(
            gs.image,
            gs.imageAlt as string | undefined,
            fallback.getStarted.title,
          ) || fallback.getStarted.imageAlt,
        requestLabel: String(gs.requestLabel ?? fallback.getStarted.requestLabel),
        requestEmail: String(gs.requestEmail ?? fallback.getStarted.requestEmail),
        guideLabel: String(gs.guideLabel ?? fallback.getStarted.guideLabel),
        guideHref: String(gs.guideHref ?? fallback.getStarted.guideHref),
      },
    }
  } catch {
    return fallback
  }
}

export async function getPartnershipListCardById(
  id: string,
): Promise<PartnershipListCard | null> {
  const page = await getPartnershipsPage()
  const card = page.listCards.find((c) => c.id === id)
  return card ?? null
}

export async function getPartnershipGetStarted(): Promise<
  PartnershipsPageData['getStarted'] | null
> {
  const page = await getPartnershipsPage()
  return page.getStarted ?? null
}
