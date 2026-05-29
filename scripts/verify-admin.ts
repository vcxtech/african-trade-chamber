/**
 * Smoke-test Payload admin data layer and API access.
 * Run: npx tsx scripts/verify-admin.ts
 */

import './load-env.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { requireEnv } from './load-env.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

type Check = { name: string; ok: boolean; detail: string }

const checks: Check[] = []

function record(name: string, ok: boolean, detail: string) {
  checks.push({ name, ok, detail })
  const mark = ok ? 'OK' : 'FAIL'
  console.log(`[${mark}] ${name}: ${detail}`)
}

async function main() {
  requireEnv('DATABASE_URI')
  requireEnv('PAYLOAD_SECRET')

  const payload = await getPayload({ config })

  // Login
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@africantradechamber.org'
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe-Atc-Dev-2026!'

  try {
    const login = await payload.login({
      collection: 'users',
      data: { email, password },
    })
    record('Admin login', Boolean(login.token), login.user?.email ?? 'no user')
  } catch (err) {
    record('Admin login', false, err instanceof Error ? err.message : String(err))
  }

  // Collection counts
  const collections = [
    'news',
    'insights',
    'team-members',
    'jobs',
    'form-submissions',
    'hero-slides',
    'hero-feature-cards',
    'media',
    'pages',
    'member-testimonials',
    'membership-categories',
    'users',
  ] as const

  for (const slug of collections) {
    try {
      const result = await payload.find({ collection: slug, limit: 1, overrideAccess: true })
      record(`Collection ${slug}`, true, `${result.totalDocs} document(s)`)
    } catch (err) {
      record(`Collection ${slug}`, false, err instanceof Error ? err.message : String(err))
    }
  }

  const mediaCollection = payload.config.collections.find((c) => c.slug === 'media')
  const mediaListComponent = mediaCollection?.admin?.components?.views?.list?.Component
  const mediaListPath =
    typeof mediaListComponent === 'string'
      ? mediaListComponent
      : 'missing list component'
  record(
    'Media grid list view',
    mediaListPath === '/components/admin/media/MediaListView#MediaListView',
    mediaListPath,
  )

  const mediaDefaultLimit = mediaCollection?.admin?.pagination?.defaultLimit
  record(
    'Media pagination default',
    mediaDefaultLimit === 40,
    mediaDefaultLimit != null ? String(mediaDefaultLimit) : 'missing',
  )

  // News sample with content
  const newsSample = await payload.find({
    collection: 'news',
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'afdb-backs-24-5m-clean-energy-drive-in-sao-tome-and-principe' } },
  })
  record(
    'Hero news post exists',
    newsSample.docs.length > 0,
    newsSample.docs.length ? String(newsSample.docs[0].title) : 'not found',
  )

  // Insights agribusiness body
  const insight = await payload.find({
    collection: 'insights',
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'sector-report-on-agribusiness-in-ghana' } },
  })
  const insightDoc = insight.docs[0] as { content?: { root?: { children?: unknown[] } } } | undefined
  const hasContent = Boolean(insightDoc?.content?.root?.children?.length)
  record('Agribusiness insight body', hasContent, hasContent ? 'Lexical content present' : 'empty or missing')

  // Jobs applyUrl
  const jobs = await payload.find({ collection: 'jobs', limit: 7, overrideAccess: true })
  const badApply = jobs.docs.filter(
    (j) => !(j as { applyUrl?: string }).applyUrl?.endsWith('/apply'),
  )
  record(
    'Jobs applyUrl',
    badApply.length === 0,
    badApply.length ? `${badApply.length} missing /apply suffix` : 'all 7 have /apply URLs',
  )

  // Globals read
  const globalSlugs = ['site-settings', 'news-listing-page', 'contact-page', 'wwd-homepage'] as const
  for (const slug of globalSlugs) {
    try {
      await payload.findGlobal({ slug, overrideAccess: true })
      record(`Global ${slug}`, true, 'readable')
    } catch (err) {
      record(`Global ${slug}`, false, err instanceof Error ? err.message : String(err))
    }
  }

  // Global save smoke test
  try {
    const newsGlobal = await payload.findGlobal({ slug: 'news-listing-page', overrideAccess: true })
    await payload.updateGlobal({
      slug: 'news-listing-page',
      data: { introTitle: (newsGlobal as { introTitle?: string }).introTitle ?? 'News' },
      overrideAccess: true,
    })
    record('Global save (news-listing-page)', true, 'update succeeded')
  } catch (err) {
    record('Global save (news-listing-page)', false, err instanceof Error ? err.message : String(err))
  }

  // Form submission create (public API path)
  try {
    await payload.create({
      collection: 'form-submissions',
      data: {
        formType: 'contact',
        email: 'verify-admin@test.local',
        subject: 'Admin verification test',
        payload: { fullName: 'Verify Script', message: 'Automated admin QA check' },
        status: 'new',
      },
      overrideAccess: true,
    })
    record('Form submission create', true, 'test row created')
  } catch (err) {
    record('Form submission create', false, err instanceof Error ? err.message : String(err))
  }

  // Media directory
  const mediaDir = path.join(ROOT, 'media')
  record('Media staticDir exists', fs.existsSync(mediaDir), mediaDir)

  const mediaCount = await payload.find({ collection: 'media', limit: 0, overrideAccess: true })
  record(
    'Media library populated',
    mediaCount.totalDocs > 0,
    `${mediaCount.totalDocs} document(s) (run npm run media:import-uploads to bulk-import public images)`,
  )

  // Legacy URL → Media library linking
  try {
    const wwd = await payload.findGlobal({ slug: 'wwd-homepage', depth: 0, overrideAccess: true })
    const services = (wwd as { services?: Array<{ image?: unknown; imageUrl?: string }> })?.services
    const linkedService = services?.find((s) => s.image != null && s.image !== '')
    record(
      'WWD service image linked',
      Boolean(linkedService),
      linkedService ? 'at least one service has Media relation' : 'no services linked yet',
    )
  } catch (err) {
    record('WWD service image linked', false, err instanceof Error ? err.message : String(err))
  }

  try {
    const newsWithUrl = await payload.find({
      collection: 'news',
      limit: 5,
      overrideAccess: true,
      where: { imageUrl: { exists: true } },
    })
    const linkedNews = newsWithUrl.docs.filter((d) => {
      const row = d as { imageUrl?: string; featuredImage?: unknown }
      return row.imageUrl && row.featuredImage != null && row.featuredImage !== ''
    })
    record(
      'News featuredImage linked',
      linkedNews.length > 0,
      `${linkedNews.length}/${newsWithUrl.docs.length} sampled posts with imageUrl have featuredImage`,
    )
  } catch (err) {
    record('News featuredImage linked', false, err instanceof Error ? err.message : String(err))
  }

  try {
    const membershipHp = await payload.findGlobal({
      slug: 'membership-homepage',
      depth: 0,
      overrideAccess: true,
    })
    const cards = (membershipHp as { cards?: Array<{ image?: unknown; imageUrl?: string }> })?.cards
    const linkedCard = cards?.find((c) => c.image != null && c.image !== '')
    record(
      'Membership homepage card linked',
      Boolean(linkedCard),
      linkedCard ? 'at least one card has Media relation' : 'no cards linked yet',
    )
  } catch (err) {
    record(
      'Membership homepage card linked',
      false,
      err instanceof Error ? err.message : String(err),
    )
  }

  // Media upload smoke test (1x1 PNG)
  const testPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  )
  const testFilePath = path.join(mediaDir, 'verify-admin-test.png')
  fs.writeFileSync(testFilePath, testPng)
  try {
    const mediaDoc = await payload.create({
      collection: 'media',
      data: { alt: 'Admin verification test image' },
      filePath: testFilePath,
      overrideAccess: true,
    })
    const savedPath = path.join(mediaDir, (mediaDoc as { filename?: string }).filename ?? '')
    record(
      'Media upload',
      fs.existsSync(savedPath),
      (mediaDoc as { filename?: string }).filename ?? 'created',
    )
  } catch (err) {
    record('Media upload', false, err instanceof Error ? err.message : String(err))
  } finally {
    if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath)
  }

  // Team members category coverage
  const teamCats = ['advisory', 'board', 'secretariat', 'fellow'] as const
  for (const cat of teamCats) {
    try {
      const result = await payload.find({
        collection: 'team-members',
        limit: 1,
        overrideAccess: true,
        where: { category: { equals: cat } },
      })
      record(`Team category ${cat}`, result.totalDocs > 0, `${result.totalDocs} member(s)`)
    } catch (err) {
      record(`Team category ${cat}`, false, err instanceof Error ? err.message : String(err))
    }
  }

  // Hero slide edit smoke test
  try {
    const slides = await payload.find({ collection: 'hero-slides', limit: 1, overrideAccess: true })
    const slide = slides.docs[0] as { id: number; title?: string } | undefined
    if (slide) {
      await payload.update({
        collection: 'hero-slides',
        id: slide.id,
        data: { title: slide.title ?? 'Hero slide' },
        overrideAccess: true,
      })
      record('Hero slide save', true, slide.title ?? 'updated')
    } else {
      record('Hero slide save', false, 'no slides found')
    }
  } catch (err) {
    record('Hero slide save', false, err instanceof Error ? err.message : String(err))
  }

  // HTTP: admin shell + public form API (requires dev server on NEXT_PUBLIC_SERVER_URL)
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002'
  try {
    const adminRes = await fetch(`${baseUrl}/admin`, { signal: AbortSignal.timeout(240_000) })
    const adminHtml = await adminRes.text()
    const hasPayload = adminHtml.includes('payload') || adminHtml.includes('Payload')
    record('HTTP /admin', adminRes.ok && hasPayload, `status ${adminRes.status}`)
  } catch (err) {
    record('HTTP /admin', false, err instanceof Error ? err.message : String(err))
  }

  try {
    const formRes = await fetch(`${baseUrl}/api/forms/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'contact',
        email: 'verify-admin-e2e@test.local',
        subject: 'Admin E2E verification',
        data: { fullName: 'QA Test', message: 'Contact form E2E from verify-admin.ts' },
      }),
      signal: AbortSignal.timeout(120_000),
    })
    const formOk = formRes.ok
    record('HTTP form submit', formOk, formOk ? '201/200' : `status ${formRes.status}`)

    if (formOk) {
      const rows = await payload.find({
        collection: 'form-submissions',
        limit: 1,
        overrideAccess: true,
        where: { email: { equals: 'verify-admin-e2e@test.local' } },
      })
      record('Form submission in admin', rows.totalDocs > 0, `${rows.totalDocs} row(s)`)
    }
  } catch (err) {
    record('HTTP form submit', false, err instanceof Error ? err.message : String(err))
  }

  // Site settings + contact + wwd globals save
  for (const slug of ['site-settings', 'contact-page', 'wwd-homepage'] as const) {
    try {
      const g = await payload.findGlobal({ slug, overrideAccess: true })
      await payload.updateGlobal({ slug, data: g as unknown as Record<string, unknown>, overrideAccess: true })
      record(`Global save (${slug})`, true, 'update succeeded')
    } catch (err) {
      record(`Global save (${slug})`, false, err instanceof Error ? err.message : String(err))
    }
  }

  const failed = checks.filter((c) => !c.ok)
  console.log('\n--- Summary ---')
  console.log(`${checks.length - failed.length}/${checks.length} checks passed`)
  if (failed.length) {
    console.log('Failed:', failed.map((f) => f.name).join(', '))
    process.exit(1)
  }
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
