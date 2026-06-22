import type { GlobalConfig } from 'payload'
import { contentGlobalAccess, hideUnlessArea, type ContentArea } from '@/lib/payload-access'
import { homepageCardFields, homepageSectionHeaderFields } from '../fields/homepageCardFields'

export function threeCardHomepageGlobal(
  slug: string,
  label: string,
  area: ContentArea = 'homepage',
): GlobalConfig {
  return {
    slug,
    label,
    access: contentGlobalAccess(area),
    admin: { group: 'Homepage', hidden: hideUnlessArea(area) },
    fields: [
      ...homepageSectionHeaderFields,
      {
        name: 'cards',
        type: 'array',
        minRows: 1,
        maxRows: 4,
        fields: homepageCardFields,
      },
    ],
  }
}

export const MembershipHomepage = threeCardHomepageGlobal(
  'membership-homepage',
  'Homepage — Membership',
  'membership',
)
export const InsightsHomepage = threeCardHomepageGlobal(
  'insights-homepage',
  'Homepage — Insights',
  'communications',
)
export const EventHomepage = threeCardHomepageGlobal('event-homepage', 'Homepage — Events', 'homepage')
export const GetInvolvedHomepage = threeCardHomepageGlobal(
  'get-involved-homepage',
  'Homepage — Get Involved',
  'homepage',
)
export const NewsHomepage = threeCardHomepageGlobal(
  'news-homepage',
  'Homepage — News',
  'communications',
)
