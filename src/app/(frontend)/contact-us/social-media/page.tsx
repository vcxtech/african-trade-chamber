import { ContactSocialBlock } from '@/components/contact/ContactSocialBlock'
import { AtcSubPageLayout } from '@/components/shared/AtcSubPageLayout'
import { getContactPage } from '@/lib/cms-contact-page'
import { defaultContactPage } from '@/lib/contact-defaults'

export const metadata = {
  title: 'Social Media — Contact',
  description: defaultContactPage.socialIntro.slice(0, 160),
}

export default async function ContactSocialMediaPage() {
  const data = await getContactPage()

  return (
    <AtcSubPageLayout
      title={data.socialTitle}
      backHref="/contact-us"
      backLabel="← Back to Contact"
    >
      <div className="bg-[#f8f9fa]">
        <ContactSocialBlock
          socialTitle={data.socialTitle}
          socialIntro={data.socialIntro}
          socialLinks={data.socialLinks}
        />
      </div>
    </AtcSubPageLayout>
  )
}
