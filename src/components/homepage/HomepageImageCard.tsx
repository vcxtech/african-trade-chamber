import Image from 'next/image'
import { HomepageCta } from '@/components/homepage/HomepageCta'
import { canOptimizeImage } from '@/lib/image-url'
import type { HomepageCard } from '@/types/homepage'

type Props = {
  card: HomepageCard
  imageHeight?: 'default' | 'tall'
  className?: string
}

export function HomepageImageCard({ card, imageHeight = 'default', className = '' }: Props) {
  const imgH = imageHeight === 'tall' ? 'h-60' : 'h-44 sm:h-48'

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_15px_30px_rgba(0,39,64,0.1)] transition hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,39,64,0.15)] ${className}`}
    >
      {card.imageUrl ? (
        <div className={`relative ${imgH} w-full overflow-hidden`}>
          <Image
            src={card.imageUrl}
            alt={card.title}
            fill
            unoptimized={!canOptimizeImage(card.imageUrl)}
            className="object-cover transition duration-500 hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>
      ) : null}
      <div className="relative flex flex-1 flex-col p-5 pb-16">
        <h3 className="text-lg font-bold text-atc-navy">{card.title}</h3>
        {card.description ? (
          <p className="mt-3 text-sm leading-relaxed text-[#4a4a4a]">{card.description}</p>
        ) : null}
        {card.buttonText && card.buttonUrl ? (
          <HomepageCta href={card.buttonUrl} variant="card">
            {card.buttonText}
          </HomepageCta>
        ) : null}
      </div>
    </article>
  )
}
