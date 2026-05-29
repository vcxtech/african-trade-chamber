import Link from 'next/link'
import type { MembershipCategory } from '@/types/content'

type Props = {
  introTitle: string
  introSubtitle: string
  categories: MembershipCategory[]
  applyLabel: string
  applyHref: string
  guideLabel: string
  guideHref: string
  standalone?: boolean
}

function CategoryItem({ category }: { category: MembershipCategory }) {
  return (
    <div className="flex flex-col rounded-[10px] border-t-[3px] border-[#002740] bg-white p-5 shadow-[0_8px_16px_rgba(0,39,64,0.08)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_12px_22px_rgba(0,39,64,0.14)]">
      <p className="mb-2.5 text-[1.1rem] font-semibold">{category.title}</p>
      <p className="mb-3.5 text-sm leading-[1.55] text-[#0b1320]">{category.description}</p>
      <p className="mb-3.5 text-sm leading-[1.55] text-[#0b1320]">{category.benefits}</p>
      <div className="mt-auto rounded-lg bg-[rgba(0,39,64,0.1)] p-3.5">
        <div className="mb-1 text-sm font-semibold">Annual Fee (USD)</div>
        <div className="text-lg font-bold">{category.annualFee}</div>
        <div className="text-xs text-[#111827]">{category.feePeriod}</div>
      </div>
    </div>
  )
}

export function CategoriesSection({
  introTitle,
  introSubtitle,
  categories,
  applyLabel,
  applyHref,
  guideLabel,
  guideHref,
  standalone = false,
}: Props) {
  return (
    <article
      id={standalone ? 'categories' : 'membership-categories'}
      className={`overflow-hidden rounded-xl bg-white shadow-[0_15px_30px_rgba(0,39,64,0.1)] ${
        standalone ? '' : 'col-span-1 md:col-span-2 lg:col-span-3'
      }`}
    >
      <div className="p-[25px]">
        {!standalone ? (
          <div className="mb-[30px] rounded-[15px] bg-[#002740] px-4 py-[30px] text-center text-white shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
            <p className="mb-3 text-[clamp(26px,1.6vw+12px,36px)] font-extrabold text-white">
              {introTitle}
            </p>
            <p className="mx-auto max-w-[760px] text-[1.08rem] text-[#e2e8f0] opacity-90">
              {introSubtitle}
            </p>
          </div>
        ) : null}

        <div
          className={`grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 ${standalone ? '' : 'mb-[30px]'}`}
        >
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-[15px]">
          <Link
            href={applyHref}
            className="inline-block rounded-[10px] border-2 border-[#002740] bg-[#002740] px-6 py-3 text-center font-bold text-white no-underline transition-colors hover:bg-white hover:text-[#002740] focus:outline focus:outline-2 focus:outline-[#002740] focus:outline-offset-2 max-md:w-full"
          >
            {applyLabel}
          </Link>
          <Link
            href={guideHref}
            className="inline-block rounded-[10px] border-2 border-[#002740] bg-white px-6 py-3 text-center font-bold text-[#002740] no-underline transition-colors hover:bg-[#002740] hover:text-white focus:outline focus:outline-2 focus:outline-[#002740] focus:outline-offset-2 max-md:w-full"
          >
            {guideLabel}
          </Link>
        </div>
      </div>
    </article>
  )
}
