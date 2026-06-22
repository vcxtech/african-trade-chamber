import type { CollectionConfig } from 'payload'
import { contentCollectionAccess, hideUnlessArea } from '@/lib/payload-access'
import { legacyImageUrlField, mediaImageField } from '../fields/mediaImage'

export const News: CollectionConfig = {
  slug: 'news',
  access: contentCollectionAccess('communications', { editorCanDelete: false }),
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'showInHomeHero', 'featured'],
    group: 'Content',
    hidden: hideUnlessArea('communications'),
  },
  hooks: {
    beforeChange: [
      async ({ data, req, originalDoc, operation }) => {
        if (data?.showInHomeHero !== true) {
          return data
        }

        const excludeId = operation === 'update' ? originalDoc?.id : undefined
        const others = await req.payload.find({
          collection: 'news',
          where: {
            and: [
              { showInHomeHero: { equals: true } },
              ...(excludeId ? [{ id: { not_equals: excludeId } }] : []),
            ],
          },
          limit: 100,
          overrideAccess: true,
        })

        for (const doc of others.docs) {
          await req.payload.update({
            collection: 'news',
            id: doc.id,
            data: { showInHomeHero: false },
            overrideAccess: true,
          })
        }

        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText' },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Chamber News', value: 'chamber' },
        { label: 'Member News', value: 'member' },
        { label: 'Press Releases', value: 'press' },
        { label: 'Media Coverage', value: 'media' },
        { label: 'Newsletter Archive', value: 'newsletter' },
      ],
      defaultValue: 'chamber',
    },
    mediaImageField({ name: 'featuredImage', label: 'Featured image' }),
    legacyImageUrlField('imageUrl'),
    { name: 'newsSource', type: 'text' },
    { name: 'newsAuthor', type: 'text' },
    { name: 'newsDate', type: 'date' },
    { name: 'originalUrl', type: 'text' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    {
      name: 'showInHomeHero',
      type: 'checkbox',
      label: 'Display in homepage hero',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'When checked, this story replaces the first homepage hero slide. Only one story can be active at a time. Upload a Hero side image below for the right-side thumbnail.',
      },
    },
    {
      name: 'heroSideImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero side image',
      displayPreview: true,
      admin: {
        position: 'sidebar',
        description:
          'Required for the right-side thumbnail on the homepage hero. Use a different image from the featured image (e.g. logo or detail shot).',
        condition: (data) => Boolean(data?.showInHomeHero),
      },
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
      defaultValue: 'medium',
    },
    { name: 'expiryDate', type: 'date' },
    { name: 'publishedAt', type: 'date' },
  ],
}
