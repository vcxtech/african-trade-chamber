'use client'

import { useMemo, useState } from 'react'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { TEAM_CATEGORY_LABELS } from '@/lib/about-defaults'
import type { TeamMember, TeamMemberCategory } from '@/types/about-page'

type Props = { members: TeamMember[] }

const FILTERS: { value: '' | TeamMemberCategory; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'advisory', label: TEAM_CATEGORY_LABELS.advisory },
  { value: 'board', label: TEAM_CATEGORY_LABELS.board },
  { value: 'secretariat', label: TEAM_CATEGORY_LABELS.secretariat },
]

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function AboutTeamSection({ members }: Props) {
  const [category, setCategory] = useState<'' | TeamMemberCategory>('advisory')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<TeamMember | null>(null)
  const trapRef = useFocusTrap(Boolean(selected), () => setSelected(null))

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return members.filter((m) => {
      if (category && m.category !== category) return false
      if (!q) return true
      const hay = `${m.name} ${m.position ?? ''} ${stripHtml(m.bio ?? '')}`.toLowerCase()
      return hay.includes(q)
    })
  }, [members, category, search])

  return (
    <section className="bg-white py-10" aria-label="Leadership and team">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end md:justify-between">
          <div className="flex flex-wrap gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.value || 'all'}
                type="button"
                onClick={() => setCategory(f.value)}
                className={`px-4 py-2 text-sm font-medium transition ${
                  category === f.value
                    ? 'bg-[#e8e8e8] text-[#002740]'
                    : 'bg-transparent text-[#002740] hover:bg-[#f0f0f0]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="min-w-[220px] md:max-w-xs">
            <label htmlFor="team-search" className="sr-only">
              Search team members
            </label>
            <input
              id="team-search"
              type="search"
              placeholder="Search team members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {members.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-[#f8f9fa] p-8 text-center text-slate-600">
            No team members yet. Import from WordPress with{' '}
            <code className="text-sm">npm run migrate:team</code> or add members in admin.
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-[#f8f9fa] p-6 text-center text-slate-600">
            No members match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((member) => (
              <article
                key={member.id}
                className="bg-white p-[15px] text-center text-black shadow-[0_0_5px_rgba(0,0,0,0.15)] transition hover:-translate-y-1"
              >
                {member.imageUrl ? (
                  <div className="mb-0 overflow-hidden bg-[#f0f0f0]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.imageUrl}
                      alt={member.imageAlt || member.name}
                      className="mx-auto max-h-[280px] w-full max-w-full object-contain object-top"
                    />
                  </div>
                ) : (
                  <div className="flex h-[220px] items-center justify-center bg-[#f0f0f0] text-4xl font-bold text-[#002740]/30">
                    {member.name.charAt(0)}
                  </div>
                )}
                <figcaption className="px-[15px] pb-2 pt-5">
                  <h3 className="mb-1 text-base font-normal uppercase tracking-wide text-[#00bcd4]">
                    {member.name}
                  </h3>
                  {member.position ? (
                    <p className="text-sm font-semibold text-black">{member.position}</p>
                  ) : null}
                  {member.bio ? (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setSelected(member)}
                        className="inline-block border border-[#00bcd4] px-[15px] py-[7px] text-sm leading-snug text-[#00bcd4] transition hover:bg-[#00bcd4] hover:text-white"
                      >
                        View profile →
                      </button>
                    </div>
                  ) : null}
                </figcaption>
              </article>
            ))}
          </div>
        )}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-modal-title"
          onClick={() => setSelected(null)}
        >
          <div
            ref={trapRef}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="team-modal-title" className="text-lg font-bold uppercase text-[#002740]">
                  {selected.name}
                </h2>
                {selected.position ? (
                  <p className="mt-1 text-sm font-semibold text-[#4a4a4a]">{selected.position}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            {selected.imageUrl ? (
              <div className="mb-4 overflow-hidden rounded-lg bg-[#f0f0f0]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.imageUrl}
                  alt={selected.imageAlt || selected.name}
                  className="mx-auto max-h-64 w-full object-contain"
                />
              </div>
            ) : null}
            {selected.bio ? (
              <div
                className="prose prose-sm max-w-none text-[#333] [&_p]:mb-3"
                dangerouslySetInnerHTML={{ __html: selected.bio }}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  )
}
