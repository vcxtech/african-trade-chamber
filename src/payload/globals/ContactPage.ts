import type { GlobalConfig } from 'payload'
import { imageAltField, legacyImageUrlField, mediaImageField } from '../fields/mediaImage'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact Page',
  fields: [
    { name: 'introTitle', type: 'text', required: true },
    { name: 'introBody', type: 'textarea', required: true },
    mediaImageField({ name: 'introImage', label: 'Intro image' }),
    imageAltField({ name: 'introImageAlt' }),
    legacyImageUrlField('introImageUrl'),
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'address', type: 'textarea', required: true },
    { name: 'officeHours', type: 'textarea', required: true },
    { name: 'formBlurbTitle', type: 'text', required: true },
    { name: 'formBlurbText', type: 'textarea', required: true },
    { name: 'formTitle', type: 'text', required: true },
    { name: 'formSubtitle', type: 'text', required: true },
    { name: 'formEmail', type: 'email', required: true },
    { name: 'submitButtonText', type: 'text', required: true },
    {
      name: 'subjectOptions',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    { name: 'locationTitle', type: 'text', required: true },
    { name: 'locationIntro', type: 'textarea', required: true },
    { name: 'mapEmbedUrl', type: 'text', required: true },
    { name: 'socialTitle', type: 'text', required: true },
    { name: 'socialIntro', type: 'text', required: true },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'newsletterTitle', type: 'text', required: true },
    { name: 'newsletterBody', type: 'textarea', required: true },
    { name: 'newsletterSubmitLabel', type: 'text', required: true },
    { name: 'newsletterSuccessMessage', type: 'textarea', required: true },
  ],
}
