'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Fellow } from '@/types/fellow'
import { FellowBioModal } from './FellowBioModal'
import { FellowsPagination, PAGE_SIZE } from './FellowsPagination'
import { FtlfFellowCard } from './FtlfFellowCard'

type Props = {
  members: Fellow[]
  cohortYear?: number
}

export function FellowsGrid({ members, cohortYear = 2025 }: Props) {
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Fellow | null>(null)

  const totalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE))

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return members.slice(start, start + PAGE_SIZE)
  }, [members, page])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const handlePageChange = (next: number) => {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="bg-[#f8f9fa] pb-12" aria-label={`${cohortYear} Fellows`}>
      <div className="mx-auto max-w-[1200px] px-[18px] md:px-8">
        {members.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            No fellows loaded. Run{' '}
            <code className="text-sm">npm run migrate:team -- data/*.xml --fellows-only</code>
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paged.map((member) => (
                <FtlfFellowCard key={member.id} fellow={member} onSelect={setSelected} />
              ))}
            </div>
            <FellowsPagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>

      <FellowBioModal fellow={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
