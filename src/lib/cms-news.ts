import { defaultNewsPage } from '@/lib/news-page-defaults'
import { NEWS_CATEGORY_LABELS } from '@/lib/news-categories'
import { getPayloadClient } from '@/lib/cms'
import type {
  NewsArticle,
  NewsArticleDetail,
  NewsArticlesPage,
  NewsCategory,
  NewsPageData,
} from '@/types/news-article'

export const NEWS_PER_PAGE = 20

const EXCERPT_MAX = 120

function truncateExcerpt(text: string): string {
  const t = text.trim()
  if (t.length <= EXCERPT_MAX) return t
  return `${t.slice(0, EXCERPT_MAX)}...`
}

function featuredImageUrl(featuredImage: unknown): string | undefined {
  if (!featuredImage || typeof featuredImage === 'number') return undefined
  const media = featuredImage as Record<string, unknown>
  const url = media.url as string | undefined
  if (!url) return undefined
  if (url.startsWith('http')) return url
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002').replace(/\/$/, '')
  return `${base}${url.startsWith('/') ? url : `/${url}`}`
}

function mapDoc(doc: Record<string, unknown>): NewsArticle {
  const category = (doc.category as NewsCategory) || 'chamber'
  const excerptRaw = doc.excerpt ? String(doc.excerpt) : ''
  const media = doc.featuredImage
  const alt =
    media && typeof media === 'object' && media !== null && 'alt' in media
      ? String((media as Record<string, unknown>).alt || '')
      : ''

  return {
    id: String(doc.id),
    title: String(doc.title ?? ''),
    slug: String(doc.slug ?? ''),
    excerpt: excerptRaw ? truncateExcerpt(excerptRaw) : undefined,
    category,
    categoryLabel: NEWS_CATEGORY_LABELS[category] ?? category,
    publishedAt: doc.publishedAt ? String(doc.publishedAt) : undefined,
    newsDate: doc.newsDate ? String(doc.newsDate) : undefined,
    newsSource: doc.newsSource ? String(doc.newsSource) : undefined,
    newsAuthor: doc.newsAuthor ? String(doc.newsAuthor) : undefined,
    featured: Boolean(doc.featured),
    imageUrl:
      (doc.imageUrl ? String(doc.imageUrl) : undefined) || featuredImageUrl(media),
    imageAlt: alt || String(doc.title ?? ''),
  }
}

function mapDetailDoc(doc: Record<string, unknown>): NewsArticleDetail {
  const base = mapDoc(doc)
  const excerptRaw = doc.excerpt ? String(doc.excerpt).trim() : ''
  const content = doc.content
  return {
    ...base,
    excerpt: excerptRaw || base.excerpt,
    excerptFull: excerptRaw || undefined,
    content:
      content && typeof content === 'object' && content !== null
        ? (content as Record<string, unknown>)
        : null,
    originalUrl: doc.originalUrl ? String(doc.originalUrl) : undefined,
  }
}

export type GetNewsArticlesOptions = {
  limit?: number
  category?: NewsCategory
}

export async function getNewsArticles(options: GetNewsArticlesOptions = {}): Promise<NewsArticle[]> {
  const { limit = NEWS_PER_PAGE, category } = options
  const page = await getNewsArticlesPage({ page: 1, limit, category })
  return page.articles
}

export type GetNewsArticlesPageOptions = {
  page?: number
  limit?: number
  category?: NewsCategory
  excludeCategories?: NewsCategory[]
}

const emptyPage: NewsArticlesPage = {
  articles: [],
  page: 1,
  totalPages: 0,
  totalDocs: 0,
  hasNextPage: false,
  hasPrevPage: false,
}

export async function getNewsArticlesPage(
  options: GetNewsArticlesPageOptions = {},
): Promise<NewsArticlesPage> {
  const { page = 1, limit = NEWS_PER_PAGE, category, excludeCategories } = options
  try {
    const payload = await getPayloadClient()
    if (!payload) return emptyPage

    const where =
      category
        ? { category: { equals: category } }
        : excludeCategories?.length
          ? { category: { not_in: excludeCategories } }
          : undefined

    const result = await payload.find({
      collection: 'news',
      sort: '-publishedAt',
      page,
      limit,
      depth: 1,
      ...(where ? { where } : {}),
    })
    return {
      articles: result.docs.map((doc) => mapDoc(doc as unknown as Record<string, unknown>)),
      page: result.page ?? page,
      totalPages: result.totalPages ?? 0,
      totalDocs: result.totalDocs ?? 0,
      hasNextPage: result.hasNextPage ?? false,
      hasPrevPage: result.hasPrevPage ?? false,
    }
  } catch {
    return emptyPage
  }
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticleDetail | null> {
  try {
    const payload = await getPayloadClient()
    if (!payload) return null
    const result = await payload.find({
      collection: 'news',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    })
    const doc = result.docs[0]
    if (!doc) return null
    return mapDetailDoc(doc as unknown as Record<string, unknown>)
  } catch {
    return null
  }
}

export function newsPageToSeedData(data: NewsPageData) {
  return {
    introTitle: data.introTitle,
    introBody: data.introBody,
  }
}

export async function getNewsPage(): Promise<NewsPageData> {
  const fallback = defaultNewsPage
  try {
    const payload = await getPayloadClient()
    if (!payload) return fallback
    const global = await payload.findGlobal({ slug: 'news-listing-page' })
    if (!global) return fallback
    const raw = global as unknown as Record<string, unknown>
    return {
      introTitle: String(raw.introTitle ?? fallback.introTitle),
      introBody: String(raw.introBody ?? fallback.introBody),
    }
  } catch {
    return fallback
  }
}
