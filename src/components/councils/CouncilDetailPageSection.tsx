import { AtcCardImage } from '@/components/shared/AtcCardImage'
import { CouncilPageHeader } from '@/components/councils/CouncilPageHeader'
import type { CouncilDetailData } from '@/types/council-page'

type Props = { data: CouncilDetailData }

export function CouncilDetailPageSection({ data }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] py-6 text-black">
      <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-5">
        <CouncilPageHeader title={data.title} subtitle={data.tagline} />

        <div className="mb-7 rounded-xl bg-white p-7 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
          {data.introParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="mb-4 last:mb-0 text-base leading-[1.7] text-[#374151]">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 text-center shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
          <h2 className="text-[1.6rem] font-semibold text-black">Our Focus Areas</h2>
        </div>

        <div className="mb-7 grid grid-cols-1 gap-[25px] md:grid-cols-2">
          {data.focusAreas.map((area) => (
            <article
              key={area.title}
              className="overflow-hidden rounded-xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.12)]"
            >
              <AtcCardImage
                src={area.imageUrl}
                alt={area.imageAlt}
                variant="action"
                className="aspect-[16/9] h-auto"
              />
              <div className="p-[25px]">
                <h3 className="mb-3 text-[1.2rem] font-semibold text-black">{area.title}</h3>
                <p className="text-base leading-[1.6] text-[#374151]">{area.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mb-7 rounded-xl bg-white p-7 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
          <h2 className="mb-6 text-center text-[1.6rem] font-semibold text-black">What We Do</h2>
          <div className="grid grid-cols-1 gap-[25px] lg:grid-cols-2">
            {data.activities.map((activity) => (
              <div
                key={activity.title}
                className="rounded-lg border-l-4 border-[#fbbf24] bg-[#f8f9fa] p-5 transition-all hover:translate-x-1 hover:bg-[#e9ecef]"
              >
                <p className="mb-2 font-semibold text-[#002740]">{activity.title}</p>
                <p className="text-[15px] leading-[1.5] text-[#374151]">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-7 overflow-hidden rounded-xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
          <AtcCardImage
            src={data.benefitsImageUrl}
            alt={data.benefitsImageAlt}
            variant="action"
            className="aspect-[16/9] h-auto md:h-[200px]"
          />
          <div className="p-7">
            <h2 className="mb-4 text-[1.6rem] font-semibold text-black">Membership Benefits</h2>
            {data.benefitsIntro ? (
              <p className="mb-4 text-base text-[#374151]">{data.benefitsIntro}</p>
            ) : null}
            <ul className="space-y-2.5">
              {data.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="relative pl-6 text-base leading-[1.6] text-[#374151] before:absolute before:left-0 before:top-0.5 before:text-xl before:font-bold before:text-[#fbbf24] before:content-['·']"
                >
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-7 rounded-xl bg-white p-7 text-center shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
          <h2 className="mb-4 text-[1.6rem] font-semibold text-black">Get Involved</h2>
          {data.ctaParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="mb-4 text-base leading-[1.6] text-[#374151]">
              {paragraph}
            </p>
          ))}
          <a
            href={`mailto:${data.contactEmail}`}
            className="mb-5 inline-block rounded-lg bg-[#002740] px-8 py-3 text-base font-semibold text-white transition hover:bg-[#003d5c] hover:shadow-md"
          >
            Join Us Today
          </a>
          <p className="text-base font-medium text-[#374151]">
            <strong>Contact:</strong>{' '}
            <a href={`mailto:${data.contactEmail}`} className="text-[#002740] hover:underline">
              {data.contactEmail}
            </a>
          </p>
        </div>

        {data.extraSection ? (
          <div className="rounded-xl bg-white p-7 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
            <h2 className="mb-4 border-b-2 border-[#002740] pb-3 text-[1.5rem] font-bold text-[#002740]">
              {data.extraSection.title}
            </h2>
            {data.extraSection.intro ? (
              <p className="mb-6 text-base leading-[1.7] text-[#374151]">{data.extraSection.intro}</p>
            ) : null}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.extraSection.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl bg-gradient-to-br from-[#f8fafc] to-[#e9ecef] p-6 shadow-sm"
                >
                  <p className="mb-2 font-semibold text-[#002740]">{item.title}</p>
                  <p className="text-sm leading-relaxed text-[#374151]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
