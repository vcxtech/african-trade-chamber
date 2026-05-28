import Link from 'next/link'
import { insightDetailHref } from '@/lib/insight-categories'
import { formatInsightMetaLine } from '@/lib/insights-display-utils'
import type { InsightArticle } from '@/types/insight-article'

type Props = { article: InsightArticle }

export function InsightListCard({ article }: Props) {
  const href = insightDetailHref(article.category, article.slug)
  const meta = formatInsightMetaLine(article)

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,39,64,0.08)] md:flex-row">
      {article.imageUrl ? (
        <Link
          href={href}
          className="relative block w-full shrink-0 md:w-[220px] lg:w-[260px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.imageAlt || article.title}
            className="h-[200px] w-full object-cover md:h-full md:min-h-[180px]"
          />
        </Link>
      ) : (
        <div className="hidden w-[220px] shrink-0 bg-slate-100 md:block lg:w-[260px]" />
      )}

      <div className="flex min-w-0 flex-1 flex-col justify-center p-6 md:p-8">
        {meta ? (
          <p className="mb-2 text-xs font-semibold tracking-wider text-slate-500">{meta}</p>
        ) : null}
        <h2 className="mb-3 text-xl font-bold leading-snug text-[#002740]">
          <Link href={href} className="hover:text-[#005a87]">
            {article.title}
          </Link>
        </h2>
        {article.excerpt ? (
          <p className="mb-5 line-clamp-3 text-base leading-relaxed text-slate-700">
            {article.excerpt}
          </p>
        ) : null}
        <div>
          <Link
            href={href}
            className="inline-flex items-center justify-center rounded-md bg-[#fbbf24] px-5 py-2.5 text-sm font-semibold text-[#002740] transition hover:bg-[#f59e0b]"
          >
            Read More
          </Link>
        </div>
      </div>
    </article>
  )
}
