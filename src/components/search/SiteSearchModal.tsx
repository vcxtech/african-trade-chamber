'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { SEARCH_MIN_QUERY_LENGTH } from '@/types/site-search'

type Props = {
  open: boolean
  onClose: () => void
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

export function SiteSearchModal({ open, onClose }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) return
    setQuery('')
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50)
    document.body.style.overflow = 'hidden'
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const submit = () => {
    const q = query.trim()
    if (q.length < SEARCH_MIN_QUERY_LENGTH) return
    onClose()
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close search"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-search-title"
        className="relative z-10 w-full max-w-xl rounded-xl bg-[#002740] p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="site-search-title" className="text-lg font-bold text-white">
            Search
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-white/80 transition hover:text-white"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
          className="flex gap-2"
        >
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#e6b14a]">
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the site…"
              className="w-full rounded-lg border border-white/20 bg-white py-3 pl-10 pr-3 text-sm text-[#002740] placeholder:text-slate-400 focus:border-[#fbbf24] focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/30"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={query.trim().length < SEARCH_MIN_QUERY_LENGTH}
            className="shrink-0 rounded-lg bg-[#fbbf24] px-5 py-3 text-sm font-semibold text-[#002740] transition hover:bg-[#f59e0b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Search
          </button>
        </form>
        <p className="mt-3 text-xs text-white/70">
          Search pages, news, insights, and careers. Enter at least {SEARCH_MIN_QUERY_LENGTH} characters.
        </p>
      </div>
    </div>
  )
}
