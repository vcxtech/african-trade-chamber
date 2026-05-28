import { InsightsCategoryPageSection } from '@/components/insights/InsightsCategoryPageSection'
import { loadInsightCategoryListing } from '@/lib/insight-category-page'
import { notFound } from 'next/navigation'

const CATEGORY_ROUTE = 'policy-papers'

export const metadata = {
  title: 'Policy Papers & Advocacy Reports',
  description: 'Policy papers and advocacy reports from the African Trade Chamber.',
}

type Props = { searchParams: Promise<{ page?: string }> }

export default async function PolicyPapersPage({ searchParams }: Props) {
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
