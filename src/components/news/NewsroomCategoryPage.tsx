import { NewsIntroSection } from '@/components/news/NewsIntroSection'
import { NewsListSection } from '@/components/news/NewsListSection'
import { NewsPagination } from '@/components/news/NewsPagination'
import { getNewsArticlesPage } from '@/lib/cms-news'
import type { NewsCategory, NewsPageData } from '@/types/news-article'

type Props = {
  intro: NewsPageData
  category: NewsCategory
  page: number
}

export async function NewsroomCategoryPage({ intro, category, page }: Props) {
  const listing = await getNewsArticlesPage({ category, page })

  const currentPage =
    listing.totalPages > 0 && page > listing.totalPages ? listing.totalPages : page

  const listingResolved =
    currentPage !== page
      ? await getNewsArticlesPage({ category, page: currentPage })
      : listing

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <NewsIntroSection data={intro} />
      <NewsListSection articles={listingResolved.articles} initialCategory={category} hideCategoryFilter />
      <NewsPagination
        page={listingResolved.page}
        totalPages={listingResolved.totalPages}
        totalDocs={listingResolved.totalDocs}
        category={category}
        hasNextPage={listingResolved.hasNextPage}
        hasPrevPage={listingResolved.hasPrevPage}
        basePath={category === 'media' ? '/media-coverage' : category === 'newsletter' ? '/newsletter-archive' : '/news'}
      />
    </div>
  )
}
