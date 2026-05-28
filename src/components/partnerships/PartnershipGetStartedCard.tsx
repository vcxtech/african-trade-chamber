import { AtcArrowLink } from '@/components/shared/AtcArrowLink'
import { AtcCardImage } from '@/components/shared/AtcCardImage'
import type { PartnershipsPageData } from '@/types/partnerships-page'

type Props = {
  data: PartnershipsPageData['getStarted']
  standalone?: boolean
}

export function PartnershipGetStartedCard({ data, standalone }: Props) {
  return (
    <article
      id={standalone ? undefined : data.id}
      className={`flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${
        standalone ? '' : 'h-full scroll-mt-24 md:col-span-2 lg:col-span-3'
      }`}
    >
      <AtcCardImage src={data.imageUrl} alt={data.imageAlt} variant="fullWidth" />
      <div className="p-6 md:p-8">
        <h2 className="mb-4 text-xl font-bold text-[#002740] md:text-2xl">{data.title}</h2>
        <p className="mb-4 text-base leading-relaxed text-[#4a4a4a]">{data.body}</p>
        <div className="flex flex-wrap gap-5">
          <AtcArrowLink href={`mailto:${data.requestEmail}`} external>
            {data.requestLabel}
          </AtcArrowLink>
          <AtcArrowLink href={data.guideHref}>{data.guideLabel}</AtcArrowLink>
        </div>
      </div>
    </article>
  )
}
