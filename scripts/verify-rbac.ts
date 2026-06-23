/**
 * Verify role-based access control for admin and editor users.
 * Run: npx tsx scripts/verify-rbac.ts
 */

import './load-env.js'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { requireEnv } from './load-env.js'
import type { User } from '../src/payload-types'

type Check = { name: string; ok: boolean; detail: string }

const checks: Check[] = []

function record(name: string, ok: boolean, detail: string) {
  checks.push({ name, ok, detail })
  const mark = ok ? 'OK' : 'FAIL'
  console.log(`[${mark}] ${name}: ${detail}`)
}

async function upsertUser(
  payload: Awaited<ReturnType<typeof getPayload>>,
  email: string,
  password: string,
  role: 'editor',
  contentAreas?: User['contentAreas'],
) {
  const normalized = email.toLowerCase()
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: normalized } },
    limit: 1,
    overrideAccess: true,
  })

  const data = {
    email: normalized,
    password,
    role,
    contentAreas: contentAreas ?? [],
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
    return existing.docs[0].id
  }

  const created = await payload.create({
    collection: 'users',
    data,
    overrideAccess: true,
  })
  return created.id
}

async function loadUser(
  payload: Awaited<ReturnType<typeof getPayload>>,
  id: number | string,
): Promise<User> {
  return payload.findByID({
    collection: 'users',
    id,
    overrideAccess: true,
  })
}

async function expectDenied(
  name: string,
  fn: () => Promise<unknown>,
): Promise<void> {
  try {
    await fn()
    record(name, false, 'expected access denial')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    record(name, true, message.slice(0, 120))
  }
}

async function expectAllowed(
  name: string,
  fn: () => Promise<unknown>,
): Promise<void> {
  try {
    await fn()
    record(name, true, 'allowed')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    record(name, false, message.slice(0, 120))
  }
}

async function main() {
  requireEnv('DATABASE_URI')
  requireEnv('PAYLOAD_SECRET')

  const payload = await getPayload({ config })

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@africantradechamber.org'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe-Atc-Dev-2026!'
  const editorEmail = process.env.SEED_EDITOR_EMAIL || 'editor@africantradechamber.org'
  const editorPassword = process.env.SEED_EDITOR_PASSWORD || 'ChangeMe-Editor-2026!'

  const adminLogin = await payload.login({
    collection: 'users',
    data: { email: adminEmail, password: adminPassword },
  })
  record('Admin login', Boolean(adminLogin.token), adminLogin.user?.email ?? 'no user')

  const editorId = await upsertUser(payload, editorEmail, editorPassword, 'editor', [
    'communications',
    'membership',
  ])

  const editorLogin = await payload.login({
    collection: 'users',
    data: { email: editorEmail, password: editorPassword },
  })

  const adminUser = adminLogin.user
    ? await loadUser(payload, adminLogin.user.id)
    : null
  const editorUser = editorLogin.user ? await loadUser(payload, editorId) : null

  if (!adminUser || !editorUser) {
    console.error('Missing test users — aborting RBAC checks')
    process.exit(1)
  }

  record('Editor role in DB', editorUser.role === 'editor', editorUser.role ?? 'missing')

  await expectAllowed('Admin reads site settings', () =>
    payload.findGlobal({
      slug: 'site-settings',
      user: adminUser,
      overrideAccess: false,
    }),
  )

  await expectDenied('Editor cannot read site settings', () =>
    payload.findGlobal({
      slug: 'site-settings',
      user: editorUser,
      overrideAccess: false,
    }),
  )

  await expectAllowed('Editor reads news', () =>
    payload.find({
      collection: 'news',
      limit: 1,
      user: editorUser,
      overrideAccess: false,
    }),
  )

  const adminUsersVisibleToEditor = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail.toLowerCase() } },
    limit: 1,
    user: editorUser,
    overrideAccess: false,
  })
  record(
    'Editor cannot read other users',
    adminUsersVisibleToEditor.totalDocs === 0,
    `${adminUsersVisibleToEditor.totalDocs} admin user(s) visible`,
  )

  const news = await payload.find({
    collection: 'news',
    limit: 1,
    overrideAccess: true,
  })
  const newsId = news.docs[0]?.id

  if (newsId) {
    await expectDenied('Editor cannot delete news', () =>
      payload.delete({
        collection: 'news',
        id: newsId,
        user: editorUser,
        overrideAccess: false,
      }),
    )
  } else {
    record('Editor cannot delete news', true, 'skipped — no news docs')
  }

  await expectAllowed('Editor reads form submissions', () =>
    payload.find({
      collection: 'form-submissions',
      limit: 1,
      user: editorUser,
      overrideAccess: false,
    }),
  )

  const submission = await payload.find({
    collection: 'form-submissions',
    limit: 1,
    overrideAccess: true,
  })
  const submissionId = submission.docs[0]?.id

  if (submissionId) {
    await expectDenied('Editor cannot update form submissions', () =>
      payload.update({
        collection: 'form-submissions',
        id: submissionId,
        data: { status: 'reviewed' },
        user: editorUser,
        overrideAccess: false,
      }),
    )
  } else {
    record('Editor cannot update form submissions', true, 'skipped — no submissions')
  }

  await expectAllowed('Public JSON form submit path (overrideAccess)', async () => {
    await payload.create({
      collection: 'form-submissions',
      data: {
        formType: 'newsletter',
        email: 'rbac-test@example.com',
        payload: { source: 'verify-rbac' },
        status: 'new',
      },
      overrideAccess: true,
    })
  })

  const failed = checks.filter((c) => !c.ok)
  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`)
  if (failed.length > 0) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
