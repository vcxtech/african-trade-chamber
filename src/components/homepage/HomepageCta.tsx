import Link from 'next/link'

type Props = {
  href: string
  children: React.ReactNode
  variant?: 'inline' | 'card' | 'header' | 'centered'
  className?: string
}

function ctaClass(variant: Props['variant'], className: string) {
  if (variant === 'centered') {
    return `group mt-6 inline-flex items-center rounded border border-atc-navy bg-atc-navy px-5 py-2 text-base font-semibold text-white transition hover:border-atc-yellow hover:bg-atc-yellow hover:text-atc-navy ${className}`
  }
  if (variant === 'header') {
    return `group mt-4 inline-flex items-center rounded border border-atc-navy bg-atc-navy px-5 py-2 text-base font-semibold text-white transition hover:border-atc-yellow hover:bg-atc-yellow hover:text-atc-navy ${className}`
  }
  if (variant === 'card') {
    return `group absolute bottom-5 left-5 inline-flex items-center rounded px-3 py-1.5 text-sm font-semibold text-atc-navy transition hover:bg-atc-yellow ${className}`
  }
  return `group mt-6 inline-flex w-fit self-start items-center rounded px-3 py-1.5 text-sm font-semibold text-atc-navy transition hover:bg-atc-yellow ${className}`
}

function CtaContent({ children, variant }: { children: React.ReactNode; variant: Props['variant'] }) {
  if (variant === 'inline' || variant === 'card') {
    return (
      <>
        {children}
        <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
      </>
    )
  }
  return (
    <>
      <span>{children}</span>
      <span className="ml-1.5 transition-transform group-hover:translate-x-0.5">→</span>
    </>
  )
}

export function HomepageCta({ href, children, variant = 'inline', className = '' }: Props) {
  const cls = ctaClass(variant, className)
  const content = <CtaContent variant={variant}>{children}</CtaContent>

  if (href.startsWith('http')) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  )
}
