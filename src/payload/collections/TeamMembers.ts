import type { CollectionConfig } from 'payload'
import { legacyImageUrlField, mediaImageField } from '../fields/mediaImage'
import { resolveCategoryIsFellow } from '../fields/resolveCategoryIsFellow'
import { FELLOWSHIP_COLLAPSIBLE_FIELD, teamMemberShowWhen } from '../fields/teamMemberAdmin'

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
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data) return data

        const isFellow = await resolveCategoryIsFellow(req, data.category)

        if (isFellow) {
          data.position = undefined
          data.socialLinks = undefined
        } else {
          data.country = undefined
          data.memberCode = undefined
          data.cohortYear = undefined
          data.postDate = undefined
        }

        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'team-member-categories',
      required: true,
      admin: {
        description: 'Choose the member type first — fellow-only fields appear below when Fellow is selected.',
      },
    },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      type: 'collapsible',
      label: 'Fellowship details',
      admin: {
        initCollapsed: false,
        components: {
          Field: FELLOWSHIP_COLLAPSIBLE_FIELD,
        },
      },
      fields: [
        {
          name: 'country',
          type: 'relationship',
          relationTo: 'fellow-countries',
          admin: {
            ...teamMemberShowWhen('fellow'),
            description: 'Manage countries under Team → Fellow Countries.',
          },
        },
        {
          name: 'cohortYear',
          type: 'select',
          label: 'Cohort Year',
          options: [
            { label: '2025', value: '2025' },
            { label: '2026', value: '2026' },
          ],
          admin: teamMemberShowWhen('fellow'),
        },
        {
          name: 'memberCode',
          type: 'text',
          label: 'Member Code',
          admin: teamMemberShowWhen('fellow'),
        },
        {
          name: 'postDate',
          type: 'text',
          admin: {
            ...teamMemberShowWhen('fellow'),
            description: 'Original WordPress publish date (ISO) for fellow ordering',
          },
        },
      ],
    },
    {
      name: 'position',
      type: 'text',
      admin: teamMemberShowWhen('non-fellow'),
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Links',
      admin: teamMemberShowWhen('non-fellow'),
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
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
