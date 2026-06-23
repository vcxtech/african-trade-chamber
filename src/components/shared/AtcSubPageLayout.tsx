import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  backHref: string
  backLabel: string
  children: ReactNode
}

export function AtcSubPageLayout({ title, subtitle, backHref, backLabel, children }: Props) {
  return (
    <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] py-6 text-black">
      <div className="mx-auto max-w-7xl px-5 py-6">
        <nav className="mb-6">
          <Link
            href={backHref}
            className="text-sm font-medium text-[#002740] transition hover:underline"
          >
            {backLabel}
          </Link>
        </nav>

        <header className="mb-8 rounded-[15px] bg-[#002740] px-4 py-[30px] text-center text-white shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
          <h1 className="text-[clamp(26px,1.6vw+12px,36px)] font-extrabold text-white">{title}</h1>
          {subtitle ? (
            <p className="mx-auto mt-3 max-w-[760px] text-[1.08rem] leading-relaxed text-[#e2e8f0] opacity-90">
              {subtitle}
            </p>
          ) : null}
        </header>

        {children}
      </div>
    </div>
  )
}
