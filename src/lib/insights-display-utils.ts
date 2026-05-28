import type { InsightArticle } from '@/types/insight-article'

export function formatInsightDisplayDate(article: InsightArticle): string {
  const raw = article.publishedAt
  if (!raw) return ''
  const dateOnly = raw.slice(0, 10)
  const d = new Date(raw.includes('T') ? raw : `${dateOnly}T12:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase()
}

export function formatInsightMetaLine(article: InsightArticle): string {
  const date = formatInsightDisplayDate(article)
  const category = article.categoryLabel.toUpperCase()
  if (date && category) return `${date} / ${category}`
  return date || category
}
