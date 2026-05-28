import type { CollectionConfig } from 'payload'

export const Insights: CollectionConfig = {
  slug: 'insights',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText' },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Trade & Market Briefs', value: 'trade-market-brief' },
        { label: 'Sector Reports', value: 'sector-report' },
        { label: 'Investment Landscape Snapshots', value: 'investment-snapshot' },
        { label: 'Policy Papers & Advocacy Reports', value: 'policy-paper' },
      ],
    },
    { name: 'author', type: 'text' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    {
      name: 'imageUrl',
      type: 'text',
      admin: { description: 'Remote image URL (e.g. imported from WordPress uploads)' },
    },
    { name: 'originalUrl', type: 'text' },
    { name: 'publishedAt', type: 'date' },
  ],
}
