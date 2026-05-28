'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { HeroSlide } from '@/types/content'

type Props = {
  slides: HeroSlide[]
}

function HeroCta({ href, children }: { href: string; children: ReactNode }) {
  const className =
    'group inline-flex items-center rounded bg-atc-navy/60 px-6 py-3 text-base font-semibold text-atc-yellow backdrop-blur-sm transition hover:bg-atc-yellow hover:text-atc-navy'

  if (href.startsWith('http')) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="ml-2 text-xl transition-transform group-hover:translate-x-1">→</span>
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
      <span className="ml-2 text-xl transition-transform group-hover:translate-x-1">→</span>
    </Link>
  )
}

function HeroSideMedia({ slide }: { slide: HeroSlide }) {
  if (slide.sideVideoUrl) {
    return (
      <div className="relative h-[280px] w-full max-w-[480px] overflow-hidden rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] lg:h-[320px] lg:w-[450px]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          poster={slide.backgroundImageUrl || undefined}
        >
          <source src={slide.sideVideoUrl} type="video/mp4" />
        </video>
      </div>
    )
  }

  if (slide.sideImageUrl) {
    return (
      <div className="relative h-[280px] w-full max-w-[480px] overflow-hidden rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] lg:h-[320px] lg:w-[450px]">
        <Image
          src={slide.sideImageUrl}
          alt=""
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 1024px) 90vw, 450px"
          priority
        />
      </div>
    )
  }

  return null
}

export function HeroSlider({ slides }: Props) {
  const [index, setIndex] = useState(0)
  const active = slides[index] ?? slides[0]

  const goTo = useCallback((i: number) => {
    setIndex(i)
  }, [])

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(next, 7000)
    return () => clearInterval(timer)
  }, [next, slides.length])

  if (!active) return null

  const isApplyOnly = active.showApplyOnly
  const hasSideMedia =
    !isApplyOnly &&
    active.showSideImage &&
    Boolean(active.sideImageUrl || active.sideVideoUrl)

  return (
    <section className="relative bg-atc-navy" aria-label="Hero">
      {/* Dots — top (live site) */}
      {slides.length > 1 ? (
        <div className="absolute left-0 right-0 top-4 z-30 flex justify-center gap-2 sm:top-6">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              className={`h-3.5 w-3.5 rounded-full border-2 border-atc-yellow/60 shadow-sm transition sm:h-4 sm:w-4 ${
                i === index
                  ? 'scale-110 border-atc-yellow bg-atc-yellow'
                  : 'bg-atc-navy/50 hover:bg-atc-navy/70'
              }`}
            />
          ))}
        </div>
      ) : null}

      <div className="relative h-[550px] w-full overflow-hidden sm:h-[600px] lg:h-[650px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {active.backgroundImageUrl ? (
              <Image
                src={active.backgroundImageUrl}
                alt=""
                fill
                priority
                className={
                  isApplyOnly
                    ? 'object-contain object-center p-4 sm:p-8'
                    : 'object-cover object-center'
                }
                sizes="100vw"
              />
            ) : null}

            {!isApplyOnly ? (
              <div
                className="absolute inset-0 bg-gradient-to-r from-atc-navy/90 via-atc-navy/65 at-[45%]:via-atc-navy/25 to-transparent"
                aria-hidden
              />
            ) : null}
          </motion.div>
        </AnimatePresence>

        {isApplyOnly ? (
          active.ctaLabel &&
          active.ctaUrl && (
            <div className="absolute bottom-[78px] left-4 z-20 sm:bottom-[118px] sm:left-8 lg:left-20">
              <HeroCta href={active.ctaUrl}>{active.ctaLabel}</HeroCta>
            </div>
          )
        ) : (
          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1280px] items-center px-4 pb-10 pt-16 sm:px-6 sm:pb-12 sm:pt-20 lg:px-10 lg:pb-14 lg:pt-24 xl:pl-20">
            <div className="flex w-full min-w-0 flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 xl:gap-12">
              <div className="min-w-0 shrink-0 text-left lg:max-w-[650px] lg:flex-1">
                <h1 className="text-[26px] font-bold leading-snug text-white sm:text-[30px] lg:text-[38px] lg:leading-tight">
                  {active.title.split('\n').map((line, i) => (
                    <span key={i}>
                      {i > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </h1>
                {active.description ? (
                  <p className="mt-6 text-base leading-relaxed text-white/95 sm:text-lg">
                    {active.description}
                  </p>
                ) : null}
                {active.ctaLabel && active.ctaUrl ? (
                  <div className="mt-8">
                    <HeroCta href={active.ctaUrl}>{active.ctaLabel}</HeroCta>
                  </div>
                ) : null}
              </div>

              {hasSideMedia ? (
                <div className="flex w-full shrink-0 justify-center lg:w-auto lg:justify-end">
                  <HeroSideMedia slide={active} />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
