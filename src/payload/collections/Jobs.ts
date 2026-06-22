import type { CollectionConfig } from 'payload'
import { contentCollectionAccess, hideUnlessArea } from '@/lib/payload-access'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  access: contentCollectionAccess('careers'),
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'department', 'location', 'status'],
    group: 'Careers',
    hidden: hideUnlessArea('careers'),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'department', type: 'text' },
    { name: 'location', type: 'text' },
    { name: 'jobType', type: 'text', defaultValue: 'Full-time' },
    { name: 'summary', type: 'textarea' },
    { name: 'description', type: 'richText' },
    { name: 'requirements', type: 'richText' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
      ],
      defaultValue: 'open',
    },
    { name: 'applyUrl', type: 'text' },
    { name: 'jobId', type: 'text', index: true },
    { name: 'category', type: 'text', defaultValue: 'Leadership' },
    { name: 'postedAt', type: 'date' },
    { name: 'roleHtml', type: 'textarea' },
    { name: 'responsibilitiesHtml', type: 'textarea' },
    { name: 'aboutHtml', type: 'textarea' },
    { name: 'qualificationsHtml', type: 'textarea' },
    { name: 'competenciesHtml', type: 'textarea' },
    { name: 'locationScope', type: 'textarea' },
    { name: 'appointment', type: 'textarea' },
    { name: 'requirementsHtml', type: 'textarea' },
    { name: 'processHtml', type: 'textarea' },
    { name: 'deadline', type: 'text' },
  ],
}
