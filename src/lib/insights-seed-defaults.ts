import type { InsightCategory } from '@/types/insight-article'

export type InsightSeedRow = {
  title: string
  slug: string
  excerpt: string
  category: InsightCategory
  author?: string
  imageUrl?: string
  publishedAt: string
  originalUrl?: string
}

export const defaultInsightsSeed: InsightSeedRow[] = [
  {
    title: 'Sector Report On Agribusiness In Ghana',
    slug: 'sector-report-on-agribusiness-in-ghana',
    category: 'sector-report',
    author: 'Maame Nyaniba Seniagya',
    publishedAt: '2025-08-21T12:00:00.000Z',
    originalUrl: 'https://africantradechamber.org/sector-report-on-agribusiness-in-ghana/',
    excerpt:
      "Prepared by: Maame Nyaniba Seniagya Executive Summary Ghana's economy still depends heavily on agriculture, which has a long history and rich cultural heritage. Through colonial rule, post-independence reforms, and current policy interventions, the sector has undergone tremendous change.",
  },
]
