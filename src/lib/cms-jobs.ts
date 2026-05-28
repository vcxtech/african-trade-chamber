import { defaultCareerJobs } from '@/lib/careers-defaults'
import { normalizePostedAt } from '@/lib/careers-utils'
import { getPayloadClient } from '@/lib/cms'
import type { CareerJob } from '@/types/career-job'

function mapDoc(doc: Record<string, unknown>): CareerJob {
  return {
    id: String(doc.jobId ?? doc.id ?? ''),
    slug: String(doc.slug ?? ''),
    title: String(doc.title ?? ''),
    jobId: String(doc.jobId ?? ''),
    location: String(doc.location ?? 'Accra, Ghana'),
    jobType: String(doc.jobType ?? 'Full-time'),
    category: String(doc.category ?? 'Leadership'),
    postedAt: normalizePostedAt(doc.postedAt),
    applyUrl: String(doc.applyUrl ?? `/careers/${doc.slug}/apply`),
    summary: String(doc.summary ?? ''),
    roleHtml: doc.roleHtml ? String(doc.roleHtml) : undefined,
    responsibilitiesHtml: doc.responsibilitiesHtml ? String(doc.responsibilitiesHtml) : undefined,
    aboutHtml: doc.aboutHtml ? String(doc.aboutHtml) : undefined,
    qualificationsHtml: doc.qualificationsHtml ? String(doc.qualificationsHtml) : undefined,
    competenciesHtml: doc.competenciesHtml ? String(doc.competenciesHtml) : undefined,
    locationScope: doc.locationScope ? String(doc.locationScope) : undefined,
    appointment: doc.appointment ? String(doc.appointment) : undefined,
    requirementsHtml: doc.requirementsHtml ? String(doc.requirementsHtml) : undefined,
    processHtml: doc.processHtml ? String(doc.processHtml) : undefined,
    deadline: doc.deadline ? String(doc.deadline) : undefined,
  }
}

export async function getCareerJobs(): Promise<CareerJob[]> {
  try {
    const payload = await getPayloadClient()
    if (!payload) return defaultCareerJobs
    const result = await payload.find({
      collection: 'jobs',
      where: { status: { equals: 'open' } },
      sort: '-postedAt',
      limit: 50,
    })
    if (!result.docs.length) return defaultCareerJobs
    return result.docs.map((doc) => mapDoc(doc as unknown as Record<string, unknown>))
  } catch {
    return defaultCareerJobs
  }
}

export async function getCareerJobBySlug(slug: string): Promise<CareerJob | null> {
  const fallback = defaultCareerJobs.find((j) => j.slug === slug) ?? null
  try {
    const payload = await getPayloadClient()
    if (!payload) return fallback
    const result = await payload.find({
      collection: 'jobs',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const doc = result.docs[0]
    if (!doc) return fallback
    return mapDoc(doc as unknown as Record<string, unknown>)
  } catch {
    return fallback
  }
}

export function careerJobToSeedData(job: CareerJob) {
  return {
    title: job.title,
    slug: job.slug,
    department: job.category,
    location: job.location,
    jobType: job.jobType,
    summary: job.summary,
    status: 'open' as const,
    applyUrl: job.applyUrl,
    jobId: job.jobId,
    category: job.category,
    postedAt: job.postedAt,
    roleHtml: job.roleHtml,
    responsibilitiesHtml: job.responsibilitiesHtml,
    aboutHtml: job.aboutHtml,
    qualificationsHtml: job.qualificationsHtml,
    competenciesHtml: job.competenciesHtml,
    locationScope: job.locationScope,
    appointment: job.appointment,
    requirementsHtml: job.requirementsHtml,
    processHtml: job.processHtml,
    deadline: job.deadline,
  }
}
