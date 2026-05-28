'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { NewsCard } from '@/components/news/NewsCard'
import { NEWS_CATEGORIES } from '@/lib/news-categories'
import type { NewsArticle } from '@/types/news-article'

type Props = {
  articles: NewsArticle[]
  initialCategory: string
  hideCategoryFilter?: boolean
  emptyMessage?: string
}

export function NewsListSection({
  articles,
  initialCategory,
  hideCategoryFilter = false,
  emptyMessage,
}: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return articles
    return articles.filter((a) => {
      const hay = `${a.title} ${a.excerpt ?? ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [articles, search])

  const visibleSlugs = useMemo(() => new Set(filtered.map((a) => a.slug)), [filtered])

  const handleCategoryChange = (value: string) => {
    if (!value) {
      router.push('/news')
      return
    }
    router.push(`/news?category=${encodeURIComponent(value)}`)
  }

  return (
    <section className="news-list-container" aria-label="News articles">
      <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:flex-wrap md:items-end">
        {!hideCategoryFilter ? (
          <div className="min-w-[200px] flex-1">
            <label htmlFor="category-filter" className="mb-1 block text-sm font-semibold text-[#002740]">
              Filter by Category:
            </label>
            <select
              id="category-filter"
              value={initialCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
            >
              <option value="">All Categories</option>
              {NEWS_CATEGORIES.filter((c) => !['media', 'newsletter'].includes(c.value)).map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div className={`min-w-[200px] ${hideCategoryFilter ? 'flex-1' : 'flex-[2]'}`}>
          <label htmlFor="news-search" className="mb-1 block text-sm font-semibold text-[#002740]">
            Search News:
          </label>
          <input
            id="news-search"
            type="search"
            placeholder="Search news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>
      </div>

      {articles.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          {emptyMessage ?? (
            <>
              No news articles yet. Add posts in{' '}
              <Link href="/admin" className="font-semibold text-[#002740] underline">
                admin
              </Link>{' '}
              or import from WordPress with <code className="text-sm">npm run migrate:news</code>.
            </>
          )}
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
          No articles match your search.
        </p>
      ) : (
        <div className="atc-news-list grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[30px]">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} hidden={!visibleSlugs.has(article.slug)} />
          ))}
        </div>
      )}
    </section>
  )
}
