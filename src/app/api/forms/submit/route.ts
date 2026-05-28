import { getPayload } from 'payload'
import config from '@/payload.config'
import type { FormSubmissionType } from '@/lib/form-submit'

export const runtime = 'nodejs'

type Body = {
  formType?: FormSubmissionType
  email?: string
  subject?: string
  jobSlug?: string
  data?: Record<string, unknown>
}

const VALID_TYPES = new Set<FormSubmissionType>([
  'contact',
  'donate',
  'volunteer',
  'membership',
  'service-request',
  'newsletter',
  'job-application',
  'fellowship',
])

export async function POST(request: Request) {
  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const formType = body.formType
  if (!formType || !VALID_TYPES.has(formType)) {
    return Response.json({ error: 'Invalid form type' }, { status: 400 })
  }

  if (!body.data || typeof body.data !== 'object') {
    return Response.json({ error: 'Missing form data' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'form-submissions',
      data: {
        formType,
        email: body.email,
        subject: body.subject,
        jobSlug: body.jobSlug,
        payload: body.data,
        status: 'new',
      },
    })
    return Response.json({ ok: true })
  } catch (err) {
    console.error('Form submission error:', err)
    return Response.json({ error: 'Unable to save submission' }, { status: 500 })
  }
}
