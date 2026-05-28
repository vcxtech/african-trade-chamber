import { ContactNewsletterBlock } from '@/components/contact/ContactNewsletterBlock'
import { AtcSubPageLayout } from '@/components/shared/AtcSubPageLayout'
import { getContactPage } from '@/lib/cms-contact-page'
import { defaultContactPage } from '@/lib/contact-defaults'

export const metadata = {
  title: 'Newsletter Signup — Contact',
  description: defaultContactPage.newsletterBody.slice(0, 160),
}

export default async function ContactNewsletterPage() {
  const data = await getContactPage()

  return (
    <AtcSubPageLayout
      title={data.newsletterTitle}
      backHref="/contact-us"
      backLabel="← Back to Contact"
    >
      <ContactNewsletterBlock
        title={data.newsletterTitle}
        body={data.newsletterBody}
        submitLabel={data.newsletterSubmitLabel}
        successMessage={data.newsletterSuccessMessage}
      />
    </AtcSubPageLayout>
  )
}
