'use client'

import { useState } from 'react'
import { AFRICAN_COUNTRIES } from '@/lib/african-countries'
import { submitForm } from '@/lib/form-submit'

const SERVICE_OPTIONS = [
  'Market Entry Support',
  'Trade Facilitation & Expansion',
  'B2B & B2G Matchmaking',
  'Investment Promotion',
  'Policy & Government Engagement',
  'Capacity Building',
] as const

const BUSINESS_TYPES = [
  'Exporter',
  'Investor',
  'Manufacturer',
  'Distributor',
  'Service Provider',
  'Other',
] as const

const BUSINESS_SIZES = [
  'Multinational',
  'Regional Enterprise',
  'National',
  'SME',
  'Startup',
] as const

const REQUEST_EMAIL =
  process.env.NEXT_PUBLIC_SERVICE_REQUEST_EMAIL || 'info@africantradechamber.org'

type FormState = {
  fullName: string
  companyName: string
  email: string
  phone: string
  country: string
  targetCountries: string
  businessNature: string
  industrySector: string
  businessSizeOps: string
  businessRevenue: string
  objectives: string
  services: string[]
}

type FieldErrors = Partial<Record<keyof FormState | 'services', string>>

const initialState: FormState = {
  fullName: '',
  companyName: '',
  email: '',
  phone: '',
  country: '',
  targetCountries: '',
  businessNature: '',
  industrySector: '',
  businessSizeOps: '',
  businessRevenue: '',
  objectives: '',
  services: [],
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhone(phone: string) {
  return /^[+]?[\d\s\-()]{10,}$/.test(phone)
}

type Props = {
  contextLabel: string
  targetCountriesPlaceholder?: string
  phoneHint?: string
}

export function ServicesRequestForm({
  contextLabel,
  targetCountriesPlaceholder = 'e.g., Ghana, Kenya, Nigeria',
  phoneHint = 'Include country code (e.g., +233 for Ghana)',
}: Props) {
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const toggleService = (service: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next.services
      return next
    })
  }

  const validate = (): boolean => {
    const next: FieldErrors = {}

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      next.fullName = 'Please enter your full name (at least 2 characters)'
    }
    if (!form.companyName.trim()) next.companyName = 'Please enter your company name'
    if (!form.email.trim() || !validateEmail(form.email)) {
      next.email = 'Please enter a valid email address'
    }
    if (!form.phone.trim() || !validatePhone(form.phone)) {
      next.phone = 'Please enter a valid phone number with country code'
    }
    if (!form.country) next.country = 'Please select your country'
    if (!form.targetCountries.trim()) next.targetCountries = 'Please specify your target countries'
    if (!form.businessNature) next.businessNature = 'Please select your business type'
    if (!form.industrySector.trim()) next.industrySector = 'Please enter your industry sector'
    if (!form.businessSizeOps) next.businessSizeOps = 'Please select your business size'
    if (!form.objectives.trim() || form.objectives.trim().length < 50) {
      next.objectives = 'Please describe your objectives (minimum 50 characters)'
    }
    if (form.services.length === 0) {
      next.services = 'Please select at least one service'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSuccess(null)

    if (!validate()) {
      setFormError('Please correct the errors above and try again.')
      return
    }

    const result = await submitForm({
      formType: 'service-request',
      email: form.email,
      subject: `New Service Request - ${form.companyName} (${contextLabel})`,
      data: { ...form, contextLabel, notifyEmail: REQUEST_EMAIL },
    })

    if (result.ok) {
      setSuccess(
        'Thank you for your request! Our advisory team will contact you within 3 business days.',
      )
      setForm(initialState)
    } else {
      setFormError(result.error ?? 'Unable to submit your request. Please try again.')
    }
  }

  const fieldClass = (key: keyof FormState) =>
    errors[key]
      ? 'border-red-500 bg-red-50'
      : 'border-slate-200 bg-slate-50 focus:border-amber-400 focus:bg-white'

  return (
    <section
      className="bg-gradient-to-br from-slate-50 to-slate-200 py-12 sm:py-16"
      aria-labelledby="services-form-heading"
    >
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <header className="mb-8 rounded-2xl bg-atc-navy px-6 py-8 text-center text-white shadow-lg">
          <h2 id="services-form-heading" className="text-2xl font-bold">
            Request Our Services
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base opacity-90">
            Connect with our trade experts to unlock opportunities across Africa
          </p>
        </header>

        {success ? (
          <div className="mb-6 rounded-lg bg-green-500 px-5 py-4 text-center font-medium text-white">
            {success}
          </div>
        ) : null}

        {formError ? (
          <div className="mb-6 rounded-lg bg-red-500 px-5 py-4 text-center font-medium text-white">
            {formError}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-lg sm:p-10"
          noValidate
        >
          <fieldset className="mb-8 border-b-2 border-slate-100 pb-8">
            <legend className="mb-5 inline-block border-b-2 border-amber-400 pb-1 text-sm font-bold text-black">
              Contact Information
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-black">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-sm transition ${fieldClass('fullName')}`}
                />
                {errors.fullName ? <p className="mt-1 text-xs text-red-500">{errors.fullName}</p> : null}
              </div>
              <div>
                <label htmlFor="companyName" className="mb-2 block text-sm font-medium text-black">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setField('companyName', e.target.value)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-sm transition ${fieldClass('companyName')}`}
                />
                {errors.companyName ? (
                  <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-black">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-sm transition ${fieldClass('email')}`}
                />
                <p className="mt-1 text-xs italic text-black/70">
                  We&apos;ll use this to send you important updates
                </p>
                {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email}</p> : null}
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-black">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-sm transition ${fieldClass('phone')}`}
                />
                <p className="mt-1 text-xs italic text-black/70">{phoneHint}</p>
                {errors.phone ? <p className="mt-1 text-xs text-red-500">{errors.phone}</p> : null}
              </div>
            </div>
            <div className="mt-5">
              <label htmlFor="country" className="mb-2 block text-sm font-medium text-black">
                Country of Origin <span className="text-red-500">*</span>
              </label>
              <select
                id="country"
                value={form.country}
                onChange={(e) => setField('country', e.target.value)}
                className={`w-full rounded-lg border-2 px-4 py-3 text-sm transition ${fieldClass('country')}`}
              >
                <option value="">Select your country</option>
                {AFRICAN_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.country ? <p className="mt-1 text-xs text-red-500">{errors.country}</p> : null}
            </div>
          </fieldset>

          <fieldset className="mb-8 border-b-2 border-slate-100 pb-8">
            <legend className="mb-5 inline-block border-b-2 border-amber-400 pb-1 text-sm font-bold text-black">
              Your Business & Goals
            </legend>
            <div className="mb-5">
              <label htmlFor="targetCountries" className="mb-2 block text-sm font-medium text-black">
                Target African Country/Countries <span className="text-red-500">*</span>
              </label>
              <input
                id="targetCountries"
                type="text"
                value={form.targetCountries}
                onChange={(e) => setField('targetCountries', e.target.value)}
                placeholder={targetCountriesPlaceholder}
                className={`w-full rounded-lg border-2 px-4 py-3 text-sm transition ${fieldClass('targetCountries')}`}
              />
              <p className="mt-1 text-xs italic text-black/70">
                List the African countries where you want to do business
              </p>
              {errors.targetCountries ? (
                <p className="mt-1 text-xs text-red-500">{errors.targetCountries}</p>
              ) : null}
            </div>
            <div className="mb-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="businessNature" className="mb-2 block text-sm font-medium text-black">
                  Nature of Business <span className="text-red-500">*</span>
                </label>
                <select
                  id="businessNature"
                  value={form.businessNature}
                  onChange={(e) => setField('businessNature', e.target.value)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-sm transition ${fieldClass('businessNature')}`}
                >
                  <option value="">Select business type</option>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.businessNature ? (
                  <p className="mt-1 text-xs text-red-500">{errors.businessNature}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="industrySector" className="mb-2 block text-sm font-medium text-black">
                  Industry Sector <span className="text-red-500">*</span>
                </label>
                <input
                  id="industrySector"
                  type="text"
                  value={form.industrySector}
                  onChange={(e) => setField('industrySector', e.target.value)}
                  placeholder="e.g., Mining, Agriculture, Technology"
                  className={`w-full rounded-lg border-2 px-4 py-3 text-sm transition ${fieldClass('industrySector')}`}
                />
                {errors.industrySector ? (
                  <p className="mt-1 text-xs text-red-500">{errors.industrySector}</p>
                ) : null}
              </div>
            </div>
            <div className="mb-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="businessSizeOps" className="mb-2 block text-sm font-medium text-black">
                  Business Size (Operational Area) <span className="text-red-500">*</span>
                </label>
                <select
                  id="businessSizeOps"
                  value={form.businessSizeOps}
                  onChange={(e) => setField('businessSizeOps', e.target.value)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-sm transition ${fieldClass('businessSizeOps')}`}
                >
                  <option value="">Select operational scope</option>
                  {BUSINESS_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.businessSizeOps ? (
                  <p className="mt-1 text-xs text-red-500">{errors.businessSizeOps}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="businessRevenue" className="mb-2 block text-sm font-medium text-black">
                  Business Size (Annual Revenue)
                </label>
                <input
                  id="businessRevenue"
                  type="text"
                  value={form.businessRevenue}
                  onChange={(e) => setField('businessRevenue', e.target.value)}
                  placeholder="e.g., $1M - $10M"
                  className="w-full rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-amber-400 focus:bg-white"
                />
                <p className="mt-1 text-xs italic text-black/70">Optional — helps us understand your scale</p>
              </div>
            </div>
            <div>
              <label htmlFor="objectives" className="mb-2 block text-sm font-medium text-black">
                Brief Description of Your Objectives <span className="text-red-500">*</span>
              </label>
              <textarea
                id="objectives"
                value={form.objectives}
                onChange={(e) => setField('objectives', e.target.value)}
                placeholder="Describe your business goals and what you hope to achieve through our services..."
                rows={5}
                className={`w-full rounded-lg border-2 px-4 py-3 text-sm transition ${fieldClass('objectives')}`}
              />
              <p className="mt-1 text-xs italic text-black/70">Minimum 50 characters — be specific about your goals</p>
              {errors.objectives ? (
                <p className="mt-1 text-xs text-red-500">{errors.objectives}</p>
              ) : null}
            </div>
          </fieldset>

          <fieldset className="mb-8">
            <legend className="mb-2 inline-block border-b-2 border-amber-400 pb-1 text-sm font-bold text-black">
              Service Interest
            </legend>
            <p className="mb-2 text-sm text-slate-500">Check all services that apply to your needs:</p>
            <p className="mb-4 text-xs italic text-black/70">Select at least one service</p>
            {errors.services ? (
              <p className="mb-3 text-xs text-red-500">{errors.services}</p>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              {SERVICE_OPTIONS.map((service) => {
                const checked = form.services.includes(service)
                return (
                  <label
                    key={service}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 transition ${
                      checked
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-sky-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleService(service)}
                      className="h-4 w-4 shrink-0"
                    />
                    <span className="text-sm text-black">{service}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="text-center">
            <button
              type="submit"
              className="inline-block rounded bg-gradient-to-br from-amber-400 to-amber-500 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-atc-navy shadow-md transition hover:-translate-y-0.5 hover:from-amber-500 hover:to-amber-600 hover:shadow-lg"
            >
              Submit Request
            </button>
            <p className="mt-5 rounded-lg bg-sky-50 px-4 py-3 text-sm italic text-blue-800">
              <strong>Note:</strong> Our advisory team will contact you within 3 business days
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
