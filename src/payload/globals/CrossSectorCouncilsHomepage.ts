import type { GlobalConfig } from 'payload'
import { contentGlobalAccess, hideUnlessArea } from '@/lib/payload-access'
import { homepageCardFields } from '../fields/homepageCardFields'
import { legacyImageUrlField, mediaImageField } from '../fields/mediaImage'

export const CrossSectorCouncilsHomepage: GlobalConfig = {
  slug: 'cross-sector-councils-homepage',
  label: 'Homepage — Cross-Sector Councils',
  access: contentGlobalAccess('homepage'),
  admin: { group: 'Homepage', hidden: hideUnlessArea('homepage') },
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
