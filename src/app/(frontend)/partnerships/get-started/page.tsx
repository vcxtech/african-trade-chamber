import { PartnershipGetStartedCard } from '@/components/partnerships/PartnershipGetStartedCard'
import { AtcSubPageLayout } from '@/components/shared/AtcSubPageLayout'
import { getPartnershipGetStarted } from '@/lib/cms-partnerships'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Get Started — Partnerships',
  description: 'Submit a partnership request to the African Trade Chamber.',
}

export default async function PartnershipGetStartedPage() {
  const data = await getPartnershipGetStarted()
  if (!data) notFound()

  return (
    <AtcSubPageLayout
      title={data.title}
      backHref="/partnerships"
      backLabel="← Back to Partnerships"
    >
      <PartnershipGetStartedCard data={data} standalone />
    </AtcSubPageLayout>
  )
}
