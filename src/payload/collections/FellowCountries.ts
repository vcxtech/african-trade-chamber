import type { CollectionConfig } from 'payload'

export const FellowCountries: CollectionConfig = {
  slug: 'fellow-countries',
  labels: {
    singular: 'Fellow Country',
    plural: 'Fellow Countries',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'sortOrder'],
    group: 'Team',
    description: 'Countries aligned with the organization. Used for fellowship cohort members.',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
