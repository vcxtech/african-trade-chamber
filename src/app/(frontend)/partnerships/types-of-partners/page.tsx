import { PartnershipListCard } from '@/components/partnerships/PartnershipListCard'
import { AtcSubPageLayout } from '@/components/shared/AtcSubPageLayout'
import { getPartnershipListCardById } from '@/lib/cms-partnerships'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Types of Partners — Partnerships',
  description: 'Partner types that collaborate with the African Trade Chamber.',
}

export default async function TypesOfPartnersPage() {
  const card = await getPartnershipListCardById('types')
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
