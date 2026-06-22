import type { HeroSlide } from '@/types/content'
import { canOptimizeImage, getNextImageSrc } from '@/lib/image-url'

type Props = {
  slide: HeroSlide
}

function preloadHref(url: string, width: number): string {
  return canOptimizeImage(url) ? getNextImageSrc(url, width) : url
}

/** Server-rendered preload hints for LCP hero images. */
export function HeroPreload({ slide }: Props) {
  const links: { key: string; href: string }[] = []

  if (slide.backgroundImageUrl) {
    links.push({
      key: 'hero-bg',
      href: preloadHref(slide.backgroundImageUrl, 1920),
    })
  }

  if (slide.sideImageUrl && slide.showSideImage) {
    links.push({
      key: 'hero-side',
      href: preloadHref(slide.sideImageUrl, 900),
    })
  }

  if (!links.length) return null

  return (
    <>
      {links.map(({ key, href }) => (
        <link key={key} rel="preload" as="image" href={href} fetchPriority="high" />
      ))}
    </>
  )
}
