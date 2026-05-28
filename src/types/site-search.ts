export type SearchResultType = 'page' | 'news' | 'insight' | 'job'

export type SearchResultItem = {
  title: string
  href: string
  excerpt?: string
  type: SearchResultType
}

export type SiteSearchResults = {
  query: string
  pages: SearchResultItem[]
  news: SearchResultItem[]
  insights: SearchResultItem[]
  jobs: SearchResultItem[]
  total: number
}

export const SEARCH_MIN_QUERY_LENGTH = 2

export const SEARCH_TYPE_LABELS: Record<SearchResultType, string> = {
  page: 'Pages',
  news: 'News',
  insight: 'Insights',
  job: 'Careers',
}
