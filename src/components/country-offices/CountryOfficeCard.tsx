import Image from 'next/image'
import Link from 'next/link'
import { HEADER_GRADIENTS } from '@/components/country-offices/country-header-gradients'
import {
  IconBuilding,
  IconComment,
  IconEnvelope,
  IconPhone,
} from '@/components/contact/ContactIcons'
import { getCountryFlagUrl } from '@/lib/country-flag'
import type { CountryOffice, EventStatusType, OfficeStatusType } from '@/types/country-offices'

function ContactTypeIcon({ type }: { type: string }) {
  const className = 'h-4 w-4 shrink-0 text-atc-navy'
  switch (type) {
    case 'location':
      return <IconBuilding className={className} />
    case 'phone':
      return <IconPhone className={className} />
    case 'email':
      return <IconEnvelope className={className} />
    case 'note':
      return <IconComment className={className} />
    default:
      return <span className="w-4 shrink-0 text-center text-xs">•</span>
  }
}

function officeBadgeClass(status: OfficeStatusType): string {
  if (status === 'headquarters' || status === 'active') {
    return 'bg-green-600 text-white'
  }
  return 'bg-[#1e3a5f] text-white'
}

function eventStatusClass(status: EventStatusType): string {
  if (status === 'confirmed') {
    return 'bg-green-500/20 text-green-800'
  }
  if (status === 'development') {
    return 'bg-slate-200 text-slate-700'
  }
  return 'bg-slate-100 text-slate-600'
}

const learnMoreClass =
  'mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#1e3a5f] px-4 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#16324a] hover:shadow-md'

type Props = {
  office: CountryOffice
}

export function CountryOfficeCard({ office }: Props) {
  const flagUrl = getCountryFlagUrl(office.slug)

  return (
    <article
      id={office.slug}
      className="group scroll-mt-24 flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition hover:-translate-y-2 hover:scale-[1.01] hover:border-blue-400/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
    >
      <div
        className={`relative min-h-[120px] overflow-hidden text-white ${HEADER_GRADIENTS[office.headerTheme]}`}
      >
        <div className="absolute left-3 top-3 z-10 overflow-hidden rounded shadow-md ring-1 ring-white/30">
          <Image
            src={flagUrl}
            alt={`${office.countryName} flag`}
            width={40}
            height={28}
            className="block h-7 w-10 object-cover"
            unoptimized
          />
        </div>
        <span
          className={`absolute right-3 top-3 z-10 max-w-[55%] rounded-full px-2.5 py-1 text-center text-[0.65rem] font-bold uppercase leading-tight tracking-wide ${officeBadgeClass(office.officeStatus)}`}
        >
          {office.officeStatusLabel}
        </span>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent)] opacity-0 transition group-hover:opacity-100" />
        <div className="relative flex min-h-[120px] flex-col items-center justify-center px-4 py-8 text-center">
          <h3 className="text-lg font-bold leading-tight drop-shadow-sm">{office.countryName}</h3>
          <p className="mt-1 text-xs font-medium opacity-95">{office.regionLabel}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 text-black">
        <div className="mb-3 rounded-lg bg-slate-50 p-3">
          {office.contacts.map((contact, i) => (
            <p key={i} className="mb-1.5 flex items-start gap-2 text-xs text-slate-700 last:mb-0">
              <span className="mt-0.5">
                <ContactTypeIcon type={contact.type} />
              </span>
              {contact.type === 'email' ? (
                <a href={`mailto:${contact.value}`} className="break-all hover:text-atc-navy hover:underline">
                  {contact.value}
                </a>
              ) : contact.type === 'phone' ? (
                <a href={`tel:${contact.value.replace(/\s/g, '')}`} className="hover:text-atc-navy">
                  {contact.value}
                </a>
              ) : (
                <span>{contact.value}</span>
              )}
            </p>
          ))}
        </div>

        {office.events.map((event, i) => (
          <div
            key={i}
            className="mb-2 rounded-lg border border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100/80 p-2.5 transition hover:-translate-y-px hover:shadow-sm"
          >
            <p className="text-xs font-semibold text-slate-800">{event.title}</p>
            <span
              className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[0.7rem] font-medium ${eventStatusClass(event.status)}`}
            >
              {event.statusLabel}
            </span>
          </div>
        ))}

        {office.learnMoreUrl ? (
          office.learnMoreUrl.startsWith('http') ? (
            <a
              href={office.learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={learnMoreClass}
            >
              Learn More
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ) : (
            <Link href={office.learnMoreUrl} className={learnMoreClass}>
              Learn More
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )
        ) : null}
      </div>
    </article>
  )
}
