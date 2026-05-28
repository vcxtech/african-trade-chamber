import type { InsightCategory } from '@/types/insight-article'

export const INSIGHT_CATEGORY_LABELS: Record<InsightCategory, string> = {
  'trade-market-brief': 'Trade & Market Briefs',
  'sector-report': 'Sector Reports',
  'investment-snapshot': 'Investment Landscape Snapshots',
  'policy-paper': 'Policy Papers & Advocacy Reports',
}

export const INSIGHT_CATEGORY_TO_ROUTE: Record<InsightCategory, string> = {
  'trade-market-brief': 'trade-market-briefs',
  'sector-report': 'sector-reports',
  'investment-snapshot': 'investment-landscape-snapshots',
  'policy-paper': 'policy-papers',
}

export const INSIGHT_ROUTE_TO_CATEGORY: Record<string, InsightCategory> = {
  'trade-market-briefs': 'trade-market-brief',
  'sector-reports': 'sector-report',
  'investment-landscape-snapshots': 'investment-snapshot',
  'policy-papers': 'policy-paper',
}

export const INSIGHT_CATEGORY_PAGE_TITLES: Record<string, string> = {
  'trade-market-briefs': 'Trade Market Briefs',
  'sector-reports': 'Sector Reports',
  'investment-landscape-snapshots': 'Investment Landscape',
  'policy-papers': 'Policy Papers & Advocacy Reports',
}

const VALID_CATEGORIES = new Set<string>(Object.keys(INSIGHT_CATEGORY_LABELS))

export function parseInsightCategory(value?: string | null): InsightCategory | undefined {
  if (!value || !VALID_CATEGORIES.has(value)) return undefined
  return value as InsightCategory
}

export function parseInsightCategoryRoute(route?: string | null): InsightCategory | undefined {
  if (!route) return undefined
  return INSIGHT_ROUTE_TO_CATEGORY[route]
}

export function insightDetailHref(category: InsightCategory, slug: string): string {
  return `/insights/${INSIGHT_CATEGORY_TO_ROUTE[category]}/${slug}`
}

export function insightCategoryListHref(categoryRoute: string, page?: number): string {
  const base = `/insights/${categoryRoute}`
  if (!page || page <= 1) return base
  return `${base}?page=${page}`
}
