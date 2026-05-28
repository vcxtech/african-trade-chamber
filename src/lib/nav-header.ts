import type { NavItem } from '@/types/content'

/** Full main navigation matching africantradechamber.org */
export const defaultHeaderNav: NavItem[] = [
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'About Us', href: '/about' },
      { label: 'Regional Network & Country Offices', href: '/country-offices' },
      {
        label: 'Country Offices',
        href: '/country-offices',
        flyout: 'right',
        subItems: [
          { label: 'Ghana', href: '/country-offices/ghana' },
          { label: 'DRC', href: '/country-offices/drc' },
          { label: 'Kenya', href: '/country-offices/kenya' },
          { label: 'Nigeria', href: '/country-offices/nigeria' },
          { label: 'South Africa', href: '/country-offices/south-africa' },
          { label: 'Egypt', href: '/country-offices/egypt' },
          { label: 'Liberia', href: '/country-offices/liberia' },
          { label: 'São Tomé and Príncipe', href: '/country-offices/sao-tome' },
          { label: 'Morocco', href: '/country-offices/morocco' },
          { label: 'Ethiopia', href: '/country-offices/ethiopia' },
        ],
      },
    ],
  },
  {
    label: 'What We Do',
    href: '/what-we-do',
    children: [
      { label: 'Policy & Government Engagement', href: '/policy-government-engagement' },
      { label: 'Trade Facilitation & Expansion', href: '/trade-facilitation-expansion' },
      { label: 'B2B & B2G Matchmaking', href: '/b2b-b2g-matchmaking' },
      { label: 'Investment Promotion', href: '/investment-promotion' },
      { label: 'Capacity Building', href: '/capacity-building' },
      { label: 'Fellowship', href: '/fellowship' },
      { label: 'Market Support', href: '/market-support' },
    ],
  },
  {
    label: 'Membership',
    href: '/membership',
    children: [
      { label: 'Why Join', href: '/membership/why-join' },
      { label: 'Categories', href: '/membership/categories' },
      { label: 'Application Process', href: '/membership/apply' },
      { label: 'Testimonials', href: '/membership/testimonials' },
    ],
  },
  {
    label: 'Events',
    href: '/events',
    children: [
      { label: 'Africa Trade Summit', href: '/events/africa-trade-summit' },
      { label: 'Africa Trade Awards', href: 'https://www.africatradeawards.com/' },
      { label: 'Trade Missions & Investment Events', href: '/events/trade-missions' },
      { label: 'Calendar of Events', href: '/events/calendar' },
      { label: 'Sponsorship Opportunities', href: '/events/sponsorship' },
    ],
  },
  {
    label: 'Councils',
    href: '/councils',
    children: [
      { label: 'Industry Councils', href: '/councils/industry' },
      {
        label: 'Cross-Sector Councils',
        href: '/councils/cross-sector',
        flyout: 'right',
        subItems: [
          { label: 'Women Entrepreneurs Council', href: '/councils/women-entrepreneurs' },
          { label: 'Young Entrepreneurs Council', href: '/councils/young-entrepreneurs' },
          { label: 'Research & Policy Council', href: '/councils/research-policy' },
        ],
      },
      { label: 'SME Council', href: '/councils/sme' },
    ],
  },
  {
    label: 'Insights',
    href: '/insights',
    children: [
      { label: 'Trade & Market Briefs', href: '/insights/trade-market-briefs' },
      { label: 'Sector Reports', href: '/insights/sector-reports' },
      { label: 'Investment Snapshots', href: '/insights/investment-landscape-snapshots' },
      { label: 'Policy Papers', href: '/insights/policy-papers' },
      { label: 'Newsletters & Multimedia', href: '/news' },
      {
        label: 'Newsroom',
        href: '/news',
        flyout: 'left',
        subItems: [
          { label: 'ATC News', href: '/news' },
          { label: 'Member News', href: '/news?category=member' },
          { label: 'Press Releases', href: '/news?category=press' },
          { label: 'Media Coverage', href: '/media-coverage' },
          { label: 'Newsletter Archive', href: '/newsletter-archive' },
        ],
      },
    ],
  },
  {
    label: 'Get Involved',
    href: '/get-involved',
    children: [
      { label: 'Careers & Opportunities', href: '/careers' },
      { label: 'Join Chamber', href: '/membership' },
      { label: 'Partner or Sponsor', href: '/partnerships' },
      { label: 'Donate', href: '/donate' },
      { label: 'Volunteer', href: '/volunteer' },
      {
        label: 'Partnerships',
        href: '/partnerships',
        flyout: 'left',
        subItems: [
          { label: 'Why Partner', href: '/partnerships/why-partner' },
          { label: 'Types of Partners', href: '/partnerships/types-of-partners' },
          { label: 'Opportunities', href: '/partnerships/opportunities' },
          { label: 'Get Started', href: '/partnerships/get-started' },
        ],
      },
      {
        label: 'Contact',
        href: '/contact-us',
        flyout: 'left',
        subItems: [
          { label: 'General Inquiries', href: '/contact-us' },
          { label: 'Office Locations', href: '/contact-us/office-locations' },
          { label: 'Social Media', href: '/contact-us/social-media' },
          { label: 'Newsletter Signup', href: '/contact-us/newsletter' },
        ],
      },
    ],
  },
]
