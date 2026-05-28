import type { CouncilDetailData } from '@/types/council-page'

export const u = (path: string) => `/uploads/${path}`

type CouncilDetailInput = Omit<
  CouncilDetailData,
  'focusAreas' | 'activities' | 'benefits' | 'benefitsImageAlt' | 'benefitsIntro'
> & {
  focusAreas: CouncilDetailData['focusAreas']
  activities: CouncilDetailData['activities']
  benefits: string[]
  benefitsImageAlt?: string
  benefitsIntro?: string
}

export function councilDetail(partial: CouncilDetailInput): CouncilDetailData {
  const benefitsIntro =
    partial.benefitsIntro ?? `Members of the ${partial.title} enjoy:`
  return {
    ...partial,
    benefitsIntro,
    benefitsImageAlt: partial.benefitsImageAlt ?? 'Membership Benefits',
  }
}
