'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FORM_STEPS } from '@/lib/membership-apply-data'
import {
  Step1Organization,
  Step2Contact,
  Step3MembershipGoals,
  Step4Capabilities,
  Step5Councils,
  Step6Final,
  Step7Success,
} from '@/components/membership/apply/MembershipApplyFormFields'
import { buildMailtoBody, validateFormStep } from '@/components/membership/apply/membership-apply-form-utils'
import { submitFormMultipart, MEMBERSHIP_NOTIFY_EMAIL } from '@/lib/form-submit'

const TOTAL_STEPS = 6
const NAVY = '#002740'

export function MembershipApplicationForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [confirmEmail, setConfirmEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const progressPercent = submitted ? 100 : (currentStep / TOTAL_STEPS) * 100
  const currentStepMeta = FORM_STEPS[currentStep - 1]

  const showStep = useCallback((step: number) => {
    const form = formRef.current
    if (!form) return
    form.querySelectorAll('.step-content').forEach((el) => el.classList.remove('active'))
    form.querySelector(`.step-content[data-step="${step}"]`)?.classList.add('active')
    setCurrentStep(step)
    setSubmitted(step === 7)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const dateField = formRef.current?.querySelector<HTMLInputElement>('#signatureDate')
    if (dateField && !dateField.value) dateField.value = today
  }, [])

  useEffect(() => {
    const form = formRef.current
    if (!form) return

    const onFileChange = (e: Event) => {
      const input = e.target as HTMLInputElement
      const label = input.nextElementSibling as HTMLElement | null
      if (!label?.classList.contains('file-label')) return
      const count = input.files?.length ?? 0
      if (count > 0) {
        label.textContent =
          count === 1 ? `📁 ${input.files![0].name}` : `📁 ${count} files selected`
        label.style.background = '#f8fafc'
        label.style.borderColor = NAVY
      }
    }

    form.querySelectorAll('.file-input').forEach((input) => {
      input.addEventListener('change', onFileChange)
    })

    const businessDesc = form.querySelector<HTMLTextAreaElement>('#businessDescription')
    const counter = form.querySelector<HTMLElement>('#businessDescCounter')
    const onDescInput = () => {
      if (!businessDesc || !counter) return
      const remaining = 750 - businessDesc.value.length
      counter.textContent = `${remaining} characters remaining`
      counter.style.color = remaining < 50 ? '#dc2626' : '#64748b'
    }
    businessDesc?.addEventListener('input', onDescInput)
    onDescInput()

    const onBlur = (e: Event) => {
      const field = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      if (!field.matches('input, select, textarea')) return
      const errorMsg = field.parentElement?.querySelector<HTMLElement>('.error-message')
      if (field.hasAttribute('required') && !field.value.trim() && field.type !== 'radio') {
        field.classList.add('input-error')
        if (errorMsg) errorMsg.style.display = 'block'
      } else if (field.type !== 'radio') {
        field.classList.remove('input-error')
        if (errorMsg) errorMsg.style.display = 'none'
      }
    }
    form.addEventListener('blur', onBlur, true)

    return () => {
      form.querySelectorAll('.file-input').forEach((input) => {
        input.removeEventListener('change', onFileChange)
      })
      businessDesc?.removeEventListener('input', onDescInput)
      form.removeEventListener('blur', onBlur, true)
    }
  }, [])

  const handleNext = () => {
    const form = formRef.current
    if (!form || !validateFormStep(form, currentStep)) return
    if (currentStep < TOTAL_STEPS) showStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) showStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = formRef.current
    if (!form || !validateFormStep(form, currentStep)) return

    const email = (form.querySelector('#email') as HTMLInputElement)?.value ?? ''
    setConfirmEmail(email)

    const orgName = (form.querySelector('#orgName') as HTMLInputElement)?.value ?? 'Application'
    const body = buildMailtoBody(form)

    setSubmitting(true)
    setError(null)

    const fd = new FormData(form)
    fd.set('formType', 'membership')
    fd.set('email', email)
    fd.set('subject', `ATC Membership Application - ${orgName}`)
    fd.set(
      'data',
      JSON.stringify({
        summaryBody: body,
        notifyEmail: MEMBERSHIP_NOTIFY_EMAIL,
      }),
    )

    const result = await submitFormMultipart(fd)

    setSubmitting(false)
    if (result.ok) {
      setSubmitted(true)
      showStep(7)
    } else {
      setError(result.error ?? 'Submission failed. Please try again.')
    }
  }

  return (
    <>
      {!submitted && (
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-5 sm:px-8 sm:py-6">
          <div className="mb-4 flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-[#002740]">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span className="text-slate-500">{Math.round(progressPercent)}% complete</span>
          </div>
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[#002740] transition-[width] duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="mb-4 text-base font-semibold text-[#0b1320] md:hidden">
            {currentStepMeta?.title}
          </p>

          <div className="hidden gap-1 md:grid md:grid-cols-6">
            {FORM_STEPS.map((step) => {
              const n = step.number
              const isActive = n === currentStep
              const isCompleted = n < currentStep
              return (
                <div key={n} className="flex flex-col items-center gap-1.5 px-0.5">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#002740] text-white ring-4 ring-[#002740]/15'
                        : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white text-slate-400 ring-1 ring-slate-200'
                    }`}
                  >
                    {isCompleted ? '✓' : n}
                  </div>
                  <span
                    className={`line-clamp-2 text-center text-[11px] font-medium leading-tight ${
                      isActive ? 'text-[#002740]' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <form ref={formRef} id="membershipForm" onSubmit={handleSubmit}>
        <div className="px-5 py-6 sm:px-8 sm:py-8 [&_.input-error]:!border-red-500 [&_.input-error]:!ring-red-500/20">
          <Step1Organization />
          <Step2Contact />
          <Step3MembershipGoals />
          <Step4Capabilities />
          <Step5Councils />
          <Step6Final />
          {submitted && <Step7Success email={confirmEmail} />}
        </div>

        {!submitted && (
          <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-8 sm:py-5">
            {error ? (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
            ) : null}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-[#002740]/30 hover:text-[#002740] disabled:invisible disabled:pointer-events-none"
            >
              ← Previous
            </button>
            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-[#002740] px-8 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#001a2e] sm:ml-auto"
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-[#e6b14a] px-8 py-2.5 text-sm font-bold text-[#002740] shadow-md transition-colors hover:bg-[#d4a043] disabled:opacity-60 sm:ml-auto"
              >
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            )}
            </div>
          </div>
        )}
      </form>
    </>
  )
}
