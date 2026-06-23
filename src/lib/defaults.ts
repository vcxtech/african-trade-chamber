import type { HeroSlide, MembershipCategory, SiteSettingsData } from '@/types/content'
import { defaultHeaderNav } from '@/lib/nav-header'
import { defaultSiteSocialLinks } from '@/lib/social-links-defaults'

export const defaultSiteSettings: SiteSettingsData = {
  siteName: 'African Trade Chamber',
  utilityBarLinks: [
    { label: 'Home', href: '/' },
    { label: 'Country Offices', href: '/country-offices' },
    { label: 'Fellowship', href: '/fellowship' },
    { label: 'Join Chamber', href: '/membership' },
    { label: 'Partner or Sponsor', href: '/partnerships' },
    { label: 'Latest News', href: '/news' },
    { label: 'Contact Us', href: '/contact-us' },
  ],
  socialLinks: defaultSiteSocialLinks,
  headerNav: defaultHeaderNav,
  footerColumns: [
    {
      title: 'About & Organization',
      links: [
        { label: 'Country Offices', href: '/country-offices' },
        { label: 'Industry Councils', href: '/councils/industry' },
        { label: 'Cross-Sector Councils', href: '/councils/cross-sector' },
      ],
    },
    {
      title: 'Services & Opportunities',
      links: [
        { label: 'What We Do', href: '/what-we-do' },
        { label: 'Membership', href: '/membership' },
        { label: 'Partnerships', href: '/partnerships' },
        { label: 'Join Chamber', href: '/membership' },
        { label: 'Get Involved', href: '/get-involved' },
      ],
    },
    {
      title: 'Insights & Engagement',
      links: [
        { label: 'Insights', href: '/insights' },
        { label: 'ATC Events', href: '/events' },
        { label: 'Newsroom', href: '/news' },
        { label: 'Contact Us', href: '/contact-us' },
      ],
    },
  ],
  address:
    'No. 5 Teinor Street, Dzorwulu,\nAccra, Ghana\n\nP.O. Box CT 9056, Cantonments\nAccra, Ghana',
  contactEmail: 'info@africantradechamber.org',
  contactPhone: '+233 505 366 200',
  showTranslator: true,
  showWhatsappHelp: true,
  whatsappHelpLabel: 'Need Help? Chat with us',
}

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'AfDB Backs $24.5m Clean Energy Drive in São Tomé and Príncipe',
    description:
      'The African Development Bank Group has approved a $24.5 million grant to support a transformative clean energy programme in São Tomé and Príncipe, marking a major step toward reducing the country\'s dependence on fossil fuels and strengthening energy security. The funding, provided through the African Development Fund, anchors a broader $30 million investment under the Energy Transition, Efficiency, and Expansion Project (ETREEP), which aims to modernise the island nation\'s power infrastructure and expand access to reliable electricity.',
    ctaLabel: 'Read Full Story',
    ctaUrl: '/news/afdb-backs-24-5m-clean-energy-drive-in-sao-tome-and-principe',
    backgroundImageUrl: '/uploads/2025/11/photo-1497435334941-8c899ee9e8e9.jpg',
    sideImageUrl: '/uploads/2026/04/Thursday-222-1024x421.webp',
    showSideImage: true,
    showApplyOnly: false,
  },
  {
    id: '2',
    title: '2026 Future Trade Leaders Fellowship',
    description: '',
    ctaLabel: 'Apply Now',
    ctaUrl: '/fellowship/apply',
    backgroundImageUrl: '/images/hero/slide-2-banner.png',
    sideImageUrl: '',
    showSideImage: false,
    showApplyOnly: true,
  },
  {
    id: '3',
    title: 'Powering Business.\nTransforming African Economies.',
    description:
      'African Trade Chamber empowers African and global businesses to scale across the continent — advancing a bold private sector agenda that drives trade, unlocks investment, and fuels economic transformation.',
    ctaLabel: 'Join Us Today',
    ctaUrl: '/membership',
    backgroundImageUrl: '/images/hero/slide-3-bg.jpg',
    sideImageUrl: '',
    sideVideoUrl: '/images/hero/slide-3-video.mp4',
    showSideImage: true,
    showApplyOnly: false,
  },
]

export const defaultMembershipCategories: MembershipCategory[] = [
  {
    id: 'platinum',
    title: 'Platinum Corporate',
    description:
      'The Platinum Corporate Membership is the highest level offered by the African Trade Chamber, designed for businesses committed to maximizing engagement and impact within the African trade community. It is for multinational corporations with presence in more than ten countries, group or holding companies, businesses generating large-scale impact, and organizations seeking access to key decision-making institutions to advance trade, economic growth, and development in Africa at the highest level.',
    benefits:
      'Platinum members receive premium benefits including priority access to events, personalized advisory services, dedicated account management, prominent recognition on ATC platforms, participation in high-level strategic discussions, and premium listings on the ATC Africa Trade Directory with membership of Industry Council(s).',
    annualFee: 'USD 50,000',
    feePeriod: 'per year',
  },
  {
    id: 'gold',
    title: 'Gold Corporate',
    description:
      'The Gold Corporate Membership is designed for businesses looking to expand their presence, network, and access to opportunities within the African trade ecosystem. It is ideal for mid-sized multinational corporations with presence in less than ten countries, group or holding companies, enterprises, industry associations, and businesses seeking access to key decision-making institutions and stakeholders in African markets.',
    benefits:
      'Gold members enjoy priority event access, networking opportunities, market intelligence, discounted rates on trade facilitation and capacity-building services, recognition on ATC channels, showcase opportunities, and member-only listings on the ATC Africa Trade Directory with membership of Industry Council(s).',
    annualFee: 'USD 20,000',
    feePeriod: 'per year',
  },
  {
    id: 'silver',
    title: 'Silver Corporate',
    description:
      'The Silver Corporate Membership is designed for businesses seeking to grow their presence, access opportunities, and build business linkages to support organizational trade and business objectives. It is ideal for businesses with presence in up to 5 countries looking to establish visibility and expand networks in African markets.',
    benefits:
      'Silver members receive access to events, networking opportunities, trade facilitation services, and basic market intelligence resources. Members also benefit from opportunities to connect, learn, and collaborate with peers and experts, including member-only listings on the ATC Africa Trade Directory and membership of Industry Council(s).',
    annualFee: 'USD 10,000',
    feePeriod: 'per year',
  },
  {
    id: 'bronze',
    title: 'Bronze Corporate',
    description:
      'Bronze Corporate Membership is specially tailored for small and medium-sized enterprises desirous of learning, development, and growth opportunities. This category is suitable for local or domestic businesses looking for mentoring and coaching to establish their presence and grow their network regionally.',
    benefits:
      'Bronze members receive access to events, networking opportunities, trade facilitation services, and basic market intelligence resources. Membership also includes mentoring/coaching engagement, market access support, and member-only listings on the ATC Africa Trade Directory with membership of Industry Council(s).',
    annualFee: 'USD 7,500',
    feePeriod: 'per year',
  },
  {
    id: 'public',
    title: 'Public Sector Institutional Membership',
    description:
      'For institutions and agencies in the public sector. This category is suitable for government institutions and agencies seeking structured collaboration and trade-focused engagement.',
    benefits:
      'Public institutions receive structured opportunities for engagement with private sector actors, peers in other countries, advisers, and investors. Members also receive member-only listings on the ATC Africa Trade Directory and membership of Industry Council(s).',
    annualFee: 'USD 5,000',
    feePeriod: 'per year',
  },
  {
    id: 'honorary',
    title: 'Honorary Membership',
    description:
      'Conferred on distinguished individuals or institutions that contribute strategic value to the Chamber.',
    benefits:
      "Honorary Membership recognizes exceptional strategic contribution and alignment with ATC's mission to advance trade, economic growth, and private-sector collaboration across Africa and the Caribbean.",
    annualFee: 'TBD',
    feePeriod: 'by invitation',
  },
]
