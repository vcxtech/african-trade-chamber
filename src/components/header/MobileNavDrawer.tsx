'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { NavChild, NavItem, NavLink } from '@/types/content'

type MobilePanel =
  | { kind: 'root' }
  | { kind: 'children'; title: string; items: NavChild[] }
  | { kind: 'subItems'; title: string; items: NavLink[] }

type Props = {
  open: boolean
  onClose: () => void
  onSearch: () => void
  items: NavItem[]
}

function ChevronRight({ className = '' }: { className?: string }) {
  return (
    <svg className={`h-3 w-3 shrink-0 ${className}`} viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M4 2l4 4-4 4" />
    </svg>
  )
}

function ChevronLeft({ className = '' }: { className?: string }) {
  return (
    <svg className={`h-4 w-4 shrink-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function NavHref({
  href,
  className,
  children,
  onClick,
}: {
  href: string
  className?: string
  children: ReactNode
  onClick?: () => void
}) {
  if (href.startsWith('http')) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}

const rowClass =
  'flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-atc-navy transition hover:bg-atc-navy/5 sm:text-sm'

function DrawerRow({
  label,
  hasChevron,
  onDrill,
  href,
  onNavigate,
}: {
  label: string
  hasChevron?: boolean
  onDrill?: () => void
  href?: string
  onNavigate?: () => void
}) {
  const textClass = 'text-atc-navy'

  if (hasChevron && onDrill) {
    return (
      <li className="border-b border-atc-navy/25">
        <button type="button" className={`${rowClass} ${textClass}`} onClick={onDrill}>
          <span>{label}</span>
          <ChevronRight />
        </button>
      </li>
    )
  }

  if (href) {
    return (
      <li className="border-b border-atc-navy/25">
        <NavHref href={href} className={`${rowClass} ${textClass}`} onClick={onNavigate}>
          <span>{label}</span>
        </NavHref>
      </li>
    )
  }

  return null
}

function MobileNavPanel({
  panel,
  index,
  items,
  onClose,
  onBack,
  onDrillRoot,
  onDrillChild,
  onNavigate,
  onSearch,
}: {
  panel: MobilePanel
  index: number
  items: NavItem[]
  onClose: () => void
  onBack: () => void
  onDrillRoot: (item: NavItem) => void
  onDrillChild: (child: NavChild) => void
  onNavigate: () => void
  onSearch: () => void
}) {
  const isRoot = panel.kind === 'root'
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      className={`fixed right-0 top-0 flex h-full w-1/2 max-w-[50vw] flex-col bg-atc-yellow shadow-[-4px_0_24px_rgba(0,0,0,0.15)] transition-transform duration-200 ease-out lg:hidden ${
        entered ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ zIndex: 101 + index }}
    >
      <div className="flex shrink-0 items-center border-b border-atc-navy/20 px-3 py-3">
        {isRoot ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center text-atc-navy"
            aria-label="Close menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 w-9 items-center justify-center text-atc-navy"
            aria-label="Back"
          >
            <ChevronLeft />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto" aria-label="Main navigation">
        <ul>
          {panel.kind === 'root'
            ? items.map((item) => (
                <DrawerRow
                  key={item.href + item.label}
                  label={item.label}
                  hasChevron={Boolean(item.children?.length)}
                  onDrill={item.children?.length ? () => onDrillRoot(item) : undefined}
                  href={!item.children?.length ? item.href : undefined}
                  onNavigate={onNavigate}
                />
              ))
            : null}

          {panel.kind === 'children' ? (
            <>
              <li className="border-b border-atc-navy/25 bg-atc-navy/10 px-4 py-3.5">
                <span className="text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
                  {panel.title}
                </span>
              </li>
              {panel.items.map((child) => (
                <DrawerRow
                  key={child.href + child.label}
                  label={child.label}
                  hasChevron={Boolean(child.subItems?.length)}
                  onDrill={child.subItems?.length ? () => onDrillChild(child) : undefined}
                  href={!child.subItems?.length ? child.href : undefined}
                  onNavigate={onNavigate}
                />
              ))}
            </>
          ) : null}

          {panel.kind === 'subItems' ? (
            <>
              <li className="border-b border-atc-navy/25 bg-atc-navy/10 px-4 py-3.5">
                <span className="text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
                  {panel.title}
                </span>
              </li>
              {panel.items.map((sub) => (
                <DrawerRow
                  key={sub.href + sub.label}
                  label={sub.label}
                  href={sub.href}
                  onNavigate={onNavigate}
                />
              ))}
            </>
          ) : null}
        </ul>
      </nav>

      {isRoot ? (
        <div className="shrink-0 border-t border-atc-navy/20 p-4">
          <button
            type="button"
            onClick={onSearch}
            className="inline-flex h-10 w-10 items-center justify-center text-atc-navy transition hover:opacity-70"
            aria-label="Search"
          >
            <SearchIcon />
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function MobileNavDrawer({ open, onClose, onSearch, items }: Props) {
  const [stack, setStack] = useState<MobilePanel[]>([{ kind: 'root' }])
  const [visible, setVisible] = useState(false)

  const reset = useCallback(() => {
    setStack([{ kind: 'root' }])
  }, [])

  const handleClose = useCallback(() => {
    onClose()
    reset()
  }, [onClose, reset])

  const handleNavigate = useCallback(() => {
    handleClose()
  }, [handleClose])

  const handleSearch = useCallback(() => {
    onSearch()
    handleClose()
  }, [onSearch, handleClose])

  useEffect(() => {
    if (open) {
      reset()
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
    }
  }, [open, reset])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, handleClose])

  if (!open) return null

  return (
    <div className="lg:hidden" role="dialog" aria-modal="true" aria-label="Main navigation">
      <button
        type="button"
        className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-200 lg:hidden ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Close menu"
        onClick={handleClose}
      />

      {stack.map((panel, index) => (
        <MobileNavPanel
          key={`${panel.kind}-${index}`}
          panel={panel}
          index={index}
          items={items}
          onClose={handleClose}
          onBack={() => setStack((s) => s.slice(0, -1))}
          onDrillRoot={(item) =>
            setStack((s) => [
              ...s,
              { kind: 'children', title: item.label, items: item.children ?? [] },
            ])
          }
          onDrillChild={(child) =>
            setStack((s) => [
              ...s,
              { kind: 'subItems', title: child.label, items: child.subItems ?? [] },
            ])
          }
          onNavigate={handleNavigate}
          onSearch={handleSearch}
        />
      ))}
    </div>
  )
}
