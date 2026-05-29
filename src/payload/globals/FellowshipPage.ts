import type { GlobalConfig } from 'payload'
import { imageAltField, legacyImageUrlField, mediaImageField } from '../fields/mediaImage'

export const FellowshipPage: GlobalConfig = {
  slug: 'fellowship-page',
  label: 'Fellowship Page',
  fields: [
    mediaImageField({ name: 'heroImage', label: 'Hero background image' }),
    legacyImageUrlField('heroImageUrl'),
    {
      name: 'introText',
      type: 'textarea',
      required: true,
    },
    {
      name: 'cohorts',
      type: 'array',
      label: 'Cohort cards',
      minRows: 1,
      fields: [
        { name: 'yearLabel', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        mediaImageField({ name: 'image', label: 'Image' }),
        imageAltField(),
        legacyImageUrlField('imageUrl'),
        { name: 'exploreUrl', type: 'text', required: true },
        {
          name: 'exploreExternal',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
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
