export type FormSubmissionType =
  | 'contact'
  | 'donate'
  | 'volunteer'
  | 'membership'
  | 'service-request'
  | 'newsletter'
  | 'job-application'
  | 'fellowship'
  | 'sme-council'

export type SubmitFormPayload = {
  formType: FormSubmissionType
  email?: string
  subject?: string
  jobSlug?: string
  data: Record<string, unknown>
  _website?: string
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

export function getHoneypotValue(form: HTMLFormElement): string {
  const value = new FormData(form).get('_website')
  return typeof value === 'string' ? value : ''
}
