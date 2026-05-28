export type ContactSocialLink = {
  platform: string
  label: string
  url: string
}

export type ContactPageData = {
  introTitle: string
  introBody: string
  introImageUrl: string
  introImageAlt: string
  email: string
  phone: string
  address: string
  officeHours: string
  formBlurbTitle: string
  formBlurbText: string
  formTitle: string
  formSubtitle: string
  formEmail: string
  submitButtonText: string
  subjectOptions: string[]
  locationTitle: string
  locationIntro: string
  mapEmbedUrl: string
  socialTitle: string
  socialIntro: string
  socialLinks: ContactSocialLink[]
  newsletterTitle: string
  newsletterBody: string
  newsletterSubmitLabel: string
  newsletterSuccessMessage: string
}
