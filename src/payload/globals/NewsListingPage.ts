import type { GlobalConfig } from 'payload'
import { contentGlobalAccess, hideUnlessArea } from '@/lib/payload-access'

export const NewsListingPage: GlobalConfig = {
  slug: 'news-listing-page',
  label: 'News Listing Page',
  access: contentGlobalAccess('communications'),
  admin: { group: 'Pages', hidden: hideUnlessArea('communications') },
  fields: [
    { name: 'introTitle', type: 'text', required: true },
    { name: 'introBody', type: 'textarea', required: true },
  ],
}
