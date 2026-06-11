'use client'

import React from 'react'
import type { UserWithToken } from '@payloadcms/ui'
import type { FormState } from 'payload'
import {
  EmailField,
  Form,
  FormSubmit,
  Link,
  PasswordField,
  useAuth,
  useConfig,
  useTranslation,
} from '@payloadcms/ui'
import { formatAdminURL, getSafeRedirect } from 'payload/shared'

const baseClass = 'login__form'

/**
 * Payload's default login form uses client-side router.push after success.
 * Behind Coolify/Next.js that can reload /admin before the auth cookie is
 * visible to the server. A full navigation fixes the session hand-off.
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

  const initialState: FormState = {
    email: {
      initialValue: prefillEmail ?? undefined,
      valid: true,
      value: prefillEmail ?? undefined,
    },
    password: {
      initialValue: prefillPassword ?? undefined,
      valid: true,
      value: prefillPassword ?? undefined,
    },
  }

  const redirectTarget = getSafeRedirect({
    fallbackTo: adminRoute,
    redirectTo: searchParams.redirect ?? '',
  })

  const handleLogin = (data: UserWithToken) => {
    setUser(data)
    window.location.assign(redirectTarget)
  }

  return (
    <Form
      action={formatAdminURL({
        apiRoute,
        path: `/${userSlug}/login`,
      })}
      className={baseClass}
      disableSuccessStatus
      initialState={initialState}
      method="POST"
      onSuccess={handleLogin as never}
      waitForAutocomplete
    >
      <div className={`${baseClass}__inputWrap`}>
        <EmailField
          field={{
            name: 'email',
            label: t('general:email'),
            required: true,
          }}
          path="email"
        />
        <PasswordField
          field={{
            name: 'password',
            label: t('general:password'),
            required: true,
          }}
          path="password"
        />
      </div>
      <Link
        href={formatAdminURL({
          adminRoute,
          path: forgotRoute,
        })}
        prefetch={false}
      >
        {t('authentication:forgotPasswordQuestion')}
      </Link>
      <FormSubmit size="large">{t('authentication:login')}</FormSubmit>
    </Form>
  )
}
