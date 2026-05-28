import { AtcCardImage } from '@/components/shared/AtcCardImage'
import { PartnershipBulletList } from '@/components/partnerships/PartnershipBulletList'
import type { PartnershipListCard as PartnershipListCardData } from '@/types/partnerships-page'

type Props = {
  card: PartnershipListCardData
  standalone?: boolean
}

export function PartnershipListCard({ card, standalone }: Props) {
  return (
    <article
      id={standalone ? undefined : card.id}
      className={`flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${
        standalone ? '' : 'h-full scroll-mt-24'
      }`}
    >
      <AtcCardImage src={card.imageUrl} alt={card.imageAlt} variant="action" />
      <div className="flex flex-grow flex-col p-6 md:p-8">
        <h2 className="mb-4 text-xl font-bold text-[#002740] md:text-2xl">{card.title}</h2>
        <PartnershipBulletList items={card.items} />
      </div>
    </article>
  )
}
