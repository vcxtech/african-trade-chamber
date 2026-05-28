import { InsightArticleDetail } from '@/components/insights/InsightArticleDetail'
import { getAllInsightStaticParams, getInsightArticleBySlug } from '@/lib/cms-insights'
import { isValidInsightCategoryRoute } from '@/lib/insight-category-page'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ category: string; slug: string }>
}

export async function generateStaticParams() {
  return getAllInsightStaticParams()
}

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params
  if (!isValidInsightCategoryRoute(category)) return { title: 'Insight' }
  const article = await getInsightArticleBySlug(category, slug)
  if (!article) return { title: 'Insight' }
  return {
    title: article.title,
    description: article.excerptFull || article.excerpt,
  }
}

export default async function InsightArticlePage({ params }: Props) {
  const { category, slug } = await params
  if (!isValidInsightCategoryRoute(category)) notFound()

  const article = await getInsightArticleBySlug(category, slug)
  if (!article) notFound()

  return <InsightArticleDetail article={article} />
}
