export type FormSubmissionType =
  | 'contact'
  | 'donate'
  | 'volunteer'
  | 'membership'
  | 'service-request'
  | 'newsletter'
  | 'job-application'
  | 'fellowship'

export type SubmitFormPayload = {
  formType: FormSubmissionType
  email?: string
  subject?: string
  jobSlug?: string
  data: Record<string, unknown>
}

async function parseSubmitResponse(res: Response): Promise<{ ok: boolean; error?: string }> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    return { ok: false, error: body.error ?? 'Submission failed' }
  }
  return { ok: true }
}

export async function submitForm(payload: SubmitFormPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/forms/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return parseSubmitResponse(res)
  } catch {
    return { ok: false, error: 'Network error. Please try again.' }
  }
}

export async function submitFormMultipart(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/forms/submit', {
      method: 'POST',
      body: formData,
    })
    return parseSubmitResponse(res)
  } catch {
    return { ok: false, error: 'Network error. Please try again.' }
  }
}

export const MEMBERSHIP_NOTIFY_EMAIL =
  process.env.NEXT_PUBLIC_MEMBERSHIP_NOTIFY_EMAIL ?? 'info@africantradechamber.org'

export const FELLOWSHIP_NOTIFY_EMAIL =
  process.env.NEXT_PUBLIC_FELLOWSHIP_NOTIFY_EMAIL ?? 'info@africantradechamber.org'

export const CAREERS_NOTIFY_EMAIL =
  process.env.NEXT_PUBLIC_CAREERS_NOTIFY_EMAIL ?? 'info@africantradechamber.org'

export const NEWSLETTER_NOTIFY_EMAIL =
  process.env.NEXT_PUBLIC_NEWSLETTER_NOTIFY_EMAIL ?? 'info@africantradechamber.org'
