import { NewsIntroSection } from '@/components/news/NewsIntroSection'
import { NewsListSection } from '@/components/news/NewsListSection'
import { NewsPagination } from '@/components/news/NewsPagination'
import { getNewsArticlesPage, getNewsPage } from '@/lib/cms-news'
import { parseNewsCategory } from '@/lib/news-categories'
import { defaultNewsPage } from '@/lib/news-page-defaults'

export const metadata = {
  title: 'News',
  description: defaultNewsPage.introBody.slice(0, 160),
}

type Props = {
  searchParams: Promise<{ category?: string; page?: string }>
}

function parsePage(raw?: string): number {
  const n = parseInt(raw ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

export default async function NewsPage({ searchParams }: Props) {
  const { category: categoryParam, page: pageParam } = await searchParams
  const category = parseNewsCategory(categoryParam)
  const page = parsePage(pageParam)

  const [intro, listing] = await Promise.all([
    getNewsPage(),
    getNewsArticlesPage({
      category,
      page,
      excludeCategories: category ? undefined : ['media', 'newsletter'],
    }),
  ])

  const currentPage =
    listing.totalPages > 0 && page > listing.totalPages ? listing.totalPages : page

  const listingResolved =
    currentPage !== page
      ? await getNewsArticlesPage({ category, page: currentPage })
      : listing

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <NewsIntroSection data={intro} />
      <NewsListSection
        articles={listingResolved.articles}
        initialCategory={category ?? ''}
      />
      <NewsPagination
        page={listingResolved.page}
        totalPages={listingResolved.totalPages}
        totalDocs={listingResolved.totalDocs}
        category={category}
        hasNextPage={listingResolved.hasNextPage}
        hasPrevPage={listingResolved.hasPrevPage}
      />
    </div>
  )
}
