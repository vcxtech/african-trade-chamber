'use client'

import { DonateForm } from '@/components/donate/DonateForm'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { DonatePageData } from '@/types/donate-page'

type Props = { data: DonatePageData }

export function DonatePageSection({ data }: Props) {
  const reducedMotion = usePrefersReducedMotion()
  const scrollToForm = () => {
    document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] py-8">
      <div className="donate-scope mx-auto max-w-[1200px] px-4">
        <header className="mb-5 rounded-2xl bg-[#002740] px-6 py-8 text-center text-white shadow-lg">
          <h1 className="text-[clamp(28px,2.6vw+6px,40px)] font-extrabold text-white">{data.headerTitle}</h1>
          <p className="mx-auto mt-2 max-w-[820px] text-[#e2e8f0]">{data.headerTagline}</p>
        </header>

        <section className="mb-4 rounded-xl border border-[#e7eef9] bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-[#002740]">{data.heroTitle}</h2>
          {data.heroParagraphs.map((p) => (
            <p key={p.slice(0, 40)} className="mb-3 text-base leading-relaxed text-black last:mb-0">
              {p}
            </p>
          ))}
        </section>

        <section className="mb-4 rounded-xl border border-[#e7eef9] bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-xl font-bold">{data.whyTitle}</h3>
          <p className="mb-3">{data.whyIntro}</p>
          <ul className="list-none space-y-2 p-0">
            {data.whyBenefits.map((item) => (
              <li key={item} className="relative pl-5 text-black">
                <span className="absolute left-0 font-bold text-[#fbbf24]">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-4 rounded-xl border border-[#e7eef9] bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-xl font-bold">{data.whoTitle}</h3>
          <p className="mb-4">{data.whoIntro}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.donorCategories.map((d) => (
              <div
                key={d.title}
                className="rounded-lg border border-[#e7eef9] bg-[rgba(251,191,36,0.1)] p-4"
              >
                <p className="font-bold text-[#002740]">{d.title}</p>
                <p className="text-sm text-black">{d.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4 rounded-xl border border-[#e7eef9] bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-xl font-bold">{data.transparencyTitle}</h3>
          <p>{data.transparencyText}</p>
        </section>

        <section className="mb-4 rounded-xl border-2 border-[#fbbf24] bg-white p-6 text-center shadow-sm">
          <p className="mb-2 text-lg font-semibold text-[#002740]">{data.ctaTitle}</p>
          <p className="mb-4 whitespace-pre-line text-black">{data.ctaText}</p>
          <button
            type="button"
            onClick={scrollToForm}
            className="inline-block rounded-full border-2 border-[#002740] bg-[#002740] px-8 py-3.5 font-bold text-white transition-colors hover:bg-white hover:text-[#002740]"
          >
            Scroll to Donation Form
          </button>
          <p
            className={`mt-4 text-2xl text-[#002740] ${reducedMotion ? '' : 'animate-bounce'}`}
            aria-hidden
          >
            ↓
          </p>
          <div className="mt-4 rounded-lg bg-[rgba(0,39,64,0.05)] p-3.5 text-sm">
            <div className="font-semibold">For bank transfers or corporate donations, please contact:</div>
            <div className="font-bold text-[#002740]">
              {data.financeEmail} | {data.financePhone}
            </div>
          </div>
        </section>

        <DonateForm financeEmail={data.financeEmail} />

        <section className="mt-4 rounded-xl border-2 border-[#fbbf24] bg-white p-6 text-center shadow-sm">
          <h3 className="mb-3 text-xl font-bold">{data.thankYouTitle}</h3>
          <p>{data.thankYouText}</p>
        </section>
      </div>
    </div>
  )
}
