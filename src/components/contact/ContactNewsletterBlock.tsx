'use client'

import { useState } from 'react'
import { submitForm, NEWSLETTER_NOTIFY_EMAIL } from '@/lib/form-submit'

type Props = {
  title: string
  body: string
  submitLabel: string
  successMessage: string
}

export function ContactNewsletterBlock({ title, body, submitLabel, successMessage }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const fd = new FormData(e.currentTarget)

    const result = await submitForm({
      formType: 'newsletter',
      email: String(fd.get('email') ?? ''),
      subject: 'Newsletter signup',
      data: {
        ...(Object.fromEntries(fd.entries()) as Record<string, unknown>),
        notifyEmail: NEWSLETTER_NOTIFY_EMAIL,
      },
    })

    setSubmitting(false)
    if (result.ok) {
      setSubmitted(true)
    } else {
      setError(result.error ?? 'Submission failed')
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#002740] focus:outline-none focus:ring-2 focus:ring-[#002740]/15'

  return (
    <section
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_15px_30px_rgba(0,39,64,0.1)] md:p-8"
      aria-label="Newsletter signup"
    >
      <h2 className="mb-2 text-2xl font-bold text-[#002740]">{title}</h2>
      <p className="mb-6 text-base leading-relaxed text-[#4a4a4a]">{body}</p>

      {submitted ? (
        <p className="rounded-lg bg-[#e8f5e8] px-4 py-3 text-base font-medium text-[#2e7d32]">
          {successMessage}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
          <div>
            <label htmlFor="newsletter-name" className="mb-1 block text-sm font-semibold text-[#002740]">
              Name
            </label>
            <input id="newsletter-name" name="name" type="text" className={inputClass} />
          </div>
          <div>
            <label htmlFor="newsletter-email" className="mb-1 block text-sm font-semibold text-[#002740]">
              Email *
            </label>
            <input id="newsletter-email" name="email" type="email" required className={inputClass} />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[#002740] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#003d5c] disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : submitLabel}
          </button>
        </form>
      )}
    </section>
  )
}
