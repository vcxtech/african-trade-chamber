import type { CollectionConfig } from 'payload'



export const Media: CollectionConfig = {

  slug: 'media',

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

    ],

  },

  admin: {

    useAsTitle: 'filename',

    defaultColumns: ['filename', 'alt', 'updatedAt'],

    group: 'Content',

    description: 'Site media library — select or upload images used across pages and posts.',

    pagination: {

      defaultLimit: 40,

      limits: [20, 40, 60, 100],

    },

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

  ],

}


