import type { CouncilsHubPageData } from '@/types/council-page'

const u = (path: string) => `/uploads/${path}`

export const defaultCouncilsHubPage: CouncilsHubPageData = {
  headerTitle: 'Councils',
  introText:
    "ATC's Councils bring together sector leaders, policymakers, and practitioners to advance trade, investment, and inclusive growth across Africa. Explore industry councils, cross-sector initiatives, and the SME Council.",
  cards: [
    {
      id: 'industry',
      title: 'Industry Councils',
      body:
        "Sector-focused platforms for dialogue, collaboration, and strategic action across key industries—addressing challenges, promoting investment, and unlocking trade opportunities.",
      imageUrl: u('2025/10/agribusiness.avif'),
      imageAlt: 'Industry Councils',
      ctaLabel: 'View Industry Councils',
      ctaHref: '/councils/industry',
    },
    {
      id: 'cross-sector',
      title: 'Cross-Sector Councils',
      body:
        'Councils addressing development priorities and cross-cutting trade issues, with targeted support for underrepresented groups and strategic themes.',
      imageUrl: u('2025/04/social.webp'),
      imageAlt: 'Cross-Sector Councils',
      ctaLabel: 'View Cross-Sector Councils',
      ctaHref: '/councils/cross-sector',
    },
    {
      id: 'sme',
      title: 'SME Council',
      body:
        "The platform through which small and medium enterprises are formally organised and represented within the Chamber's work on trade and market integration.",
      imageUrl: u('2025/11/2150690161.jpg'),
      imageAlt: 'SME Council',
      ctaLabel: 'Learn About SME Council',
      ctaHref: '/councils/sme',
    },
  ],
}
