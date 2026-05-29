import type { GlobalConfig } from 'payload'
import { homepageCardFields } from '../fields/homepageCardFields'
import { legacyImageUrlField, mediaImageField } from '../fields/mediaImage'

export const IndustryCouncilsHomepage: GlobalConfig = {
  slug: 'industry-councils-homepage',
  label: 'Homepage — Industry Councils',
  fields: [
    { name: 'headerTitle', type: 'text', required: true },
    { name: 'headerDescription', type: 'textarea' },
    { name: 'headerButtonText', type: 'text' },
    { name: 'headerButtonUrl', type: 'text' },
    {
      type: 'group',
      name: 'intro',
      fields: [
        mediaImageField({ name: 'image', label: 'Image' }),
        legacyImageUrlField('imageUrl'),
        { name: 'title', type: 'text' },
        { name: 'text', type: 'textarea' },
        { name: 'buttonText', type: 'text' },
        { name: 'buttonUrl', type: 'text' },
      ],
    },
    {
      name: 'councils',
      type: 'array',
      fields: homepageCardFields,
    },
  ],
}
