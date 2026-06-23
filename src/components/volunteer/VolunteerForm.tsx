'use client'

import { useState } from 'react'
import { AFRICAN_COUNTRIES } from '@/lib/membership-apply-data'
import { FormHoneypot } from '@/components/forms/FormHoneypot'
import { getHoneypotValue, submitForm } from '@/lib/form-submit'

const ROLE_OPTIONS = [
  'Event Support',
  'Research & Policy',
  'Media & Communications',
  'Translation & Interpretation',
  'Administrative/Program Support',
]

type Props = { formEmail: string; submitLabel: string }

export function VolunteerForm({ formEmail, submitLabel }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd.entries()) as Record<string, unknown>
    data.roles = fd.getAll('roles').map(String)

    const result = await submitForm({
      formType: 'volunteer',
      email: String(fd.get('email') ?? ''),
      subject: `ATC Volunteer Application - ${fd.get('fullName')}`,
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

  const inputClass =
    'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#002740] focus:outline-none focus:ring-2 focus:ring-[#002740]/15'

  return (
    <>
    {submitted ? (
      <p className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-800">
        Thank you for your volunteer application. We will be in touch.
      </p>
    ) : (
    <form onSubmit={handleSubmit} className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <FormHoneypot />
      {error ? <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
      <h3 className="mb-2 text-lg font-bold text-[#002740]">Personal Information</h3>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="volunteer-fullName" className="mb-1 block text-sm font-semibold">
            Full Name *
          </label>
          <input id="volunteer-fullName" name="fullName" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="volunteer-email" className="mb-1 block text-sm font-semibold">
            Email *
          </label>
          <input id="volunteer-email" name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="volunteer-phone" className="mb-1 block text-sm font-semibold">
            Phone
          </label>
          <input id="volunteer-phone" name="phone" type="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="volunteer-country" className="mb-1 block text-sm font-semibold">
            Country of Residence *
          </label>
          <select id="volunteer-country" name="country" required className={inputClass}>
            <option value="">Select country</option>
            {AFRICAN_COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="volunteer-status" className="mb-1 block text-sm font-semibold">
            Occupation/Status *
          </label>
          <select id="volunteer-status" name="status" required className={inputClass}>
            <option value="">Select</option>
            <option>Student</option>
            <option>Graduate</option>
            <option>Employed</option>
            <option>Self-employed</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="volunteer-expertise" className="mb-1 block text-sm font-semibold">
            Area(s) of Expertise
          </label>
          <input id="volunteer-expertise" name="expertise" className={inputClass} />
        </div>
      </div>

      <h3 className="mb-2 text-lg font-bold text-[#002740]">Volunteer Interest</h3>
      <p className="mb-2 text-sm font-medium">Preferred Volunteer Role(s):</p>
      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        {ROLE_OPTIONS.map((role) => (
          <label key={role} className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="roles" value={role} className="accent-[#002740]" />
            {role}
          </label>
        ))}
      </div>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="volunteer-availability" className="mb-1 block text-sm font-semibold">
            Hours per week
          </label>
          <input id="volunteer-availability" name="availability" type="number" min={1} max={40} className={inputClass} />
        </div>
        <div>
          <label htmlFor="volunteer-duration" className="mb-1 block text-sm font-semibold">
            Preferred Duration
          </label>
          <select id="volunteer-duration" name="duration" className={inputClass}>
            <option value="">Select duration</option>
            <option>1 month</option>
            <option>2-3 months</option>
            <option>Project-based</option>
            <option>Ongoing</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="volunteer-motivation" className="mb-1 block text-sm font-semibold">
          Motivation Statement *
        </label>
        <textarea id="volunteer-motivation" name="motivation" required maxLength={750} rows={4} className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-[#002740] px-6 py-3 font-bold text-white hover:bg-[#001a2e] disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : submitLabel}
      </button>
    </form>
    )}
    </>
  )
}
