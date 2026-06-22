import type { Metadata } from 'next'
import Link from 'next/link'
import { FellowshipApplicationForm } from '@/components/fellowship/FellowshipApplicationForm'
import { getFellowshipPage } from '@/lib/cms-fellowship'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFellowshipPage()
  return {
    title: 'Fellowship Application',
    description: `Apply for the ${page.cta.title}.`,
  }
}

export default async function FellowshipApplyPage() {
  const page = await getFellowshipPage()
  const { cta } = page

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <Link href="/fellowship" className="text-sm font-semibold text-atc-navy hover:underline">
        ← Future Trade Leaders Fellowship
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-atc-navy">{cta.title}</h1>
      <p className="mt-4 text-atc-navy/80">{cta.tagline}</p>
      <div className="mt-8">
        <FellowshipApplicationForm applicationTitle={cta.title} />
      </div>
    </div>
  )
}
