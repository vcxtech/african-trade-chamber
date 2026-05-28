import { insightDetailHref, parseInsightCategory } from '@/lib/insight-categories'
import { searchStaticPages } from '@/lib/site-search-index'
import { getPayloadClient } from '@/lib/cms'
import type { SearchResultItem, SiteSearchResults } from '@/types/site-search'
import { SEARCH_MIN_QUERY_LENGTH } from '@/types/site-search'

const emptyResults = (query: string): SiteSearchResults => ({
  query,
  pages: [],
  news: [],
  insights: [],
  jobs: [],
  total: 0,
})

function dedupeByHref(items: SearchResultItem[]): SearchResultItem[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.href)) return false
    seen.add(item.href)
    return true
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PayloadAny = any

async function searchNews(query: string, limit: number): Promise<SearchResultItem[]> {
  const payload = (await getPayloadClient()) as PayloadAny
  if (!payload) return []
  const result = await payload.find({
    collection: 'news',
    limit,
    depth: 0,
    where: {
      or: [{ title: { contains: query } }, { excerpt: { contains: query } }],
    },
  })
  return result.docs.map((doc: PayloadAny) => ({
    title: String(doc.title ?? ''),
    href: `/news/${String(doc.slug ?? '')}`,
    excerpt: doc.excerpt ? String(doc.excerpt) : undefined,
    type: 'news' as const,
  }))
}

async function searchInsights(query: string, limit: number): Promise<SearchResultItem[]> {
  const payload = (await getPayloadClient()) as PayloadAny
  if (!payload) return []
  const result = await payload.find({
    collection: 'insights',
    limit,
    depth: 0,
    where: {
      or: [{ title: { contains: query } }, { excerpt: { contains: query } }],
    },
  })
  return result.docs
    .map((doc: PayloadAny) => {
      const category = parseInsightCategory(String(doc.category ?? ''))
      const slug = String(doc.slug ?? '')
      if (!category || !slug) return null
      return {
        title: String(doc.title ?? ''),
        href: insightDetailHref(category, slug),
        excerpt: doc.excerpt ? String(doc.excerpt) : undefined,
        type: 'insight' as const,
      }
    })
    .filter((item: SearchResultItem | null): item is SearchResultItem => item !== null)
}

async function searchJobs(query: string, limit: number): Promise<SearchResultItem[]> {
  const payload = (await getPayloadClient()) as PayloadAny
  if (!payload) return []
  const result = await payload.find({
    collection: 'jobs',
    limit,
    depth: 0,
    where: {
      and: [
        { status: { equals: 'open' } },
        {
          or: [
            { title: { contains: query } },
            { summary: { contains: query } },
            { department: { contains: query } },
          ],
        },
      ],
    },
  })
  return result.docs.map((doc: PayloadAny) => ({
    title: String(doc.title ?? ''),
    href: `/careers/${String(doc.slug ?? '')}`,
    excerpt: doc.summary ? String(doc.summary) : undefined,
    type: 'job' as const,
  }))
}

async function searchCmsPages(query: string, limit: number): Promise<SearchResultItem[]> {
  const payload = (await getPayloadClient()) as PayloadAny
  if (!payload) return []
  const result = await payload.find({
    collection: 'pages',
    limit,
    depth: 0,
    where: {
      or: [{ title: { contains: query } }, { excerpt: { contains: query } }],
    },
  })
  return result.docs.map((doc: PayloadAny) => ({
    title: String(doc.title ?? ''),
    href: `/${String(doc.slug ?? '')}`,
    excerpt: doc.excerpt ? String(doc.excerpt) : undefined,
    type: 'page' as const,
  }))
}

export async function searchSite(rawQuery: string): Promise<SiteSearchResults> {
  const query = rawQuery.trim()
  if (query.length < SEARCH_MIN_QUERY_LENGTH) return emptyResults(query)

  try {
    const [staticPages, cmsPages, news, insights, jobs] = await Promise.all([
      Promise.resolve(searchStaticPages(query, 15)),
      searchCmsPages(query, 5),
      searchNews(query, 10),
      searchInsights(query, 10),
      searchJobs(query, 10),
    ])

    const pages = dedupeByHref([...staticPages, ...cmsPages])

    return {
      query,
      pages,
      news,
      insights,
      jobs,
      total: pages.length + news.length + insights.length + jobs.length,
    }
  } catch {
    const pages = searchStaticPages(query, 15)
    return {
      ...emptyResults(query),
      pages,
      total: pages.length,
    }
  }
}
