export type NavLink = { label: string; href: string }
export type NavChild = NavLink & {
  subItems?: NavLink[]
  /** Second-level flyout position (default: right) */
  flyout?: 'left' | 'right'
}
export type NavItem = NavLink & { children?: NavChild[] }

export type SocialLink = {
  platform: 'facebook' | 'linkedin' | 'twitter' | 'youtube' | 'instagram'
  url: string
}

export type SiteSettingsData = {
  siteName: string
  utilityBarLinks: NavLink[]
  socialLinks: SocialLink[]
  headerNav: NavItem[]
  footerColumns: { title: string; links: NavLink[] }[]
  address?: string
  contactEmail?: string
  contactPhone?: string
  showTranslator?: boolean
  showWhatsappHelp?: boolean
  whatsappHelpLabel?: string
}

export type HeroSlide = {
  id: string
  title: string
  description: string
  ctaLabel: string
  ctaUrl: string
  backgroundImageUrl: string
  sideImageUrl?: string
  sideVideoUrl?: string
  showSideImage: boolean
  showApplyOnly: boolean
}

export type MembershipCategory = {
  id: string
  title: string
  description: string
  benefits: string
  annualFee: string
  feePeriod: string
}
