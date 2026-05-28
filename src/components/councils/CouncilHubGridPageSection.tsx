import { CouncilHubCard } from '@/components/councils/CouncilHubCard'
import { CouncilPageHeader } from '@/components/councils/CouncilPageHeader'
import type { CouncilHubPageData } from '@/types/council-page'

type Props = { data: CouncilHubPageData }

export function CouncilHubGridPageSection({ data }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] py-6 text-black">
      <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-5">
        <CouncilPageHeader title={data.headerTitle} />
        <div className="mb-7 rounded-xl bg-white p-7 shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
          <p className="text-center text-base leading-[1.7] text-[#374151]">{data.introText}</p>
        </div>
        <div className="grid grid-cols-1 gap-[25px] min-[768px]:grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
          {data.cards.map((card) => (
            <CouncilHubCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </div>
  )
}
