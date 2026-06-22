import path from 'path'
import fs from 'fs'
import type { Payload } from 'payload'
import type { FormSubmissionType } from '@/lib/form-submit'

const FORM_TYPE_DEFAULTS: Partial<Record<FormSubmissionType, string>> = {
  contact: 'info@africantradechamber.org',
  donate: 'finance@africantradechamber.org',
  volunteer: 'info@africantradechamber.org',
  membership: 'info@africantradechamber.org',
  'service-request': 'info@africantradechamber.org',
  newsletter: 'info@africantradechamber.org',
  'job-application': 'info@africantradechamber.org',
  fellowship: 'info@africantradechamber.org',
  'sme-council': 'info@africantradechamber.org',
}

type AttachmentRef = {
  id?: number | string
  filename?: string
  url?: string
}

type SubmissionDoc = {
  id: number | string
  formType: FormSubmissionType
  email?: string | null
  subject?: string | null
  jobSlug?: string | null
  payload: Record<string, unknown>
}

function resolveNotifyEmail(formType: FormSubmissionType, data: Record<string, unknown>): string {
  const fromPayload = data.notifyEmail
  if (typeof fromPayload === 'string' && fromPayload.includes('@')) {
    return fromPayload
  }
  const envDefault = process.env.FORM_DEFAULT_NOTIFY_EMAIL
  if (envDefault?.includes('@')) {
    return envDefault
  }
  return FORM_TYPE_DEFAULTS[formType] ?? 'info@africantradechamber.org'
}

function formatFieldValue(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    return value.map(formatFieldValue).filter(Boolean).join(', ')
  }
  if (typeof value === 'object') {
    const obj = value as AttachmentRef
    if (obj.filename) return obj.filename
    return JSON.stringify(value)
  }
  return String(value)
}

function buildEmailBody(doc: SubmissionDoc, adminUrl: string): string {
  const data = doc.payload ?? {}
  const lines: string[] = [
    `New ${doc.formType} form submission`,
    '',
    `Form type: ${doc.formType}`,
  ]

  if (doc.subject) lines.push(`Subject: ${doc.subject}`)
  if (doc.email) lines.push(`Submitter email: ${doc.email}`)
  if (doc.jobSlug) lines.push(`Job slug: ${doc.jobSlug}`)
  lines.push(`Admin: ${adminUrl}`)
  lines.push('')
  lines.push('--- Submission data ---')

  const skipKeys = new Set(['notifyEmail', 'summaryBody'])
  for (const [key, value] of Object.entries(data)) {
    if (skipKeys.has(key)) continue
    if (key === 'companyLogo' && value && typeof value === 'object') {
      const ref = value as AttachmentRef
      lines.push(`Company logo: ${ref.filename ?? ref.url ?? '(uploaded)'}`)
      continue
    }
    if (key === 'supportingDocs' && Array.isArray(value)) {
      const names = value
        .map((item) => (typeof item === 'object' && item ? (item as AttachmentRef).filename : null))
        .filter(Boolean)
      lines.push(`Supporting documents: ${names.length ? names.join(', ') : '(none)'}`)
      continue
    }
    const formatted = formatFieldValue(value)
    if (formatted) lines.push(`${key}: ${formatted}`)
  }

  if (typeof data.summaryBody === 'string' && data.summaryBody.trim()) {
    lines.push('')
    lines.push('--- Summary ---')
    lines.push(data.summaryBody.trim())
  }

  return lines.join('\n')
}

function attachmentPath(filename: string): string {
  return path.join(process.cwd(), 'form-attachments', filename)
}

function collectEmailAttachments(data: Record<string, unknown>): Array<{ filename: string; path: string }> {
  const attachments: Array<{ filename: string; path: string }> = []

  const addRef = (ref: unknown) => {
    if (!ref || typeof ref !== 'object') return
    const { filename } = ref as AttachmentRef
    if (!filename) return
    const filePath = attachmentPath(filename)
    if (fs.existsSync(filePath)) {
      attachments.push({ filename, path: filePath })
    }
  }

  addRef(data.companyLogo)
  if (Array.isArray(data.supportingDocs)) {
    for (const doc of data.supportingDocs) addRef(doc)
  }

  return attachments
}

export async function sendFormSubmissionNotification(
  payload: Payload,
  doc: SubmissionDoc,
): Promise<void> {
  if (!payload.email) {
    console.warn('[form-notification] Email adapter not configured; skipping notification.')
    return
  }

  const data = doc.payload ?? {}
  const to = resolveNotifyEmail(doc.formType, data)
  const serverURL = process.env.PAYLOAD_SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER_URL ?? ''
  const adminUrl = serverURL
    ? `${serverURL.replace(/\/$/, '')}/admin/collections/form-submissions/${doc.id}`
    : `(submission id: ${doc.id})`

  const subject =
    doc.subject?.trim() ||
    `New ${doc.formType} submission${doc.email ? ` from ${doc.email}` : ''}`

  const text = buildEmailBody(doc, adminUrl)
  const fileAttachments = collectEmailAttachments(data)

  await payload.sendEmail({
    to,
    subject,
    text,
    ...(fileAttachments.length > 0
      ? {
          attachments: fileAttachments.map((a) => ({
            filename: a.filename,
            path: a.path,
          })),
        }
      : {}),
  })
}
