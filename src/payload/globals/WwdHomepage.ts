import type { GlobalConfig } from 'payload'
import { contentGlobalAccess, hideUnlessArea } from '@/lib/payload-access'
import { homepageCardFields } from '../fields/homepageCardFields'
import { legacyImageUrlField, mediaImageField } from '../fields/mediaImage'

export const WwdHomepage: GlobalConfig = {
  slug: 'wwd-homepage',
  label: 'Homepage — What We Do',
  access: contentGlobalAccess('homepage'),
  admin: { group: 'Homepage', hidden: hideUnlessArea('homepage') },
  fields: [
    {
      name: 'headerTitle',
      type: 'text',
      label: 'Header tagline',
      required: true,
    },
    {
      name: 'headerContent',
      type: 'textarea',
      label: 'Header paragraphs (separate with ||)',
    },
    {
      type: 'group',
      name: 'intro',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Our Services' },
        { name: 'content', type: 'textarea', label: 'Description' },
        mediaImageField({ name: 'image', label: 'Image' }),
        legacyImageUrlField('imageUrl'),
        { name: 'buttonText', type: 'text', defaultValue: 'View all services' },
        { name: 'buttonUrl', type: 'text' },
      ],
    },
    {
      name: 'services',
      type: 'array',
      label: 'Service cards',
      fields: [
        ...homepageCardFields,
        { name: 'order', type: 'number', defaultValue: 0 },
      ],
    },
  ],
}
