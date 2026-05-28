import { getInsightArticlesPage } from '@/lib/cms-insights'
import {
  INSIGHT_CATEGORY_PAGE_TITLES,
  parseInsightCategoryRoute,
} from '@/lib/insight-categories'
import type { InsightCategory } from '@/types/insight-article'

export type InsightCategoryRouteConfig = {
  categoryRoute: string
  category: InsightCategory
  title: string
}

export const INSIGHT_CATEGORY_ROUTES: InsightCategoryRouteConfig[] = [
  {
    categoryRoute: 'trade-market-briefs',
    category: 'trade-market-brief',
    title: INSIGHT_CATEGORY_PAGE_TITLES['trade-market-briefs'],
  },
  {
    categoryRoute: 'sector-reports',
    category: 'sector-report',
    title: INSIGHT_CATEGORY_PAGE_TITLES['sector-reports'],
  },
  {
    categoryRoute: 'investment-landscape-snapshots',
    category: 'investment-snapshot',
    title: INSIGHT_CATEGORY_PAGE_TITLES['investment-landscape-snapshots'],
  },
  {
    categoryRoute: 'policy-papers',
    category: 'policy-paper',
    title: INSIGHT_CATEGORY_PAGE_TITLES['policy-papers'],
  },
]

export function getInsightCategoryRouteConfig(
  categoryRoute: string,
): InsightCategoryRouteConfig | undefined {
  return INSIGHT_CATEGORY_ROUTES.find((r) => r.categoryRoute === categoryRoute)
}

export function parseInsightListPage(raw?: string): number {
  const n = parseInt(raw ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

export async function loadInsightCategoryListing(
  categoryRoute: string,
  pageParam?: string,
) {
  const config = getInsightCategoryRouteConfig(categoryRoute)
  if (!config) return null

  const page = parseInsightListPage(pageParam)
  const listing = await getInsightArticlesPage({ category: config.category, page })

  const currentPage =
    listing.totalPages > 0 && page > listing.totalPages ? listing.totalPages : page

  const listingResolved =
    currentPage !== page
      ? await getInsightArticlesPage({ category: config.category, page: currentPage })
      : listing

  return { config, listing: listingResolved }
}

export function isValidInsightCategoryRoute(route: string): boolean {
  return Boolean(parseInsightCategoryRoute(route))
}
