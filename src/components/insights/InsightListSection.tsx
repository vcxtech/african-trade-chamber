import { InsightListCard } from '@/components/insights/InsightListCard'
import type { InsightArticle } from '@/types/insight-article'

type Props = {
  articles: InsightArticle[]
  emptyMessage?: string
}

export function InsightListSection({
  articles,
  emptyMessage = 'No publications in this category yet. Check back soon.',
}: Props) {
  if (!articles.length) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {articles.map((article) => (
        <InsightListCard key={article.id} article={article} />
      ))}
    </div>
  )
}
