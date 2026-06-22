'use client'

import { useCallback, useEffect, useState } from 'react'
import type { FellowTestimonial, ResourceTestimonial } from '@/types/fellowship'

type ModalState = {
  title: string
  subtitle: string
  body: string
}

type FellowshipCohortTestimonialsProps = {
  fellowTestimonialsTitle: string
  fellowTestimonialsIntro: string
  resourceTestimonialsTitle: string
  resourceTestimonialsIntro: string
  fellowTestimonials: FellowTestimonial[]
  resourceTestimonials: ResourceTestimonial[]
}

function ReadMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-auto inline-flex items-center gap-1 border-none bg-transparent p-0 text-sm font-semibold text-[#002740] hover:text-[#fece00] hover:underline"
    >
      Read More <span aria-hidden>→</span>
    </button>
  )
}

function FellowCard({
  item,
  onReadMore,
}: {
  item: FellowTestimonial
  onReadMore: () => void
}) {
  return (
    <article className="relative flex h-full flex-col rounded-xl bg-white p-[30px] shadow-[0_15px_30px_rgba(0,39,64,0.1)] transition hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,39,64,0.15)]">
      <span
        className="pointer-events-none absolute left-[25px] top-[15px] text-[60px] font-bold leading-none text-[#fece00]"
        aria-hidden
      >
        &ldquo;
      </span>
      <div className="mt-5 flex flex-1 flex-col">
        <p className="mb-5 line-clamp-4 flex-1 text-base italic leading-[1.7] text-black">
          {item.quote}
        </p>
        <ReadMoreButton onClick={onReadMore} />
        <div className="mt-5 flex items-center gap-[15px]">
          <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#002740] to-[#fece00] text-lg font-semibold text-white">
            {item.initials}
          </div>
          <div>
            <h4 className="text-base font-semibold text-black">{item.name}</h4>
            <p className="text-sm text-black">{item.subtitle}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

function ResourceCard({
  item,
  onReadMore,
}: {
  item: ResourceTestimonial
  onReadMore: () => void
}) {
  return (
    <article className="flex h-full flex-col rounded-lg border-l-4 border-[#fece00] bg-white p-[25px] shadow-[0_10px_20px_rgba(0,39,64,0.1)] transition hover:-translate-y-1">
      <p className="mb-[15px] line-clamp-2 flex-1 text-[15px] italic leading-relaxed text-black">
        &ldquo;{item.quote}&rdquo;
      </p>
      <ReadMoreButton onClick={onReadMore} />
      <div className="mt-auto border-t border-[#e9ecef] pt-[15px]">
        <h5 className="text-sm font-semibold text-black">{item.name}</h5>
        <p className="text-[13px] text-black">{item.role}</p>
        {item.organization ? (
          <p className="text-[13px] text-black">{item.organization}</p>
        ) : null}
      </div>
    </article>
  )
}

function TestimonialModal({
  modal,
  onClose,
}: {
  modal: ModalState | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!modal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [modal, onClose])

  if (!modal) return null

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative max-h-[80vh] w-full max-w-[600px] overflow-y-auto rounded-xl bg-white p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-4 text-3xl font-bold text-[#4a4a4a] hover:text-[#002740]"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="pr-8 text-2xl font-bold text-[#002740]">{modal.title}</h2>
        {modal.subtitle ? (
          <p className="mt-2 text-base italic text-[#4a4a4a]">{modal.subtitle}</p>
        ) : null}
        <p className="mt-5 whitespace-pre-wrap text-base leading-[1.7] text-black">{modal.body}</p>
      </div>
    </div>
  )
}

export function FellowshipCohortTestimonials({
  fellowTestimonialsTitle,
  fellowTestimonialsIntro,
  resourceTestimonialsTitle,
  resourceTestimonialsIntro,
  fellowTestimonials,
  resourceTestimonials,
}: FellowshipCohortTestimonialsProps) {
  const [modal, setModal] = useState<ModalState | null>(null)

  const openFellow = useCallback((item: FellowTestimonial) => {
    setModal({ title: item.name, subtitle: item.subtitle, body: item.quote })
  }, [])

  const openResource = useCallback((item: ResourceTestimonial) => {
    setModal({
      title: item.name,
      subtitle: [item.role, item.organization].filter(Boolean).join(' — '),
      body: item.quote,
    })
  }, [])

  const hasFellow = fellowTestimonials.length > 0
  const hasResource = resourceTestimonials.length > 0
  if (!hasFellow && !hasResource) return null

  return (
    <div className="bg-[#f8f9fa] pb-16 font-[family-name:var(--font-poppins,'Poppins',sans-serif)]">
      <div className="mx-auto max-w-[1200px] px-5">
        <header className="mb-12 text-center">
          <h2 className="mb-2 text-[28px] font-bold text-black">Testimonials</h2>
          <p className="text-base text-black">Voices from Fellowship</p>
        </header>

        {hasFellow ? (
          <section className="mb-[60px]" aria-labelledby="fellow-testimonials-title">
            <h3
              id="fellow-testimonials-title"
              className="mb-2 text-center text-[28px] font-bold text-black"
            >
              {fellowTestimonialsTitle}
            </h3>
            {fellowTestimonialsIntro ? (
              <p className="mb-[30px] text-center text-base text-black">{fellowTestimonialsIntro}</p>
            ) : null}
            <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 lg:grid-cols-3">
              {fellowTestimonials.map((item) => (
                <FellowCard key={item.name} item={item} onReadMore={() => openFellow(item)} />
              ))}
            </div>
          </section>
        ) : null}

        {hasResource ? (
          <section className="mb-[60px]" aria-labelledby="resource-testimonials-title">
            <h3
              id="resource-testimonials-title"
              className="mb-2 text-center text-[28px] font-bold text-black"
            >
              {resourceTestimonialsTitle}
            </h3>
            {resourceTestimonialsIntro ? (
              <p className="mb-[30px] text-center text-base text-black">
                {resourceTestimonialsIntro}
              </p>
            ) : null}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {resourceTestimonials.map((item) => (
                <ResourceCard key={item.name} item={item} onReadMore={() => openResource(item)} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <TestimonialModal modal={modal} onClose={() => setModal(null)} />
    </div>
  )
}
