/**
 * Seed hero slides, membership categories, and site settings defaults.
 * Run: npm run seed (requires Postgres + .env)
 */

import './load-env.js'
import config from '../src/payload.config'
import { getPayload } from 'payload'
import {
  defaultHeroSlides,
  defaultMembershipCategories,
  defaultSiteSettings,
} from '../src/lib/defaults'
import { defaultHomepageSections } from '../src/lib/homepage-defaults'
import { defaultCountryOfficesPage } from '../src/lib/country-offices-defaults'
import { defaultFellowshipPage } from '../src/lib/fellowship-defaults'
import {
  fellowshipCohortToSeedData,
  fellowshipHubToSeedData,
} from '../src/lib/cms-fellowship'
import { mergeFellowshipCohortSeedData } from '../src/lib/fellowship-cohort-utils'
import { defaultMembershipPage } from '../src/lib/membership-page-defaults'
import { membershipPageToSeedData } from '../src/lib/cms-membership-page'
import { defaultGetInvolvedPage } from '../src/lib/get-involved-defaults'
import { getInvolvedPageToSeedData } from '../src/lib/cms-get-involved'
import { defaultPartnershipsPage } from '../src/lib/partnerships-defaults'
import { partnershipsPageToSeedData } from '../src/lib/cms-partnerships'
import { defaultDonatePage } from '../src/lib/donate-defaults'
import { donatePageToSeedData } from '../src/lib/cms-donate-page'
import { defaultVolunteerPage } from '../src/lib/volunteer-defaults'
import { volunteerPageToSeedData } from '../src/lib/cms-volunteer-page'
import { defaultContactPage } from '../src/lib/contact-defaults'
import { contactPageToSeedData } from '../src/lib/cms-contact-page'
import { defaultAboutPage } from '../src/lib/about-defaults'
import { aboutPageToSeedData } from '../src/lib/cms-about-page'
import { defaultCareerJobs } from '../src/lib/careers-defaults'
import { careerJobToSeedData } from '../src/lib/cms-jobs'
import { defaultNewsPage } from '../src/lib/news-page-defaults'
import { newsPageToSeedData } from '../src/lib/cms-news'
import { insightsSeedDocuments } from '../src/lib/cms-insights'
import { requireEnv } from './load-env.js'

async function main() {
  requireEnv('DATABASE_URI')
  requireEnv('PAYLOAD_SECRET')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: defaultSiteSettings.siteName,
      utilityBarLinks: defaultSiteSettings.utilityBarLinks,
      socialLinks: defaultSiteSettings.socialLinks,
      headerNav: defaultSiteSettings.headerNav,
      footerColumns: defaultSiteSettings.footerColumns,
      address: defaultSiteSettings.address,
      contactEmail: defaultSiteSettings.contactEmail,
      contactPhone: defaultSiteSettings.contactPhone,
      showTranslator: defaultSiteSettings.showTranslator,
      showWhatsappHelp: defaultSiteSettings.showWhatsappHelp,
      whatsappHelpLabel: defaultSiteSettings.whatsappHelpLabel,
      fellowshipPopupEnabled: defaultSiteSettings.fellowshipPopupEnabled,
      fellowshipPopupTitle: defaultSiteSettings.fellowshipPopupTitle,
      fellowshipPopupBody: defaultSiteSettings.fellowshipPopupBody,
      fellowshipPopupDeadline: defaultSiteSettings.fellowshipPopupDeadline,
      fellowshipPopupApplyUrl: defaultSiteSettings.fellowshipPopupApplyUrl,
    },
  })
  console.log('Updated site-settings global')

  const existingSlides = await payload.find({
    collection: 'hero-slides',
    sort: 'order',
    limit: 20,
  })
  if (!existingSlides.docs.length) {
    for (let i = 0; i < defaultHeroSlides.length; i++) {
      const s = defaultHeroSlides[i]
      await payload.create({
        collection: 'hero-slides',
        data: {
          title: s.title,
          description: s.description,
          ctaLabel: s.ctaLabel,
          ctaUrl: s.ctaUrl,
          backgroundImageUrl: s.backgroundImageUrl,
          sideImageUrl: s.sideImageUrl,
          sideVideoUrl: s.sideVideoUrl,
          showSideImage: s.showSideImage,
          showApplyOnly: s.showApplyOnly,
          order: i,
          enabled: true,
        },
      })
    }
    console.log(`Created ${defaultHeroSlides.length} hero slides`)
  } else {
    for (let i = 0; i < defaultHeroSlides.length; i++) {
      const s = defaultHeroSlides[i]
      const doc = existingSlides.docs[i]
      if (!doc) continue
      await payload.update({
        collection: 'hero-slides',
        id: doc.id,
        data: {
          title: s.title,
          description: s.description,
          ctaLabel: s.ctaLabel,
          ctaUrl: s.ctaUrl,
          backgroundImageUrl: s.backgroundImageUrl,
          sideImageUrl: s.sideImageUrl,
          sideVideoUrl: s.sideVideoUrl,
          showSideImage: s.showSideImage,
          showApplyOnly: s.showApplyOnly,
          order: i,
          enabled: true,
        },
      })
    }
    console.log(`Synced ${defaultHeroSlides.length} hero slides`)
  }

  const existingCats = await payload.find({ collection: 'membership-categories', limit: 1 })
  if (!existingCats.docs.length) {
    for (let i = 0; i < defaultMembershipCategories.length; i++) {
      const c = defaultMembershipCategories[i]
      await payload.create({
        collection: 'membership-categories',
        data: {
          title: c.title,
          description: c.description,
          benefits: c.benefits,
          annualFee: c.annualFee,
          feePeriod: c.feePeriod,
          order: i,
        },
      })
    }
    console.log(`Created ${defaultMembershipCategories.length} membership categories`)
  }

  const existingFeatures = await payload.find({
    collection: 'hero-feature-cards',
    sort: 'order',
    limit: 20,
  })
  if (!existingFeatures.docs.length) {
    for (let i = 0; i < defaultHomepageSections.featureCards.length; i++) {
      const card = defaultHomepageSections.featureCards[i]
      await payload.create({
        collection: 'hero-feature-cards',
        data: {
          title: card.title,
          description: card.description,
          linkText: card.linkText,
          linkUrl: card.linkUrl,
          order: i,
          enabled: true,
        },
      })
    }
    console.log(`Created ${defaultHomepageSections.featureCards.length} hero feature cards`)
  } else {
    for (let i = 0; i < defaultHomepageSections.featureCards.length; i++) {
      const card = defaultHomepageSections.featureCards[i]
      const doc = existingFeatures.docs[i]
      if (!doc) continue
      await payload.update({
        collection: 'hero-feature-cards',
        id: doc.id,
        data: {
          title: card.title,
          description: card.description,
          linkText: card.linkText,
          linkUrl: card.linkUrl,
          order: i,
          enabled: true,
        },
      })
    }
    console.log(`Synced ${defaultHomepageSections.featureCards.length} hero feature cards`)
  }

  const hp = defaultHomepageSections

  await payload.updateGlobal({
    slug: 'wwd-homepage',
    data: {
      headerTitle: hp.wwd.headerTitle,
      headerContent: hp.wwd.headerContent,
      intro: {
        title: hp.wwd.intro.title,
        content: hp.wwd.intro.description,
        imageUrl: hp.wwd.intro.imageUrl,
        buttonText: hp.wwd.intro.buttonText,
        buttonUrl: hp.wwd.intro.buttonUrl,
      },
      services: hp.wwd.services.map((s, order) => ({
        title: s.title,
        description: s.description,
        imageUrl: s.imageUrl,
        buttonText: s.buttonText,
        buttonUrl: s.buttonUrl,
        order,
      })),
    },
  })

  await payload.updateGlobal({
    slug: 'industry-councils-homepage',
    data: {
      headerTitle: hp.industryCouncils.headerTitle,
      headerDescription: hp.industryCouncils.headerDescription,
      headerButtonText: hp.industryCouncils.headerButtonText,
      headerButtonUrl: hp.industryCouncils.headerButtonUrl,
      intro: hp.industryCouncils.intro,
      councils: hp.industryCouncils.councils,
    },
  })

  await payload.updateGlobal({
    slug: 'cross-sector-councils-homepage',
    data: {
      intro: {
        title: hp.crossSector.intro.title,
        description: hp.crossSector.intro.description,
        buttonText: hp.crossSector.intro.buttonText,
        buttonUrl: hp.crossSector.intro.buttonUrl,
      },
      councils: hp.crossSector.councils,
    },
  })

  for (const [slug, section] of [
    ['membership-homepage', hp.membership],
    ['insights-homepage', hp.insights],
    ['event-homepage', hp.events],
    ['get-involved-homepage', hp.getInvolved],
    ['news-homepage', hp.news],
  ] as const) {
    await payload.updateGlobal({
      slug,
      data: {
        sectionTitle: section.sectionTitle,
        sectionDescription: section.sectionDescription,
        sectionCtaText: section.sectionCtaText,
        sectionCtaUrl: section.sectionCtaUrl,
        cards: section.cards,
      },
    })
  }

  console.log('Updated homepage section globals')

  await payload.updateGlobal({
    slug: 'country-offices-page',
    data: {
      pageTitle: defaultCountryOfficesPage.pageTitle,
      pageSubtitle: defaultCountryOfficesPage.pageSubtitle,
      offices: defaultCountryOfficesPage.offices,
    },
  })
  console.log('Updated country-offices-page global')

  await payload.updateGlobal({
    slug: 'fellowship-page',
    data: fellowshipHubToSeedData(defaultFellowshipPage),
  })
  console.log('Updated fellowship-page global (hub)')

  for (const cohort of defaultFellowshipPage.cohorts) {
    const year = String(cohort.cohortYear)
    const existing = await payload.find({
      collection: 'fellowship-cohorts',
      where: { cohortYear: { equals: year } },
      limit: 1,
      depth: 0,
    })
    const seedData = fellowshipCohortToSeedData(cohort)
    if (existing.docs[0]) {
      const merged = mergeFellowshipCohortSeedData(
        existing.docs[0] as unknown as Record<string, unknown>,
        seedData,
      )
      await payload.update({
        collection: 'fellowship-cohorts',
        id: existing.docs[0].id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: merged as any,
      })
    } else {
      await payload.create({
        collection: 'fellowship-cohorts',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: seedData as any,
      })
    }
  }
  console.log('Synced fellowship-cohorts collection')

  await payload.updateGlobal({
    slug: 'membership-page',
    data: membershipPageToSeedData(defaultMembershipPage),
  })
  console.log('Updated membership-page global')

  const existingTestimonials = await payload.find({
    collection: 'member-testimonials',
    sort: 'sortOrder',
    limit: 20,
  })
  for (let i = 0; i < defaultMembershipPage.testimonials.length; i++) {
    const t = defaultMembershipPage.testimonials[i]
    const doc = existingTestimonials.docs[i]
    const data = {
      name: t.name,
      position: t.position,
      quote: t.quote,
      sortOrder: t.sortOrder,
    }
    if (doc) {
      await payload.update({
        collection: 'member-testimonials',
        id: doc.id,
        data,
      })
    } else {
      await payload.create({
        collection: 'member-testimonials',
        data,
      })
    }
  }
  for (let i = defaultMembershipPage.testimonials.length; i < existingTestimonials.docs.length; i++) {
    await payload.delete({
      collection: 'member-testimonials',
      id: existingTestimonials.docs[i].id,
    })
  }
  console.log('Synced member testimonials')

  await payload.updateGlobal({
    slug: 'get-involved-page',
    data: getInvolvedPageToSeedData(defaultGetInvolvedPage),
  })
  console.log('Updated get-involved-page global')

  await payload.updateGlobal({
    slug: 'partnerships-page',
    data: partnershipsPageToSeedData(defaultPartnershipsPage),
  })
  console.log('Updated partnerships-page global')

  await payload.updateGlobal({
    slug: 'donate-page',
    data: donatePageToSeedData(defaultDonatePage),
  })
  console.log('Updated donate-page global')

  await payload.updateGlobal({
    slug: 'volunteer-page',
    data: volunteerPageToSeedData(defaultVolunteerPage),
  })
  console.log('Updated volunteer-page global')

  await payload.updateGlobal({
    slug: 'contact-page',
    data: contactPageToSeedData(defaultContactPage),
  })
  console.log('Updated contact-page global')

  await payload.updateGlobal({
    slug: 'about-page',
    data: aboutPageToSeedData(defaultAboutPage),
  })
  console.log('Updated about-page global')

  for (const job of defaultCareerJobs) {
    const existing = await payload.find({
      collection: 'jobs',
      where: { slug: { equals: job.slug } },
      limit: 1,
    })
    const data = careerJobToSeedData(job)
    if (existing.docs[0]) {
      await payload.update({
        collection: 'jobs',
        id: existing.docs[0].id,
        data,
      })
    } else {
      await payload.create({
        collection: 'jobs',
        data,
      })
    }
  }
  console.log(`Synced ${defaultCareerJobs.length} career jobs`)

  for (const row of insightsSeedDocuments()) {
    const existing = await payload.find({
      collection: 'insights',
      where: { slug: { equals: row.slug } },
      limit: 1,
    })
    if (existing.docs[0]) {
      await payload.update({
        collection: 'insights',
        id: existing.docs[0].id,
        data: row,
      })
    } else {
      await payload.create({
        collection: 'insights',
        data: row,
      })
    }
  }
  console.log(`Synced ${insightsSeedDocuments().length} insight articles`)

  await payload.updateGlobal({
    slug: 'news-listing-page',
    data: newsPageToSeedData(defaultNewsPage),
  })
  console.log('Updated news-listing-page global')

  const existingCatsAll = await payload.find({
    collection: 'membership-categories',
    sort: 'order',
    limit: 20,
  })
  if (existingCatsAll.docs.length) {
    for (let i = 0; i < defaultMembershipCategories.length; i++) {
      const doc = existingCatsAll.docs[i]
      const c = defaultMembershipCategories[i]
      if (!doc || !c) continue
      await payload.update({
        collection: 'membership-categories',
        id: doc.id,
        data: {
          title: c.title,
          description: c.description,
          benefits: c.benefits,
          annualFee: c.annualFee,
          feePeriod: c.feePeriod,
          order: i,
        },
      })
    }
    console.log('Updated membership category copy')
  }

  const { readEnv } = await import('./lib/sanitize-env.js')
  const adminEmail = readEnv('SEED_ADMIN_EMAIL')
  const adminPassword = readEnv('SEED_ADMIN_PASSWORD')
  const autoSeed = process.env.AUTO_SEED === 'true'

  if (autoSeed && (!adminEmail || !adminPassword)) {
    console.error(
      'AUTO_SEED=true requires SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to be set.',
    )
    process.exit(1)
  }

  if (adminEmail && adminPassword) {
    const { syncAdminUser } = await import('./lib/sync-admin-user.js')
    await syncAdminUser({ email: adminEmail, password: adminPassword, payload })
  } else if (!autoSeed) {
    console.warn(
      'Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env, then run "npm run reset-admin".',
    )
  }

  console.log('Seed complete')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
