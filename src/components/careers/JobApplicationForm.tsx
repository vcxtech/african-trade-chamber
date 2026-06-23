'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FormHoneypot } from '@/components/forms/FormHoneypot'
import { getHoneypotValue, submitForm } from '@/lib/form-submit'
import type { CareerJob } from '@/types/career-job'

type Props = {
  job: CareerJob
}

const STEPS = [
  'Applicant Details',
  'My Information',
  'My Experience',
  'Application Questions',
  'Voluntary Disclosures',
  'Self-Identify',
  'Review & Submit',
]

const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#002740] focus:outline-none focus:ring-2 focus:ring-[#002740]/15'

function formDataToObject(fd: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  fd.forEach((value, key) => {
    if (key.endsWith('[]')) {
      const k = key.slice(0, -2)
      const existing = out[k]
      out[k] = Array.isArray(existing) ? [...existing, String(value)] : [String(value)]
    } else {
      out[key] = String(value)
    }
  })
  return out
}

export function JobApplicationForm({ job }: Props) {
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, unknown>>({})

  const saveStep = (fd: FormData) => {
    setFormData((prev) => ({ ...prev, ...formDataToObject(fd) }))
  }

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    saveStep(new FormData(e.currentTarget))
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    saveStep(new FormData(e.currentTarget))
    setSubmitting(true)
    setError(null)

    const merged = { ...formData, ...formDataToObject(new FormData(e.currentTarget)) }
    const email = String(merged.email ?? '')

    const result = await submitForm({
      formType: 'job-application',
      email: email || undefined,
      subject: `Job Application — ${job.title} (${job.jobId})`,
      jobSlug: job.slug,
      _website: getHoneypotValue(e.currentTarget),
      data: {
        jobTitle: job.title,
        jobId: job.jobId,
        ...merged,
      },
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
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <h2 className="text-xl font-bold text-[#002740]">Application submitted</h2>
        <p className="mt-2 text-slate-700">
          Thank you for applying for {job.title}. Our recruitment team will review your application.
        </p>
        <Link href="/careers" className="mt-6 inline-block font-semibold text-[#002740] underline">
          Back to careers
        </Link>
      </div>
    )
  }

  return (
    <div id="atc-job-application-wrapper" className="apply-scope">
      <nav
        id="atc-stepper"
        className="mb-6 rounded-xl border border-[#e7eef9] bg-white p-4 shadow-sm"
        aria-label="Application steps"
      >
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={`rounded-lg px-2 py-2 text-center text-xs font-semibold ${
                i === step
                  ? 'bg-[#002740] text-white'
                  : i < step
                    ? 'bg-[#fbbf24]/20 text-[#002740]'
                    : 'bg-slate-100 text-slate-500'
              }`}
            >
              <span className="block text-[10px] uppercase opacity-80">Step {i + 1}</span>
              {label}
            </li>
          ))}
        </ol>
      </nav>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <form
        onSubmit={step === STEPS.length - 1 ? handleSubmit : handleNext}
        className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:p-8"
      >
        <FormHoneypot />
        <h2 className="section-title mb-6 text-xl font-bold text-[#002740]">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </h2>

        {step === 0 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">No account required. Please provide your contact information.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold">First Name *</label>
                <input name="firstName" required defaultValue={String(formData.firstName ?? '')} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Last Name *</label>
                <input name="lastName" required defaultValue={String(formData.lastName ?? '')} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Email *</label>
                <input name="email" type="email" required defaultValue={String(formData.email ?? '')} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Phone *</label>
                <input name="phone" type="tel" required defaultValue={String(formData.phone ?? '')} className={inputClass} />
              </div>
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input name="consent" type="checkbox" required className="mt-1" />
              <span>
                I acknowledge that I am submitting my information voluntarily and agree to the African Trade
                Chamber&apos;s data-privacy policy.
              </span>
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold">Current Title</label>
                <input name="currentTitle" defaultValue={String(formData.currentTitle ?? '')} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Current Organization</label>
                <input name="currentOrganization" defaultValue={String(formData.currentOrganization ?? '')} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Country of Residence *</label>
                <input name="country" required defaultValue={String(formData.country ?? '')} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">LinkedIn URL</label>
                <input name="linkedin" type="url" defaultValue={String(formData.linkedin ?? '')} className={inputClass} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">Education *</label>
              <textarea name="education" required rows={4} defaultValue={String(formData.education ?? '')} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Work Experience *</label>
              <textarea name="experience" required rows={6} defaultValue={String(formData.experience ?? '')} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Skills & Competencies</label>
              <textarea name="skills" rows={3} defaultValue={String(formData.skills ?? '')} className={inputClass} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Why are you interested in this role at the African Trade Chamber? *
              </label>
              <textarea name="motivation" required rows={5} defaultValue={String(formData.motivation ?? '')} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">
                What motivates you to contribute to African regional trade and private-sector development? *
              </label>
              <textarea name="tradeMotivation" required rows={5} defaultValue={String(formData.tradeMotivation ?? '')} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Additional information (optional)</label>
              <textarea name="additionalInfo" rows={3} defaultValue={String(formData.additionalInfo ?? '')} className={inputClass} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">All fields in this section are optional.</p>
            <div>
              <label className="mb-1 block text-sm font-semibold">How did you hear about this opportunity?</label>
              <input name="referralSource" defaultValue={String(formData.referralSource ?? '')} className={inputClass} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Voluntary self-identification (optional).</p>
            <div>
              <label className="mb-1 block text-sm font-semibold">Gender</label>
              <select name="gender" defaultValue={String(formData.gender ?? '')} className={inputClass}>
                <option value="">Prefer not to say</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Review your application for {job.title} ({job.jobId}).</p>
            <label className="flex items-start gap-2 text-sm">
              <input name="certifyAccurate" type="checkbox" required className="mt-1" />
              <span>I certify that all information provided is accurate and truthful to the best of my knowledge.</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input name="certifyAuthorize" type="checkbox" required className="mt-1" />
              <span>I authorize the African Trade Chamber to contact my references and verify my credentials.</span>
            </label>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-[#002740]"
            >
              Previous
            </button>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[#002740] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#003a5c] disabled:opacity-60"
          >
            {step === STEPS.length - 1 ? (submitting ? 'Submitting…' : 'Submit Application') : 'Next'}
          </button>
        </div>
      </form>
    </div>
  )
}
