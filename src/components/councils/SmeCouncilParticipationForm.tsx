'use client'

import { useState } from 'react'
import { FormHoneypot } from '@/components/forms/FormHoneypot'
import { getHoneypotValue, submitForm } from '@/lib/form-submit'

const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#002740] focus:outline-none focus:ring-2 focus:ring-[#002740]/15'

export function SmeCouncilParticipationForm() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd.entries()) as Record<string, unknown>
    const orgName = String(fd.get('organizationName') ?? 'Organization')

    const result = await submitForm({
      formType: 'sme-council',
      email: String(fd.get('email') ?? ''),
      subject: `SME Council Participation Request — ${orgName}`,
      _website: getHoneypotValue(e.currentTarget),
      data,
    })

    setSubmitting(false)
    if (result.ok) {
      setSubmitted(true)
      e.currentTarget.reset()
    } else {
      setError(result.error ?? 'Submission failed')
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-green-50 px-4 py-6 text-center">
        <p className="font-semibold text-green-900">Thank you — your request has been received.</p>
        <p className="mt-2 text-sm text-green-800">We will contact you about SME Council participation.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto max-w-xl space-y-4 text-left">
      <FormHoneypot />
      {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="sme-org" className="mb-1 block text-sm font-semibold text-[#002740]">
            Organization name *
          </label>
          <input id="sme-org" name="organizationName" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="sme-contact" className="mb-1 block text-sm font-semibold text-[#002740]">
            Contact name *
          </label>
          <input id="sme-contact" name="contactName" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="sme-email" className="mb-1 block text-sm font-semibold text-[#002740]">
            Email *
          </label>
          <input id="sme-email" name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="sme-phone" className="mb-1 block text-sm font-semibold text-[#002740]">
            Phone
          </label>
          <input id="sme-phone" name="phone" type="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="sme-country" className="mb-1 block text-sm font-semibold text-[#002740]">
            Country *
          </label>
          <input id="sme-country" name="country" required className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="sme-message" className="mb-1 block text-sm font-semibold text-[#002740]">
          Brief message *
        </label>
        <textarea
          id="sme-message"
          name="message"
          required
          rows={4}
          placeholder="Tell us about your business and interest in the SME Council"
          className={`${inputClass} resize-y`}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-[#002740] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#001a2e] disabled:opacity-60 sm:w-auto"
      >
        {submitting ? 'Submitting…' : 'Submit participation request'}
      </button>
    </form>
  )
}
