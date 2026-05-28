import type { NewsCategory } from '@/types/news-article'

export const NEWS_CATEGORIES: { value: NewsCategory; label: string }[] = [
  { value: 'chamber', label: 'Chamber News' },
  { value: 'member', label: 'Member News' },
  { value: 'press', label: 'Press Releases' },
  { value: 'media', label: 'Media Coverage' },
  { value: 'newsletter', label: 'Newsletter Archive' },
]

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  chamber: 'Chamber News',
  member: 'Member News',
  press: 'Press Releases',
  media: 'Media Coverage',
  newsletter: 'Newsletter Archive',
}

const VALID = new Set<string>(['chamber', 'member', 'press', 'media', 'newsletter'])

export function parseNewsCategory(value?: string | null): NewsCategory | undefined {
  if (!value || !VALID.has(value)) return undefined
  return value as NewsCategory
}
