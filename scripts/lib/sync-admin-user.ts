import type { Payload } from 'payload'

type SyncAdminUserArgs = {
  email: string
  password: string
  payload: Payload
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

async function findUserByEmail(payload: Payload, email: string) {
  const normalized = normalizeEmail(email)
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
  const normalized = normalizeEmail(email)
  const existing = await findUserByEmail(payload, normalized)

  if (existing) {
    await payload.update({
      collection: 'users',
      id: existing.id,
      data: {
        email: normalized,
        password,
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
    data: { email: normalized, password, role: 'admin' },
    overrideAccess: true,
  })
  return 'created' as const
}

async function verifyLogin(payload: Payload, email: string, password: string) {
  const login = await payload.login({
    collection: 'users',
    data: { email: normalizeEmail(email), password },
  })
  return Boolean(login.token)
}

/**
 * Create or reset the admin user, unlock the account, and verify login works.
 * Throws if credentials in env cannot authenticate after sync.
 */
export async function syncAdminUser({ email, password, payload }: SyncAdminUserArgs) {
  const normalized = normalizeEmail(email)
  const action = await upsertAdminUser(payload, normalized, password)

  try {
    const ok = await verifyLogin(payload, normalized, password)
    if (ok) {
      console.log(
        `${action === 'created' ? 'Created' : 'Updated'} admin user: ${normalized} (login verified, password length ${password.length})`,
      )
      return
    }
  } catch {
    // fall through to recreate
  }

  console.warn(`Admin login failed after ${action}; recreating user...`)
  const existing = await findUserByEmail(payload, normalized)
  if (existing) {
    await payload.delete({
      collection: 'users',
      id: existing.id,
      overrideAccess: true,
    })
  }

  await payload.create({
    collection: 'users',
    data: { email: normalized, password, role: 'admin' },
    overrideAccess: true,
  })

  try {
    const ok = await verifyLogin(payload, normalized, password)
    if (ok) {
      console.log(
        `Recreated admin user: ${normalized} (login verified, password length ${password.length})`,
      )
      return
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(
      `Admin login failed after recreate for ${normalized} (password length ${password.length}): ${message}. ` +
        'If your password contains quotes or apostrophes, change SEED_ADMIN_PASSWORD to letters and numbers only, redeploy, and try again.',
    )
  }

  throw new Error(
    `Admin login failed for ${normalized} (password length ${password.length}). ` +
      'Change SEED_ADMIN_PASSWORD to a simple value without quotes or apostrophes (e.g. AtcAdmin2026Secure), redeploy, and try again.',
  )
}
