import { defaultInsightsSeed } from '@/lib/insights-seed-defaults'
import {
  INSIGHT_CATEGORY_LABELS,
  INSIGHT_CATEGORY_TO_ROUTE,
  parseInsightCategory,
  parseInsightCategoryRoute,
} from '@/lib/insight-categories'
import { getPayloadClient } from '@/lib/cms'
import { resolvePayloadMediaAlt, resolvePayloadMediaUrl } from '@/lib/payload-media'
import type {
  InsightArticle,
  InsightArticleDetail,
  InsightArticlesPage,
  InsightCategory,
} from '@/types/insight-article'

export const INSIGHTS_PER_PAGE = 10

const EXCERPT_MAX = 200

function truncateExcerpt(text: string): string {
  const t = text.trim()
  if (t.length <= EXCERPT_MAX) return t
  return `${t.slice(0, EXCERPT_MAX)}...`
}

function mapDoc(doc: Record<string, unknown>): InsightArticle {
  const category = parseInsightCategory(String(doc.category ?? '')) ?? 'sector-report'
  const excerptRaw = doc.excerpt ? String(doc.excerpt) : ''
  const media = doc.featuredImage
  const title = String(doc.title ?? '')

  return {
    id: String(doc.id),
    title,
    slug: String(doc.slug ?? ''),
    excerpt: excerptRaw ? truncateExcerpt(excerptRaw) : undefined,
    category,
    categoryLabel: INSIGHT_CATEGORY_LABELS[category],
    categoryRoute: INSIGHT_CATEGORY_TO_ROUTE[category],
    publishedAt: doc.publishedAt ? String(doc.publishedAt) : undefined,
    author: doc.author ? String(doc.author) : undefined,
    imageUrl: resolvePayloadMediaUrl(media, doc.imageUrl as string | undefined),
    imageAlt: resolvePayloadMediaAlt(media, null, title),
  }
}

function mapDetailDoc(doc: Record<string, unknown>): InsightArticleDetail {
  const base = mapDoc(doc)
  const excerptRaw = doc.excerpt ? String(doc.excerpt).trim() : ''
  const content = doc.content
  return {
    ...base,
    excerpt: excerptRaw ? truncateExcerpt(excerptRaw) : base.excerpt,
    excerptFull: excerptRaw || undefined,
    content:
      content && typeof content === 'object' && content !== null
        ? (content as Record<string, unknown>)
        : null,
    originalUrl: doc.originalUrl ? String(doc.originalUrl) : undefined,
  }
}

const emptyPage: InsightArticlesPage = {
  articles: [],
  page: 1,
  totalPages: 0,
  totalDocs: 0,
  hasNextPage: false,
  hasPrevPage: false,
}

export type GetInsightArticlesPageOptions = {
  page?: number
  limit?: number
  category: InsightCategory
}

export async function getInsightArticlesPage(
  options: GetInsightArticlesPageOptions,
): Promise<InsightArticlesPage> {
  const { page = 1, limit = INSIGHTS_PER_PAGE, category } = options
  try {
    const payload = await getPayloadClient()
    if (!payload) return emptyPage
    const result = await payload.find({
      collection: 'insights',
      sort: '-publishedAt',
      page,
      limit,
      depth: 1,
      where: { category: { equals: category } },
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

export async function getInsightArticleBySlug(
  categoryRoute: string,
  slug: string,
): Promise<InsightArticleDetail | null> {
  const category = parseInsightCategoryRoute(categoryRoute)
  if (!category) return null

  try {
    const payload = await getPayloadClient()
    if (!payload) return null
    const result = await payload.find({
      collection: 'insights',
      where: {
        and: [{ slug: { equals: slug } }, { category: { equals: category } }],
      },
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

export async function getAllInsightStaticParams(): Promise<
  { category: string; slug: string }[]
> {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'insights',
      limit: 500,
      depth: 0,
    })
    return result.docs
      .map((doc) => {
        const d = doc as unknown as Record<string, unknown>
        const category = parseInsightCategory(String(d.category ?? ''))
        const slug = String(d.slug ?? '')
        if (!category || !slug) return null
        return { category: INSIGHT_CATEGORY_TO_ROUTE[category], slug }
      })
      .filter((p): p is { category: string; slug: string } => p !== null)
  } catch {
    return []
  }
}

export function insightsSeedDocuments() {
  return defaultInsightsSeed.map((row) => ({
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    category: row.category,
    author: row.author,
    imageUrl: row.imageUrl,
    publishedAt: row.publishedAt,
    originalUrl: row.originalUrl,
  }))
}
