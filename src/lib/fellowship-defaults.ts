import {
  FELLOW_TESTIMONIALS,
  RESOURCE_TESTIMONIALS,
} from '@/lib/fellowship-2025-testimonials'
import type { FellowshipPageData } from '@/types/fellowship'

const COHORT_2025_PAGE = {
  pageHeroTitle: 'Future Trade Leaders Fellowship Community 2025',
  pageHeroSubtitle:
    "Meet the inspiring individuals and expert minds shaping Africa and the Caribbean's future in trade.",
  pageHeroImageUrl: '/uploads/2025/04/Young-ent-2.jpg',
  pageHeroImageAlt: 'Future Trade Leaders Fellowship 2025 cohort',
  seoTitle: 'Future Trade Leaders Fellowship Community 2025',
  seoDescription:
    "Meet the 2025 Future Trade Leaders Fellowship cohort — professionals shaping Africa and the Caribbean's future in trade.",
  showTestimonials: true,
  fellowTestimonialsTitle: 'Fellow Testimonials',
  fellowTestimonialsIntro:
    'Hear directly from fellowship graduates about their transformative experiences and career impact.',
  resourceTestimonialsTitle: 'Resource Person Testimonials',
  resourceTestimonialsIntro:
    'Insights from industry experts, mentors, and leaders who work closely with our fellows.',
  fellowTestimonials: FELLOW_TESTIMONIALS,
  resourceTestimonials: RESOURCE_TESTIMONIALS,
} as const

const COHORT_2026_PAGE = {
  pageHeroTitle: 'Future Trade Leaders Fellowship Community 2026',
  pageHeroSubtitle:
    "Meet the inspiring individuals and expert minds shaping Africa and the Caribbean's future in trade.",
  pageHeroImageUrl: '/images/fellowship/cohort-2026.jpg',
  pageHeroImageAlt: 'Future Trade Leaders Fellowship 2026 cohort',
  seoTitle: 'Future Trade Leaders Fellowship Community 2026',
  seoDescription:
    "Meet the 2026 Future Trade Leaders Fellowship cohort — professionals shaping Africa and the Caribbean's future in trade.",
  showTestimonials: true,
  fellowTestimonialsTitle: 'Fellow Testimonials',
  fellowTestimonialsIntro: '',
  resourceTestimonialsTitle: 'Resource Person Testimonials',
  resourceTestimonialsIntro: '',
  fellowTestimonials: [] as typeof FELLOW_TESTIMONIALS,
  resourceTestimonials: [] as typeof RESOURCE_TESTIMONIALS,
} as const

export const defaultFellowshipCohorts: FellowshipPageData['cohorts'] = [
    {
      cohortYear: 2025,
      yearLabel: '2025 cohort',
      title: 'Future Trade Leaders Fellowship (2025)',
      description:
        'The 2025 cohort brings together professionals advancing intra-African trade, enterprise development, and leadership across the continent and the Caribbean.',
      imageUrl: '/images/fellowship/cohort-2025.jpg',
      imageAlt: 'Future Trade Leaders Fellowship 2025 cohort',
      exploreUrl: '/fellowship/2025',
      exploreExternal: false,
      ...COHORT_2025_PAGE,
    },
    {
      cohortYear: 2026,
      yearLabel: '2026 cohort',
      title: 'Future Trade Leaders Fellowship (2026)',
      description:
        'The upcoming 2026 fellowship continues the flagship experience for SMEs and entrepreneurs shaping the future of trade in the region.',
      imageUrl: '/images/fellowship/cohort-2026.jpg',
      imageAlt: 'Future Trade Leaders Fellowship 2026 cohort',
      exploreUrl: '/fellowship/2026',
      exploreExternal: false,
      ...COHORT_2026_PAGE,
    },
  ]

export const defaultFellowshipPage: FellowshipPageData = {
  heroImageUrl: '/images/fellowship/hero.png',
  introText:
    'The Future Trade Leaders Fellowship is a flagship initiative of the African Trade Chamber designed to develop a new generation of trade leaders across Africa and the Caribbean. Positioned at the intersection of policy, markets, and global trade systems, the program equips participants with practical knowledge of international trade, regional integration, and opportunities under the AfCFTA, while fostering collaboration, peer exchange, and access to key stakeholders. Through this, the Fellowship builds a strong network of individuals prepared to contribute meaningfully to Africa’s evolving trade landscape and economic transformation.',
  cohorts: defaultFellowshipCohorts,
  cta: {
    eyebrow: 'Call for Applications',
    title: '2026 Future Trade Leaders Fellowship Program',
    tagline: 'Young Entrepreneurs and SMEs Cohort',
    sections: [
      {
        heading: 'About the Fellowship Program',
        paragraphs: [
          'The African Trade Chamber is excited to announce the launch of the second Future Trade Leaders Fellowship Program designed to empower and cultivate the generation of trade leaders across Africa and the Caribbean to champion the intra-African and Caribbean trade agenda.',
          'This is a 6-month program.',
        ],
      },
      {
        heading: 'Program Objectives',
        paragraphs: [
          'This comprehensive fellowship program aims to provide young professionals with the Enterprise skills, knowledge and networks necessary to excel in the dynamic field of international trade. It further seeks to:',
        ],
        listItems: [
          'Equip fellows with a deep understanding of global trade dynamics, policies, controls and regulations.',
          'Foster leadership and transactional skills as well encourage innovative thinking in trade-related fields.',
          'Create a network of multifunctional trade leaders across Africa and the Caribbean for collaboration and knowledge-sharing.',
          'Provide mentorship opportunities with seasoned professionals in the trade industry.',
          'Equip Young Entrepreneurs with the tools to strengthen their business models, develop investment-ready plans, and improve their access to funding and growth opportunities.',
        ],
      },
      {
        heading: 'Program Components',
        labeledParagraphs: [
          {
            label: 'Interactive Workshops:',
            text: 'Engage in workshops covering various aspects of international trade, including trade finance, supply chain management, trade negotiations and trade policy analysis.',
          },
          {
            label: 'Resource Persons:',
            text: 'Direct interaction with experienced trade professionals who will provide guidance and support.',
          },
          {
            label: 'Networking Events:',
            text: 'Connect with other fellows, industry experts and leaders in the trade community through networking and pitching events, panel discussions and conferences.',
          },
          {
            label: 'Practical Projects:',
            text: 'Collaborate on real-world projects that address current challenges and opportunities in intra-African and Caribbean trade, gaining hands-on experience and making tangible contributions to the field.',
          },
        ],
      },
      {
        heading: 'Who Should Apply?',
        paragraphs: [
          'The program is open to Young Entrepreneurs that demonstrate a passion for progressive trade and have the potential to become future leaders in the field. Ideal candidates should possess the following qualities:',
        ],
        listItems: [
          {
            title: 'Active Business Engagement',
            body: 'Must be actively running or managing an SME with a clear product or service offering.',
          },
          {
            title: 'Growth Mindset',
            body: 'Demonstrates a clear ambition to grow, scale, or expand into new markets.',
          },
          {
            title: 'Basic Business Understanding',
            body: 'Has a working knowledge of their business operations (customers, revenue, costs, etc.).',
          },
          {
            title: 'Commitment & Availability',
            body: 'Able to fully participate in the program and complete required activities.',
          },
          {
            title: 'Openness to Learning & Collaboration',
            body: 'Willing to engage, learn, and work with peers across different markets and sectors.',
          },
        ],
      },
      {
        heading: 'Applicants must:',
        listItems: [
          'Be a citizen of an African or Caribbean country.',
          'Be 18 – 40 years old.',
          'Have a registered business.',
        ],
      },
      {
        heading: 'Deadline',
        paragraphs: ['Applications must be submitted by 30th May, 2026'],
      },
      {
        heading: 'Selection Process',
        paragraphs: [
          'Candidates will be evaluated based on demonstrated interest and involvement in trade, leadership and managerial potential for the program. Shortlisted applicants will be invited for online interviews as part of the selection process.',
        ],
      },
      {
        heading: 'Contact Information',
        paragraphs: [
          'For inquiries or further information about the Future Trade Leaders Fellowship Program, please contact the African Trade Chamber on the phone number or email below.',
        ],
      },
    ],
    footerParagraphs: [
      'Join us in shaping the future of intra-African and Caribbean trade.',
      'Apply now and embark on a transformative journey towards driving Africa’s shared prosperity!',
    ],
    applyUrl: '/fellowship/apply',
    contactPhone: '+233505366200',
    contactEmail: 'fellowships@africantradechamber.org',
  },
}
