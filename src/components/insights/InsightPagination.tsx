import Link from 'next/link'
import { insightCategoryListHref } from '@/lib/insight-categories'

type Props = {
  categoryRoute: string
  page: number
  totalPages: number
  totalDocs: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

function pageNumbers(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set<number>([1, total, current, current - 1, current + 1])
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
}

export function InsightPagination({
  categoryRoute,
  page,
  totalPages,
  totalDocs,
  hasNextPage,
  hasPrevPage,
}: Props) {
  if (totalPages <= 1) return null

  const pages = pageNumbers(page, totalPages)

  return (
    <nav
      className="mt-10 flex flex-col items-center gap-4 border-t border-slate-200 pt-8"
      aria-label="Insights pagination"
    >
      <p className="text-sm text-slate-600">
        Page {page} of {totalPages} ({totalDocs} articles)
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {hasPrevPage ? (
            <Link
              href={insightCategoryListHref(categoryRoute, page - 1)}
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
                  href={insightCategoryListHref(categoryRoute, p)}
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
              href={insightCategoryListHref(categoryRoute, page + 1)}
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
