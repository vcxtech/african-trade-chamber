import { InsightsCategoryPageSection } from '@/components/insights/InsightsCategoryPageSection'
import { loadInsightCategoryListing } from '@/lib/insight-category-page'
import { notFound } from 'next/navigation'

const CATEGORY_ROUTE = 'sector-reports'

export const metadata = {
  title: 'Sector Reports',
  description: 'Sector reports from the African Trade Chamber.',
}

type Props = { searchParams: Promise<{ page?: string }> }

export default async function SectorReportsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const loaded = await loadInsightCategoryListing(CATEGORY_ROUTE, pageParam)
  if (!loaded) notFound()

  return (
    <InsightsCategoryPageSection
      title={loaded.config.title}
      categoryRoute={CATEGORY_ROUTE}
      listing={loaded.listing}
    />
  )
}
