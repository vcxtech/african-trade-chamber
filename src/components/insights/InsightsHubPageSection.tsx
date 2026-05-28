import { EventHubCard } from '@/components/events/EventHubCard'
import { EventsPageHeader } from '@/components/events/EventsPageHeader'
import type { InsightsHubPageData } from '@/types/insight-article'

type Props = { data: InsightsHubPageData }

export function InsightsHubPageSection({ data }: Props) {
  return (
    <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] py-6 text-black">
      <div className="mx-auto max-w-[1200px] px-5 py-6">
        <EventsPageHeader title={data.headerTitle} subtitle={data.headerSubtitle} />
        <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 lg:grid-cols-3">
          {data.cards.map((card) => (
            <EventHubCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </div>
  )
}
