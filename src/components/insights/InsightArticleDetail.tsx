import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { insightCategoryListHref } from '@/lib/insight-categories'
import { formatInsightDisplayDate, formatInsightMetaLine } from '@/lib/insights-display-utils'
import type { InsightArticleDetail as InsightArticleDetailType } from '@/types/insight-article'

type Props = { article: InsightArticleDetailType }

function hasLexicalContent(content: InsightArticleDetailType['content']): boolean {
  if (!content || typeof content !== 'object') return false
  const root = content.root as { children?: unknown[] } | undefined
  return Boolean(root?.children && root.children.length > 0)
}

export function InsightArticleDetail({ article }: Props) {
  const listHref = insightCategoryListHref(article.categoryRoute)
  const meta = formatInsightMetaLine(article)
  const displayDate = formatInsightDisplayDate(article)

  const byline = [displayDate, article.author].filter(Boolean).join(' / ')

  return (
    <div className="insight-article-detail">
      <section className="bg-[#002740] px-4 py-10 text-white md:py-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href={listHref}
            className="mb-6 inline-block text-sm font-medium text-white/90 hover:text-white"
          >
            ← Back to {article.categoryLabel}
          </Link>
          {meta ? (
            <p className="mb-3 text-xs font-semibold tracking-wider text-white/80">{meta}</p>
          ) : null}
          <h1 className="text-2xl font-bold leading-tight md:text-4xl">{article.title}</h1>
          {byline ? (
            <p className="mt-3 text-sm uppercase tracking-wide text-white/90">{byline}</p>
          ) : null}
        </div>
      </section>

      <nav className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 md:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="hover:text-[#002740]">
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          <Link href="/insights" className="hover:text-[#002740]">
            Insights
          </Link>
          <span className="mx-2">&gt;</span>
          <Link href={listHref} className="hover:text-[#002740]">
            {article.categoryLabel}
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-[#002740]">{article.title}</span>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
        {article.imageUrl ? (
          <div className="mb-8 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt={article.imageAlt || article.title}
              className="w-full object-cover"
            />
          </div>
        ) : null}

        <div className="insight-content space-y-4 text-base leading-relaxed text-slate-700 [&_a]:text-[#005a87] [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#002740] [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#002740] [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-lg [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_ul]:list-disc">
          {hasLexicalContent(article.content) ? (
            <RichText data={article.content as never} />
          ) : article.excerptFull || article.excerpt ? (
            <p className="text-lg leading-relaxed text-slate-700">
              {article.excerptFull || article.excerpt}
            </p>
          ) : null}
        </div>

        {!hasLexicalContent(article.content) && article.originalUrl ? (
          <p className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-600">
            <a
              href={article.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#002740] underline"
            >
              View original article
            </a>
          </p>
        ) : null}
      </article>
    </div>
  )
}
