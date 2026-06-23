import type { CollectionConfig } from 'payload'
import { getPayloadCookieSecure } from '@/lib/payload-server-url'
import {
  adminFieldUpdate,
  hideUnlessAdmin,
  isAdmin,
  type AtcUser,
} from '@/lib/payload-access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Keep lock columns in the schema (maxLoginAttempts: 0 drops them and triggers interactive push prompts).
    maxLoginAttempts: process.env.NODE_ENV === 'development' ? 999 : 5,
    lockTime: 600 * 1000,
    cookies: {
      sameSite: 'Lax',
      secure: getPayloadCookieSecure(),
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'role'],
    description:
      'CMS staff accounts. Administrators manage all content and settings. Editors can change content in assigned areas.',
    group: 'Administration',
    hidden: hideUnlessAdmin(),
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: ({ req }) => {
      if (!req.user) return false
      if ((req.user as AtcUser).role === 'admin') return true
      return { id: { equals: req.user.id } }
    },
    update: ({ req, id }) => {
      if (!req.user) return false
      if ((req.user as AtcUser).role === 'admin') return true
      return req.user.id === id
    },
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      label: 'First name',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last name',
    },
    {
      name: 'displayName',
      type: 'text',
      label: 'Display name',
      admin: {
        description: 'Shown in the admin bar. Leave blank to use first + last name.',
      },
    },
    {
      name: 'jobTitle',
      type: 'text',
      label: 'Job title',
      admin: {
        placeholder: 'e.g. Communications Manager',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      defaultValue: 'editor',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        update: adminFieldUpdate,
      },
      admin: {
        position: 'sidebar',
        condition: (_, __, { user }) => (user as AtcUser | undefined)?.role === 'admin',
      },
    },
    {
      name: 'contentAreas',
      type: 'select',
      label: 'Content areas',
      hasMany: true,
      options: [
        { label: 'Communications', value: 'communications' },
        { label: 'Homepage', value: 'homepage' },
        { label: 'Programs', value: 'programs' },
        { label: 'Membership', value: 'membership' },
        { label: 'Careers', value: 'careers' },
      ],
      access: {
        update: adminFieldUpdate,
      },
      admin: {
        position: 'sidebar',
        condition: (_, __, { user }) => (user as AtcUser | undefined)?.role === 'admin',
        description:
          'Assign at least one content area. Editors cannot access content until areas are assigned.',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio / notes',
      admin: {
        description: 'Optional — visible on your account page only.',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (!data) return data
        const first = typeof data.firstName === 'string' ? data.firstName.trim() : ''
        const last = typeof data.lastName === 'string' ? data.lastName.trim() : ''
        const display =
          typeof data.displayName === 'string' ? data.displayName.trim() : ''
        if (!display && (first || last)) {
          data.displayName = [first, last].filter(Boolean).join(' ')
        }

        if (req.user && (req.user as AtcUser).role !== 'admin') {
          delete data.role
          delete data.contentAreas
        }

        return data
      },
    ],
  },
}
