'use client'

import Link from 'next/link'

import '../hero/hero-slides-list-banner.scss'

export function FellowshipAdminGuide() {
  return (
    <div className="hero-slides-list-banner mb-6 rounded-lg border border-[#c5d9e8] bg-[#f0f6fa] px-5 py-4 text-sm text-[#002740]">
      <p className="mb-2 font-semibold">Fellowship hub page</p>
      <ul className="mb-0 list-disc space-y-1 pl-5">
        <li>
          <strong>This screen</strong> (<Link href="/fellowship" target="_blank" className="underline">/fellowship</Link>
          ): intro, hero, and call-for-applications only.
        </li>
        <li>
          <strong>Cohort pages</strong> (<code className="text-xs">/fellowship/2025</code>,{' '}
          <code className="text-xs">/fellowship/2026</code>): edit under{' '}
          <Link href="/admin/collections/fellowship-cohorts" className="underline">
            Fellowship → Fellowship Cohorts
          </Link>{' '}
          — one admin page per year.
        </li>
        <li>
          <strong>Fellow roster grid</strong>: Team → Team Members (Fellow category + Cohort Year).
        </li>
      </ul>
    </div>
  )
}
