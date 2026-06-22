export type FellowTestimonial = {
  quote: string
  name: string
  subtitle: string
  initials: string
}

export type ResourceTestimonial = {
  quote: string
  name: string
  role: string
  organization?: string
}

export type FellowshipCohort = {
  cohortYear: number
  yearLabel: string
  title: string
  description: string
  imageUrl: string
  imageAlt: string
  exploreUrl: string
  exploreExternal: boolean
  pageHeroTitle: string
  pageHeroSubtitle: string
  pageHeroImageUrl: string
  pageHeroImageAlt: string
  seoTitle: string
  seoDescription: string
  showTestimonials: boolean
  fellowTestimonialsTitle: string
  fellowTestimonialsIntro: string
  resourceTestimonialsTitle: string
  resourceTestimonialsIntro: string
  fellowTestimonials: FellowTestimonial[]
  resourceTestimonials: ResourceTestimonial[]
}

export type FellowshipCtaListItem =
  | string
  | {
      title: string
      body?: string
    }

export type FellowshipCtaBlock = {
  heading: string
  paragraphs?: string[]
  labeledParagraphs?: Array<{ label: string; text: string }>
  listItems?: FellowshipCtaListItem[]
}

export type FellowshipCtaData = {
  eyebrow: string
  title: string
  tagline: string
  sections: FellowshipCtaBlock[]
  footerParagraphs: string[]
  applyUrl: string
  contactPhone: string
  contactEmail: string
}

export type FellowshipPageData = {
  heroImageUrl: string
  introText: string
  cohorts: FellowshipCohort[]
  cta: FellowshipCtaData
}
