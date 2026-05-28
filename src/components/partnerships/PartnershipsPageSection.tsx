import { PartnershipGetStartedCard } from '@/components/partnerships/PartnershipGetStartedCard'
import { PartnershipListCard } from '@/components/partnerships/PartnershipListCard'
import type { PartnershipsPageData } from '@/types/partnerships-page'

type Props = { data: PartnershipsPageData }

export function PartnershipsPageSection({ data }: Props) {
  return (
    <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] py-10">
      <div className="mx-auto max-w-[1200px] px-5">
        <header className="mb-10 rounded-xl bg-[#002740] px-8 py-8 text-center text-white shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
          <h1 className="text-[2rem] font-semibold tracking-tight text-white">{data.headerTitle}</h1>
        </header>

        <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm md:col-span-2 lg:col-span-3">
            <p className="text-center text-lg leading-[1.7] text-[#4a4a4a]">{data.introText}</p>
          </article>

          {data.listCards.map((card) => (
            <PartnershipListCard key={card.id} card={card} />
          ))}

          <PartnershipGetStartedCard data={data.getStarted} />
        </div>
      </div>
    </div>
  )
}
