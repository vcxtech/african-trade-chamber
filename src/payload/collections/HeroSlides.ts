import type { CollectionConfig } from 'payload'
import { contentCollectionAccess, hideUnlessArea } from '@/lib/payload-access'
import { legacyImageUrlField, mediaImageField } from '../fields/mediaImage'

export const HeroSlides: CollectionConfig = {
  slug: 'hero-slides',
  access: contentCollectionAccess('homepage'),
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'enabled'],
    group: 'Homepage',
    hidden: hideUnlessArea('homepage'),
    description:
      'Order 0 = fallback slide 1 when no news story is pinned to the homepage hero. Order 1+ = carousel slides 2, 3, and so on.',
    components: {
      beforeList: ['/components/admin/hero/HeroSlidesListBanner#HeroSlidesListBanner'],
    },
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
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: '0 = fallback for slide 1. 1+ = promo slides shown after slide 1.',
      },
    },
    { name: 'enabled', type: 'checkbox', defaultValue: true },
  ],
}
