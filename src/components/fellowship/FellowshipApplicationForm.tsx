'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FormHoneypot } from '@/components/forms/FormHoneypot'
import { getHoneypotValue, submitForm } from '@/lib/form-submit'

const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#002740] focus:outline-none focus:ring-2 focus:ring-[#002740]/15'

type Props = {
  applicationTitle: string
}

export function FellowshipApplicationForm({ applicationTitle }: Props) {
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
      subject: `${applicationTitle} — Application`,
      _website: getHoneypotValue(e.currentTarget),
      data,
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
          Thank you for applying to the {applicationTitle}. We will review your application and
          contact you.
        </p>
        <Link href="/fellowship" className="mt-4 inline-block font-semibold text-atc-navy underline">
          Back to Fellowship
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <FormHoneypot />
      {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fellowship-fullName" className="mb-1 block text-sm font-semibold">
            Full Name *
          </label>
          <input id="fellowship-fullName" name="fullName" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="fellowship-email" className="mb-1 block text-sm font-semibold">
            Email *
          </label>
          <input id="fellowship-email" name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="fellowship-phone" className="mb-1 block text-sm font-semibold">
            Phone *
          </label>
          <input id="fellowship-phone" name="phone" type="tel" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="fellowship-country" className="mb-1 block text-sm font-semibold">
            Country *
          </label>
          <input id="fellowship-country" name="country" required className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="fellowship-organization" className="mb-1 block text-sm font-semibold">
          Organization / Business *
        </label>
        <input id="fellowship-organization" name="organization" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="fellowship-motivation" className="mb-1 block text-sm font-semibold">
          Why do you want to join the fellowship? *
        </label>
        <textarea id="fellowship-motivation" name="motivation" required rows={5} className={inputClass} />
      </div>
      <div>
        <label htmlFor="fellowship-linkedin" className="mb-1 block text-sm font-semibold">
          LinkedIn or portfolio URL
        </label>
        <input id="fellowship-linkedin" name="linkedin" type="url" className={inputClass} />
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
