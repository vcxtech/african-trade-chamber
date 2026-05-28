import { NewsroomCategoryPage } from '@/components/news/NewsroomCategoryPage'
import { defaultNewsletterArchivePage } from '@/lib/newsroom-page-defaults'

export const metadata = {
  title: 'Newsletter Archive',
  description: defaultNewsletterArchivePage.introBody.slice(0, 160),
}

type Props = {
  searchParams: Promise<{ page?: string }>
}

function parsePage(raw?: string): number {
  const n = parseInt(raw ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

export default async function NewsletterArchivePage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = parsePage(pageParam)

  return (
    <NewsroomCategoryPage intro={defaultNewsletterArchivePage} category="newsletter" page={page} />
  )
}
