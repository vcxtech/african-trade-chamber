import type { CollectionConfig } from 'payload'

export const TeamMemberCategories: CollectionConfig = {
  slug: 'team-member-categories',
  labels: {
    singular: 'Team Member Category',
    plural: 'Team Member Categories',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'showOnAbout', 'isFellow', 'sortOrder'],
    group: 'Team',
    description: 'Categories for team members. Toggle “Show on About” to publish on the About page.',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'showOnAbout',
      type: 'checkbox',
      label: 'Show on About page',
      defaultValue: false,
    },
    {
      name: 'isFellow',
      type: 'checkbox',
      label: 'Fellow category',
      defaultValue: false,
      admin: {
        description: 'When checked, members use fellow fields (country, cohort year) and appear on fellowship cohort pages.',
      },
    },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
