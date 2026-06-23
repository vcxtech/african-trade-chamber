import Link from 'next/link'
import type { HeroFeatureCard } from '@/types/homepage'

type Props = {
  cards: HeroFeatureCard[]
}

export function HeroFeatureCards({ cards }: Props) {
  if (!cards.length) return null

  return (
    <section className="bg-white py-10 sm:py-14" aria-label="About ATC">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {cards.map((card) => (
          <article
            key={card.id}
            className="rounded-xl bg-white p-6 text-center shadow-[0_12px_22px_rgba(0,39,64,0.14)] transition hover:-translate-y-1"
          >
            <h2 className="text-lg font-bold text-atc-navy sm:text-xl">{card.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-atc-muted">{card.description}</p>
            <Link
              href={card.linkUrl}
              className="group mt-4 inline-flex items-center text-sm font-semibold text-atc-navy hover:text-atc-yellow"
            >
              {card.linkText}
              <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
