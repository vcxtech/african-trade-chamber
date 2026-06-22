import type { CollectionConfig } from 'payload'
import { contentCollectionAccess, hideUnlessArea } from '@/lib/payload-access'

export const MemberTestimonials: CollectionConfig = {
  slug: 'member-testimonials',
  access: contentCollectionAccess('membership'),
  labels: {
    singular: 'Member Testimonial',
    plural: 'Member Testimonials',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'sortOrder'],
    group: 'Membership',
    hidden: hideUnlessArea('membership'),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'position', type: 'text', required: true },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
