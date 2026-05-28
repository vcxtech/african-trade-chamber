export type InsightCategory =
  | 'trade-market-brief'
  | 'sector-report'
  | 'investment-snapshot'
  | 'policy-paper'

export type InsightArticle = {
  id: string
  title: string
  slug: string
  excerpt?: string
  category: InsightCategory
  categoryLabel: string
  categoryRoute: string
  publishedAt?: string
  author?: string
  imageUrl?: string
  imageAlt?: string
}

export type InsightArticleDetail = InsightArticle & {
  excerptFull?: string
  content?: Record<string, unknown> | null
  originalUrl?: string
}

export type InsightArticlesPage = {
  articles: InsightArticle[]
  page: number
  totalPages: number
  totalDocs: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type InsightsHubCardData = {
  id: string
  title: string
  body: string
  imageUrl: string
  imageAlt: string
  ctaLabel: string
  ctaHref: string
}

export type InsightsHubPageData = {
  headerTitle: string
  headerSubtitle: string
  cards: InsightsHubCardData[]
}
