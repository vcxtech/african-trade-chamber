import type { CouncilDetailData } from '@/types/council-page'
import { agribusinessDetail } from './council-details/agribusiness'
import { energyDetail } from './council-details/energy'
import {
  manufacturingDetail,
  tradeFinanceDetail,
  transportLogisticsDetail,
  miningExtractivesDetail,
} from './council-details/remaining'
import {
  healthcareDetail,
  tourismHospitalityDetail,
  creativesDetail,
  infrastructureDevelopmentDetail,
} from './council-details/remaining-part2'
import {
  customsDetail,
  professionalServicesDetail,
  technologyInnovationDetail,
  researchPolicyDetail,
  womenEntrepreneursDetail,
  youngEntrepreneursDetail,
} from './council-details/remaining-part3'

export const councilDetailsBySlug: Record<string, CouncilDetailData> = {
  agribusiness: agribusinessDetail,
  energy: energyDetail,
  manufacturing: manufacturingDetail,
  'trade-finance': tradeFinanceDetail,
  'transport-logistics': transportLogisticsDetail,
  'mining-extractives': miningExtractivesDetail,
  healthcare: healthcareDetail,
  'tourism-hospitality': tourismHospitalityDetail,
  creatives: creativesDetail,
  'infrastructure-development': infrastructureDevelopmentDetail,
  customs: customsDetail,
  'professional-services': professionalServicesDetail,
  'technology-innovation': technologyInnovationDetail,
  'research-policy': researchPolicyDetail,
  'women-entrepreneurs': womenEntrepreneursDetail,
  'young-entrepreneurs': youngEntrepreneursDetail,
}

export const councilDetailSlugs = Object.keys(councilDetailsBySlug)

export function getCouncilDetail(slug: string): CouncilDetailData | undefined {
  return councilDetailsBySlug[slug]
}
