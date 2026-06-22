'use client'

import React from 'react'
import { useAuth } from '@payloadcms/ui'
import {
  contentAreasLabel,
  roleLabel,
  type AtcUser,
  type UserRole,
} from '@/lib/payload-access'

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002'

function rolePillClass(role: UserRole | null | undefined): string {
  switch (role) {
    case 'admin':
      return 'atc-admin-top-bar__pill atc-admin-top-bar__pill--admin'
    case 'editor':
    default:
      return 'atc-admin-top-bar__pill atc-admin-top-bar__pill--editor'
  }
}

export function AtcAdminTopBar() {
  const { user } = useAuth<AtcUser>()
  const displayName =
    (typeof user?.displayName === 'string' && user.displayName.trim()) ||
    user?.email ||
    'User'
  const role = roleLabel(user?.role)
  const restrictedAreas =
    user?.role &&
    user.role !== 'admin' &&
    user.contentAreas &&
    user.contentAreas.length > 0
      ? contentAreasLabel(user.contentAreas)
      : null

  return (
    <div className="atc-admin-top-bar" role="banner">
      <div className="atc-admin-top-bar__utility">
        <span className="atc-admin-top-bar__brand">African Trade Chamber — Content Admin</span>
        <div className="atc-admin-top-bar__right">
          {user ? (
            <div className="atc-admin-top-bar__pills">
              <span className="atc-admin-top-bar__pill atc-admin-top-bar__pill--name">
                {displayName}
              </span>
              <span className={rolePillClass(user.role)}>{role}</span>
              {restrictedAreas ? (
                <span className="atc-admin-top-bar__pill atc-admin-top-bar__pill--areas">
                  {restrictedAreas}
                </span>
              ) : null}
            </div>
          ) : null}
          <a
            className="atc-admin-top-bar__utility-link"
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open website ↗
          </a>
        </div>
      </div>
    </div>
  )
}
