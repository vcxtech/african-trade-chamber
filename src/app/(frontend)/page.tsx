import { CrossSectorCouncilsHomepage } from '@/components/homepage/CrossSectorCouncilsHomepage'
import { HeroFeatureCards } from '@/components/homepage/HeroFeatureCards'
import { IndustryCouncilsHomepage } from '@/components/homepage/IndustryCouncilsHomepage'
import { ThreeCardHomepageSection } from '@/components/homepage/ThreeCardHomepageSection'
import { WhatWeDoHomepage } from '@/components/homepage/WhatWeDoHomepage'
import { HeroPreload } from '@/components/HeroPreload'
import { HeroSlider } from '@/components/HeroSlider'
import { getHeroSlides } from '@/lib/cms'
import { getHomepageSections } from '@/lib/cms-homepage'

export default async function HomePage() {
  const [slides, sections] = await Promise.all([getHeroSlides(), getHomepageSections()])

  const firstSlide = slides[0]

  return (
    <>
      {firstSlide ? <HeroPreload slide={firstSlide} /> : null}
      <HeroSlider slides={slides} />
      <HeroFeatureCards cards={sections.featureCards} />
      <WhatWeDoHomepage data={sections.wwd} />
      <IndustryCouncilsHomepage data={sections.industryCouncils} />
      <CrossSectorCouncilsHomepage data={sections.crossSector} />
      <ThreeCardHomepageSection data={sections.membership} ariaLabel="Membership" />
      <ThreeCardHomepageSection data={sections.insights} ariaLabel="Insights" />
      <ThreeCardHomepageSection data={sections.events} ariaLabel="Events" />
      <ThreeCardHomepageSection data={sections.getInvolved} ariaLabel="Get involved" />
      <ThreeCardHomepageSection data={sections.news} ariaLabel="News" />
    </>
  )
}
