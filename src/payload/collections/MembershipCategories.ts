import type { CollectionConfig } from 'payload'
import { contentCollectionAccess, hideUnlessArea } from '@/lib/payload-access'

export const MembershipCategories: CollectionConfig = {
  slug: 'membership-categories',
  access: contentCollectionAccess('membership'),
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'annualFee', 'order'],
    group: 'Membership',
    hidden: hideUnlessArea('membership'),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'benefits', type: 'textarea', required: true },
    { name: 'annualFee', type: 'text', required: true },
    { name: 'feePeriod', type: 'text', defaultValue: 'per year' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
