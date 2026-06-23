import config from '@payload-config'
import { getPayload } from 'payload'
import {
  defaultHeroSlides,
  defaultMembershipCategories,
  defaultSiteSettings,
} from '@/lib/defaults'
import { resolvePayloadMediaUrl } from '@/lib/payload-media'
import type { HeroSlide, MembershipCategory, NavChild, NavItem, NavLink, SiteSettingsData } from '@/types/content'

/** Legacy CMS rows may still point "Contact Us" at /get-involved. */
function normalizeContactHref(href: string): string {
  if (href === '/get-involved' || href.startsWith('/get-involved#')) return '/contact-us'
  return href
}

function normalizeNavLink(link: NavLink): NavLink {
  const label = link.label.trim().toLowerCase()
  if (label.includes('contact')) {
    return { ...link, href: normalizeContactHref(link.href) }
  }
  return link
}

function normalizeNavLinks(links: NavLink[]): NavLink[] {
  return links.map(normalizeNavLink)
}

function normalizeHeaderNav(nav: NavItem[]): NavItem[] {
  return nav.map((item) => ({
    ...item,
    href: item.label.trim().toLowerCase() === 'contact' ? normalizeContactHref(item.href) : item.href,
    children: item.children?.map((child) => ({
      ...normalizeNavLink(child),
      subItems: child.subItems?.map(normalizeNavLink),
    })),
  }))
}

function mapHeaderNav(raw: unknown): NavItem[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item) => {
    const row = item as Record<string, unknown>
    const children = Array.isArray(row.children)
      ? row.children.map((child) => {
          const ch = child as Record<string, unknown>
          const subs = (ch.subItems ?? ch.children) as unknown
          return {
            label: String(ch.label),
            href: String(ch.href),
            flyout: ch.flyout as NavChild['flyout'],
            subItems: Array.isArray(subs)
              ? subs.map((s) => {
                  const sub = s as Record<string, unknown>
                  return { label: String(sub.label), href: String(sub.href) }
                })
              : undefined,
          } satisfies NavChild
        })
      : undefined
    return {
      label: String(row.label),
      href: String(row.href),
      children,
    }
  })
}

let payloadInstance: Awaited<ReturnType<typeof getPayload>> | null = null
let payloadInitFailed = false
let payloadInitPromise: Promise<Awaited<ReturnType<typeof getPayload>> | null> | null = null

function formatConnectError(err: unknown): string {
  if (err instanceof AggregateError) {
    const parts = err.errors.map((e) => (e instanceof Error ? e.message : String(e))).filter(Boolean)
    return parts.join('; ') || 'connection refused'
  }
  if (err instanceof Error) return err.message || err.name
  return String(err)
}

async function initPayload(): Promise<Awaited<ReturnType<typeof getPayload>> | null> {
  if (payloadInstance) return payloadInstance
  if (payloadInitFailed) return null
  if (!process.env.DATABASE_URI?.trim()) {
    payloadInitFailed = true
    return null
  }

  if (!payloadInitPromise) {
    payloadInitPromise = (async () => {
      try {
        const client = await getPayload({ config })
        payloadInstance = client
        return client
      } catch (err) {
        payloadInitFailed = true
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[cms] Postgres unavailable — using defaults. Start Docker Desktop, then: docker compose up -d postgres',
            formatConnectError(err),
          )
        }
        return null
      }
    })()
  }

  return payloadInitPromise
}

/** Returns Payload client, or null if Postgres is unavailable (pages should use code defaults). */
export async function getPayloadClient() {
  return initPayload()
}

function isNewsHeroEligible(doc: Record<string, unknown>, now: Date): boolean {
  const publishedAt = doc.publishedAt ? new Date(String(doc.publishedAt)) : null
  if (publishedAt && publishedAt > now) return false
  const expiryDate = doc.expiryDate ? new Date(String(doc.expiryDate)) : null
  if (expiryDate && expiryDate < now) return false
  return true
}

function mapHeroSlideDoc(doc: Record<string, unknown>, fallback?: HeroSlide): HeroSlide {
  const backgroundImageUrl =
    resolvePayloadMediaUrl(
      doc.backgroundImage,
      doc.backgroundImageUrl as string | undefined,
      fallback?.backgroundImageUrl,
      'heroBg',
    ) || ''
  const sideImageUrl =
    resolvePayloadMediaUrl(
      doc.sideImage,
      doc.sideImageUrl as string | undefined,
      fallback?.sideImageUrl,
      'heroSide',
    ) || ''
  return {
    id: String(doc.id),
    title: String(doc.title ?? ''),
    description: String(doc.description ?? ''),
    ctaLabel: String(doc.ctaLabel ?? 'Learn more'),
    ctaUrl: String(doc.ctaUrl ?? '/'),
    backgroundImageUrl,
    sideImageUrl,
    sideVideoUrl: String(doc.sideVideoUrl ?? ''),
    showSideImage:
      Boolean(doc.showSideImage) || Boolean(sideImageUrl || doc.sideVideoUrl),
    showApplyOnly: Boolean(doc.showApplyOnly),
  }
}

function mapNewsToHeroSlide(doc: Record<string, unknown>, fallback?: HeroSlide): HeroSlide {
  const backgroundImageUrl =
    resolvePayloadMediaUrl(
      doc.featuredImage,
      doc.imageUrl as string | undefined,
      fallback?.backgroundImageUrl,
      'heroBg',
    ) || ''
  const sideImageUrl = resolvePayloadMediaUrl(doc.heroSideImage, undefined, undefined, 'heroSide') || ''
  return {
    id: `news-${doc.id}`,
    title: String(doc.title ?? ''),
    description: String(doc.excerpt ?? '').trim(),
    ctaLabel: 'Read Full Story',
    ctaUrl: `/news/${doc.slug}`,
    backgroundImageUrl,
    sideImageUrl,
    sideVideoUrl: '',
    showSideImage: Boolean(sideImageUrl),
    showApplyOnly: false,
  }
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const payload = await getPayloadClient()
    if (!payload) return defaultSiteSettings
    const global = await payload.findGlobal({ slug: 'site-settings' })
    const utilityBarLinks = (global.utilityBarLinks as SiteSettingsData['utilityBarLinks'])?.length
      ? normalizeNavLinks(global.utilityBarLinks as SiteSettingsData['utilityBarLinks'])
      : defaultSiteSettings.utilityBarLinks
    const headerNavRaw = mapHeaderNav(global.headerNav)
    const headerNav = headerNavRaw.length
      ? normalizeHeaderNav(headerNavRaw)
      : defaultSiteSettings.headerNav
    const footerColumns = (global.footerColumns as SiteSettingsData['footerColumns'])?.length
      ? (global.footerColumns as SiteSettingsData['footerColumns']).map((col) => ({
          ...col,
          links: normalizeNavLinks(col.links),
        }))
      : defaultSiteSettings.footerColumns

    return {
      siteName: global.siteName || defaultSiteSettings.siteName,
      utilityBarLinks,
      socialLinks: (global.socialLinks as SiteSettingsData['socialLinks'])?.length
        ? (global.socialLinks as SiteSettingsData['socialLinks'])
        : defaultSiteSettings.socialLinks,
      headerNav,
      footerColumns,
      address: global.address || defaultSiteSettings.address,
      contactEmail: global.contactEmail || defaultSiteSettings.contactEmail,
      contactPhone: global.contactPhone || defaultSiteSettings.contactPhone,
      showTranslator: global.showTranslator ?? defaultSiteSettings.showTranslator,
      showWhatsappHelp: global.showWhatsappHelp ?? defaultSiteSettings.showWhatsappHelp,
      whatsappHelpLabel:
        global.whatsappHelpLabel || defaultSiteSettings.whatsappHelpLabel,
    }
  } catch {
    return defaultSiteSettings
  }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const payload = await getPayloadClient()
    if (!payload) return defaultHeroSlides

    const now = new Date()
    const slides: HeroSlide[] = []

    const pinnedResult = await payload.find({
      collection: 'news',
      where: { showInHomeHero: { equals: true } },
      limit: 1,
      depth: 1,
    })
    const pinnedDoc = pinnedResult.docs[0] as unknown as Record<string, unknown> | undefined

    if (pinnedDoc && isNewsHeroEligible(pinnedDoc, now)) {
      slides.push(mapNewsToHeroSlide(pinnedDoc, defaultHeroSlides[0]))
    } else {
      const fallbackResult = await payload.find({
        collection: 'hero-slides',
        where: {
          and: [{ enabled: { equals: true } }, { order: { equals: 0 } }],
        },
        limit: 1,
        depth: 1,
      })
      const fallbackDoc = fallbackResult.docs[0] as unknown as Record<string, unknown> | undefined
      if (fallbackDoc) {
        slides.push(mapHeroSlideDoc(fallbackDoc, defaultHeroSlides[0]))
      } else if (defaultHeroSlides[0]) {
        slides.push(defaultHeroSlides[0])
      }
    }

    const promoResult = await payload.find({
      collection: 'hero-slides',
      where: {
        and: [{ enabled: { equals: true } }, { order: { greater_than: 0 } }],
      },
      sort: 'order',
      limit: 10,
      depth: 1,
    })
    promoResult.docs.forEach((doc, i) => {
      slides.push(mapHeroSlideDoc(doc as unknown as Record<string, unknown>, defaultHeroSlides[i + 1]))
    })

    if (!slides.length) return defaultHeroSlides
    return slides
  } catch {
    return defaultHeroSlides
  }
}

export type NewsItem = {
  id: string
  title: string
  slug: string
  excerpt?: string
  category: string
  publishedAt?: string
}

export type JobItem = {
  id: string
  title: string
  slug: string
  department?: string
  location?: string
  summary?: string
  status: string
}

export async function getNewsList(limit = 20): Promise<NewsItem[]> {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'news',
      sort: '-publishedAt',
      limit,
    })
    return result.docs.map((doc) => ({
      id: String(doc.id),
      title: doc.title as string,
      slug: doc.slug as string,
      excerpt: doc.excerpt as string | undefined,
      category: (doc.category as string) || 'chamber',
      publishedAt: doc.publishedAt as string | undefined,
    }))
  } catch {
    return []
  }
}

export async function getOpenJobs(): Promise<JobItem[]> {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'jobs',
      where: { status: { equals: 'open' } },
      sort: 'title',
      limit: 50,
    })
    return result.docs.map((doc) => ({
      id: String(doc.id),
      title: doc.title as string,
      slug: doc.slug as string,
      department: doc.department as string | undefined,
      location: doc.location as string | undefined,
      summary: doc.summary as string | undefined,
      status: (doc.status as string) || 'open',
    }))
  } catch {
    return []
  }
}

export async function getMembershipCategories(): Promise<MembershipCategory[]> {
  try {
    const payload = await getPayloadClient()
    if (!payload) return defaultMembershipCategories
    const result = await payload.find({
      collection: 'membership-categories',
      sort: 'order',
      limit: 20,
    })
    if (!result.docs.length) return defaultMembershipCategories
    return result.docs.map((doc) => ({
      id: String(doc.id),
      title: doc.title as string,
      description: doc.description as string,
      benefits: doc.benefits as string,
      annualFee: doc.annualFee as string,
      feePeriod: (doc.feePeriod as string) || 'per year',
    }))
  } catch {
    return defaultMembershipCategories
  }
}
