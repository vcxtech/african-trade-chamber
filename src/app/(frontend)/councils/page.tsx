import { CouncilsHubPageSection } from '@/components/councils/CouncilsHubPageSection'
import { defaultCouncilsHubPage } from '@/lib/councils-hub-defaults'

export const metadata = {
  title: 'Councils',
  description:
    "ATC Councils bring together sector leaders and practitioners to advance trade, investment, and inclusive growth across Africa.",
}

export default function CouncilsPage() {
  return <CouncilsHubPageSection data={defaultCouncilsHubPage} />
}
