import type { InsightsHubPageData } from '@/types/insight-article'

const u = (path: string) => `/uploads/${path}`

export const defaultInsightsHubPage: InsightsHubPageData = {
  headerTitle: 'Insights',
  headerSubtitle:
    "ATC produces high-quality insights that help businesses, policymakers, and development partners understand Africa's trade landscape, identify opportunities, and make informed decisions. Our insights span policy analysis, sector studies, market intelligence, and investment trends.",
  cards: [
    {
      id: 'trade-market-briefs',
      title: 'Trade & Market Briefs',
      body: 'Concise, country- or sector-specific briefs offering practical intelligence on trade trends, market access conditions, logistics, and compliance considerations.',
      imageUrl: u('2025/04/tmphoto-1551288049-bebda4e38f71.avif'),
      imageAlt: 'Trade & Market Briefs',
      ctaLabel: 'View Market Briefs',
      ctaHref: '/insights/trade-market-briefs',
    },
    {
      id: 'sector-reports',
      title: 'Sector Reports',
      body: 'In-depth studies of strategic sectors—agribusiness, energy, manufacturing, logistics—highlighting trade performance, bottlenecks, and growth prospects.',
      imageUrl: u('2025/04/shutterstock_170766917.webp'),
      imageAlt: 'Sector Reports',
      ctaLabel: 'Explore Sector Reports',
      ctaHref: '/insights/sector-reports',
    },
    {
      id: 'investment-snapshots',
      title: 'Investment Landscape Snapshots',
      body: 'Visual summaries and trends profiling investment hotspots, active funds, investor appetite, and sector attractiveness across Africa.',
      imageUrl: u('2025/11/photo-1526628953301-3e589a6a8b74.jpg'),
      imageAlt: 'Investment Landscape Snapshots',
      ctaLabel: 'View Investment Snapshots',
      ctaHref: '/insights/investment-landscape-snapshots',
    },
    {
      id: 'policy-papers',
      title: 'Policy Papers & Advocacy Reports',
      body: "Position papers and briefs from ATC's Policy and Research Unit with actionable recommendations for improving trade and investment climates.",
      imageUrl: u('2025/04/2021-09-28_LDCs_participation_1200x675-1.webp'),
      imageAlt: 'Policy Papers & Advocacy Reports',
      ctaLabel: 'Access Policy Papers',
      ctaHref: '/insights/policy-papers',
    },
    {
      id: 'newsletters',
      title: 'Newsletters & Multimedia Content',
      body: 'Quarterly newsletters and video features covering member updates, thought leadership, event highlights, and expert interviews.',
      imageUrl: u('2025/04/officeworkers.webp'),
      imageAlt: 'Newsletters & Multimedia Content',
      ctaLabel: 'Browse Multimedia Resources',
      ctaHref: '/news',
    },
  ],
}
