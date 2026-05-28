import { defaultAboutPage } from '@/lib/about-defaults'
import { defaultContactPage } from '@/lib/contact-defaults'
import { councilDetailsBySlug } from '@/lib/council-detail-defaults'
import { defaultCountryOfficesPage } from '@/lib/country-offices-defaults'
import { defaultCouncilsHubPage } from '@/lib/councils-hub-defaults'
import { defaultCrossSectorCouncilsPage } from '@/lib/cross-sector-councils-defaults'
import { defaultDonatePage } from '@/lib/donate-defaults'
import { defaultEventsPage } from '@/lib/events-page-defaults'
import { defaultFellowshipPage } from '@/lib/fellowship-defaults'
import { defaultGetInvolvedPage } from '@/lib/get-involved-defaults'
import { defaultIndustryCouncilsPage } from '@/lib/industry-councils-defaults'
import { INSIGHT_CATEGORY_PAGE_TITLES } from '@/lib/insight-categories'
import { defaultInsightsHubPage } from '@/lib/insights-hub-defaults'
import { defaultMembershipPage } from '@/lib/membership-page-defaults'
import { defaultNewsPage } from '@/lib/news-page-defaults'
import {
  defaultMediaCoveragePage,
  defaultNewsletterArchivePage,
} from '@/lib/newsroom-page-defaults'
import { defaultPartnershipsPage } from '@/lib/partnerships-defaults'
import { defaultSmeCouncilPage } from '@/lib/sme-council-defaults'
import {
  b2bMatchmakingPage,
  capacityBuildingPage,
  investmentPromotionPage,
  marketSupportPage,
  policyGovernmentPage,
  tradeFacilitationPage,
} from '@/lib/service-pages-defaults'
import { defaultSponsorshipPage } from '@/lib/sponsorship-defaults'
import { defaultTradeMissionsPage } from '@/lib/trade-missions-defaults'
import { defaultVolunteerPage } from '@/lib/volunteer-defaults'
import { defaultWhatWeDoPage } from '@/lib/what-we-do-defaults'
import { defaultAfricaTradeSummit } from '@/lib/africa-trade-summit-defaults'
import type { SearchResultItem } from '@/types/site-search'

type StaticEntry = {
  title: string
  href: string
  excerpt?: string
}

function page(title: string, href: string, excerpt?: string): StaticEntry {
  return { title, href, excerpt }
}

function buildStaticSearchIndex(): StaticEntry[] {
  const entries: StaticEntry[] = [
    page('About Us', '/about', defaultAboutPage.mainContent.replace(/<[^>]+>/g, ' ')),
    page('What We Do', '/what-we-do', defaultWhatWeDoPage.intro.tagline),
    page('Membership', '/membership', defaultMembershipPage.headerSubtitle),
    page('Why Join', '/membership/why-join', defaultMembershipPage.whyJoin.body),
    page('Membership Categories', '/membership/categories'),
    page('Apply for Membership', '/membership/apply'),
    page('Membership Testimonials', '/membership/testimonials'),
    page('Councils', '/councils', defaultCouncilsHubPage.introText),
    page('Industry Councils', '/councils/industry', defaultIndustryCouncilsPage.introText),
    page('Cross-Sector Councils', '/councils/cross-sector', defaultCrossSectorCouncilsPage.introText),
    page('SME Council', '/councils/sme', defaultSmeCouncilPage.tagline),
    page('Events', '/events', defaultEventsPage.headerSubtitle),
    page(
      'Africa Trade Summit',
      '/events/africa-trade-summit',
      defaultAfricaTradeSummit.hero.themeText,
    ),
    page('Trade Missions & Investment Events', '/events/trade-missions', defaultTradeMissionsPage.headerSubtitle),
    page('Calendar of Events', '/events/calendar'),
    page('Sponsorship Opportunities', '/events/sponsorship', defaultSponsorshipPage.headerTagline),
    page('Insights', '/insights', defaultInsightsHubPage.headerSubtitle),
    page('News', '/news', defaultNewsPage.introBody),
    page('Media Coverage', '/media-coverage', defaultMediaCoveragePage.introBody),
    page('Newsletter Archive', '/newsletter-archive', defaultNewsletterArchivePage.introBody),
    page('Careers', '/careers'),
    page('Contact Us', '/contact-us', defaultContactPage.introBody),
    page('Office Locations', '/contact-us/office-locations', defaultContactPage.locationIntro),
    page('Social Media', '/contact-us/social-media', defaultContactPage.socialIntro),
    page('Newsletter Signup', '/contact-us/newsletter', defaultContactPage.newsletterBody),
    page('Get Involved', '/get-involved', defaultGetInvolvedPage.intro.body),
    page('Fellowship', '/fellowship', defaultFellowshipPage.introText),
    page('Apply for Fellowship', '/fellowship/apply'),
    page('Partnerships', '/partnerships', defaultPartnershipsPage.introText),
    page('Why Partner', '/partnerships/why-partner'),
    page('Types of Partners', '/partnerships/types-of-partners'),
    page('Partnership Opportunities', '/partnerships/opportunities'),
    page('Get Started — Partnerships', '/partnerships/get-started'),
    page('Donate', '/donate', defaultDonatePage.heroParagraphs[0]),
    page('Volunteer', '/volunteer', defaultVolunteerPage.heroText),
    page(
      'Regional Network & Country Offices',
      '/country-offices',
      defaultCountryOfficesPage.pageSubtitle,
    ),
    page(marketSupportPage.pageTitle, '/market-support', marketSupportPage.tagline),
    page(tradeFacilitationPage.pageTitle, '/trade-facilitation-expansion', tradeFacilitationPage.tagline),
    page(b2bMatchmakingPage.pageTitle, '/b2b-b2g-matchmaking', b2bMatchmakingPage.tagline),
    page(investmentPromotionPage.pageTitle, '/investment-promotion', investmentPromotionPage.tagline),
    page(policyGovernmentPage.pageTitle, '/policy-government-engagement', policyGovernmentPage.tagline),
    page(capacityBuildingPage.pageTitle, '/capacity-building', capacityBuildingPage.tagline),
  ]

  for (const card of defaultInsightsHubPage.cards) {
    entries.push(page(card.title, card.ctaHref, card.body))
  }

  for (const [route, title] of Object.entries(INSIGHT_CATEGORY_PAGE_TITLES)) {
    entries.push(page(title, `/insights/${route}`))
  }

  for (const slug of Object.keys(councilDetailsBySlug)) {
    const detail = councilDetailsBySlug[slug]
    entries.push(page(detail.title, `/councils/${slug}`, detail.tagline))
  }

  for (const office of defaultCountryOfficesPage.offices) {
    entries.push(
      page(
        `${office.countryName} Country Office`,
        `/country-offices/${office.slug}`,
        office.regionLabel,
      ),
    )
  }

  return entries
}

const staticIndex = buildStaticSearchIndex()

function normalizeText(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
}

export function searchStaticPages(query: string, limit = 15): SearchResultItem[] {
  const q = normalizeText(query)
  if (!q) return []

  const seen = new Set<string>()
  const results: SearchResultItem[] = []

  for (const entry of staticIndex) {
    if (seen.has(entry.href)) continue
    const haystack = normalizeText(`${entry.title} ${entry.excerpt ?? ''}`)
    if (!haystack.includes(q)) continue
    seen.add(entry.href)
    results.push({
      title: entry.title,
      href: entry.href,
      excerpt: entry.excerpt,
      type: 'page',
    })
    if (results.length >= limit) break
  }

  return results
}
