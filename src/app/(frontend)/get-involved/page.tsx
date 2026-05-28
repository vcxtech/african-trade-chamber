import { GetInvolvedPageSection } from '@/components/get-involved/GetInvolvedPageSection'
import { LegacyHashRedirect } from '@/components/shared/LegacyHashRedirect'
import { getGetInvolvedPage } from '@/lib/cms-get-involved'
import { defaultGetInvolvedPage } from '@/lib/get-involved-defaults'

const GET_INVOLVED_HASH_REDIRECTS: Record<string, string> = {
  newsletter: '/contact-us/newsletter',
}

export const metadata = {
  title: 'Get Involved',
  description: defaultGetInvolvedPage.intro.body.slice(0, 160),
}

export default async function GetInvolvedPage() {
  const data = await getGetInvolvedPage()
  return (
    <>
      <LegacyHashRedirect map={GET_INVOLVED_HASH_REDIRECTS} />
      <GetInvolvedPageSection data={data} />
    </>
  )
}
