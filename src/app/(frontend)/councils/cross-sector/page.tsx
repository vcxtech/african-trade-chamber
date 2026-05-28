import { CouncilHubGridPageSection } from '@/components/councils/CouncilHubGridPageSection'
import { defaultCrossSectorCouncilsPage } from '@/lib/cross-sector-councils-defaults'

export const metadata = {
  title: 'Cross-Sector Councils',
  description:
    "ATC Cross-Sector Councils address development priorities and cross-cutting trade issues across the trade ecosystem.",
}

export default function CrossSectorCouncilsPage() {
  return <CouncilHubGridPageSection data={defaultCrossSectorCouncilsPage} />
}
