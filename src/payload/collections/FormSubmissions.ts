import type { CollectionConfig } from 'payload'
import { sendFormSubmissionNotification } from '@/lib/form-notification'

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
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        try {
          await sendFormSubmissionNotification(req.payload, {
            id: doc.id,
            formType: doc.formType,
            email: doc.email,
            subject: doc.subject,
            jobSlug: doc.jobSlug,
            payload: (doc.payload ?? {}) as Record<string, unknown>,
          })
        } catch (err) {
          console.error('[form-submissions] Failed to send notification email:', err)
        }
      },
    ],
  },
}
