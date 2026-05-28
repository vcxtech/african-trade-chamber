import { PartnershipListCard } from '@/components/partnerships/PartnershipListCard'
import { AtcSubPageLayout } from '@/components/shared/AtcSubPageLayout'
import { getPartnershipListCardById } from '@/lib/cms-partnerships'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Why Partner — Partnerships',
  description: 'Why partner with the African Trade Chamber.',
}

export default async function WhyPartnerPage() {
  const card = await getPartnershipListCardById('why-partner')
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
