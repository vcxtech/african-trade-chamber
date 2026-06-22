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
  'sme-council',
])

const MEMBERSHIP_FILE_FIELDS = ['companyLogo', 'supportingDocs'] as const

type AttachmentRef = {
  id: number | string
  filename: string
  url?: string
}

async function uploadFormFile(
  payload: Awaited<ReturnType<typeof getPayload>>,
  file: File | Blob,
  fallbackName: string,
): Promise<AttachmentRef> {
  const name = file instanceof File ? file.name : fallbackName
  const buffer = Buffer.from(await file.arrayBuffer())
  const doc = await payload.create({
    collection: 'form-attachments',
    data: { alt: name },
    file: {
      data: buffer,
      mimetype: file.type || 'application/octet-stream',
      name,
      size: file.size,
    },
    overrideAccess: true,
  })

  return {
    id: doc.id,
    filename: typeof doc.filename === 'string' ? doc.filename : name,
    url: typeof doc.url === 'string' ? doc.url : undefined,
  }
}

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0
}

async function parseMultipartRequest(request: Request): Promise<Body> {
  const formData = await request.formData()
  const formType = formData.get('formType')
  if (typeof formType !== 'string' || !VALID_TYPES.has(formType as FormSubmissionType)) {
    throw new Error('Invalid form type')
  }

  const email = formData.get('email')
  const subject = formData.get('subject')
  const jobSlug = formData.get('jobSlug')
  const dataRaw = formData.get('data')

  let data: Record<string, unknown> = {}
  if (typeof dataRaw === 'string' && dataRaw.trim()) {
    try {
      data = JSON.parse(dataRaw) as Record<string, unknown>
    } catch {
      throw new Error('Invalid data JSON')
    }
  }

  for (const [key, value] of formData.entries()) {
    if (
      key === 'formType' ||
      key === 'email' ||
      key === 'subject' ||
      key === 'jobSlug' ||
      key === 'data' ||
      MEMBERSHIP_FILE_FIELDS.includes(key as (typeof MEMBERSHIP_FILE_FIELDS)[number])
    ) {
      continue
    }
    if (typeof value === 'string') {
      data[key] = value
    }
  }

  const payload = await getPayload({ config })

  const logo = formData.get('companyLogo')
  if (isUploadFile(logo)) {
    data.companyLogo = await uploadFormFile(payload, logo, 'company-logo')
  }

  const supportingDocs = formData.getAll('supportingDocs').filter(isUploadFile)
  if (supportingDocs.length > 0) {
    data.supportingDocs = await Promise.all(
      supportingDocs.map((file, index) =>
        uploadFormFile(
          payload,
          file,
          file instanceof File ? file.name : `supporting-doc-${index + 1}`,
        ),
      ),
    )
  }

  return {
    formType: formType as FormSubmissionType,
    email: typeof email === 'string' ? email : undefined,
    subject: typeof subject === 'string' ? subject : undefined,
    jobSlug: typeof jobSlug === 'string' ? jobSlug : undefined,
    data,
  }
}

async function parseJsonRequest(request: Request): Promise<Body> {
  return (await request.json()) as Body
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? ''
  let body: Body

  try {
    body = contentType.includes('multipart/form-data')
      ? await parseMultipartRequest(request)
      : await parseJsonRequest(request)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid request body'
    return Response.json({ error: message }, { status: 400 })
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
      overrideAccess: true,
    })
    return Response.json({ ok: true })
  } catch (err) {
    console.error('Form submission error:', err)
    return Response.json({ error: 'Unable to save submission' }, { status: 500 })
  }
}
