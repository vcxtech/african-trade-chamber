'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import '../hero/hero-slides-list-banner.scss'

const COHORT_YEARS = new Set(['2025', '2026'])
const FELLOWSHIP_HUB_HREF = '/admin/globals/fellowship-page'
const FELLOWSHIP_COHORTS_HREF = '/admin/collections/fellowship-cohorts'

function normalizeSearch(raw: string | null): string {
  if (!raw) return ''
  try {
    return decodeURIComponent(raw).trim().toLowerCase()
  } catch {
    return raw.trim().toLowerCase()
  }
}

function isFellowshipRelatedSearch(query: string): boolean {
  if (!query) return false
  if (query.includes('fellowship')) return true
  if (COHORT_YEARS.has(query)) return true
  if (/^\/fellowship(\/\d{4})?$/.test(query)) return true
  if (/^fellowship\/\d{4}$/.test(query)) return true
  return false
}

export function PagesFellowshipSearchHint() {
  const searchParams = useSearchParams()
  const query = normalizeSearch(searchParams.get('search'))

  if (!isFellowshipRelatedSearch(query)) return null

  return (
    <div className="hero-slides-list-banner mb-6 rounded-lg border border-[#e6b422] bg-[#fffbeb] px-5 py-4 text-sm text-[#002740]">
      <p className="mb-2 font-semibold">Looking for fellowship cohort pages?</p>
      <p className="mb-3">
        Live cohort pages such as <code className="text-xs">/fellowship/2025</code> and{' '}
        <code className="text-xs">/fellowship/2026</code> are <strong>not</strong> in the Pages
        collection. Edit each year under{' '}
        <Link href={FELLOWSHIP_COHORTS_HREF} className="font-semibold underline">
          Fellowship → Fellowship Cohorts
        </Link>
        . The hub intro and CTA are under{' '}
        <Link href={FELLOWSHIP_HUB_HREF} className="underline">
          Globals → Fellowship hub
        </Link>
        .
      </p>
      <p className="mb-0">
        <Link href={FELLOWSHIP_COHORTS_HREF} className="mr-4 font-semibold underline">
          Open Fellowship Cohorts
        </Link>
        <Link href={FELLOWSHIP_HUB_HREF} className="mr-4 underline">
          Fellowship hub
        </Link>
        <Link href="/fellowship/2025" target="_blank" className="mr-4 underline">
          Preview /fellowship/2025
        </Link>
        <Link href="/fellowship/2026" target="_blank" className="underline">
          Preview /fellowship/2026
        </Link>
      </p>
    </div>
  )
}
