export type NewsCategory = 'chamber' | 'member' | 'press' | 'media' | 'newsletter'

export type NewsArticle = {
  id: string
  title: string
  slug: string
  excerpt?: string
  category: NewsCategory
  categoryLabel: string
  publishedAt?: string
  newsDate?: string
  newsSource?: string
  newsAuthor?: string
  featured: boolean
  imageUrl?: string
  imageAlt?: string
}

export type NewsPageData = {
  introTitle: string
  introBody: string
}

/** Full article for /news/[slug] (includes Lexical body). */
export type NewsArticleDetail = NewsArticle & {
  excerptFull?: string
  content?: Record<string, unknown> | null
  originalUrl?: string
}

export type NewsArticlesPage = {
  articles: NewsArticle[]
  page: number
  totalPages: number
  totalDocs: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
