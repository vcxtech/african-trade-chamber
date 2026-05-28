import Link from 'next/link'
import type { NewsCategory } from '@/types/news-article'

type Props = {
  page: number
  totalPages: number
  totalDocs: number
  category?: NewsCategory
  hasNextPage: boolean
  hasPrevPage: boolean
  basePath?: string
}

export function buildNewsListHref(
  page: number,
  category?: NewsCategory,
  basePath = '/news',
): string {
  const params = new URLSearchParams()
  if (basePath === '/news' && category) params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const q = params.toString()
  return q ? `${basePath}?${q}` : basePath
}

function pageNumbers(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set<number>([1, total, current, current - 1, current + 1])
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
}

export function NewsPagination({
  page,
  totalPages,
  totalDocs,
  category,
  hasNextPage,
  hasPrevPage,
  basePath = '/news',
}: Props) {
  if (totalPages <= 1) return null

  const pages = pageNumbers(page, totalPages)

  return (
    <nav
      className="mt-10 flex flex-col items-center gap-4 border-t border-slate-200 pt-8"
      aria-label="News pagination"
    >
      <p className="text-sm text-slate-600">
        Page {page} of {totalPages} ({totalDocs} articles)
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {hasPrevPage ? (
            <Link
              href={buildNewsListHref(page - 1, category, basePath)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#002740] hover:bg-slate-50"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-lg border border-slate-100 px-4 py-2 text-sm text-slate-400">
              Previous
            </span>
          )}
        </li>
        {pages.map((p, i) => {
          const prev = pages[i - 1]
          const showEllipsis = prev !== undefined && p - prev > 1
          return (
            <li key={p} className="flex items-center gap-2">
              {showEllipsis ? <span className="px-1 text-slate-400">…</span> : null}
              {p === page ? (
                <span
                  className="flex h-10 min-w-10 items-center justify-center rounded-lg bg-[#002740] px-3 text-sm font-semibold text-white"
                  aria-current="page"
                >
                  {p}
                </span>
              ) : (
                <Link
                  href={buildNewsListHref(p, category, basePath)}
                  className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-[#002740] hover:bg-slate-50"
                >
                  {p}
                </Link>
              )}
            </li>
          )
        })}
        <li>
          {hasNextPage ? (
            <Link
              href={buildNewsListHref(page + 1, category, basePath)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#002740] hover:bg-slate-50"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-lg border border-slate-100 px-4 py-2 text-sm text-slate-400">
              Next
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}
