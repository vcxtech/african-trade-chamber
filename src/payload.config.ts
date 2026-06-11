import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Pages } from './payload/collections/Pages'
import { News } from './payload/collections/News'
import { Insights } from './payload/collections/Insights'
import { Jobs } from './payload/collections/Jobs'
import { HeroSlides } from './payload/collections/HeroSlides'
import { HeroFeatureCards } from './payload/collections/HeroFeatureCards'
import { MembershipCategories } from './payload/collections/MembershipCategories'
import { MemberTestimonials } from './payload/collections/MemberTestimonials'
import { SiteSettings } from './payload/globals/SiteSettings'
import { WwdHomepage } from './payload/globals/WwdHomepage'
import { IndustryCouncilsHomepage } from './payload/globals/IndustryCouncilsHomepage'
import { CrossSectorCouncilsHomepage } from './payload/globals/CrossSectorCouncilsHomepage'
import {
  MembershipHomepage,
  InsightsHomepage,
  EventHomepage,
  GetInvolvedHomepage,
  NewsHomepage,
} from './payload/globals/ThreeCardHomepageSection'
import { CountryOfficesPage } from './payload/globals/CountryOfficesPage'
import { FellowshipPage } from './payload/globals/FellowshipPage'
import { MembershipPage } from './payload/globals/MembershipPage'
import { GetInvolvedPage } from './payload/globals/GetInvolvedPage'
import { PartnershipsPage } from './payload/globals/PartnershipsPage'
import { DonatePage } from './payload/globals/DonatePage'
import { VolunteerPage } from './payload/globals/VolunteerPage'
import { NewsListingPage } from './payload/globals/NewsListingPage'
import { ContactPage } from './payload/globals/ContactPage'
import { AboutPage } from './payload/globals/AboutPage'
import { TeamMembers } from './payload/collections/TeamMembers'
import { FormSubmissions } from './payload/collections/FormSubmissions'
import { getPayloadCookieSecure, getPrimaryServerURL, getServerURLs } from './lib/payload-server-url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURLs = getServerURLs()
const serverURL = getPrimaryServerURL()

export default buildConfig({
  serverURL,
  csrf: serverURLs,
  cors: serverURLs,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — African Trade Chamber',
      icons: { icon: '/images/atc-logo.png' },
      openGraph: { images: [{ url: '/images/atc-logo.png' }] },
    },
    theme: 'light',
    components: {
      views: {
        login: {
          Component: '/components/admin/AtcLoginView#AtcLoginView',
        },
        createFirstUser: {
          Component: '/components/admin/AtcCreateFirstUserBlocked#AtcCreateFirstUserBlocked',
        },
      },
      beforeLogin: ['/components/admin/AtcLoginHeading#AtcLoginHeading'],
      beforeNav: ['/components/admin/AtcAdminOpenNav#AtcAdminOpenNav'],
      afterNav: ['/components/admin/AtcAdminNavFooter#AtcAdminNavFooter'],
      header: ['/components/admin/AtcAdminTopBar#AtcAdminTopBar'],
      graphics: {
        Logo: '/components/admin/AtcAdminLogo#AtcAdminLogo',
        Icon: '/components/admin/AtcAdminIcon#AtcAdminIcon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    News,
    Insights,
    Jobs,
    HeroSlides,
    HeroFeatureCards,
    MembershipCategories,
    MemberTestimonials,
    TeamMembers,
    FormSubmissions,
  ],
  globals: [
    SiteSettings,
    WwdHomepage,
    IndustryCouncilsHomepage,
    CrossSectorCouncilsHomepage,
    MembershipHomepage,
    InsightsHomepage,
    EventHomepage,
    GetInvolvedHomepage,
    NewsHomepage,
    CountryOfficesPage,
    FellowshipPage,
    MembershipPage,
    GetInvolvedPage,
    PartnershipsPage,
    DonatePage,
    VolunteerPage,
    NewsListingPage,
    ContactPage,
    AboutPage,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: process.env.PAYLOAD_DB_PUSH === 'true' || process.env.NODE_ENV !== 'production',
  }),
  sharp,
  routes: {
    admin: '/admin',
  },
})
