import type { GlobalConfig } from 'payload'
import { imageAltField, legacyImageUrlField, mediaImageField } from '../fields/mediaImage'

const imageFields = [
  mediaImageField({ name: 'image', label: 'Image' }),
  imageAltField(),
  legacyImageUrlField('imageUrl'),
]

export const MembershipPage: GlobalConfig = {
  slug: 'membership-page',
  label: 'Membership Page',
  fields: [
    { name: 'headerTitle', type: 'text', required: true },
    { name: 'headerSubtitle', type: 'textarea', required: true },
    {
      name: 'whyJoin',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', required: true },
        ...imageFields,
        { name: 'body', type: 'textarea', required: true },
        { name: 'ctaLabel', type: 'text', required: true },
        { name: 'ctaHref', type: 'text', required: true },
      ],
    },
    {
      name: 'benefits',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'intro', type: 'textarea', required: true },
        ...imageFields,
        {
          name: 'items',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'categoriesIntro',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'textarea', required: true },
      ],
    },
    {
      name: 'footerCtas',
      type: 'group',
      fields: [
        { name: 'applyLabel', type: 'text', required: true },
        { name: 'applyHref', type: 'text', required: true },
        { name: 'guideLabel', type: 'text', required: true },
        { name: 'guideHref', type: 'text', required: true },
      ],
    },
    { name: 'testimonialsHeaderTitle', type: 'text', required: true },
    { name: 'testimonialsHeaderSubtitle', type: 'textarea', required: true },
  ],
}
