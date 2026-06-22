import type { CollectionConfig } from 'payload'
import { contentCollectionAccess, hideUnlessArea } from '@/lib/payload-access'

export const HeroFeatureCards: CollectionConfig = {
  slug: 'hero-feature-cards',
  access: contentCollectionAccess('homepage'),
  labels: { singular: 'Hero feature card', plural: 'Hero feature cards' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'enabled', 'updatedAt'],
    group: 'Homepage',
    hidden: hideUnlessArea('homepage'),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'linkText', type: 'text', defaultValue: 'Learn more' },
    { name: 'linkUrl', type: 'text', required: true },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
