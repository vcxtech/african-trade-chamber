import { notFound, redirect } from 'next/navigation'
import { CouncilDetailPageSection } from '@/components/councils/CouncilDetailPageSection'
import { councilDetailSlugs, getCouncilDetail } from '@/lib/council-detail-defaults'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return councilDetailSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  if (slug === 'sme') {
    return { title: 'SME Council' }
  }
  const detail = getCouncilDetail(slug)
  if (!detail) {
    return { title: 'Council' }
  }
  return {
    title: detail.title,
    description: detail.tagline,
  }
}

export default async function CouncilDetailPage({ params }: Props) {
  const { slug } = await params

  if (slug === 'sme') {
    redirect('/councils/sme')
  }

  const detail = getCouncilDetail(slug)
  if (!detail) {
    notFound()
  }

  return <CouncilDetailPageSection data={detail} />
}
