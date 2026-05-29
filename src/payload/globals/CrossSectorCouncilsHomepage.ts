import type { GlobalConfig } from 'payload'
import { homepageCardFields } from '../fields/homepageCardFields'
import { legacyImageUrlField, mediaImageField } from '../fields/mediaImage'

export const CrossSectorCouncilsHomepage: GlobalConfig = {
  slug: 'cross-sector-councils-homepage',
  label: 'Homepage — Cross-Sector Councils',
  fields: [
    {
      type: 'group',
      name: 'intro',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        mediaImageField({ name: 'image', label: 'Image' }),
        legacyImageUrlField('imageUrl'),
        { name: 'buttonText', type: 'text', defaultValue: 'Learn more' },
        { name: 'buttonUrl', type: 'text' },
      ],
    },
    {
      name: 'councils',
      type: 'array',
      label: 'Council cards',
      fields: homepageCardFields,
    },
  ],
}
