import type { CollectionConfig } from 'payload'
import { formAttachmentAccess, hideUnlessAdminOrArea } from '@/lib/payload-access'

export const FormAttachments: CollectionConfig = {
  slug: 'form-attachments',
  access: formAttachmentAccess(),
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'createdAt'],
    group: 'Forms',
    description: 'Files uploaded with public form submissions (membership applications, etc.)',
    hidden: hideUnlessAdminOrArea('membership'),
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
