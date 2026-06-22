import type { GlobalConfig } from 'payload'
import { contentGlobalAccess, hideUnlessArea } from '@/lib/payload-access'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  access: contentGlobalAccess('communications'),
  admin: { group: 'Pages', hidden: hideUnlessArea('communications') },
  fields: [
    { name: 'sectionTitle', type: 'text', required: true },
    { name: 'mainContent', type: 'textarea', required: true },
    { name: 'visionContent', type: 'textarea', required: true },
    { name: 'missionContent', type: 'textarea', required: true },
  ],
}
