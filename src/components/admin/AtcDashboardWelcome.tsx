'use client'

import React from 'react'
import { useAuth } from '@payloadcms/ui'
import {
  hasContentArea,
  type AtcUser,
  type ContentArea,
  type UserRole,
} from '@/lib/payload-access'

const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002').replace(/\/$/, '')

type QuickLink = {
  href: string
  label: string
  external?: boolean
  adminOnly?: boolean
  areas?: ContentArea[]
  write?: boolean
}

const quickLinks: QuickLink[] = [
  { href: '/admin/collections/news/create', label: 'Add news', areas: ['communications'], write: true },
  { href: '/admin/collections/news', label: 'Browse news', areas: ['communications'] },
  { href: '/admin/collections/form-submissions', label: 'Form submissions', areas: ['membership'] },
  {
    href: '/admin/collections/fellowship-cohorts',
    label: 'Fellowship cohorts',
    areas: ['programs'],
    write: true,
  },
  { href: '/admin/globals/site-settings', label: 'Site settings', adminOnly: true },
  { href: '/admin/collections/users', label: 'Manage users', adminOnly: true },
  { href: '/admin/account', label: 'My account' },
  { href: siteUrl, label: 'View live site', external: true },
]

function canSeeLink(user: AtcUser | null | undefined, link: QuickLink): boolean {
  if (!user) return false
  if (link.adminOnly) return user.role === 'admin'
  if (link.areas?.length) {
    const hasArea = link.areas.some((area) => hasContentArea(user, area))
    if (!hasArea) return false
  }
  return true
}

function subtitleForRole(role: UserRole | null | undefined): string {
  switch (role) {
    case 'admin':
      return 'Full access — manage content, forms, settings, and staff accounts.'
    case 'editor':
      return 'Edit content in your assigned areas. Form submissions are view-only; contact an admin to delete records.'
    default:
      return 'African Trade Chamber content admin — jump to common tasks below.'
  }
}

export function AtcDashboardWelcome() {
  const { user } = useAuth<AtcUser>()
  const visibleLinks = quickLinks.filter((link) => canSeeLink(user, link))

  return (
    <section className="atc-dashboard-welcome" aria-labelledby="atc-dashboard-welcome-title">
      <h2 id="atc-dashboard-welcome-title" className="atc-dashboard-welcome__title">
        Welcome back
      </h2>
      <p className="atc-dashboard-welcome__subtitle">{subtitleForRole(user?.role)}</p>
      <div className="atc-dashboard-welcome__grid">
        {visibleLinks.map((link) => (
          <a
            key={link.href}
            className="atc-dashboard-welcome__link"
            href={link.href}
            {...(link.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {link.label}
            {link.external ? ' ↗' : ''}
          </a>
        ))}
      </div>
    </section>
  )
}
