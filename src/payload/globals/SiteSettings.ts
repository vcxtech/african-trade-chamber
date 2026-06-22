import type { GlobalConfig } from 'payload'
import { adminOnlyAccess, hideUnlessAdmin } from '@/lib/payload-access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Site', hidden: hideUnlessAdmin() },
  access: adminOnlyAccess(),
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'African Trade Chamber',
    },
    {
      name: 'utilityBarLinks',
      type: 'array',
      label: 'Utility bar links (yellow top bar)',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social links',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Instagram', value: 'instagram' },
          ],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'headerNav',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        {
          name: 'children',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
            {
              name: 'flyout',
              type: 'select',
              options: [
                { label: 'Right', value: 'right' },
                { label: 'Left', value: 'left' },
              ],
              defaultValue: 'right',
            },
            {
              name: 'subItems',
              type: 'array',
              label: 'Sub-menu items',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'footerColumns',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'contactEmail',
      type: 'email',
    },
    {
      name: 'contactPhone',
      type: 'text',
    },
    {
      name: 'showTranslator',
      type: 'checkbox',
      label: 'Show language translator (bottom-left)',
      defaultValue: true,
    },
    {
      name: 'showWhatsappHelp',
      type: 'checkbox',
      label: 'Show WhatsApp help button (bottom-right)',
      defaultValue: true,
    },
    {
      name: 'whatsappHelpLabel',
      type: 'text',
      label: 'WhatsApp help button label',
      defaultValue: 'Need Help? Chat with us',
    },
    {
      name: 'fellowshipPopupEnabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'fellowshipPopupTitle',
      type: 'text',
      defaultValue: '2026 Future Trade Leaders Fellowship',
    },
    {
      name: 'fellowshipPopupBody',
      type: 'textarea',
    },
    {
      name: 'fellowshipPopupDeadline',
      type: 'text',
      defaultValue: '30th May, 2026',
    },
    {
      name: 'fellowshipPopupApplyUrl',
      type: 'text',
      defaultValue: '/fellowship/apply',
    },
  ],
}
