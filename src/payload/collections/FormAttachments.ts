import type { CollectionConfig } from 'payload'

export const FormAttachments: CollectionConfig = {
  slug: 'form-attachments',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'createdAt'],
    group: 'Forms',
    description: 'Files uploaded with public form submissions (membership applications, etc.)',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    staticDir: 'form-attachments',
    mimeTypes: [
      'image/*',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Original filename or description from the form upload.',
      },
    },
  ],
}
