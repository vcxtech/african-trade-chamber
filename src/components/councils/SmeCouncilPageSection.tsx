import { SmeCouncilParticipationForm } from '@/components/councils/SmeCouncilParticipationForm'
import { AtcCardImage } from '@/components/shared/AtcCardImage'
import { CouncilPageHeader } from '@/components/councils/CouncilPageHeader'
import type { SmeCouncilPageData } from '@/types/council-page'

type Props = { data: SmeCouncilPageData }

export function SmeCouncilPageSection({ data }: Props) {
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
          <h2 className="text-[1.6rem] font-semibold text-black">Purpose & Objectives</h2>
        </div>

        <div className="mb-7 grid grid-cols-1 gap-[25px] sm:grid-cols-2 lg:grid-cols-3">
          {data.objectives.map((objective) => (
            <div
              key={objective.title}
              className="flex h-full flex-col rounded-xl border-l-4 border-[#fbbf24] bg-white p-7 shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
            >
              <h3 className="mb-3 text-[1.15rem] font-semibold leading-snug text-[#002740]">
                {objective.title}
              </h3>
              <p className="flex-1 text-[15px] leading-[1.6] text-[#374151]">{objective.description}</p>
            </div>
          ))}
        </div>

        <div className="mb-7 rounded-xl bg-white p-7 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
          <h2 className="mb-5 text-center text-[1.6rem] font-semibold text-black">Membership</h2>
          {data.membershipParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="mb-4 text-base leading-[1.7] text-[#374151]">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mb-7 overflow-hidden rounded-xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
          <AtcCardImage
            src={data.participationImageUrl}
            alt={data.participationImageAlt}
            variant="action"
            className="aspect-[16/9] h-auto"
          />
          <div className="bg-gradient-to-br from-white to-[#f8f9fa] p-8">
            <h2 className="mb-4 text-center text-[1.6rem] font-semibold text-[#002740]">
              Participation Contribution
            </h2>
            {data.participationParagraphs.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 40)}
                className={`text-base leading-[1.7] text-[#374151] ${index < data.participationParagraphs.length - 1 ? 'mb-4' : 'mb-3'}`}
              >
                {paragraph}
              </p>
            ))}
            <p className="mb-3 font-semibold text-[#002740]">Participation Contributions support:</p>
            <ul className="grid gap-3 md:grid-cols-2">
              {data.participationBullets.map((bullet) => (
                <li
                  key={bullet}
                  className="relative rounded-lg border-l-[3px] border-[#fbbf24] bg-white py-4 pl-11 pr-4 text-base leading-[1.6] text-[#374151] shadow-sm"
                >
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[#fbbf24]">
                    ✓
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-7 rounded-xl border border-dashed border-[#002740]/20 bg-white p-8 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
          <p className="mb-6 text-center text-lg font-semibold text-[#002740]">
            SME Council Participation Request
          </p>
          <SmeCouncilParticipationForm />
        </div>

        <div className="rounded-xl bg-white p-7 text-center shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
          <h2 className="mb-4 text-[1.6rem] font-semibold text-black">{data.engagementTitle}</h2>
          {data.engagementParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="mb-4 text-base leading-[1.6] text-[#374151]">
              {paragraph}
            </p>
          ))}
          <p className="text-base font-medium text-[#374151]">
            <strong>Contact:</strong>{' '}
            <a href={`mailto:${data.contactEmail}`} className="text-[#002740] hover:underline">
              {data.contactEmail}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
