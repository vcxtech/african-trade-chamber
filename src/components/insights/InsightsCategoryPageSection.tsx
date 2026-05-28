import { InsightListSection } from '@/components/insights/InsightListSection'
import { InsightPagination } from '@/components/insights/InsightPagination'
import { InsightsCategoryHeader } from '@/components/insights/InsightsCategoryHeader'
import type { InsightArticlesPage } from '@/types/insight-article'

type Props = {
  title: string
  categoryRoute: string
  listing: InsightArticlesPage
}

export function InsightsCategoryPageSection({ title, categoryRoute, listing }: Props) {
  return (
    <>
      <InsightsCategoryHeader title={title} />
      <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
        <InsightListSection articles={listing.articles} />
        <InsightPagination
          categoryRoute={categoryRoute}
          page={listing.page}
          totalPages={listing.totalPages}
          totalDocs={listing.totalDocs}
          hasNextPage={listing.hasNextPage}
          hasPrevPage={listing.hasPrevPage}
        />
      </div>
    </>
  )
}
