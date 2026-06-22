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
import { getMediaUsageStats } from './lib/collect-used-media-ids.js'

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
    'team-member-categories',
    'fellow-countries',
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

  const newsCollection = payload.config.collections.find((c) => c.slug === 'news')
  const hasShowInHomeHero = Boolean(
    newsCollection?.fields?.some(
      (f) => typeof f === 'object' && f !== null && 'name' in f && f.name === 'showInHomeHero',
    ),
  )
  record(
    'News showInHomeHero field',
    hasShowInHomeHero,
    hasShowInHomeHero ? 'configured' : 'missing',
  )

  const hasHeroSideImage = Boolean(
    newsCollection?.fields?.some(
      (f) => typeof f === 'object' && f !== null && 'name' in f && f.name === 'heroSideImage',
    ),
  )
  record(
    'News heroSideImage field',
    hasHeroSideImage,
    hasHeroSideImage ? 'configured' : 'missing',
  )

  try {
    const pinnedNews = await payload.find({
      collection: 'news',
      where: { showInHomeHero: { equals: true } },
      limit: 5,
      overrideAccess: true,
    })
    record(
      'News hero pin count',
      pinnedNews.totalDocs <= 1,
      `${pinnedNews.totalDocs} pinned (max 1)`,
    )
  } catch (err) {
    record('News hero pin count', false, err instanceof Error ? err.message : String(err))
  }

  try {
    const afdb = await payload.find({
      collection: 'news',
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: 'afdb-backs-24-5m-clean-energy-drive-in-sao-tome-and-principe' } },
    })
    const newsDoc = afdb.docs[0] as { id: number; showInHomeHero?: boolean } | undefined
    if (newsDoc) {
      const wasPinned = Boolean(newsDoc.showInHomeHero)
      await payload.update({
        collection: 'news',
        id: newsDoc.id,
        data: { showInHomeHero: true },
        overrideAccess: true,
      })
      const afterPin = await payload.find({
        collection: 'news',
        where: { showInHomeHero: { equals: true } },
        limit: 5,
        overrideAccess: true,
      })
      await payload.update({
        collection: 'news',
        id: newsDoc.id,
        data: { showInHomeHero: wasPinned },
        overrideAccess: true,
      })
      record(
        'News hero pin hook',
        afterPin.totalDocs === 1,
        afterPin.totalDocs === 1 ? 'single pin enforced' : `${afterPin.totalDocs} pinned after hook`,
      )
    } else {
      record('News hero pin hook', false, 'AfDB news post not found')
    }
  } catch (err) {
    record('News hero pin hook', false, err instanceof Error ? err.message : String(err))
  }

  const heroSlidesCollection = payload.config.collections.find((c) => c.slug === 'hero-slides')
  const heroBeforeList = heroSlidesCollection?.admin?.components?.beforeList?.[0]
  record(
    'Hero slides list banner',
    heroBeforeList === '/components/admin/hero/HeroSlidesListBanner#HeroSlidesListBanner',
    typeof heroBeforeList === 'string' ? heroBeforeList : 'missing beforeList component',
  )

  const hasHiddenVariantField = Boolean(
    mediaCollection?.fields?.some(
      (f) => typeof f === 'object' && f !== null && 'name' in f && f.name === 'isHiddenVariant',
    ),
  )
  record(
    'Media isHiddenVariant field',
    hasHiddenVariantField,
    hasHiddenVariantField ? 'configured' : 'missing',
  )

  const mediaBaseListFilter = mediaCollection?.admin?.baseListFilter
  record(
    'Media variant list filter',
    typeof mediaBaseListFilter === 'function',
    typeof mediaBaseListFilter === 'function' ? 'baseListFilter set' : 'missing',
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

  try {
    const usage = await getMediaUsageStats(payload)
    record(
      'Media usage scan',
      usage.usedCount > 0,
      `${usage.usedCount} used / ${usage.unusedCount} unused of ${usage.totalMedia} total`,
    )
  } catch (err) {
    record('Media usage scan', false, err instanceof Error ? err.message : String(err))
  }

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
  let testMediaId: number | undefined
  let testSavedFilename: string | undefined
  try {
    const mediaDoc = await payload.create({
      collection: 'media',
      data: { alt: 'Admin verification test image' },
      filePath: testFilePath,
      overrideAccess: true,
    })
    testMediaId = (mediaDoc as { id: number }).id
    testSavedFilename = (mediaDoc as { filename?: string }).filename
    const savedPath = path.join(mediaDir, testSavedFilename ?? '')
    record(
      'Media upload',
      fs.existsSync(savedPath),
      testSavedFilename ?? 'created',
    )
  } catch (err) {
    record('Media upload', false, err instanceof Error ? err.message : String(err))
  } finally {
    if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath)
    if (testMediaId != null) {
      try {
        await payload.delete({
          collection: 'media',
          id: testMediaId,
          overrideAccess: true,
        })
      } catch {
        /* ignore cleanup failure */
      }
    }
    if (testSavedFilename) {
      const savedPath = path.join(mediaDir, testSavedFilename)
      if (fs.existsSync(savedPath)) {
        try {
          fs.unlinkSync(savedPath)
        } catch {
          /* ignore cleanup failure */
        }
      }
    }
  }

  // Team member taxonomy + category coverage
  try {
    const categories = await payload.find({
      collection: 'team-member-categories',
      limit: 50,
      overrideAccess: true,
    })
    record(
      'Team member categories seeded',
      categories.totalDocs >= 7,
      `${categories.totalDocs} categor(ies)`,
    )

    const countries = await payload.find({
      collection: 'fellow-countries',
      limit: 50,
      overrideAccess: true,
    })
    record(
      'Fellow countries seeded',
      countries.totalDocs >= 25,
      `${countries.totalDocs} countr(ies)`,
    )
  } catch (err) {
    record('Team taxonomies', false, err instanceof Error ? err.message : String(err))
  }

  const teamCats = ['advisory', 'board', 'secretariat', 'fellow'] as const
  for (const catSlug of teamCats) {
    try {
      const catDoc = await payload.find({
        collection: 'team-member-categories',
        where: { slug: { equals: catSlug } },
        limit: 1,
        overrideAccess: true,
      })
      const categoryId = catDoc.docs[0]?.id
      if (!categoryId) {
        record(`Team category ${catSlug}`, false, 'category slug missing — run migrate:team-taxonomies')
        continue
      }
      const result = await payload.find({
        collection: 'team-members',
        limit: 1,
        overrideAccess: true,
        where: { category: { equals: categoryId } },
      })
      record(`Team category ${catSlug}`, result.totalDocs > 0, `${result.totalDocs} member(s)`)
    } catch (err) {
      record(`Team category ${catSlug}`, false, err instanceof Error ? err.message : String(err))
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
    const mediaSample = await payload.find({
      collection: 'media',
      limit: 1,
      overrideAccess: true,
      where: { filename: { exists: true } },
    })
    const filename = (mediaSample.docs[0] as { filename?: string } | undefined)?.filename
    if (filename) {
      const mediaRes = await fetch(
        `${baseUrl}/api/media/file/${encodeURIComponent(filename)}`,
        { signal: AbortSignal.timeout(120_000) },
      )
      record(
        'HTTP public media file',
        mediaRes.status === 200,
        mediaRes.status === 200 ? filename : `status ${mediaRes.status} (${filename})`,
      )
    } else {
      record('HTTP public media file', false, 'no media doc with filename found')
    }
  } catch (err) {
    record('HTTP public media file', false, err instanceof Error ? err.message : String(err))
  }

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

  try {
    const testPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    )
    const multipart = new FormData()
    multipart.append('formType', 'membership')
    multipart.append('email', 'verify-admin-multipart@test.local')
    multipart.append('subject', 'Admin E2E membership multipart')
    multipart.append(
      'data',
      JSON.stringify({
        orgName: 'QA Multipart Org',
        notifyEmail: 'info@africantradechamber.org',
        summaryBody: 'Multipart membership test from verify-admin.ts',
      }),
    )
    multipart.append('orgName', 'QA Multipart Org')
    multipart.append(
      'companyLogo',
      new Blob([testPng], { type: 'image/png' }),
      'verify-membership-logo.png',
    )

    const multipartRes = await fetch(`${baseUrl}/api/forms/submit`, {
      method: 'POST',
      body: multipart,
      signal: AbortSignal.timeout(120_000),
    })
    const multipartOk = multipartRes.ok
    record('HTTP membership multipart submit', multipartOk, multipartOk ? '200' : `status ${multipartRes.status}`)

    if (multipartOk) {
      const rows = await payload.find({
        collection: 'form-submissions',
        limit: 1,
        overrideAccess: true,
        where: { email: { equals: 'verify-admin-multipart@test.local' } },
      })
      const row = rows.docs[0] as { payload?: Record<string, unknown> } | undefined
      const logo = row?.payload?.companyLogo as { filename?: string } | undefined
      record(
        'Membership multipart attachment ref',
        Boolean(logo?.filename),
        logo?.filename ?? 'missing companyLogo ref',
      )
    }
  } catch (err) {
    record('HTTP membership multipart submit', false, err instanceof Error ? err.message : String(err))
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
