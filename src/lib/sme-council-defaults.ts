import type { SmeCouncilPageData } from '@/types/council-page'

const u = (path: string) => `/uploads/${path}`

export const defaultSmeCouncilPage: SmeCouncilPageData = {
  title: 'SME Council',
  tagline:
    "Empowering Africa's Small and Medium-Sized Enterprises for Growth and Global Competitiveness",
  introParagraphs: [
    "The SME Council of the African Trade Chamber (ATC) is the platform through which small and medium enterprises are formally organised and represented within the Chamber's work on trade, industrial development, and market integration across Africa.",
    "The Council brings together SMEs operating across priority sectors and jurisdictions, providing a structured channel through which enterprise realities, constraints, and opportunities are consolidated and reflected in the Chamber's engagement with governments, large enterprises, development finance institutions, and trade-enabling bodies, including those working within the African Continental Free Trade Area (AfCFTA) framework.",
    "Established as a statutory council of the African Trade Chamber, the SME Council operates alongside the Chamber's Industry and Thematic Councils. This structure allows SMEs to participate meaningfully in the Chamber's activities while preserving the Chamber's governance integrity and institutional standing.",
  ],
  objectives: [
    {
      title: 'Enterprise Organisation',
      description:
        'Organising SMEs into credible, coordinated enterprise clusters across sectors and jurisdictions.',
    },
    {
      title: 'Trade Participation',
      description:
        'Supporting SME participation in trade, manufacturing, and cross-border market opportunities.',
    },
    {
      title: 'Institutional Interface',
      description:
        'Providing a collective interface between SMEs and larger market actors, public institutions, and development partners.',
    },
    {
      title: 'Policy Engagement',
      description:
        "Elevating SME perspectives into the Chamber's policy, advocacy, and evidence-based engagements.",
    },
    {
      title: 'Sectoral Progression',
      description:
        'Creating pathways for enterprises to progress into deeper sectoral and strategic engagement within the Chamber.',
    },
    {
      title: 'Value Chain Integration',
      description:
        'Strengthening the role of African enterprises in trade and industrial value chains through structured coordination.',
    },
  ],
  membershipParagraphs: [
    'Enterprises participate in the African Trade Chamber through the SME Council as SME Council Members. Membership is open to formally registered small and medium enterprises operating in African countries, including those active in manufacturing, agro-processing, mining services, energy and power services, logistics, pharmaceuticals, and digital trade.',
    'The SME Council operates as one unified platform. It does not apply internal membership tiers. Differences in enterprise scale, capability, and readiness are reflected through participation in specific initiatives, sector programmes, and market engagements, rather than through formal classification.',
  ],
  participationImageUrl: u('2025/11/2150690161.jpg'),
  participationImageAlt: 'Participation Contribution',
  participationParagraphs: [
    "SME Council Members make an annual Participation Contribution in support of the Council's work. This contribution is not a commercial membership fee. It reflects a shared commitment to sustaining a functional, enterprise-led platform capable of delivering structured engagement, coordination, and representation.",
    'Contribution levels are designed to remain measured, context-aware, and inclusive, with flexibility and sponsorship mechanisms to ensure that viable enterprises are not excluded on financial grounds.',
  ],
  participationBullets: [
    'The organisation and coordination of SME engagement across countries and sectors',
    'The delivery of trade, market access, and business-matching initiatives',
    'Structured policy engagement on issues affecting SME participation in trade and industry',
    'The maintenance of institutional systems and the SME Council registry',
  ],
  engagementTitle: 'Engagement and Progression',
  engagementParagraphs: [
    "Through active participation in the SME Council, enterprises gain access to the African Trade Chamber's trade initiatives, sector platforms, market-access programmes, and policy engagement processes.",
    'Enterprises demonstrating sustained growth, cross-border activity, and strategic relevance may be considered for deeper sector participation and, where appropriate, progression into full African Trade Chamber membership in line with established criteria.',
    'Interested in joining the SME Council? Complete the participation request form below to begin your journey with the African Trade Chamber.',
  ],
  contactEmail: 'sme@africantradechamber.org',
}
