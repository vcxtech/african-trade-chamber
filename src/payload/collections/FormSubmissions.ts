import type { CollectionConfig } from 'payload'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'formType',
    defaultColumns: ['formType', 'email', 'createdAt'],
    description: 'Form submissions from the public website',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'formType',
      type: 'select',
      required: true,
      options: [
        { label: 'Contact', value: 'contact' },
        { label: 'Donate', value: 'donate' },
        { label: 'Volunteer', value: 'volunteer' },
        { label: 'Membership Application', value: 'membership' },
        { label: 'Service Request', value: 'service-request' },
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Job Application', value: 'job-application' },
        { label: 'Fellowship Application', value: 'fellowship' },
      ],
    },
    { name: 'email', type: 'email' },
    { name: 'subject', type: 'text' },
    {
      name: 'payload',
      type: 'json',
      required: true,
    },
    { name: 'jobSlug', type: 'text', admin: { condition: (_, s) => s.formType === 'job-application' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Archived', value: 'archived' },
      ],
    },
  ],
}
