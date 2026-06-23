import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SiteFloatingWidgets } from '@/components/SiteFloatingWidgets'
import { LOGO_PATH, SITE_NAME } from '@/components/SiteLogo'
import { getSiteSettings } from '@/lib/cms'
import '../globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Advancing trade and investment across Africa and the Caribbean — empowering businesses to scale across the continent.',
  icons: {
    icon: LOGO_PATH,
    shortcut: LOGO_PATH,
    apple: LOGO_PATH,
  },
  openGraph: {
    title: SITE_NAME,
    siteName: SITE_NAME,
    images: [{ url: LOGO_PATH, alt: SITE_NAME }],
  },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-md focus:bg-atc-yellow focus:px-4 focus:py-2 focus:font-semibold focus:text-atc-navy"
        >
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col">
          <Header
            settings={{
              siteName: settings.siteName,
              utilityBarLinks: settings.utilityBarLinks,
              socialLinks: settings.socialLinks,
              headerNav: settings.headerNav,
            }}
          />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer
            settings={{
              siteName: settings.siteName,
              footerColumns: settings.footerColumns,
              address: settings.address,
              contactEmail: settings.contactEmail,
            }}
          />
          <SiteFloatingWidgets
            contactPhone={settings.contactPhone}
            showTranslator={settings.showTranslator}
            showWhatsapp={settings.showWhatsappHelp}
            whatsappLabel={settings.whatsappHelpLabel}
          />
        </div>
      </body>
    </html>
  )
}
