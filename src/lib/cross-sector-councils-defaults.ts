import type { CouncilHubPageData } from '@/types/council-page'

const u = (path: string) => `/uploads/${path}`

export const defaultCrossSectorCouncilsPage: CouncilHubPageData = {
  headerTitle: 'Cross-Sector Councils',
  introText:
    "ATC's Cross-Sector Councils address key development priorities and cross-cutting trade issues. These councils offer targeted support, advocacy, and programming for underrepresented groups and strategic themes across the trade ecosystem.",
  cards: [
    {
      id: 'research-policy',
      title: 'Research & Policy Council',
      body:
        'Convenes academics, policy experts, and industry stakeholders to conduct trade-related research, develop policy proposals, and drive evidence-based advocacy.',
      imageUrl: u('2025/11/75857.jpg'),
      imageAlt: 'Research & Policy Council',
      focusAreas: [
        'Trade Policy Research',
        'Evidence-Based Advocacy',
        'Capacity Building',
        'Knowledge Exchange',
        'Strategic Foresight',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/research-policy',
    },
    {
      id: 'women-entrepreneurs',
      title: 'Women Entrepreneurs Council',
      body:
        'Supports the empowerment of women in trade through mentorship, access to finance, capacity building, and policy advocacy.',
      imageUrl: u('2025/10/Professional-Services-Council-2.png'),
      imageAlt: 'Women Entrepreneurs Council',
      focusAreas: [
        'Mentorship & Networking',
        'Access to Finance',
        'Capacity Building',
        'Policy Advocacy',
        'Market Access & Trade Facilitation',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/women-entrepreneurs',
    },
    {
      id: 'young-entrepreneurs',
      title: 'Young Entrepreneurs Council',
      body:
        'Fosters entrepreneurship among African youth by promoting innovation, education, startup support, and access to market networks.',
      imageUrl: u('2025/10/education.jpeg'),
      imageAlt: 'Young Entrepreneurs Council',
      focusAreas: [
        'Innovation & Entrepreneurship',
        'Education & Skills Development',
        'Startup Support & Financing',
        'Market Access & Networking',
        'Policy Advocacy',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/young-entrepreneurs',
    },
  ],
}
