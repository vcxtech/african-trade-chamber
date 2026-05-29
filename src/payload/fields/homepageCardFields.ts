import type { Field } from 'payload'
import { imageAltField, legacyImageUrlField, mediaImageField } from './mediaImage'

export const homepageCardFields: Field[] = [
  { name: 'title', type: 'text', required: true },
  { name: 'description', type: 'textarea' },
  mediaImageField({ name: 'image', label: 'Image' }),
  imageAltField(),
  legacyImageUrlField('imageUrl'),
  { name: 'buttonText', type: 'text', defaultValue: 'Learn more' },
  { name: 'buttonUrl', type: 'text' },
]

export const homepageSectionHeaderFields: Field[] = [
  { name: 'sectionTitle', type: 'text', required: true },
  { name: 'sectionDescription', type: 'textarea' },
  { name: 'sectionCtaText', type: 'text', label: 'Header CTA text' },
  { name: 'sectionCtaUrl', type: 'text', label: 'Header CTA URL' },
]

/** Card fields with image upload for page globals (membership, partnerships, etc.). */
export const pageImageCardFields: Field[] = [
  { name: 'title', type: 'text', required: true },
  { name: 'body', type: 'textarea' },
  mediaImageField({ name: 'image', label: 'Image' }),
  imageAltField(),
  legacyImageUrlField('imageUrl'),
  { name: 'ctaLabel', type: 'text' },
  { name: 'ctaHref', type: 'text' },
]
