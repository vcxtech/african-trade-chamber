'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth, useConfig, useTranslation } from '@payloadcms/ui'
import { formatAdminURL, getSafeRedirect } from 'payload/shared'

const baseClass = 'login__form'

/**
 * Login via JSON POST — production Payload only populates req.data from JSON
 * on /api/users/login. The default Form multipart submit returns 400 in prod.
 */
export function AtcLoginForm({
  prefillEmail,
  prefillPassword,
  searchParams,
}: {
  prefillEmail?: string
  prefillPassword?: string
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { config } = useConfig()
  const {
    admin: {
      routes: { forgot: forgotRoute },
      user: userSlug,
    },
    routes: { admin: adminRoute, api: apiRoute },
  } = config

  const { t } = useTranslation()
  const { setUser } = useAuth()

  const [email, setEmail] = useState(prefillEmail ?? '')
  const [password, setPassword] = useState(prefillPassword ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectTarget = getSafeRedirect({
    fallbackTo: adminRoute,
    redirectTo: searchParams.redirect ?? '',
  })

  const loginUrl = formatAdminURL({
    apiRoute,
    path: `/${userSlug}/login`,
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': typeof navigator !== 'undefined' ? navigator.language : 'en',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      let body: { message?: string; errors?: Array<{ message?: string }> } = {}
      try {
        body = await response.json()
      } catch {
        body = {}
      }

      if (!response.ok) {
        setError(
          body.message ||
            body.errors?.[0]?.message ||
            'The email or password provided is incorrect.',
        )
        setLoading(false)
        return
      }

      setUser(body as Parameters<typeof setUser>[0])
      window.location.assign(redirectTarget)
    } catch {
      setError('Login failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form className={baseClass} onSubmit={handleSubmit}>
      <div className={`${baseClass}__inputWrap`}>
        <div className="field-type email">
          <label className="field-label" htmlFor="atc-login-email">
            {t('general:email')}
            <span className="required">*</span>
          </label>
          <input
            autoComplete="email"
            className="field-input"
            id="atc-login-email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </div>
        <div className="field-type password">
          <label className="field-label" htmlFor="atc-login-password">
            {t('general:password')}
            <span className="required">*</span>
          </label>
          <input
            autoComplete="current-password"
            className="field-input"
            id="atc-login-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </div>
      </div>

      {error ? <p className="atc-login-error">{error}</p> : null}

      <Link
        href={formatAdminURL({
          adminRoute,
          path: forgotRoute,
        })}
        prefetch={false}
      >
        {t('authentication:forgotPasswordQuestion')}
      </Link>

      <button
        className="btn btn--icon-style-without-border btn--size-large btn--style-primary"
        disabled={loading}
        type="submit"
      >
        {loading ? '…' : t('authentication:login')}
      </button>
    </form>
  )
}
