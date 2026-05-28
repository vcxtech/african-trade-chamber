import { InsightsHubPageSection } from '@/components/insights/InsightsHubPageSection'
import { defaultInsightsHubPage } from '@/lib/insights-hub-defaults'

export const metadata = {
  title: 'Insights',
  description: defaultInsightsHubPage.headerSubtitle.slice(0, 160),
}

export default function InsightsPage() {
  return <InsightsHubPageSection data={defaultInsightsHubPage} />
}
