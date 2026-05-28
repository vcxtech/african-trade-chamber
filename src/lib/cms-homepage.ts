import { defaultHomepageSections } from '@/lib/homepage-defaults'
import { resolveImageUrl } from '@/lib/image-url'
import { getPayloadClient } from '@/lib/cms'
import type {
  CrossSectorHomepageData,
  HeroFeatureCard,
  HomepageCard,
  HomepageSectionsData,
  IndustryCouncilsHomepageData,
  ThreeCardSectionData,
  WwdHomepageData,
} from '@/types/homepage'

function strOrFallback(value?: string | null, fallback?: string): string | undefined {
  const trimmed = value?.trim()
  return trimmed || fallback
}

function mapCard(
  row: {
    title?: string | null
    description?: string | null
    imageUrl?: string | null
    buttonText?: string | null
    buttonUrl?: string | null
  },
  fallback?: HomepageCard,
): HomepageCard {
  return {
    title: strOrFallback(row.title, fallback?.title) || '',
    description: strOrFallback(row.description, fallback?.description),
    imageUrl: resolveImageUrl(row.imageUrl ?? undefined, fallback?.imageUrl),
    buttonText: strOrFallback(row.buttonText, fallback?.buttonText),
    buttonUrl: strOrFallback(row.buttonUrl, fallback?.buttonUrl),
  }
}

function mapThreeCardSection(
  global: Record<string, unknown> | null | undefined,
  fallback: ThreeCardSectionData,
): ThreeCardSectionData {
  if (!global) return fallback
  const raw = (global.cards as Array<Record<string, string>> | undefined) || []
  const cards = raw.map((row, i) => mapCard(row, fallback.cards[i]))
  return {
    sectionTitle: (global.sectionTitle as string) || fallback.sectionTitle,
    sectionDescription: (global.sectionDescription as string) || fallback.sectionDescription,
    sectionCtaText: strOrFallback(global.sectionCtaText as string, fallback.sectionCtaText),
    sectionCtaUrl: strOrFallback(global.sectionCtaUrl as string, fallback.sectionCtaUrl),
    cards: cards.length ? cards : fallback.cards,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PayloadAny = any

export async function getHomepageSections(): Promise<HomepageSectionsData> {
  const fallback = defaultHomepageSections

  try {
    const payload = (await getPayloadClient()) as PayloadAny
    if (!payload) return fallback

    const [
      featureResult,
      wwdGlobal,
      industryGlobal,
      crossGlobal,
      membershipGlobal,
      insightsGlobal,
      eventGlobal,
      getInvolvedGlobal,
      newsGlobal,
    ] = await Promise.all([
      payload.find({
        collection: 'hero-feature-cards',
        where: { enabled: { equals: true } },
        sort: 'order',
        limit: 10,
      }),
      payload.findGlobal({ slug: 'wwd-homepage' }),
      payload.findGlobal({ slug: 'industry-councils-homepage' }),
      payload.findGlobal({ slug: 'cross-sector-councils-homepage' }),
      payload.findGlobal({ slug: 'membership-homepage' }),
      payload.findGlobal({ slug: 'insights-homepage' }),
      payload.findGlobal({ slug: 'event-homepage' }),
      payload.findGlobal({ slug: 'get-involved-homepage' }),
      payload.findGlobal({ slug: 'news-homepage' }),
    ])

    const featureCards: HeroFeatureCard[] = featureResult.docs?.length
      ? featureResult.docs.map((doc: PayloadAny, i: number) => ({
          id: String(doc.id),
          title: doc.title,
          description: doc.description,
          linkText: strOrFallback(doc.linkText, fallback.featureCards[i]?.linkText) || 'Learn more',
          linkUrl: strOrFallback(doc.linkUrl, fallback.featureCards[i]?.linkUrl) || '/about',
        }))
      : fallback.featureCards

    const wwd: WwdHomepageData = wwdGlobal?.headerTitle
      ? {
          headerTitle: wwdGlobal.headerTitle,
          headerContent: wwdGlobal.headerContent || fallback.wwd.headerContent,
          intro: mapCard(
            {
              title: wwdGlobal.intro?.title,
              description: wwdGlobal.intro?.content,
              imageUrl: wwdGlobal.intro?.imageUrl,
              buttonText: wwdGlobal.intro?.buttonText,
              buttonUrl: wwdGlobal.intro?.buttonUrl,
            },
            fallback.wwd.intro,
          ),
          services:
            wwdGlobal.services?.map((s: PayloadAny, i: number) =>
              mapCard(
                {
                  title: s.title,
                  description: s.description,
                  imageUrl: s.imageUrl,
                  buttonText: s.buttonText,
                  buttonUrl: s.buttonUrl,
                },
                fallback.wwd.services[i],
              ),
            ) || fallback.wwd.services,
        }
      : fallback.wwd

    const industryCouncils: IndustryCouncilsHomepageData = industryGlobal?.headerTitle
      ? {
          headerTitle: industryGlobal.headerTitle,
          headerDescription: industryGlobal.headerDescription || '',
          headerButtonText:
            strOrFallback(industryGlobal.headerButtonText, fallback.industryCouncils.headerButtonText) ||
            '',
          headerButtonUrl:
            strOrFallback(industryGlobal.headerButtonUrl, fallback.industryCouncils.headerButtonUrl) ||
            '',
          intro: {
            imageUrl: resolveImageUrl(
              industryGlobal.intro?.imageUrl,
              fallback.industryCouncils.intro.imageUrl,
            ),
            title: strOrFallback(industryGlobal.intro?.title, fallback.industryCouncils.intro.title),
            text: strOrFallback(industryGlobal.intro?.text, fallback.industryCouncils.intro.text),
            buttonText: strOrFallback(
              industryGlobal.intro?.buttonText,
              fallback.industryCouncils.intro.buttonText,
            ),
            buttonUrl: strOrFallback(
              industryGlobal.intro?.buttonUrl,
              fallback.industryCouncils.intro.buttonUrl,
            ),
          },
          councils:
            industryGlobal.councils?.map((c: PayloadAny, i: number) =>
              mapCard(
                {
                  title: c.title,
                  description: c.description,
                  imageUrl: c.imageUrl,
                  buttonText: c.buttonText,
                  buttonUrl: c.buttonUrl,
                },
                fallback.industryCouncils.councils[i],
              ),
            ) || fallback.industryCouncils.councils,
        }
      : fallback.industryCouncils

    const crossSector: CrossSectorHomepageData = crossGlobal?.intro?.title
      ? {
          intro: mapCard(
            {
              title: crossGlobal.intro.title,
              description: crossGlobal.intro.description,
              buttonText: crossGlobal.intro.buttonText,
              buttonUrl: crossGlobal.intro.buttonUrl,
            },
            fallback.crossSector.intro,
          ),
          councils:
            crossGlobal.councils?.map((c: PayloadAny, i: number) =>
              mapCard(
                {
                  title: c.title,
                  description: c.description,
                  imageUrl: c.imageUrl,
                  buttonText: c.buttonText,
                  buttonUrl: c.buttonUrl,
                },
                fallback.crossSector.councils[i],
              ),
            ) || fallback.crossSector.councils,
        }
      : fallback.crossSector

    return {
      featureCards,
      wwd,
      industryCouncils,
      crossSector,
      membership: mapThreeCardSection(membershipGlobal, fallback.membership),
      insights: mapThreeCardSection(insightsGlobal, fallback.insights),
      events: mapThreeCardSection(eventGlobal, fallback.events),
      getInvolved: mapThreeCardSection(getInvolvedGlobal, fallback.getInvolved),
      news: mapThreeCardSection(newsGlobal, fallback.news),
    }
  } catch {
    return fallback
  }
}
