import { defaultContactPage } from '@/lib/contact-defaults'
import { getPayloadClient } from '@/lib/cms'
import { resolvePayloadMediaAlt, resolvePayloadMediaUrl } from '@/lib/payload-media'
import type { ContactPageData, ContactSocialLink } from '@/types/contact-page'

export function contactPageToSeedData(data: ContactPageData) {
  return {
    ...data,
    subjectOptions: data.subjectOptions.map((label) => ({ label })),
    socialLinks: data.socialLinks,
  }
}

export async function getContactPage(): Promise<ContactPageData> {
  const fallback = defaultContactPage
  try {
    const payload = await getPayloadClient()
    if (!payload) return fallback
    const global = await payload.findGlobal({ slug: 'contact-page', depth: 1 })
    if (!global) return fallback
    const raw = global as unknown as Record<string, unknown>

    const subjectRaw = (raw.subjectOptions as Array<{ label?: string }>) || []
    const socialRaw = (raw.socialLinks as ContactSocialLink[]) || []

    return {
      introTitle: String(raw.introTitle ?? fallback.introTitle),
      introBody: String(raw.introBody ?? fallback.introBody),
      introImageUrl:
        resolvePayloadMediaUrl(
          raw.introImage,
          raw.introImageUrl as string | undefined,
          fallback.introImageUrl,
        ) || fallback.introImageUrl,
      introImageAlt:
        resolvePayloadMediaAlt(
          raw.introImage,
          raw.introImageAlt as string | undefined,
          fallback.introTitle,
        ) || fallback.introImageAlt,
      email: String(raw.email ?? fallback.email),
      phone: String(raw.phone ?? fallback.phone),
      address: String(raw.address ?? fallback.address),
      officeHours: String(raw.officeHours ?? fallback.officeHours),
      formBlurbTitle: String(raw.formBlurbTitle ?? fallback.formBlurbTitle),
      formBlurbText: String(raw.formBlurbText ?? fallback.formBlurbText),
      formTitle: String(raw.formTitle ?? fallback.formTitle),
      formSubtitle: String(raw.formSubtitle ?? fallback.formSubtitle),
      formEmail: String(raw.formEmail ?? fallback.formEmail),
      submitButtonText: String(raw.submitButtonText ?? fallback.submitButtonText),
      subjectOptions: subjectRaw.length
        ? subjectRaw.map((s, i) => s.label || fallback.subjectOptions[i] || '')
        : fallback.subjectOptions,
      locationTitle: String(raw.locationTitle ?? fallback.locationTitle),
      locationIntro: String(raw.locationIntro ?? fallback.locationIntro),
      mapEmbedUrl: String(raw.mapEmbedUrl ?? fallback.mapEmbedUrl),
      socialTitle: String(raw.socialTitle ?? fallback.socialTitle),
      socialIntro: String(raw.socialIntro ?? fallback.socialIntro),
      socialLinks: socialRaw.length ? socialRaw : fallback.socialLinks,
      newsletterTitle: String(raw.newsletterTitle ?? fallback.newsletterTitle),
      newsletterBody: String(raw.newsletterBody ?? fallback.newsletterBody),
      newsletterSubmitLabel: String(
        raw.newsletterSubmitLabel ?? fallback.newsletterSubmitLabel,
      ),
      newsletterSuccessMessage: String(
        raw.newsletterSuccessMessage ?? fallback.newsletterSuccessMessage,
      ),
    }
  } catch {
    return fallback
  }
}
