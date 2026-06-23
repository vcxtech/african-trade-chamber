import { HomepageCta } from '@/components/homepage/HomepageCta'
import { HomepageImageCard } from '@/components/homepage/HomepageImageCard'
import type { ThreeCardSectionData } from '@/types/homepage'

type Props = {
  data: ThreeCardSectionData
  ariaLabel: string
}

export function ThreeCardHomepageSection({ data, ariaLabel }: Props) {
  return (
    <section className="bg-white py-12 sm:py-16" aria-label={ariaLabel}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-atc-navy">{data.sectionTitle}</h2>
          <p className="mx-auto mt-3 max-w-3xl text-base text-atc-muted">{data.sectionDescription}</p>
          {data.sectionCtaText && data.sectionCtaUrl ? (
            <HomepageCta href={data.sectionCtaUrl} variant="header">
              {data.sectionCtaText}
            </HomepageCta>
          ) : null}
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {data.cards.map((card, i) => (
            <HomepageImageCard key={`${card.title}-${i}`} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}
