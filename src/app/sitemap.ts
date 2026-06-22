import type { MetadataRoute } from 'next'
import { councilDetailSlugs } from '@/lib/council-detail-defaults'
import { defaultCareerJobs } from '@/lib/careers-defaults'
import { defaultCountryOfficesPage } from '@/lib/country-offices-defaults'
import { INSIGHT_CATEGORY_TO_ROUTE } from '@/lib/insight-categories'
import { getPayloadClient } from '@/lib/cms'
import { getFellowshipCohortYears } from '@/lib/cms-fellowship'

const BASE = (process.env.NEXT_PUBLIC_SERVER_URL || 'https://africantradechamber.org').replace(/\/$/, '')

const STATIC_PATHS = [
  '/',
  '/about',
  '/what-we-do',
  '/membership',
  '/membership/why-join',
  '/membership/categories',
  '/membership/apply',
  '/membership/testimonials',
  '/events',
  '/events/africa-trade-summit',
  '/events/trade-missions',
  '/events/calendar',
  '/events/sponsorship',
  '/councils',
  '/councils/industry',
  '/councils/cross-sector',
  '/councils/sme',
  '/insights',
  '/insights/trade-market-briefs',
  '/insights/sector-reports',
  '/insights/investment-landscape-snapshots',
  '/insights/policy-papers',
  '/news',
  '/media-coverage',
  '/newsletter-archive',
  '/careers',
  '/country-offices',
  '/fellowship',
  '/fellowship/apply',
  '/get-involved',
  '/partnerships',
  '/partnerships/why-partner',
  '/partnerships/types-of-partners',
  '/partnerships/opportunities',
  '/partnerships/get-started',
  '/contact-us',
  '/contact-us/office-locations',
  '/contact-us/social-media',
  '/contact-us/newsletter',
  '/donate',
  '/volunteer',
  '/policy-government-engagement',
  '/trade-facilitation-expansion',
  '/b2b-b2g-matchmaking',
  '/investment-promotion',
  '/capacity-building',
  '/market-support',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }))

  for (const slug of councilDetailSlugs) {
    entries.push({
      url: `${BASE}/councils/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  for (const office of defaultCountryOfficesPage.offices) {
    entries.push({
      url: `${BASE}/country-offices/${office.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  for (const job of defaultCareerJobs) {
    entries.push({
      url: `${BASE}/careers/${job.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    })
  }

  const fellowshipYears = await getFellowshipCohortYears()
  for (const year of fellowshipYears) {
    entries.push({
      url: `${BASE}/fellowship/${year}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  try {
    const payload = await getPayloadClient()
    if (payload) {
      const [news, insights] = await Promise.all([
        payload.find({ collection: 'news', limit: 500, depth: 0 }),
        payload.find({ collection: 'insights', limit: 200, depth: 0 }),
      ])

      for (const doc of news.docs) {
        const slug = String((doc as { slug?: string }).slug ?? '')
        if (!slug) continue
        entries.push({
          url: `${BASE}/news/${slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.5,
        })
      }

      for (const doc of insights.docs) {
        const slug = String((doc as { slug?: string }).slug ?? '')
        const category = String((doc as { category?: string }).category ?? '')
        const route = INSIGHT_CATEGORY_TO_ROUTE[category as keyof typeof INSIGHT_CATEGORY_TO_ROUTE]
        if (!slug || !route) continue
        entries.push({
          url: `${BASE}/insights/${route}/${slug}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.5,
        })
      }
    }
  } catch {
    // CMS unavailable at build time — static entries only
  }

  return entries
}
