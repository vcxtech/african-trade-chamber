import type { MetadataRoute } from 'next'

const BASE = (process.env.NEXT_PUBLIC_SERVER_URL || 'https://africantradechamber.org').replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/search'],
    },
    sitemap: `${BASE}/sitemap.xml`,
  }
}
