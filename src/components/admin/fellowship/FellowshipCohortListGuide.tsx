'use client'

import Link from 'next/link'

import '../hero/hero-slides-list-banner.scss'

export function FellowshipCohortListGuide() {
  return (
    <div className="hero-slides-list-banner mb-6 rounded-lg border border-[#c5d9e8] bg-[#f0f6fa] px-5 py-4 text-sm text-[#002740]">
      <p className="mb-2 font-semibold">Fellowship cohort pages</p>
      <p className="mb-3">
        Each row is one cohort year. Click a row to edit its hub card, page hero, SEO, and testimonials.
        Fellow roster grids are edited under Team → Team Members.
      </p>
      <p className="mb-0">
        <Link href="/admin/globals/fellowship-page" className="mr-4 font-semibold underline">
          Fellowship hub (intro + CTA)
        </Link>
        <Link href="/fellowship" target="_blank" className="underline">
          Preview /fellowship
        </Link>
      </p>
    </div>
  )
}
