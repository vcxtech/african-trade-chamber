import type { CollectionConfig } from 'payload'
import { legacyImageUrlField, mediaImageField } from '../fields/mediaImage'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'featured'],
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
