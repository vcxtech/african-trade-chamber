'use client'

import Image from 'next/image'
import { countryToFlagIso, flagUrl } from '@/lib/country-flags'
import { fellowBioExcerpt } from '@/lib/fellow-card'
import type { Fellow } from '@/types/fellow'

type Props = {
  fellow: Fellow
  onSelect: (fellow: Fellow) => void
}

function BuiltCardGraphic({ fellow }: { fellow: Fellow }) {
  const flagIso = countryToFlagIso(fellow.country)

  return (
    <div className="relative bg-[#002740] px-3 pb-3 pt-3">
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)`,
          backgroundSize: '12px 12px',
        }}
        aria-hidden
      />
      <div className="relative mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-[#fece00] bg-[#002740]">
            <span className="text-[6px] font-bold leading-tight text-[#fece00]">ATC</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-[#fece00]">
            FTLF {fellow.cohortYear ?? 2025}
          </span>
        </div>
        {flagIso ? (
          <div className="shrink-0 text-center">
            <Image
              src={flagUrl(flagIso, 36)}
              alt={fellow.country || ''}
              width={36}
              height={27}
              className="rounded-sm border border-white/20 object-cover"
              unoptimized
            />
            <span className="mt-0.5 block text-[7px] font-semibold uppercase tracking-wide text-white">
              {fellow.country}
            </span>
          </div>
        ) : null}
      </div>
      <div className="relative mx-auto mb-2 w-[78%] max-w-[200px]">
        <div className="border border-white bg-white p-0.5">
          <div className="border-l-2 border-b-2 border-[#fece00]">
            {fellow.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fellow.imageUrl}
                alt={fellow.imageAlt || fellow.name}
                className="aspect-[4/5] w-full object-cover object-top"
              />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center bg-[#e8eef2] text-3xl font-bold text-[#002740]/40">
                {fellow.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
      <h3 className="text-center text-sm font-bold uppercase leading-tight tracking-wide text-white">
        {fellow.name}
      </h3>
      <p className="mt-0.5 text-center text-[10px] text-white/90">
        {fellow.position ||
          `${fellow.cohortYear ?? 2025} Future Trade Leaders Fellow`}
      </p>
      <p className="mt-2 text-center text-[8px] text-white/60">www.africantradechamber.org</p>
    </div>
  )
}

export function FtlfFellowCard({ fellow, onSelect }: Props) {
  const code = fellow.memberCode || fellow.slug.replace(/-\d+$/, '').toUpperCase()
  const excerpt = fellowBioExcerpt(fellow.name, fellow.bio)
  const useBuiltGraphic = !fellow.imageUrl

  return (
    <button
      type="button"
      onClick={() => onSelect(fellow)}
      className="group flex h-full w-full cursor-pointer flex-col text-left transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#002740]/30"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-sm border border-[#e0e0e0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        {useBuiltGraphic ? (
          <BuiltCardGraphic fellow={fellow} />
        ) : (
          <div className="relative w-full bg-[#002740]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fellow.imageUrl}
              alt={fellow.imageAlt || fellow.name}
              className="block w-full object-contain"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col px-4 py-4">
          <h3 className="mb-2 text-left text-sm font-bold text-black">{code}</h3>
          <p className="text-left text-[13px] leading-[1.55] text-[#333]">{excerpt}</p>
        </div>
      </article>
    </button>
  )
}
