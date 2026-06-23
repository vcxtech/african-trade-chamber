import { HomepageCta } from '@/components/homepage/HomepageCta'
import { HomepageImageCard } from '@/components/homepage/HomepageImageCard'
import type { CrossSectorHomepageData } from '@/types/homepage'

type Props = { data: CrossSectorHomepageData }

export function CrossSectorCouncilsHomepage({ data }: Props) {
  return (
    <section className="bg-white py-12 sm:py-16" aria-label="Cross-sector councils">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="flex flex-col items-center rounded-xl bg-white p-8 text-center shadow-[0_15px_30px_rgba(0,39,64,0.1)] md:col-span-3">
            <h2 className="text-2xl font-bold text-atc-navy">{data.intro.title}</h2>
            {data.intro.description ? (
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-atc-muted">
                {data.intro.description}
              </p>
            ) : null}
            {data.intro.buttonText && data.intro.buttonUrl ? (
              <HomepageCta href={data.intro.buttonUrl} variant="centered">
                {data.intro.buttonText}
              </HomepageCta>
            ) : null}
          </article>

          {data.councils.map((council, i) => (
            <HomepageImageCard key={`${council.title}-${i}`} card={council} />
          ))}
        </div>
      </div>
    </section>
  )
}
