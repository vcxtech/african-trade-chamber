import { AtcArrowLink } from '@/components/shared/AtcArrowLink'
import { AtcCardImage } from '@/components/shared/AtcCardImage'
import type { CouncilHubCardData } from '@/types/council-page'

type Props = CouncilHubCardData

export function CouncilHubCard({
  title,
  body,
  imageUrl,
  imageAlt,
  focusAreas,
  ctaLabel,
  ctaHref,
}: Props) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_15px_35px_rgba(0,0,0,0.12)]">
      <AtcCardImage
        src={imageUrl}
        alt={imageAlt}
        variant="action"
        className="h-[200px] md:h-[200px]"
        imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="flex flex-1 flex-col gap-3.5 p-[25px]">
        <h2 className="text-[1.2rem] font-semibold text-[#002740]">{title}</h2>
        <p className="text-[15px] leading-[1.7] text-[#374151]">{body}</p>
        {focusAreas && focusAreas.length > 0 ? (
          <div className="mt-1">
            <p className="mb-1 text-sm font-semibold text-[#002740]">Focus Areas:</p>
            <ul className="ml-4 list-disc text-[13px] text-[#4b5563]">
              {focusAreas.map((item) => (
                <li key={item} className="mb-0.5">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <AtcArrowLink href={ctaHref} className="mt-auto pt-1">
          {ctaLabel}
        </AtcArrowLink>
      </div>
    </article>
  )
}
