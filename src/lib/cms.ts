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
      fellowshipPopupEnabled: global.fellowshipPopupEnabled ?? true,
      fellowshipPopupTitle: global.fellowshipPopupTitle || defaultSiteSettings.fellowshipPopupTitle,
      fellowshipPopupBody: global.fellowshipPopupBody || defaultSiteSettings.fellowshipPopupBody,
      fellowshipPopupDeadline:
        global.fellowshipPopupDeadline || defaultSiteSettings.fellowshipPopupDeadline,
      fellowshipPopupApplyUrl:
        global.fellowshipPopupApplyUrl || defaultSiteSettings.fellowshipPopupApplyUrl,
    }
  } catch {
    return defaultSiteSettings
  }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const payload = await getPayloadClient()
    if (!payload) return defaultHeroSlides
    const result = await payload.find({
      collection: 'hero-slides',
      where: { enabled: { equals: true } },
      sort: 'order',
      limit: 10,
      depth: 1,
    })
    if (!result.docs.length) return defaultHeroSlides
    return result.docs.map((doc, i) => {
      const fallback = defaultHeroSlides[i]
      const backgroundImageUrl =
        resolvePayloadMediaUrl(
          doc.backgroundImage,
          doc.backgroundImageUrl as string | undefined,
          fallback?.backgroundImageUrl,
        ) || ''
      const sideImageUrl =
        resolvePayloadMediaUrl(
          doc.sideImage,
          doc.sideImageUrl as string | undefined,
          fallback?.sideImageUrl,
        ) || ''
      return {
        id: String(doc.id),
        title: doc.title as string,
        description: (doc.description as string) || '',
        ctaLabel: (doc.ctaLabel as string) || 'Learn more',
        ctaUrl: (doc.ctaUrl as string) || '/',
        backgroundImageUrl,
        sideImageUrl,
        sideVideoUrl: (doc.sideVideoUrl as string) || '',
        showSideImage:
          Boolean(doc.showSideImage) || Boolean(sideImageUrl || (doc.sideVideoUrl as string)),
        showApplyOnly: Boolean(doc.showApplyOnly),
      }
    })
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
