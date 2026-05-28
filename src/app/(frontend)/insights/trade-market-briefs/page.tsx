import { InsightsCategoryPageSection } from '@/components/insights/InsightsCategoryPageSection'
import { loadInsightCategoryListing } from '@/lib/insight-category-page'
import { notFound } from 'next/navigation'

const CATEGORY_ROUTE = 'trade-market-briefs'

export const metadata = {
  title: 'Trade Market Briefs',
  description: 'Trade and market briefs from the African Trade Chamber.',
}

type Props = { searchParams: Promise<{ page?: string }> }

export default async function TradeMarketBriefsPage({ searchParams }: Props) {
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
