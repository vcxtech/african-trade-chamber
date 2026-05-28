import { ContactLocationBlock } from '@/components/contact/ContactLocationBlock'
import { AtcSubPageLayout } from '@/components/shared/AtcSubPageLayout'
import { getContactPage } from '@/lib/cms-contact-page'
import { defaultContactPage } from '@/lib/contact-defaults'

export const metadata = {
  title: 'Office Locations — Contact',
  description: defaultContactPage.locationIntro.slice(0, 160),
}

export default async function ContactOfficeLocationsPage() {
  const data = await getContactPage()

  return (
    <AtcSubPageLayout
      title={data.locationTitle}
      backHref="/contact-us"
      backLabel="← Back to Contact"
    >
      <div className="bg-[#f8f9fa]">
        <ContactLocationBlock
          locationTitle={data.locationTitle}
          locationIntro={data.locationIntro}
          mapEmbedUrl={data.mapEmbedUrl}
        />
      </div>
    </AtcSubPageLayout>
  )
}
