'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import type { SiteSettingsData } from '@/types/content'

type Props = {
  settings: Pick<
    SiteSettingsData,
    | 'fellowshipPopupEnabled'
    | 'fellowshipPopupTitle'
    | 'fellowshipPopupBody'
    | 'fellowshipPopupDeadline'
    | 'fellowshipPopupApplyUrl'
  >
}

function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('233') && digits.length >= 12) {
    return `+233 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`
  }
  return phone
}

function popupKicker(title: string): string {
  const firstLine = title.split('\n')[0]?.trim()
  if (!firstLine) return 'Call for Applications'
  const words = firstLine.split(/\s+/)
  return words.length > 6 ? 'Call for Applications' : firstLine
}

export function FellowshipPopup({ settings }: Props) {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => {
    setOpen(false)
    document.body.style.overflow = ''
  }, [])

  useEffect(() => {
    if (!settings.fellowshipPopupEnabled) return
    const t = setTimeout(() => setOpen(true), 900)
    return () => clearTimeout(t)
  }, [settings.fellowshipPopupEnabled])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close])

  if (!settings.fellowshipPopupEnabled) return null

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close dialog backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99998] cursor-default border-0 bg-[radial-gradient(circle_at_15%_15%,rgba(245,197,24,0.12),transparent_45%),rgba(2,23,38,0.74)] backdrop-blur-[3px]"
            onClick={close}
          />

          <div className="pointer-events-none fixed inset-0 z-[99999] flex items-center justify-center p-2">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="fellowship-popup-title"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="pointer-events-auto w-[min(92vw,620px)] overflow-hidden rounded-[22px] shadow-[0_26px_70px_rgba(2,6,23,0.35)] max-[520px]:w-[calc(100vw-18px)] max-[520px]:rounded-[18px]"
              style={{ fontFamily: 'var(--font-poppins), Poppins, system-ui, sans-serif' }}
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="relative rounded-t-[22px] bg-gradient-to-br from-[#002740] via-[#003a5c] to-[#002740] px-6 pb-[22px] pr-14 pt-[22px] max-[520px]:rounded-t-[18px] max-[520px]:px-[18px] max-[520px]:pr-[52px]">
              <div
                className="pointer-events-none absolute bottom-0 left-6 right-6 h-[3px] rounded-sm bg-gradient-to-r from-[#f5c518] via-[#f9de7b] to-[#f5c518] max-[520px]:left-[18px] max-[520px]:right-[18px]"
                aria-hidden
              />
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.19em] text-[#dbeafe]">
                {popupKicker(settings.fellowshipPopupTitle ?? '')}
              </p>
              <h2
                id="fellowship-popup-title"
                className="max-w-[11ch] text-[clamp(30px,3.5vw,42px)] font-extrabold leading-[1.06] tracking-tight text-white max-[520px]:max-w-full max-[520px]:text-[clamp(26px,10.5vw,38px)]"
              >
                {settings.fellowshipPopupTitle}
              </h2>
              <button
                type="button"
                onClick={close}
                className="absolute right-3 top-3 flex h-9 w-9 min-h-9 min-w-9 items-center justify-center rounded-full border-0 bg-white/15 p-0 text-[28px] font-bold leading-none text-white transition hover:bg-white/30 hover:rotate-90"
                aria-label="Close popup"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="rounded-b-[22px] bg-white px-6 pb-[22px] pt-6 text-[#0f172a] max-[520px]:rounded-b-[18px] max-[520px]:p-[18px]">
              {settings.fellowshipPopupBody ? (
                <p className="mb-3 text-base font-normal leading-[1.72] text-[#475569] max-[520px]:text-[15px]">
                  {settings.fellowshipPopupBody}
                </p>
              ) : null}

              {settings.fellowshipPopupDeadline ? (
                <div className="mt-1.5 inline-flex items-center gap-2.5 rounded-full border border-[#f6e8ad] bg-[#fff8dd] px-3.5 py-2 text-sm font-bold text-[#6b5200]">
                  <strong>Deadline:</strong> {settings.fellowshipPopupDeadline}
                </div>
              ) : null}

              <div className="mt-[18px] flex flex-wrap gap-2.5 max-[520px]:flex-col">
                {settings.fellowshipPopupApplyUrl ? (
                  <Link
                    href={settings.fellowshipPopupApplyUrl}
                    className="inline-flex items-center justify-center rounded-xl bg-[#002740] px-[22px] py-3 text-[15px] font-bold leading-tight text-white no-underline shadow-[0_10px_24px_rgba(0,39,64,0.26)] transition hover:-translate-y-px hover:bg-[#003a5c] hover:shadow-[0_14px_28px_rgba(0,39,64,0.3)] max-[520px]:w-full"
                    onClick={close}
                  >
                    Apply Now
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex items-center justify-center rounded-xl border-0 bg-[#f8fafc] px-[18px] py-3 text-sm font-semibold leading-tight text-[#1e293b] transition hover:bg-[#eef2f7] max-[520px]:w-full"
                >
                  Maybe later
                </button>
              </div>
            </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
