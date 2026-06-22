'use client'

import Link from 'next/link'
import { useState } from 'react'
import { submitForm, FELLOWSHIP_NOTIFY_EMAIL } from '@/lib/form-submit'

const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#002740] focus:outline-none focus:ring-2 focus:ring-[#002740]/15'

export function FellowshipApplicationForm() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd.entries()) as Record<string, unknown>

    const result = await submitForm({
      formType: 'fellowship',
      email: String(fd.get('email') ?? ''),
      subject: '2026 Future Trade Leaders Fellowship Application',
      data: { ...data, notifyEmail: FELLOWSHIP_NOTIFY_EMAIL },
    })

    setSubmitting(false)
    if (result.ok) {
      setSubmitted(true)
    } else {
      setError(result.error ?? 'Submission failed')
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8">
        <h2 className="text-xl font-bold text-atc-navy">Application received</h2>
        <p className="mt-2 text-atc-navy/80">
          Thank you for applying to the 2026 Future Trade Leaders Fellowship. We will review your
          application and contact you.
        </p>
        <Link href="/fellowship" className="mt-4 inline-block font-semibold text-atc-navy underline">
          Back to Fellowship
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold">Full Name *</label>
          <input name="fullName" required className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Email *</label>
          <input name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Phone *</label>
          <input name="phone" type="tel" required className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Country *</label>
          <input name="country" required className={inputClass} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">Organization / Business *</label>
        <input name="organization" required className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">Why do you want to join the fellowship? *</label>
        <textarea name="motivation" required rows={5} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">LinkedIn or portfolio URL</label>
        <input name="linkedin" type="url" className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="atc-cta inline-flex disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : 'Submit Application'}
      </button>
    </form>
  )
}
