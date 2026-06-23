'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { MemberTestimonial } from '@/types/membership-page'

type Props = {
  title: string
  subtitle: string
  testimonials: MemberTestimonial[]
  standalone?: boolean
}

const INTERVAL_MS = 5000

function AuthorIcon() {
  return (
    <svg
      className="h-6 w-6 text-[#002740]"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  )
}

export function MembershipTestimonials({
  title,
  subtitle,
  testimonials,
  standalone = false,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const reducedMotion = usePrefersReducedMotion()
  const count = testimonials.length

  const goTo = useCallback(
    (index: number) => {
      if (!count) return
      setActiveIndex(((index % count) + count) % count)
    },
    [count],
  )

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])

  useEffect(() => {
    if (!count || reducedMotion) return
    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % count)
    }, INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [count, reducedMotion])

  if (!count) return null

  const sorted = [...testimonials].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <section
      id={standalone ? 'testimonials' : undefined}
      className={standalone ? '' : 'mx-auto mt-10 max-w-[1200px] px-5 py-10'}
      aria-roledescription="carousel"
      aria-label={title}
    >
      {!standalone ? (
        <div className="mb-[30px] rounded-[15px] bg-[#002740] px-4 py-[30px] text-center text-white shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
          <p className="mb-[15px] text-[2rem] font-bold leading-tight tracking-tight text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)]">
            {title}
          </p>
          <p className="mx-auto max-w-[800px] text-[1.1rem] font-normal leading-[1.6] text-white/80">
            {subtitle}
          </p>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl bg-white shadow-[0_15px_30px_rgba(0,39,64,0.1)]">
        <div className="p-[25px]">
          <div className="relative mt-5 overflow-hidden py-[30px]">
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2.5 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#002740] shadow-[0_4px_10px_rgba(0,39,64,0.1)] transition-colors hover:bg-[#002740] hover:text-white max-md:h-[35px] max-md:w-[35px]"
              aria-label="Previous testimonial"
            >
              ‹
            </button>

            <div className="relative min-h-[240px] px-10 max-md:px-5 max-sm:px-2.5">
              {sorted.map((item, i) => (
                <div
                  key={item.id}
                  className={`w-full transition-opacity duration-500 ${
                    i === activeIndex
                      ? 'relative opacity-100'
                      : 'pointer-events-none absolute left-0 top-0 opacity-0'
                  }`}
                  aria-hidden={i !== activeIndex}
                >
                  <div className="relative flex flex-col rounded-xl bg-gradient-to-br from-[rgba(0,39,64,0.1)] to-[rgba(230,177,74,0.1)] p-[30px] shadow-[0_10px_20px_rgba(0,39,64,0.05)] max-sm:px-5 max-sm:py-[25px]">
                    <span
                      className="pointer-events-none absolute left-5 top-4 font-serif text-[60px] leading-none text-[#e6b14a] opacity-20"
                      aria-hidden
                    >
                      &ldquo;
                    </span>
                    <p className="relative mb-5 flex-grow pt-2.5 text-base leading-[1.7] text-black">
                      {item.quote}
                    </p>
                    <div className="mt-auto flex items-center">
                      <div className="mr-[15px] flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border-2 border-white bg-[rgba(0,39,64,0.1)] shadow-[0_4px_8px_rgba(0,39,64,0.1)]">
                        <AuthorIcon />
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold text-black">{item.name}</div>
                        <div className="text-[13px] text-black">{item.position}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-2.5 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#002740] shadow-[0_4px_10px_rgba(0,39,64,0.1)] transition-colors hover:bg-[#002740] hover:text-white max-md:h-[35px] max-md:w-[35px]"
              aria-label="Next testimonial"
            >
              ›
            </button>

            <div className="mt-[25px] flex justify-center" role="tablist" aria-label="Testimonial slides">
              <div className="flex gap-2">
                {sorted.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={i === activeIndex}
                    aria-label={`Show testimonial ${i + 1}`}
                    onClick={() => goTo(i)}
                    className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? 'w-6 rounded-[5px] bg-[#002740]'
                        : 'w-2.5 bg-[rgba(0,39,64,0.1)] hover:bg-[rgba(0,39,64,0.25)]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
