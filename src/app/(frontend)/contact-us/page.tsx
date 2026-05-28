import { ContactPageSection } from '@/components/contact/ContactPageSection'
import { LegacyHashRedirect } from '@/components/shared/LegacyHashRedirect'
import { getContactPage } from '@/lib/cms-contact-page'
import { defaultContactPage } from '@/lib/contact-defaults'

const CONTACT_HASH_REDIRECTS: Record<string, string> = {
  'office-locations': '/contact-us/office-locations',
  social: '/contact-us/social-media',
}

export const metadata = {
  title: 'Contact Us',
  description: defaultContactPage.introBody.slice(0, 160),
}

export default async function ContactUsPage() {
  const data = await getContactPage()
  return (
    <>
      <LegacyHashRedirect map={CONTACT_HASH_REDIRECTS} />
      <ContactPageSection data={data} />
    </>
  )
}
