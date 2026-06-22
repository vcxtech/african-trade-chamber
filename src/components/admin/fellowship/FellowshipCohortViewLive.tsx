'use client'

import { useFormFields } from '@payloadcms/ui'

export function FellowshipCohortViewLive() {
  const cohortYear = useFormFields(([fields]) => fields.cohortYear?.value as string | undefined)

  if (!cohortYear) {
    return (
      <p className="mb-4 text-sm text-[#4a5568]">
        Select a cohort year above to preview the live page.
      </p>
    )
  }

  const href = `/fellowship/${cohortYear}`

  return (
    <p className="mb-4 text-sm">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[#002740] underline hover:text-[#fece00]"
      >
        View live page →
      </a>{' '}
      <span className="text-[#4a5568]">({href})</span>
    </p>
  )
}
