export type CouncilHubCardData = {
  id: string
  title: string
  body: string
  imageUrl: string
  imageAlt: string
  focusAreas?: string[]
  ctaLabel: string
  ctaHref: string
}

export type CouncilHubPageData = {
  headerTitle: string
  introText: string
  cards: CouncilHubCardData[]
}

export type CouncilsHubCardData = {
  id: string
  title: string
  body: string
  imageUrl: string
  imageAlt: string
  ctaLabel: string
  ctaHref: string
}

export type CouncilsHubPageData = {
  headerTitle: string
  introText: string
  cards: CouncilsHubCardData[]
}

export type CouncilFocusArea = {
  title: string
  description: string
  imageUrl: string
  imageAlt: string
}

export type CouncilActivity = {
  title: string
  description: string
}

export type CouncilExtraSection = {
  title: string
  intro?: string
  items: { title: string; description: string }[]
}

export type CouncilDetailData = {
  slug: string
  title: string
  tagline: string
  introParagraphs: string[]
  focusAreas: CouncilFocusArea[]
  activities: CouncilActivity[]
  benefitsIntro?: string
  benefits: string[]
  benefitsImageUrl: string
  benefitsImageAlt: string
  ctaParagraphs: string[]
  contactEmail: string
  extraSection?: CouncilExtraSection
}

export type SmeObjectiveCard = {
  title: string
  description: string
}

export type SmeCouncilPageData = {
  title: string
  tagline: string
  introParagraphs: string[]
  objectives: SmeObjectiveCard[]
  membershipParagraphs: string[]
  participationImageUrl: string
  participationImageAlt: string
  participationParagraphs: string[]
  participationBullets: string[]
  engagementTitle: string
  engagementParagraphs: string[]
  contactEmail: string
}
