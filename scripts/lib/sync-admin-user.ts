import type { Payload } from 'payload'
import { describeSecretEnv, sanitizeEnvValue, warnIfPasswordHasExtraSuffix } from './sanitize-env.js'

type SyncAdminUserArgs = {
  email: string
  password: string
  payload: Payload
}

function normalizeCredentials(email: string, password: string) {
  const normalizedEmail = sanitizeEnvValue(email).toLowerCase()
  const normalizedPassword = sanitizeEnvValue(password)
  return { normalizedEmail, normalizedPassword }
}

async function findUserByEmail(payload: Payload, email: string) {
  const normalized = sanitizeEnvValue(email).toLowerCase()
  const result = await payload.find({
    collection: 'users',
    where: { email: { equals: normalized } },
    limit: 1,
    overrideAccess: true,
    showHiddenFields: true,
  })
  return result.docs[0] ?? null
}

async function upsertAdminUser(payload: Payload, email: string, password: string) {
  const normalized = sanitizeEnvValue(email).toLowerCase()
  const cleanPassword = sanitizeEnvValue(password)
  const existing = await findUserByEmail(payload, normalized)

  if (existing) {
    await payload.update({
      collection: 'users',
      id: existing.id,
      data: {
        email: normalized,
        password: cleanPassword,
        role: 'admin',
        loginAttempts: 0,
        lockUntil: null,
      },
      overrideAccess: true,
      showHiddenFields: true,
    })
    return 'updated' as const
  }

  await payload.create({
    collection: 'users',
    data: { email: normalized, password: cleanPassword, role: 'admin' },
    overrideAccess: true,
  })
  return 'created' as const
}

async function verifyLogin(payload: Payload, email: string, password: string) {
  const login = await payload.login({
    collection: 'users',
    data: {
      email: sanitizeEnvValue(email).toLowerCase(),
      password: sanitizeEnvValue(password),
    },
  })
  return Boolean(login.token)
}

/**
 * Create or reset the admin user, unlock the account, and verify login works.
 * Throws if credentials in env cannot authenticate after sync.
 */
export async function syncAdminUser({ email, password, payload }: SyncAdminUserArgs) {
  const { normalizedEmail, normalizedPassword } = normalizeCredentials(email, password)
  console.log(describeSecretEnv('SEED_ADMIN_PASSWORD', normalizedPassword))
  warnIfPasswordHasExtraSuffix(normalizedPassword, 'AtcAdmin2026Secure')
  const rawPasswordLen = password.length
  if (rawPasswordLen !== normalizedPassword.length) {
    console.warn(
      `SEED_ADMIN_PASSWORD was ${rawPasswordLen} chars before sanitization, ${normalizedPassword.length} after (removed quotes/spaces). Use ${normalizedPassword.length} chars when logging in.`,
    )
  }
  const action = await upsertAdminUser(payload, normalizedEmail, normalizedPassword)

  try {
    const ok = await verifyLogin(payload, normalizedEmail, normalizedPassword)
    if (ok) {
      console.log(
        `${action === 'created' ? 'Created' : 'Updated'} admin user: ${normalizedEmail} (login verified, password length ${normalizedPassword.length})`,
      )
      return
    }
  } catch {
    // fall through to recreate
  }

  console.warn(`Admin login failed after ${action}; recreating user...`)
  const existing = await findUserByEmail(payload, normalizedEmail)
  if (existing) {
    await payload.delete({
      collection: 'users',
      id: existing.id,
      overrideAccess: true,
    })
  }

  await payload.create({
    collection: 'users',
    data: { email: normalizedEmail, password: normalizedPassword, role: 'admin' },
    overrideAccess: true,
  })

  try {
    const ok = await verifyLogin(payload, normalizedEmail, normalizedPassword)
    if (ok) {
      console.log(
        `Recreated admin user: ${normalizedEmail} (login verified, password length ${normalizedPassword.length})`,
      )
      return
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(
      `Admin login failed after recreate for ${normalizedEmail} (password length ${normalizedPassword.length}): ${message}. ` +
        'If your password contains quotes or apostrophes, change SEED_ADMIN_PASSWORD to letters and numbers only, redeploy, and try again.',
    )
  }

  throw new Error(
    `Admin login failed for ${normalizedEmail} (password length ${normalizedPassword.length}). ` +
      'Change SEED_ADMIN_PASSWORD to a simple value without quotes or apostrophes (e.g. AtcAdmin2026Secure), redeploy, and try again.',
  )
}
