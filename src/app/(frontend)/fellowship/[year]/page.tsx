import { FellowshipCohortHero } from '@/components/fellowship-2025/FellowshipCohortHero'
import { FellowshipCohortTestimonials } from '@/components/fellowship-2025/FellowshipCohortTestimonials'
import { FellowsGrid } from '@/components/fellowship-2025/FellowsGrid'
import {
  getFellowshipCohortByYear,
  getFellowshipCohortYears,
} from '@/lib/cms-fellowship'
import { getFellows } from '@/lib/cms-team-members'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 60

type PageProps = {
  params: Promise<{ year: string }>
}

export async function generateStaticParams() {
  const years = await getFellowshipCohortYears()
  return years.map((year) => ({ year: String(year) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year: yearParam } = await params
  const year = Number.parseInt(yearParam, 10)
  if (!Number.isFinite(year)) return {}

  const cohort = await getFellowshipCohortByYear(year)
  if (!cohort) return {}

  return {
    title: cohort.seoTitle,
    description: cohort.seoDescription,
  }
}

export default async function FellowshipCohortPage({ params }: PageProps) {
  const { year: yearParam } = await params
  const year = Number.parseInt(yearParam, 10)
  if (!Number.isFinite(year)) notFound()

  const cohort = await getFellowshipCohortByYear(year)
  if (!cohort || cohort.cohortYear !== year) notFound()

  const fellows = await getFellows({ year })

  return (
    <main className="bg-[#f8f9fa]">
      <FellowshipCohortHero
        title={cohort.pageHeroTitle}
        subtitle={cohort.pageHeroSubtitle}
        imageUrl={cohort.pageHeroImageUrl}
      />
      <FellowsGrid members={fellows} cohortYear={year} />
      {cohort.showTestimonials ? (
        <FellowshipCohortTestimonials
          fellowTestimonialsTitle={cohort.fellowTestimonialsTitle}
          fellowTestimonialsIntro={cohort.fellowTestimonialsIntro}
          resourceTestimonialsTitle={cohort.resourceTestimonialsTitle}
          resourceTestimonialsIntro={cohort.resourceTestimonialsIntro}
          fellowTestimonials={cohort.fellowTestimonials}
          resourceTestimonials={cohort.resourceTestimonials}
        />
      ) : null}
    </main>
  )
}
