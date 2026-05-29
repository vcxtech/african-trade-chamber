import Image from 'next/image'
import { HomepageCta } from '@/components/homepage/HomepageCta'
import { isLocalImage } from '@/lib/image-url'
import { HomepageImageCard } from '@/components/homepage/HomepageImageCard'
import type { IndustryCouncilsHomepageData } from '@/types/homepage'

type Props = { data: IndustryCouncilsHomepageData }

export function IndustryCouncilsHomepage({ data }: Props) {
  return (
    <section className="bg-white py-12 sm:py-16" aria-label="Industry councils">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <header className="mb-10 hidden text-center">
          <h2 className="text-3xl font-bold text-atc-navy">{data.headerTitle}</h2>
          <p className="mx-auto mt-3 max-w-3xl text-[#4a4a4a]">{data.headerDescription}</p>
          {data.headerButtonText && data.headerButtonUrl ? (
            <HomepageCta href={data.headerButtonUrl} variant="header">
              {data.headerButtonText}
            </HomepageCta>
          ) : null}
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <article className="relative flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_15px_30px_rgba(0,39,64,0.1)] sm:col-span-2 lg:col-span-4">
            {data.intro.imageUrl ? (
              <div className="relative h-52 w-full sm:h-60">
                <Image
                  src={data.intro.imageUrl}
                  alt={data.intro.title || 'Industry councils'}
                  fill
                  unoptimized={!isLocalImage(data.intro.imageUrl)}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            ) : null}
            <div className="relative flex flex-1 flex-col p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-atc-navy">{data.intro.title}</h3>
              {data.intro.text ? (
                <p className="mt-3 text-base leading-relaxed text-[#4a4a4a]">{data.intro.text}</p>
              ) : null}
              {data.intro.buttonText && data.intro.buttonUrl ? (
                <HomepageCta href={data.intro.buttonUrl}>{data.intro.buttonText}</HomepageCta>
              ) : null}
            </div>
          </article>

          {data.councils.map((council, i) => (
            <HomepageImageCard key={`${council.title}-${i}`} card={council} />
          ))}
        </div>
      </div>
    </section>
  )
}
