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

export async function submitForm(payload: SubmitFormPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/forms/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      return { ok: false, error: body.error ?? 'Submission failed' }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Network error. Please try again.' }
  }
}
