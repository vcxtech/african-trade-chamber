import type { CollectionConfig } from 'payload'
import { legacyImageUrlField, mediaImageField } from '../fields/mediaImage'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: {
    singular: 'Team Member',
    plural: 'Team Members',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'position', 'sortOrder'],
    group: 'Team',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'position', type: 'text' },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Advisory Board', value: 'advisory' },
        { label: 'Board of Directors', value: 'board' },
        { label: 'Secretariat Management', value: 'secretariat' },
        { label: 'Fellow', value: 'fellow' },
      ],
      defaultValue: 'advisory',
    },
    { name: 'country', type: 'text', admin: { condition: (_, s) => s?.category === 'fellow' } },
    { name: 'memberCode', type: 'text', admin: { condition: (_, s) => s?.category === 'fellow' } },
    {
      name: 'cohortYear',
      type: 'number',
      admin: { condition: (_, s) => s?.category === 'fellow' },
    },
    {
      name: 'socialLinks',
      type: 'group',
      admin: { condition: (_, s) => s?.category === 'fellow' },
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'x', type: 'text' },
        { name: 'tiktok', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'linkedin', type: 'text' },
      ],
    },
    { name: 'bio', type: 'textarea' },
    mediaImageField({ name: 'photo', label: 'Photo' }),
    legacyImageUrlField('imageUrl'),
    {
      name: 'postDate',
      type: 'text',
      admin: { description: 'Original WordPress publish date (ISO) for fellow ordering' },
    },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
