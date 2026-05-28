import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JobApplicationForm } from '@/components/careers/JobApplicationForm'
import { getCareerJobBySlug } from '@/lib/cms-jobs'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const job = await getCareerJobBySlug(slug)
  if (!job) return { title: 'Apply' }
  return { title: `Apply — ${job.title}` }
}

export default async function JobApplyPage({ params }: Props) {
  const { slug } = await params
  const job = await getCareerJobBySlug(slug)
  if (!job) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href={`/careers/${slug}`} className="mb-6 inline-flex text-sm font-semibold text-[#002740] hover:text-[#fbbf24]">
        ← Back to job posting
      </Link>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[#002740] md:text-3xl">Apply for {job.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{job.jobId}</p>
      </header>
      <JobApplicationForm job={job} />
    </div>
  )
}
