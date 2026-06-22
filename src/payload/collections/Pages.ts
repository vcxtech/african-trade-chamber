import type { CollectionConfig } from 'payload'

const PAGES_FELLOWSHIP_HINT =
  '/components/admin/pages/PagesFellowshipSearchHint#PagesFellowshipSearchHint'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
    description:
      'Generic CMS pages served at /{slug}. Main site sections (About, Contact, etc.) are edited under Globals. Fellowship hub is under Globals → Fellowship hub; cohort pages (/fellowship/{year}) are under Fellowship → Fellowship Cohorts.',
    components: {
      beforeList: [PAGES_FELLOWSHIP_HINT],
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'seoTitle',
      type: 'text',
    },
    {
      name: 'seoDescription',
      type: 'textarea',
    },
  ],
}
