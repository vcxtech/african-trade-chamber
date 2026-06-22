import type { GlobalConfig } from 'payload'
import { contentGlobalAccess, hideUnlessArea } from '@/lib/payload-access'
import { legacyImageUrlField, mediaImageField } from '../fields/mediaImage'

const FELLOWSHIP_GUIDE = '/components/admin/fellowship/FellowshipAdminGuide#FellowshipAdminGuide'

export const FellowshipPage: GlobalConfig = {
  slug: 'fellowship-page',
  label: 'Fellowship hub',
  access: contentGlobalAccess('programs'),
  admin: {
    description:
      'Hub at /fellowship — intro, hero, and call for applications. Cohort pages are edited under Fellowship → Fellowship Cohorts.',
    group: 'Fellowship',
    hidden: hideUnlessArea('programs'),
  },
  fields: [
    {
      name: 'adminGuide',
      type: 'ui',
      admin: {
        components: {
          Field: FELLOWSHIP_GUIDE,
        },
      },
    },
    mediaImageField({ name: 'heroImage', label: 'Hero background image' }),
    legacyImageUrlField('heroImageUrl'),
    {
      name: 'introText',
      type: 'textarea',
      required: true,
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'tagline', type: 'text', required: true },
        {
          name: 'sections',
          type: 'array',
          fields: [
            { name: 'heading', type: 'text', required: true },
            {
              name: 'paragraphs',
              type: 'array',
              fields: [{ name: 'text', type: 'textarea', required: true }],
            },
            {
              name: 'labeledParagraphs',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'text', type: 'textarea', required: true },
              ],
            },
            {
              name: 'listItems',
              type: 'array',
              fields: [
                { name: 'text', type: 'text', admin: { description: 'Simple bullet' } },
                { name: 'title', type: 'text', admin: { description: 'Bold title (optional)' } },
                { name: 'body', type: 'textarea', admin: { description: 'Body after title (optional)' } },
              ],
            },
          ],
        },
        {
          name: 'footerParagraphs',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        { name: 'applyUrl', type: 'text', required: true },
        { name: 'contactPhone', type: 'text', required: true },
        { name: 'contactEmail', type: 'text', required: true },
      ],
    },
  ],
}
