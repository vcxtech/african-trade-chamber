import type { CollectionConfig } from 'payload'
import { isHiddenMediaVariant } from '@/lib/media-filename-utils'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*'],
    displayPreview: true,
    adminThumbnail: ({ doc }): string | null | false => {
      const url = doc.thumbnailURL ?? doc.url
      return typeof url === 'string' ? url : null
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'heroBg',
        width: 1920,
        withoutEnlargement: true,
      },
      {
        name: 'heroSide',
        width: 900,
        withoutEnlargement: true,
      },
      {
        name: 'card',
        width: 600,
        withoutEnlargement: true,
      },
    ],
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        const filename = data?.filename
        if (typeof filename === 'string') {
          return {
            ...data,
            isHiddenVariant: isHiddenMediaVariant(filename),
          }
        }
        return data
      },
    ],
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'Content',
    description:
      'Site media library — select or upload images used across pages and posts. Grid view hides WordPress size variants by default; search by filename to find a specific size if needed.',
    pagination: {
      defaultLimit: 40,
      limits: [20, 40, 60, 100],
    },
    baseListFilter: () => ({
      isHiddenVariant: { not_equals: true },
    }),
    components: {
      views: {
        list: {
          Component: '/components/admin/media/MediaListView#MediaListView',
        },
      },
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Accessibility description shown when the image cannot be displayed.',
      },
    },
    {
      name: 'isHiddenVariant',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
      },
    },
  ],
}
