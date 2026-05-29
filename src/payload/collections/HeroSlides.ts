import type { CollectionConfig } from 'payload'
import { legacyImageUrlField, mediaImageField } from '../fields/mediaImage'

export const HeroSlides: CollectionConfig = {
  slug: 'hero-slides',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'enabled'],
    group: 'Homepage',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'ctaLabel', type: 'text' },
    { name: 'ctaUrl', type: 'text' },
    mediaImageField({ name: 'backgroundImage', label: 'Background image' }),
    legacyImageUrlField('backgroundImageUrl'),
    mediaImageField({ name: 'sideImage', label: 'Side image' }),
    legacyImageUrlField('sideImageUrl'),
    { name: 'sideVideoUrl', type: 'text', admin: { description: 'MP4 URL for right-side video (slide 3)' } },
    { name: 'showSideImage', type: 'checkbox', defaultValue: true },
    { name: 'showApplyOnly', type: 'checkbox', defaultValue: false },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'enabled', type: 'checkbox', defaultValue: true },
  ],
}
