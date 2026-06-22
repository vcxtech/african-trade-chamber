'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { HeroSlide } from '@/types/content'
import { canOptimizeImage, getNextImageSrc } from '@/lib/image-url'

type Props = {
  slides: HeroSlide[]
}

const SIDE_IMAGE_BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k='

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

const prefetchedSrcs = new Set<string>()

function prefetchSlideImages(slide: HeroSlide | undefined) {
  if (!slide || typeof window === 'undefined') return

  const urls: { url: string; width: number }[] = []
  if (slide.backgroundImageUrl) {
    urls.push({ url: slide.backgroundImageUrl, width: 1920 })
  }
  if (slide.sideImageUrl) {
    urls.push({ url: slide.sideImageUrl, width: 900 })
  }

  for (const { url, width } of urls) {
    const src = canOptimizeImage(url) ? getNextImageSrc(url, width) : url
    if (prefetchedSrcs.has(src)) continue
    prefetchedSrcs.add(src)
    const img = new window.Image()
    img.src = src
  }
}

const sideMediaContainerClass =
  'relative mx-auto h-[160px] w-full max-w-[320px] overflow-hidden rounded-xl bg-atc-navy/50 shadow-[0_10px_20px_rgba(0,0,0,0.3)] sm:h-[200px] sm:max-w-[380px] lg:mx-0 lg:h-[320px] lg:w-[450px] lg:max-w-[480px]'

function HeroSideMedia({
  slide,
  isFirstSlide,
}: {
  slide: HeroSlide
  isFirstSlide: boolean
}) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
  }, [slide.id, slide.sideImageUrl])

  if (slide.sideVideoUrl) {
    return (
      <div className={sideMediaContainerClass}>
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
      <div className={sideMediaContainerClass}>
        <Image
          src={slide.sideImageUrl}
          alt=""
          fill
          className={`object-cover transition-all duration-300 hover:scale-105 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 640px) 320px, (max-width: 1024px) 380px, 450px"
          priority={isFirstSlide}
          fetchPriority={isFirstSlide ? 'high' : 'auto'}
          placeholder="blur"
          blurDataURL={SIDE_IMAGE_BLUR}
          unoptimized={!canOptimizeImage(slide.sideImageUrl)}
          onLoad={() => setLoaded(true)}
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

  useEffect(() => {
    if (slides.length <= 1) return
    const nextIndex = (index + 1) % slides.length
    prefetchSlideImages(slides[nextIndex])
    // Prefetch only when the active slide changes, not when slides array identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by index
  }, [index, slides.length])

  if (!active) return null

  const isApplyOnly = active.showApplyOnly
  const hasSideMedia =
    !isApplyOnly &&
    active.showSideImage &&
    Boolean(active.sideImageUrl || active.sideVideoUrl)

  return (
    <section className="relative bg-atc-navy" aria-label="Hero">
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

      <div className="relative min-h-[520px] w-full overflow-hidden sm:min-h-[560px] lg:h-[650px] lg:min-h-0">
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
                priority={index === 0}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                className={
                  isApplyOnly
                    ? 'object-contain object-center p-4 sm:p-8'
                    : 'object-cover object-center'
                }
                sizes="100vw"
                unoptimized={!canOptimizeImage(active.backgroundImageUrl)}
              />
            ) : null}

            {!isApplyOnly ? (
              <div
                className="absolute inset-0 bg-gradient-to-b from-atc-navy/85 via-atc-navy/70 to-atc-navy/40 lg:bg-gradient-to-r lg:from-atc-navy/90 lg:via-atc-navy/65 lg:at-[45%]:via-atc-navy/25 lg:to-transparent"
                aria-hidden
              />
            ) : null}
          </motion.div>
        </AnimatePresence>

        {isApplyOnly ? (
          active.ctaLabel &&
          active.ctaUrl && (
            <div className="absolute bottom-24 left-4 z-20 sm:bottom-[118px] sm:left-8 lg:left-20">
              <HeroCta href={active.ctaUrl}>{active.ctaLabel}</HeroCta>
            </div>
          )
        ) : (
          <div className="relative z-10 mx-auto flex min-h-[520px] w-full max-w-[1280px] items-start px-4 pb-24 pt-20 sm:min-h-[560px] sm:px-6 sm:pb-28 sm:pt-20 lg:h-full lg:min-h-0 lg:items-center lg:px-10 lg:pb-14 lg:pt-24 xl:pl-20">
            <div className="flex w-full min-w-0 flex-col items-stretch gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10 xl:gap-12">
              <div className="min-w-0 shrink-0 text-left lg:max-w-[650px] lg:flex-1">
                <h1 className="text-[22px] font-bold leading-tight text-white sm:text-[30px] lg:text-[38px] lg:leading-tight">
                  {active.title.split('\n').map((line, i) => (
                    <span key={i}>
                      {i > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </h1>
                {active.description ? (
                  <p className="mt-4 line-clamp-5 text-[15px] leading-relaxed text-white/95 sm:mt-6 sm:line-clamp-none sm:text-lg">
                    {active.description}
                  </p>
                ) : null}
                {active.ctaLabel && active.ctaUrl ? (
                  <div className="mt-5 lg:mt-8">
                    <HeroCta href={active.ctaUrl}>{active.ctaLabel}</HeroCta>
                  </div>
                ) : null}
              </div>

              {hasSideMedia ? (
                <div className="mt-4 flex w-full shrink-0 justify-center lg:mt-0 lg:w-auto lg:justify-end">
                  <HeroSideMedia slide={active} isFirstSlide={index === 0} />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
