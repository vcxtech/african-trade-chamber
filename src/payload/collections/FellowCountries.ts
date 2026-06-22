import type { CollectionConfig } from 'payload'
import { contentCollectionAccess, hideUnlessArea } from '@/lib/payload-access'

export const FellowCountries: CollectionConfig = {
  slug: 'fellow-countries',
  access: contentCollectionAccess('programs'),
  labels: {
    singular: 'Fellow Country',
    plural: 'Fellow Countries',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'sortOrder'],
    group: 'Team',
    hidden: hideUnlessArea('programs'),
    description: 'Countries aligned with the organization. Used for fellowship cohort members.',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
