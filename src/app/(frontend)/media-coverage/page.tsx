import { NewsroomCategoryPage } from '@/components/news/NewsroomCategoryPage'
import { defaultMediaCoveragePage } from '@/lib/newsroom-page-defaults'

export const metadata = {
  title: 'Media Coverage',
  description: defaultMediaCoveragePage.introBody.slice(0, 160),
}

type Props = {
  searchParams: Promise<{ page?: string }>
}

function parsePage(raw?: string): number {
  const n = parseInt(raw ?? '1', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

export default async function MediaCoveragePage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = parsePage(pageParam)

  return (
    <NewsroomCategoryPage intro={defaultMediaCoveragePage} category="media" page={page} />
  )
}
