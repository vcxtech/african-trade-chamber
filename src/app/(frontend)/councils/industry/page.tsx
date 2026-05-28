import { CouncilHubGridPageSection } from '@/components/councils/CouncilHubGridPageSection'
import { defaultIndustryCouncilsPage } from '@/lib/industry-councils-defaults'

export const metadata = {
  title: 'Industry Councils',
  description:
    "ATC Industry Councils serve as platforms for focused dialogue, collaboration, and strategic action across key sectors.",
}

export default function IndustryCouncilsPage() {
  return <CouncilHubGridPageSection data={defaultIndustryCouncilsPage} />
}
