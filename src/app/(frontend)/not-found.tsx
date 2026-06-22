import Link from 'next/link'
import { SiteLogo } from '@/components/SiteLogo'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <SiteLogo className="mx-auto mb-8 h-14 w-auto" />
      <p className="text-sm font-bold uppercase tracking-widest text-atc-gold">404</p>
      <h1 className="mt-2 text-3xl font-bold text-atc-navy sm:text-4xl">Page not found</h1>
      <p className="mt-4 max-w-md text-slate-600">
        The page you are looking for may have been moved or no longer exists.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-lg bg-atc-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#001a2e]"
        >
          Back to home
        </Link>
        <Link
          href="/contact-us"
          className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-atc-navy transition hover:border-atc-navy/30"
        >
          Contact us
        </Link>
      </div>
    </div>
  )
}
