import type { GlobalConfig } from 'payload'
import { contentGlobalAccess, hideUnlessArea } from '@/lib/payload-access'

export const VolunteerPage: GlobalConfig = {
  slug: 'volunteer-page',
  label: 'Volunteer Page',
  access: contentGlobalAccess('careers'),
  admin: { group: 'Pages', hidden: hideUnlessArea('careers') },
  fields: [
    { name: 'headerTitle', type: 'text', required: true },
    { name: 'headerTagline', type: 'text', required: true },
    { name: 'heroTitle', type: 'text', required: true },
    { name: 'heroText', type: 'textarea', required: true },
    { name: 'heroText2', type: 'textarea', required: true },
    { name: 'whyTitle', type: 'text', required: true },
    { name: 'whyIntro', type: 'text', required: true },
    {
      name: 'whyBenefits',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'rolesTitle', type: 'text', required: true },
    {
      name: 'roles',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
      ],
    },
    { name: 'whoTitle', type: 'text', required: true },
    { name: 'whoIntro', type: 'text', required: true },
    {
      name: 'whoCanApply',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'commitmentTitle', type: 'text', required: true },
    { name: 'commitmentText', type: 'textarea', required: true },
    { name: 'formTitle', type: 'text', required: true },
    { name: 'formSubtitle', type: 'text', required: true },
    { name: 'formEmail', type: 'text', required: true },
    { name: 'submitButtonText', type: 'text', required: true },
    { name: 'thankYouTitle', type: 'text', required: true },
    { name: 'thankYouText', type: 'textarea', required: true },
  ],
}
