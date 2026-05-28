'use client'

import { useState } from 'react'
import { submitForm } from '@/lib/form-submit'

type Props = { financeEmail: string }

const DONOR_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'corporation', label: 'Corporation/Foundation' },
  { value: 'development_partner', label: 'Development Partner/Institution' },
  { value: 'government', label: 'Governmental Organization' },
  { value: 'diaspora', label: 'Diaspora Community' },
]

export function DonateForm({ financeEmail }: Props) {
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
      formType: 'donate',
      email: String(fd.get('donor_email') ?? ''),
      subject: `ATC Donation - ${fd.get('donor_name')}`,
      data: { ...data, notifyEmail: financeEmail },
    })

    setSubmitting(false)
    if (result.ok) {
      setSubmitted(true)
      e.currentTarget.reset()
    } else {
      setError(result.error ?? 'Submission failed')
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[15px] focus:border-[#002740] focus:outline-none focus:ring-2 focus:ring-[#002740]/15'

  return (
    <form
      id="donation-form"
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl rounded-xl border border-[#e7eef9] bg-white p-6 shadow-[0_10px_20px_rgba(2,6,23,0.08)]"
    >
      <h3 className="mb-5 text-xl font-bold text-[#002740]">Make a Donation</h3>
      {submitted ? (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-green-800">Thank you for your donation request. Our team will follow up shortly.</p>
      ) : (
      <>
      {error ? <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
      <div className="space-y-4">
        <div>
          <label htmlFor="donor_name" className="mb-1 block text-sm font-semibold">
            Full Name <span className="text-red-600">*</span>
          </label>
          <input id="donor_name" name="donor_name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="donor_email" className="mb-1 block text-sm font-semibold">
            Email Address <span className="text-red-600">*</span>
          </label>
          <input id="donor_email" name="donor_email" type="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="donor_phone" className="mb-1 block text-sm font-semibold">
            Phone Number
          </label>
          <input id="donor_phone" name="donor_phone" type="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="donor_type" className="mb-1 block text-sm font-semibold">
            I am a:
          </label>
          <select id="donor_type" name="donor_type" className={inputClass}>
            <option value="">Select...</option>
            {DONOR_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="amount" className="mb-1 block text-sm font-semibold">
            Donation Amount (GHS) <span className="text-red-600">*</span>
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="1"
            step="0.01"
            required
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-500">Minimum: GHS 1</p>
        </div>
        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-semibold">
            Message (Optional)
          </label>
          <textarea id="message" name="message" rows={3} className={inputClass} />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full border-2 border-[#002740] bg-[#002740] px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-white hover:text-[#002740] disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Donate Now'}
        </button>
      </div>
      </>
      )}
    </form>
  )
}
