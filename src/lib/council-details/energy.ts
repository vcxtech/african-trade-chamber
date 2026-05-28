import type { CouncilDetailData } from '@/types/council-page'
import { u } from './shared'

export const energyDetail: CouncilDetailData = {
  slug: 'energy',
  title: 'Energy Council',
  tagline: "Powering Africa's Future through Trade, Investment, and Innovation",
  introParagraphs: [
    "The Energy Council of the African Trade Chamber is a strategic platform that unites energy sector leaders, policymakers, investors, and innovators to advance trade, investment, and sustainable development in Africa's power, oil and gas, and renewable energy industries.",
    "Our mission is to position Africa's energy sector as a cornerstone of economic growth, industrialization, and climate resilience — driving access, affordability, and innovation across the continent.",
  ],
  focusAreas: [
    {
      title: 'Power Sector Development',
      description:
        'We promote investment in electricity generation, transmission, and distribution infrastructure to expand access to affordable, reliable energy for businesses and communities.',
      imageUrl: u('2025/11/photo-1497435334941-8c899ee9e8e9.jpg'),
      imageAlt: 'Power Sector Development',
    },
    {
      title: 'Oil & Gas Trade and Investment',
      description:
        'The Council facilitates exploration, production, refining, and cross-border trade in oil and gas, ensuring responsible resource management and competitive participation in global markets.',
      imageUrl: u('2025/11/30610.jpg'),
      imageAlt: 'Oil & Gas Trade and Investment',
    },
    {
      title: 'Renewable Energy Transition',
      description:
        "We accelerate the adoption of solar, wind, hydro, geothermal, and other renewable energy solutions to diversify Africa's energy mix, reduce emissions, and enhance energy security.",
      imageUrl: u('2025/11/photo-1509391366360-2e959784a276.jpg'),
      imageAlt: 'Renewable Energy Transition',
    },
    {
      title: 'Energy Infrastructure & Technology',
      description:
        "By fostering innovation and technology transfer, the Council supports the modernization of Africa's energy systems — from smart grids to clean fuel solutions — enabling sustainable industrial growth.",
      imageUrl: u('2025/11/126128.jpg'),
      imageAlt: 'Energy Infrastructure & Technology',
    },
  ],
  activities: [
    {
      title: 'Policy Advocacy',
      description:
        'Work with governments, regional bodies, and industry regulators to shape policies that promote energy trade, investment, and market integration.',
    },
    {
      title: 'Trade & Investment Facilitation',
      description:
        'Organize energy trade missions, investment forums, and project matchmaking between African energy companies and global partners.',
    },
    {
      title: 'Innovation & Technology Promotion',
      description:
        'Showcase clean energy innovations, energy efficiency solutions, and emerging technologies at African Trade Chamber events and exhibitions.',
    },
    {
      title: 'Capacity Building & Skills Development',
      description:
        'Deliver targeted training for energy professionals, entrepreneurs, and institutions to strengthen sectoral expertise.',
    },
    {
      title: 'Market Intelligence',
      description:
        "Provide members with research, sector trends, and investment opportunity reports across Africa's energy landscape.",
    },
  ],
  benefitsIntro: 'Members of the Energy Council enjoy:',
  benefits: [
    'Access to exclusive policy dialogues and strategic planning sessions',
    'Opportunities to participate in high-profile energy trade and investment events',
    'Visibility in African Trade Chamber publications and partner platforms',
    'Market intelligence and sector-specific research reports',
    'Networking with leading African and international energy stakeholders',
  ],
  benefitsImageUrl: u('2025/11/2148920581.jpg'),
  benefitsImageAlt: 'Membership Benefits',
  ctaParagraphs: [
    "Whether you operate in power generation, oil and gas, renewable energy, or energy technology, the Energy Council offers a collaborative platform to shape Africa's energy future.",
    "Join us today to drive sustainable growth, unlock investment, and power the next chapter of Africa's development.",
  ],
  contactEmail: 'energy@africantradechamber.org',
}
