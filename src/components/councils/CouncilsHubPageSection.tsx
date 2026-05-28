import { AtcArrowLink } from '@/components/shared/AtcArrowLink'
import { AtcCardImage } from '@/components/shared/AtcCardImage'
import { CouncilPageHeader } from '@/components/councils/CouncilPageHeader'
import type { CouncilsHubPageData } from '@/types/council-page'

type Props = { data: CouncilsHubPageData }

export function CouncilsHubPageSection({ data }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] py-6 text-black">
      <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-5">
        <CouncilPageHeader title={data.headerTitle} />
        <div className="mb-7 rounded-xl bg-white p-7 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
          <p className="text-center text-base leading-[1.7] text-[#374151]">{data.introText}</p>
        </div>
        <div className="grid grid-cols-1 gap-[25px] md:grid-cols-3">
          {data.cards.map((card) => (
            <article
              key={card.id}
              className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
            >
              <AtcCardImage
                src={card.imageUrl}
                alt={card.imageAlt}
                variant="action"
                imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="flex flex-1 flex-col p-[25px]">
                <h2 className="mb-3 text-xl font-bold text-[#002740]">{card.title}</h2>
                <p className="mb-4 flex-1 text-base leading-[1.6] text-[#374151]">{card.body}</p>
                <AtcArrowLink href={card.ctaHref}>{card.ctaLabel}</AtcArrowLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
