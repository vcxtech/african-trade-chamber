import { PartnershipsPageSection } from '@/components/partnerships/PartnershipsPageSection'
import { LegacyHashRedirect } from '@/components/shared/LegacyHashRedirect'
import { getPartnershipsPage } from '@/lib/cms-partnerships'
import { defaultPartnershipsPage } from '@/lib/partnerships-defaults'

const PARTNERSHIP_HASH_REDIRECTS: Record<string, string> = {
  'why-partner': '/partnerships/why-partner',
  types: '/partnerships/types-of-partners',
  opportunities: '/partnerships/opportunities',
  'get-started': '/partnerships/get-started',
}

export const metadata = {
  title: 'Partnerships',
  description: defaultPartnershipsPage.introText.slice(0, 160),
}

export default async function PartnershipsPage() {
  const data = await getPartnershipsPage()
  return (
    <>
      <LegacyHashRedirect map={PARTNERSHIP_HASH_REDIRECTS} />
      <PartnershipsPageSection data={data} />
    </>
  )
}
