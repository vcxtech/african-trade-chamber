import type { ContactSocialLink } from '@/types/contact-page'
import type { SocialLink } from '@/types/content'

export const ATC_SOCIAL_URLS = {
  facebook: 'https://www.facebook.com/africantradechamber?mibextid=LQQJ4d',
  linkedin: 'https://www.linkedin.com/company/atc-african-trade-chamber/',
  twitter: 'https://x.com/ATC_Chamber?s=20',
  instagram: 'https://www.instagram.com/africantradechamber?igsh=Y3ZuaHgzdXZ0aDhm',
  youtube: 'https://www.youtube.com/channel/UClXYhsa3V-MllfWHnz2VGOQ',
} as const

export const defaultSiteSocialLinks: SocialLink[] = [
  { platform: 'facebook', url: ATC_SOCIAL_URLS.facebook },
  { platform: 'linkedin', url: ATC_SOCIAL_URLS.linkedin },
  { platform: 'twitter', url: ATC_SOCIAL_URLS.twitter },
  { platform: 'instagram', url: ATC_SOCIAL_URLS.instagram },
  { platform: 'youtube', url: ATC_SOCIAL_URLS.youtube },
]

export const defaultContactSocialLinks: ContactSocialLink[] = [
  { platform: 'facebook', label: 'Facebook', url: ATC_SOCIAL_URLS.facebook },
  { platform: 'linkedin', label: 'LinkedIn', url: ATC_SOCIAL_URLS.linkedin },
  { platform: 'twitter', label: 'X', url: ATC_SOCIAL_URLS.twitter },
  { platform: 'instagram', label: 'Instagram', url: ATC_SOCIAL_URLS.instagram },
  { platform: 'youtube', label: 'YouTube', url: ATC_SOCIAL_URLS.youtube },
]
