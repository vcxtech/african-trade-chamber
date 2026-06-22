import type { Field } from 'payload'
import { imageAltField, legacyImageUrlField, mediaImageField } from './mediaImage'

const COHORT_VIEW_LIVE = '/components/admin/fellowship/FellowshipCohortViewLive#FellowshipCohortViewLive'
const COHORT_TESTIMONIALS_NOTE =
  '/components/admin/fellowship/FellowshipCohortTestimonialsNote#FellowshipCohortTestimonialsNote'

export const fellowshipCohortFields: Field[] = [
  {
    name: 'viewLive',
    type: 'ui',
    admin: {
      components: {
        Field: COHORT_VIEW_LIVE,
      },
    },
  },
  {
    name: 'cohortYear',
    type: 'select',
    label: 'Cohort year',
    required: true,
    unique: true,
    options: [
      { label: '2025', value: '2025' },
      { label: '2026', value: '2026' },
    ],
  },
  {
    type: 'collapsible',
    label: 'Hub card (/fellowship)',
    admin: { initCollapsed: false },
    fields: [
      { name: 'yearLabel', type: 'text', required: true, label: 'Card year label' },
      { name: 'title', type: 'text', required: true, label: 'Card title' },
      { name: 'description', type: 'textarea', required: true, label: 'Card description' },
      mediaImageField({ name: 'image', label: 'Hub card image' }),
      imageAltField(),
      legacyImageUrlField('imageUrl'),
      {
        name: 'exploreUrl',
        type: 'text',
        admin: {
          readOnly: true,
          description: 'Auto-set to /fellowship/{cohort year} when saved.',
        },
      },
      {
        name: 'exploreExternal',
        type: 'checkbox',
        defaultValue: false,
        admin: { hidden: true },
      },
    ],
  },
  {
    type: 'collapsible',
    label: 'Cohort page (/fellowship/{year})',
    admin: { initCollapsed: false },
    fields: [
      { name: 'pageHeroTitle', type: 'text', required: true, label: 'Page hero title' },
      { name: 'pageHeroSubtitle', type: 'textarea', required: true, label: 'Page hero subtitle' },
      mediaImageField({ name: 'pageHeroImage', label: 'Page hero background' }),
      { name: 'pageHeroImageAlt', type: 'text', label: 'Page hero image alt' },
      legacyImageUrlField('pageHeroImageUrl'),
      { name: 'seoTitle', type: 'text', required: true, label: 'SEO title' },
      { name: 'seoDescription', type: 'textarea', required: true, label: 'SEO description' },
      {
        name: 'showTestimonials',
        type: 'checkbox',
        label: 'Show testimonials section',
        defaultValue: true,
        admin: {
          description:
            'When off, the entire testimonials block is hidden on /fellowship/{year} — even if rows exist below.',
        },
      },
      {
        name: 'testimonialsNote',
        type: 'ui',
        admin: {
          components: {
            Field: COHORT_TESTIMONIALS_NOTE,
          },
        },
      },
      {
        name: 'fellowTestimonialsTitle',
        type: 'text',
        label: 'Fellow testimonials heading',
        defaultValue: 'Fellow Testimonials',
      },
      {
        name: 'fellowTestimonialsIntro',
        type: 'textarea',
        label: 'Fellow testimonials intro',
      },
      {
        name: 'fellowTestimonials',
        type: 'array',
        label: 'Fellow testimonials',
        fields: [
          { name: 'quote', type: 'textarea', required: true },
          { name: 'name', type: 'text', required: true },
          { name: 'subtitle', type: 'text', required: true },
          { name: 'initials', type: 'text', required: true },
        ],
      },
      {
        name: 'resourceTestimonialsTitle',
        type: 'text',
        label: 'Resource person testimonials heading',
        defaultValue: 'Resource Person Testimonials',
      },
      {
        name: 'resourceTestimonialsIntro',
        type: 'textarea',
        label: 'Resource person testimonials intro',
      },
      {
        name: 'resourceTestimonials',
        type: 'array',
        label: 'Resource person testimonials',
        fields: [
          { name: 'quote', type: 'textarea', required: true },
          { name: 'name', type: 'text', required: true },
          { name: 'role', type: 'text', required: true },
          { name: 'organization', type: 'text' },
        ],
      },
    ],
  },
]
