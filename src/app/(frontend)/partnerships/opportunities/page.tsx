import { PartnershipListCard } from '@/components/partnerships/PartnershipListCard'
import { AtcSubPageLayout } from '@/components/shared/AtcSubPageLayout'
import { getPartnershipListCardById } from '@/lib/cms-partnerships'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Partnership Opportunities',
  description: 'Partnership opportunities with the African Trade Chamber.',
}

export default async function PartnershipOpportunitiesPage() {
  const card = await getPartnershipListCardById('opportunities')
  if (!card) notFound()

  return (
    <AtcSubPageLayout
      title={card.title}
      backHref="/partnerships"
      backLabel="← Back to Partnerships"
    >
      <PartnershipListCard card={card} standalone />
    </AtcSubPageLayout>
  )
}
