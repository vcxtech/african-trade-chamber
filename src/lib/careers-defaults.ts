import type { CareerJob } from '@/types/career-job'

const ABOUT_ATC =
  'The African Trade Chamber is a private sector-led institution working to strengthen Africa\'s commercial and trade architecture by advancing intra-African trade, investment flows, and market integration. The Chamber operates at the intersection of private sector engagement, trade policy dialogue, and economic development.'

const STANDARD_REQUIREMENTS =
  'Applicants should submit the following documents:<br>• Curriculum Vitae including professional references<br>• Cover Letter outlining interest in the role'

const STANDARD_PROCESS =
  'Applications will be reviewed by the Chamber\'s recruitment panel. Shortlisted candidates will be invited for interviews. Only shortlisted candidates will be contacted.'

const STANDARD_APPOINTMENT =
  'This is a full-time senior leadership position within the African Trade Chamber. The appointment will be offered on an initial contractual basis with the possibility of renewal based on performance and institutional requirements.'

const STANDARD_LOCATION =
  'Duty Station: Accra, Ghana. The role operates across Africa and internationally. Travel across Africa and internationally will be required.'

function job(
  slug: string,
  title: string,
  jobId: string,
  postedAt: string,
  summary: string,
  extra?: Partial<CareerJob>,
): CareerJob {
  return {
    id: jobId,
    slug,
    title,
    jobId,
    location: 'Accra, Ghana',
    jobType: 'Full-time',
    category: 'Leadership',
    postedAt,
    applyUrl: `/careers/${slug}/apply`,
    summary,
    aboutHtml: ABOUT_ATC,
    requirementsHtml: STANDARD_REQUIREMENTS,
    processHtml: STANDARD_PROCESS,
    appointment: STANDARD_APPOINTMENT,
    locationScope: STANDARD_LOCATION,
    deadline: '30 April, 2026',
    ...extra,
  }
}

export const defaultCareerJobs: CareerJob[] = [
  job('director-of-memberships', 'Director of Memberships', 'ATCMd081', '2026-03-13', 'The African Trade Chamber invites applications from qualified and experienced professionals for the position of Director of Memberships. This senior leadership role is responsible for developing and managing the Chamber\'s membership strategy and strengthening engagement with businesses and institutions participating in the Chamber\'s network.', {
    roleHtml:
      'As Director of Memberships, you will lead the development and implementation of the African Trade Chamber\'s membership strategy and oversee engagement with the Chamber\'s growing network of businesses, investors, and institutional partners. The role focuses on expanding the Chamber\'s membership base across Africa and internationally while ensuring that member institutions derive meaningful value from their participation in the Chamber\'s platforms and initiatives.',
    responsibilitiesHtml:
      '• Drive Membership Growth: Develop and implement strategies to expand the Chamber\'s membership base across key industries, sectors, and geographic regions.<br>• Strengthen Member Engagement: Ensure that member institutions actively participate in the Chamber\'s programs, initiatives, and convenings.<br>• Develop Membership Platforms: Design and oversee membership programs, services, and engagement opportunities that provide value to participating institutions.<br>• Build Institutional Relationships: Engage with businesses, investors, industry associations, and institutional partners to strengthen the Chamber\'s membership community.<br>• Support Strategic Initiatives: Facilitate member participation in the Chamber\'s platforms, including major convenings such as the Africa Trade Summit and sector-focused initiatives.<br>• Enhance Member Value: Work closely with member institutions to understand their priorities and facilitate opportunities for collaboration, networking, and business engagement.',
    qualificationsHtml:
      '• Advanced degree in business administration, economics, international relations, marketing, public policy, or a related field.<br>• Postgraduate qualifications will be considered an advantage.<br>• Minimum 10–15 years of professional experience in membership management, corporate engagement, business development, or private sector development.<br>• Demonstrated ability to engage senior executives, investors, and institutional leaders.',
    competenciesHtml:
      '• Strategic leadership and membership development<br>• Stakeholder engagement and relationship management<br>• Business networking and institutional collaboration<br>• Strong communication and negotiation skills<br>• Strategic thinking and program development<br>• Ability to work effectively in diverse and cross-cultural environments',
  }),
  job(
    'director-of-programs-and-sector-platforms',
    'Director of Programs and Sector Platforms',
    'ATCPD082',
    '2026-03-16',
    'The African Trade Chamber invites applications for the position of Director of Programs and Sector Platforms. This senior leadership role is responsible for developing and managing the Chamber\'s institutional programs and sector engagement platforms that support trade expansion, industrial development, and private sector collaboration across Africa.',
  ),
  job(
    'director-of-events-and-strategic-convenings',
    'Director of Events and Strategic Convenings',
    'ATCED083',
    '2026-03-16',
    'The African Trade Chamber invites applications for the position of Director of Events and Strategic Convenings. This senior leadership role is responsible for leading the planning and delivery of the Chamber\'s high-level convenings, forums, and institutional dialogue platforms.',
  ),
  job(
    'director-of-trade-and-investment-facilitation',
    'Director of Trade and Investment Facilitation',
    'ATCTI084',
    '2026-03-16',
    'The African Trade Chamber invites applications for the position of Director of Trade and Investment Facilitation. This senior leadership role is responsible for leading the Chamber\'s initiatives that promote cross-border trade, investment partnerships, and commercial collaboration across African markets.',
  ),
  job(
    'director-of-policy-and-strategic-intelligence',
    'Director of Policy and Strategic Intelligence',
    'ATCPS085',
    '2026-03-16',
    'The African Trade Chamber invites applications for the position of Director of Policy and Strategic Intelligence. This senior leadership role is responsible for leading the Chamber\'s policy research, strategic analysis, and economic intelligence initiatives related to Africa\'s trade and economic landscape.',
  ),
  job(
    'director-of-communications-and-institutional-engagement',
    'Director of Communications and Institutional Engagement',
    'ATCCE086',
    '2026-03-16',
    'The African Trade Chamber invites applications for the position of Director of Communications and Institutional Engagement. This senior leadership role is responsible for leading the Chamber\'s communications strategy and strengthening its institutional visibility and engagement with partners, media, and stakeholders.',
  ),
  job(
    'director-of-partnerships',
    'Director of Partnerships',
    'ATCP087',
    '2026-03-27',
    'The African Trade Chamber invites applications from experienced and high-performing professionals for the position of Director of Partnerships. This senior leadership role is responsible for shaping and managing the Chamber\'s institutional partnership strategy and cultivating strategic relationships with governments, development finance institutions, corporations, and international partners.',
    {
      roleHtml:
        'As Director of Partnerships, you will lead the Chamber\'s strategy for building and managing institutional partnerships that support its programs, platforms, and initiatives. The role focuses on developing collaborations with governments, development finance institutions, multinational corporations, foundations, and international organizations.',
      responsibilitiesHtml:
        '• Drive Partnerships Strategy<br>• Expand Strategic Relationships<br>• Support Institutional Initiatives<br>• Mobilize Institutional Support<br>• Strengthen Institutional Representation',
      qualificationsHtml:
        '• Advanced degree in economics, international development, international relations, business administration, public policy, law, or a related field.<br>• Minimum 10–15 years of professional experience in institutional partnerships or stakeholder engagement.',
      competenciesHtml:
        '• Strategic leadership and institutional diplomacy<br>• Partnership development and relationship management<br>• Public-private partnership facilitation<br>• Resource mobilization and stakeholder engagement',
    },
  ),
]
