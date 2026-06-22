import { revalidatePath } from 'next/cache'
import type { CollectionConfig } from 'payload'
import { applyFellowshipCohortBeforeChange } from '@/lib/fellowship-cohort-utils'
import { contentCollectionAccess, hideUnlessArea } from '@/lib/payload-access'
import { fellowshipCohortFields } from '../fields/fellowshipCohortFields'

const COHORT_LIST_GUIDE =
  '/components/admin/fellowship/FellowshipCohortListGuide#FellowshipCohortListGuide'

export const FellowshipCohorts: CollectionConfig = {
  slug: 'fellowship-cohorts',
  access: contentCollectionAccess('programs'),
  labels: {
    singular: 'Fellowship Cohort',
    plural: 'Fellowship Cohorts',
  },
  admin: {
    group: 'Fellowship',
    hidden: hideUnlessArea('programs'),
    useAsTitle: 'title',
    defaultColumns: ['cohortYear', 'title', 'updatedAt'],
    description:
      'One entry per cohort year (/fellowship/2025, /fellowship/2026). Hub card + cohort page hero, SEO, and testimonials.',
    components: {
      beforeList: [COHORT_LIST_GUIDE],
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data) applyFellowshipCohortBeforeChange(data as Record<string, unknown>)
        return data
      },
    ],
    afterChange: [
      ({ doc }) => {
        const year = doc?.cohortYear
        if (!year) return
        try {
          revalidatePath('/fellowship')
          revalidatePath(`/fellowship/${year}`)
        } catch {
          // No-op outside Next.js request context (seed/migration scripts).
        }
      },
    ],
  },
  fields: fellowshipCohortFields,
}
