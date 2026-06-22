import type { GlobalConfig } from 'payload'
import { contentGlobalAccess, hideUnlessArea } from '@/lib/payload-access'
import { imageAltField, legacyImageUrlField, mediaImageField } from '../fields/mediaImage'

const listItemFields = [{ name: 'text', type: 'text' as const, required: true }]

export const PartnershipsPage: GlobalConfig = {
  slug: 'partnerships-page',
  label: 'Partnerships Page',
  access: contentGlobalAccess('communications'),
  admin: { group: 'Pages', hidden: hideUnlessArea('communications') },
  fields: [
    { name: 'headerTitle', type: 'text', required: true },
    { name: 'introText', type: 'textarea', required: true },
    {
      name: 'listCards',
      type: 'array',
      fields: [
        { name: 'id', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        mediaImageField({ name: 'image', label: 'Image' }),
        imageAltField(),
        legacyImageUrlField('imageUrl'),
        { name: 'items', type: 'array', fields: listItemFields },
      ],
    },
    {
      name: 'getStarted',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
        mediaImageField({ name: 'image', label: 'Image' }),
        imageAltField(),
        legacyImageUrlField('imageUrl'),
        { name: 'requestLabel', type: 'text', required: true },
        { name: 'requestEmail', type: 'text', required: true },
        { name: 'guideLabel', type: 'text', required: true },
        { name: 'guideHref', type: 'text', required: true },
      ],
    },
  ],
}
