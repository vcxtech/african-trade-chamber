import Link from 'next/link'
import type { SearchResultItem, SiteSearchResults } from '@/types/site-search'
import { SEARCH_MIN_QUERY_LENGTH, SEARCH_TYPE_LABELS } from '@/types/site-search'

type Props = {
  results: SiteSearchResults
}

function ResultGroup({
  label,
  items,
}: {
  label: string
  items: SearchResultItem[]
}) {
  if (!items.length) return null

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#002740]/70">{label}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-[#002740]/30 hover:shadow-md"
            >
              <span className="font-semibold text-[#002740]">{item.title}</span>
              {item.excerpt ? (
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
                  {item.excerpt}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function SiteSearchResults({ results }: Props) {
  const { query, pages, news, insights, jobs, total } = results

  if (!query) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
        Enter a search term above to find pages, news, insights, and careers.
      </p>
    )
  }

  if (query.length < SEARCH_MIN_QUERY_LENGTH) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
        Please enter at least {SEARCH_MIN_QUERY_LENGTH} characters to search.
      </p>
    )
  }

  if (total === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
        No results found for &ldquo;{query}&rdquo;. Try different keywords.
      </p>
    )
  }

  return (
    <div>
      <p className="mb-6 text-sm text-slate-600">
        {total} result{total === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
      </p>
      <ResultGroup label={SEARCH_TYPE_LABELS.page} items={pages} />
      <ResultGroup label={SEARCH_TYPE_LABELS.news} items={news} />
      <ResultGroup label={SEARCH_TYPE_LABELS.insight} items={insights} />
      <ResultGroup label={SEARCH_TYPE_LABELS.job} items={jobs} />
    </div>
  )
}
