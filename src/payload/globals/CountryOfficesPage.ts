import type { GlobalConfig } from 'payload'
import { contentGlobalAccess, hideUnlessArea } from '@/lib/payload-access'

export const CountryOfficesPage: GlobalConfig = {
  slug: 'country-offices-page',
  label: 'Country Offices Page',
  access: contentGlobalAccess('communications'),
  admin: { group: 'Pages', hidden: hideUnlessArea('communications') },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      required: true,
      defaultValue: 'Regional Network & Country Offices',
    },
    {
      name: 'pageSubtitle',
      type: 'textarea',
      required: true,
    },
    {
      name: 'offices',
      type: 'array',
      label: 'Country offices',
      minRows: 1,
      fields: [
        { name: 'slug', type: 'text', required: true, admin: { description: 'URL anchor id, e.g. ghana' } },
        { name: 'flag', type: 'text', required: true, admin: { description: 'Flag emoji' } },
        { name: 'countryName', type: 'text', required: true },
        { name: 'regionLabel', type: 'text', required: true },
        {
          name: 'headerTheme',
          type: 'select',
          required: true,
          options: [
            { label: 'Ghana', value: 'ghana' },
            { label: 'Kenya', value: 'kenya' },
            { label: 'Nigeria', value: 'nigeria' },
            { label: 'South Africa', value: 'south-africa' },
            { label: 'DRC', value: 'drc' },
            { label: 'Liberia', value: 'liberia' },
            { label: 'São Tomé', value: 'sao-tome' },
            { label: 'Morocco', value: 'morocco' },
            { label: 'Ethiopia', value: 'ethiopia' },
            { label: 'Egypt', value: 'egypt' },
          ],
        },
        {
          name: 'officeStatus',
          type: 'select',
          required: true,
          options: [
            { label: 'Headquarters', value: 'headquarters' },
            { label: 'Active', value: 'active' },
            { label: 'In development', value: 'development' },
            { label: 'Planning', value: 'planning' },
          ],
        },
        { name: 'officeStatusLabel', type: 'text', required: true },
        {
          name: 'contacts',
          type: 'array',
          fields: [
            {
              name: 'type',
              type: 'select',
              required: true,
              options: [
                { label: 'Location', value: 'location' },
                { label: 'Phone', value: 'phone' },
                { label: 'Email', value: 'email' },
                { label: 'Note', value: 'note' },
              ],
            },
            { name: 'value', type: 'text', required: true },
          ],
        },
        {
          name: 'events',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'status',
              type: 'select',
              required: true,
              options: [
                { label: 'Confirmed', value: 'confirmed' },
                { label: 'Planning', value: 'planning' },
                { label: 'Development', value: 'development' },
              ],
            },
            { name: 'statusLabel', type: 'text', required: true },
          ],
        },
        {
          name: 'learnMoreUrl',
          type: 'text',
          admin: { description: 'Optional — internal path or full URL' },
        },
      ],
    },
  ],
}
