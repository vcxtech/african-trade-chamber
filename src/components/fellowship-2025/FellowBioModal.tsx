'use client'

import { fellowCategoriesLabel } from '@/lib/fellow-card'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import type { Fellow } from '@/types/fellow'

type Props = {
  fellow: Fellow | null
  onClose: () => void
}

export function FellowBioModal({ fellow, onClose }: Props) {
  const trapRef = useFocusTrap(Boolean(fellow), onClose)
  if (!fellow) return null

  const memberCode =
    fellow.memberCode || fellow.slug.replace(/-\d+$/, '').toUpperCase()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fellow-modal-title"
      onClick={onClose}
    >
      <div
        ref={trapRef}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="fellow-modal-title" className="text-lg font-bold text-[#002740]">
              {memberCode}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#4a4a4a]">
              {fellowCategoriesLabel(fellow.country)}
            </p>
            <p className="mt-1 text-sm text-[#666]">{fellow.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {fellow.imageUrl ? (
          <div className="mb-4 overflow-hidden rounded-lg bg-[#002740]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fellow.imageUrl}
              alt={fellow.imageAlt || fellow.name}
              className="mx-auto w-full object-contain"
            />
          </div>
        ) : null}
        {fellow.bio ? (
          <div
            className="prose prose-sm max-w-none text-[#333] [&_p]:mb-3"
            dangerouslySetInnerHTML={{ __html: fellow.bio }}
          />
        ) : (
          <p className="text-sm text-slate-600">No profile details available.</p>
        )}
      </div>
    </div>
  )
}
