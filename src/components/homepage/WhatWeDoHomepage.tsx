import Image from 'next/image'
import { HomepageCta } from '@/components/homepage/HomepageCta'
import { isLocalImage } from '@/lib/image-url'
import { HomepageImageCard } from '@/components/homepage/HomepageImageCard'
import type { WwdHomepageData } from '@/types/homepage'

type Props = { data: WwdHomepageData }

export function WhatWeDoHomepage({ data }: Props) {
  const paragraphs = data.headerContent.split('||').filter(Boolean)

  return (
    <section className="bg-white py-12 sm:py-16" aria-label="What we do">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <header className="mb-10 text-center">
          <p className="mx-auto max-w-3xl text-xl font-semibold text-atc-navy">{data.headerTitle}</p>
          {paragraphs.map((p, i) => (
            <p key={i} className="mx-auto mt-3 max-w-3xl text-base text-[#4a4a4a]">
              {p.trim()}
            </p>
          ))}
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <article className="relative flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_15px_30px_rgba(0,39,64,0.1)] sm:col-span-2 lg:col-span-4">
            {data.intro.imageUrl ? (
              <div className="relative h-52 w-full sm:h-60">
                <Image
                  src={data.intro.imageUrl}
                  alt={data.intro.title || 'Our Services'}
                  fill
                  unoptimized={!isLocalImage(data.intro.imageUrl)}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            ) : null}
            <div className="relative flex flex-1 flex-col p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-atc-navy">{data.intro.title}</h3>
              {data.intro.description ? (
                <p className="mt-3 text-base leading-relaxed text-[#4a4a4a]">
                  {data.intro.description}
                </p>
              ) : null}
              {data.intro.buttonText && data.intro.buttonUrl ? (
                <HomepageCta href={data.intro.buttonUrl}>{data.intro.buttonText}</HomepageCta>
              ) : null}
            </div>
          </article>

          {data.services.map((service, i) => (
            <HomepageImageCard key={`${service.title}-${i}`} card={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
