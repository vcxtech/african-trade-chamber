'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SiteSearchModal } from '@/components/search/SiteSearchModal'
import { MobileNavDrawer } from '@/components/header/MobileNavDrawer'
import { SiteLogo } from '@/components/SiteLogo'
import { SocialIcons } from '@/components/SocialIcons'
import type { NavChild, NavItem, NavLink, SiteSettingsData, SocialLink } from '@/types/content'

type Props = {
  settings: Pick<
    SiteSettingsData,
    'siteName' | 'utilityBarLinks' | 'socialLinks' | 'headerNav'
  >
}

const dropdownPanelClass =
  'bg-[#eceef1] py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]'
const dropdownLinkClass =
  'block px-5 py-3 text-sm font-medium leading-snug text-atc-navy transition hover:bg-white/70'

function ChevronDown({ className = '' }: { className?: string }) {
  return (
    <svg className={`h-2.5 w-2.5 shrink-0 ${className}`} viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M2 4l4 4 4-4" />
    </svg>
  )
}

function ChevronRight({ className = '' }: { className?: string }) {
  return (
    <svg className={`h-3 w-3 shrink-0 ${className}`} viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M4 2l4 4-4 4" />
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

export function Header({ settings }: Props) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const utilityLinks = settings.utilityBarLinks?.length ? settings.utilityBarLinks : []
  const socialLinks = settings.socialLinks?.length ? settings.socialLinks : []

  const closeMobile = () => setMobileOpen(false)
  const openSearch = () => {
    setMobileOpen(false)
    setSearchOpen(true)
  }

  useEffect(() => {
    if (!openDropdown) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openDropdown])

  return (
    <>
      <SiteSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <div className="hidden bg-atc-yellow text-atc-navy lg:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-end gap-x-1 gap-y-1 px-3 py-2 text-xs sm:gap-x-3 sm:px-6 sm:text-[13px]">
          <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1" aria-label="Utility">
            {utilityLinks.map((link) => (
              <UtilityLink key={link.href + link.label} link={link} pathname={pathname} />
            ))}
          </nav>
          <SocialIcons links={socialLinks} className="ml-1 sm:ml-2" />
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-atc-navy text-atc-yellow shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-6 lg:py-3.5">
          <SiteLogo priority heightClass="h-9 sm:h-10 md:h-11" />

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {settings.headerNav.map((item) => (
              <NavDesktopItem
                key={item.href + item.label}
                item={item}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openSearch}
              className="hidden p-2 text-white transition hover:text-atc-yellow lg:inline-flex"
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            <button
              type="button"
              onClick={openSearch}
              className="inline-flex h-10 w-10 items-center justify-center text-atc-yellow lg:hidden"
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded border border-atc-yellow/40 text-atc-yellow lg:hidden"
              aria-expanded={mobileOpen}
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileNavDrawer
        open={mobileOpen}
        onClose={closeMobile}
        onSearch={openSearch}
        items={settings.headerNav}
        utilityLinks={utilityLinks}
      />
    </>
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
  children: React.ReactNode
  onClick?: () => void
}) {
  if (href.startsWith('http')) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
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

function isUtilityLinkActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function UtilityLink({ link, pathname }: { link: NavLink; pathname: string }) {
  const isActive = isUtilityLinkActive(link.href, pathname)

  return (
    <Link
      href={link.href}
      className={`whitespace-nowrap font-medium transition hover:opacity-80 ${
        isActive ? 'font-semibold text-white' : 'text-atc-navy/90'
      }`}
    >
      {link.label}
    </Link>
  )
}

function NavDesktopItem({
  item,
  openDropdown,
  setOpenDropdown,
}: {
  item: NavItem
  openDropdown: string | null
  setOpenDropdown: (v: string | null) => void
}) {
  const key = item.label
  const hasChildren = Boolean(item.children?.length)
  const isOpen = openDropdown === key

  const linkClass = `flex items-center gap-1 px-2.5 py-2 text-sm font-semibold transition lg:px-3 ${
    isOpen ? 'text-white' : 'text-atc-yellow hover:text-white'
  }`

  if (!hasChildren) {
    return (
      <Link href={item.href} className={linkClass}>
        {item.label}
      </Link>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpenDropdown(key)}
      onMouseLeave={() => setOpenDropdown(null)}
    >
      <Link
        href={item.href}
        className={linkClass}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={(e) => {
          e.preventDefault()
          setOpenDropdown(isOpen ? null : key)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpenDropdown(isOpen ? null : key)
          }
        }}
      >
        {item.label}
        <ChevronDown className={isOpen ? 'text-white' : 'text-atc-yellow'} />
      </Link>
      {isOpen ? (
        <div
          className={`absolute left-0 top-full z-50 min-w-[300px] ${dropdownPanelClass}`}
        >
          {item.children!.map((child) => (
            <NavDesktopChild key={child.href + child.label} child={child} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function NavDesktopChild({ child }: { child: NavChild }) {
  const [flyoutOpen, setFlyoutOpen] = useState(false)
  const hasFlyout = Boolean(child.subItems?.length)
  const flyoutLeft = child.flyout === 'left'

  if (!hasFlyout) {
    return (
      <NavHref href={child.href} className={dropdownLinkClass}>
        {child.label}
      </NavHref>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setFlyoutOpen(true)}
      onMouseLeave={() => setFlyoutOpen(false)}
    >
      <Link
        href={child.href}
        className={`${dropdownLinkClass} flex items-center justify-between gap-3 pr-4`}
        aria-expanded={flyoutOpen}
        aria-haspopup="true"
        onClick={(e) => {
          e.preventDefault()
          setFlyoutOpen((open) => !open)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setFlyoutOpen((open) => !open)
          }
          if (e.key === 'Escape') setFlyoutOpen(false)
        }}
      >
        <span>{child.label}</span>
        <ChevronRight />
      </Link>
      {flyoutOpen ? (
        <div
          className={`absolute top-0 z-[60] min-w-[280px] ${dropdownPanelClass} ${
            flyoutLeft ? 'right-full' : 'left-full'
          }`}
        >
          {child.subItems!.map((sub) => (
            <Link key={sub.href + sub.label} href={sub.href} className={dropdownLinkClass}>
              {sub.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}
