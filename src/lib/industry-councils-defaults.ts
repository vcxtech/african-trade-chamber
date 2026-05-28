import type { CouncilHubPageData } from '@/types/council-page'

const u = (path: string) => `/uploads/${path}`

export const defaultIndustryCouncilsPage: CouncilHubPageData = {
  headerTitle: 'Industry Councils',
  introText:
    "ATC's Industry Councils serve as platforms for focused dialogue, collaboration, and strategic action across key sectors—bringing together leaders to address challenges, promote investment, and unlock trade opportunities across the continent.",
  cards: [
    {
      id: 'agribusiness',
      title: 'Agribusiness Council',
      body:
        'Positions agribusiness as a driver of growth, food security, and sustainability by advancing value chains, market access, and climate‑smart transformation across Africa.',
      imageUrl: u('2025/10/agribusiness.avif'),
      imageAlt: 'Agribusiness Council',
      focusAreas: [
        'Agricultural Transformation',
        'Value Chain Development',
        'Food Security & Nutrition',
        'Market Access & Trade Facilitation',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/agribusiness',
    },
    {
      id: 'energy',
      title: 'Energy Council',
      body:
        'Advances trade, investment, and innovation in power, oil & gas, and renewables to drive access, affordability, and climate resilience across the continent.',
      imageUrl: u('2025/10/GreentechEnergy-II-1920x500-page-575x400-1.jpg'),
      imageAlt: 'Energy Council',
      focusAreas: [
        'Power Sector Development',
        'Oil & Gas Trade and Investment',
        'Renewable Energy Transition',
        'Energy Infrastructure & Technology',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/energy',
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing Council',
      body:
        'Strengthens industrial capacity, export competitiveness, and regional production networks by fostering innovation, standards, and market integration.',
      imageUrl: u('2025/07/Manufacturing-2.jpeg'),
      imageAlt: 'Manufacturing Council',
      focusAreas: [
        'Industrial Competitiveness',
        'Export Growth & Market Access',
        'Regional Production Networks',
        'Innovation & Technology Adoption',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/manufacturing',
    },
    {
      id: 'trade-finance',
      title: 'Trade Finance Council',
      body:
        'Expands access to trade credit and innovative instruments, improves risk mitigation, and builds capacity so African firms can seize market opportunities.',
      imageUrl: u('2025/10/trade-councils.jpg'),
      imageAlt: 'Trade Finance Council',
      focusAreas: [
        'Access to Trade Credit',
        'Innovative Financial Instruments',
        'Risk Mitigation',
        'Capacity Building in Trade Finance',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/trade-finance',
    },
    {
      id: 'transport-logistics',
      title: 'Transport & Logistics Council',
      body:
        'Improves trade infrastructure, streamlines logistics, and enhances regional connectivity to make African trade faster and more cost‑effective.',
      imageUrl: u('2025/10/transport-scaled.jpg'),
      imageAlt: 'Transport & Logistics Council',
      focusAreas: [
        'Trade Infrastructure Development',
        'Logistics Efficiency',
        'Regional & Continental Connectivity',
        'Technology in Logistics',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/transport-logistics',
    },
    {
      id: 'mining-extractives',
      title: 'Mining & Extractives Council',
      body:
        'Promotes responsible resource development, investment facilitation, and local beneficiation to drive inclusive, sustainable growth in mining.',
      imageUrl: u('2025/10/minning.jpg'),
      imageAlt: 'Mining & Extractives Council',
      focusAreas: [
        'Responsible Resource Development',
        'Investment Facilitation',
        'Local Value Addition & Beneficiation',
        'Policy & Governance',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/mining-extractives',
    },
    {
      id: 'healthcare',
      title: 'Healthcare Council',
      body:
        "Strengthens Africa's health systems through pharmaceutical trade, medical technology, investment in infrastructure, and regulatory harmonization.",
      imageUrl: u('2025/10/Healthcare-Council.jpg'),
      imageAlt: 'Healthcare Council',
      focusAreas: [
        'Pharmaceutical Trade & Manufacturing',
        'Medical Technology & Innovation',
        'Healthcare Infrastructure & Investment',
        'Policy & Standards Harmonization',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/healthcare',
    },
    {
      id: 'tourism-hospitality',
      title: 'Tourism & Hospitality Council',
      body:
        'Develops regional tourism strategies, elevates service standards, and promotes travel‑related investment and sustainable destination growth.',
      imageUrl: u('2025/10/Tourism-Hospitality-Council.jpg'),
      imageAlt: 'Tourism & Hospitality Council',
      focusAreas: [
        'Regional Tourism Strategies',
        'Hospitality Standards & Service Excellence',
        'Travel‑Related Investment Promotion',
        'Sustainable & Inclusive Tourism',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/tourism-hospitality',
    },
    {
      id: 'creatives',
      title: 'Creatives Council',
      body:
        "Grows Africa's creative industries by expanding market access, fostering cultural exchange, and promoting investment in creative enterprises.",
      imageUrl: u('2025/10/cultural.jpg'),
      imageAlt: 'Creatives Council',
      focusAreas: [
        'Creative Industry Development',
        'Market Access & Export Promotion',
        'Cultural Exchange & Collaboration',
        'Investment in the Creative Economy',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/creatives',
    },
    {
      id: 'infrastructure-development',
      title: 'Infrastructure Development Council',
      body:
        'Mobilizes investment and PPPs for ports, roads, rail, air, and digital systems to reduce trade costs and accelerate regional integration.',
      imageUrl: u('2025/11/photo-1541888946425-d81bb19240f5.jpg'),
      imageAlt: 'Infrastructure Development Council',
      focusAreas: [
        'Trade‑Related Infrastructure',
        'Public‑Private Partnerships (PPPs)',
        'Regional Integration Corridors',
        'Digital Infrastructure',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/infrastructure-development',
    },
    {
      id: 'customs',
      title: 'Customs Council',
      body:
        'Improves efficiency and harmonization of customs procedures, strengthens compliance, and combats illicit trade to support seamless cross‑border trade.',
      imageUrl: u('2025/11/photo-1586953208448-b95a79798f07.jpg'),
      imageAlt: 'Customs Council',
      focusAreas: [
        'Harmonization of Customs Practices',
        'Compliance Support',
        'Anti‑Illicit Trade Strategies',
        'Capacity Building for Customs Officials',
        'Technology Adoption',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/customs',
    },
    {
      id: 'professional-services',
      title: 'Professional Services Council',
      body:
        'Connects law, accounting, engineering, and consulting firms to clients and projects, and advances policy for cross‑border service delivery and standards.',
      imageUrl: u('2025/11/photo-1450101499163-c8848c66ca85.jpg'),
      imageAlt: 'Professional Services Council',
      focusAreas: [
        'Market Access & Networking',
        'Policy & Regulatory Engagement',
        'Capacity Building & Skills Development',
        'Standards & Best Practices',
        'Cross‑Border Collaboration',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/professional-services',
    },
    {
      id: 'technology-innovation',
      title: 'Technology & Innovation Council',
      body:
        "Catalyzes Africa's digital economy by supporting innovation, scaling tech enterprises, and enabling digital trade and investment across sectors.",
      imageUrl: u('2025/11/photo-1518770660439-4636190af475.jpg'),
      imageAlt: 'Technology & Innovation Council',
      focusAreas: [
        'Digital Transformation',
        'Innovation & Startups',
        'Emerging Technologies',
        'Digital Trade & E‑Commerce',
      ],
      ctaLabel: 'Learn More',
      ctaHref: '/councils/technology-innovation',
    },
  ],
}
