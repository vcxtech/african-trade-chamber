import type { GlobalConfig } from 'payload'
import { contentGlobalAccess, hideUnlessArea } from '@/lib/payload-access'

export const DonatePage: GlobalConfig = {
  slug: 'donate-page',
  label: 'Donate Page',
  access: contentGlobalAccess('careers'),
  admin: { group: 'Pages', hidden: hideUnlessArea('careers') },
  fields: [
    { name: 'headerTitle', type: 'text', required: true },
    { name: 'headerTagline', type: 'text', required: true },
    { name: 'heroTitle', type: 'text', required: true },
    {
      name: 'heroParagraphs',
      type: 'array',
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    { name: 'whyTitle', type: 'text', required: true },
    { name: 'whyIntro', type: 'text', required: true },
    {
      name: 'whyBenefits',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'whoTitle', type: 'text', required: true },
    { name: 'whoIntro', type: 'text', required: true },
    {
      name: 'donorCategories',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
      ],
    },
    { name: 'transparencyTitle', type: 'text', required: true },
    { name: 'transparencyText', type: 'textarea', required: true },
    { name: 'ctaTitle', type: 'text', required: true },
    { name: 'ctaText', type: 'textarea', required: true },
    { name: 'financeEmail', type: 'text', required: true },
    { name: 'financePhone', type: 'text', required: true },
    { name: 'thankYouTitle', type: 'text', required: true },
    { name: 'thankYouText', type: 'textarea', required: true },
    { name: 'formTitle', type: 'text', required: true },
  ],
}
