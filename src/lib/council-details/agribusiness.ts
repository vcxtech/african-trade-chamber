import type { CouncilDetailData } from '@/types/council-page'
import { u } from './shared'

export const agribusinessDetail: CouncilDetailData = {
  slug: 'agribusiness',
  title: 'Agribusiness Council',
  tagline:
    "Advancing Africa's Agricultural Transformation through Trade, Investment, and Innovation",
  introParagraphs: [
    "The Agribusiness Industry Council of the African Trade Chamber brings together agribusiness leaders, policymakers, investors, and value chain stakeholders to advance Africa's agricultural transformation. The Council fosters trade, investment, and innovation across the sector to unlock the continent's vast potential.",
    "Our mission is to position agribusiness as a key driver of Africa's economic growth, food security, and sustainable development — creating opportunities from farm to market.",
  ],
  focusAreas: [
    {
      title: 'Agricultural Transformation',
      description:
        'We promote modern, climate-smart farming techniques and technologies that increase productivity, enhance sustainability, and improve competitiveness in regional and global markets.',
      imageUrl: u('2025/11/2149894720.jpg'),
      imageAlt: 'Agricultural Transformation',
    },
    {
      title: 'Value Chain Development',
      description:
        'We support the entire agricultural value chain — from production and processing to logistics, distribution, and export — ensuring agribusinesses capture more value and create jobs across rural and urban communities.',
      imageUrl: u('2025/11/photo-1574943320219-553eb213f72d.avif'),
      imageAlt: 'Value Chain Development',
    },
    {
      title: 'Food Security & Nutrition',
      description:
        'We champion trade policies, partnerships, and investments that strengthen food systems, improve access to nutritious food, and build resilience against climate and market shocks.',
      imageUrl: u('2025/11/photo-1542838132-92c53300491e.jpg'),
      imageAlt: 'Food Security & Nutrition',
    },
    {
      title: 'Market Access & Trade Facilitation',
      description:
        'We connect farmers, processors, and agribusiness enterprises with domestic, continental, and international buyers, opening new trade opportunities and helping members navigate regulations, standards, and certifications.',
      imageUrl: u('2025/10/market.jpg'),
      imageAlt: 'Market Access & Trade Facilitation',
    },
  ],
  activities: [
    {
      title: 'Policy Advocacy',
      description:
        'Engage with governments and regional bodies to shape agribusiness-friendly policies and harmonized trade regulations under frameworks like the AfCFTA.',
    },
    {
      title: 'Trade Missions & Expos',
      description:
        'Organize B2B and B2G engagements, trade fairs, and market development missions to showcase African agricultural products globally.',
    },
    {
      title: 'Investment Promotion',
      description:
        'Facilitate partnerships between agribusiness enterprises and investors, including private equity, DFIs, and impact funds.',
    },
    {
      title: 'Capacity Building',
      description:
        'Deliver training, technical assistance, and knowledge-sharing platforms to strengthen skills, productivity, and business operations.',
    },
    {
      title: 'Research & Market Intelligence',
      description:
        'Provide members with data-driven insights on market trends, emerging opportunities, and risk management in agribusiness trade.',
    },
  ],
  benefitsIntro: 'Members of the Agribusiness Industry Council gain:',
  benefits: [
    'Access to high-level policy dialogues and decision-making platforms',
    'Participation in exclusive trade and investment matchmaking events',
    'Market intelligence reports and sector-specific research',
    'Opportunities to showcase products at African Trade Chamber events and partner exhibitions',
    'Networking with leading agribusiness companies, government agencies, and international organizations',
  ],
  benefitsImageUrl: u('2025/11/2149894717.jpg'),
  benefitsImageAlt: 'Membership Benefits',
  ctaParagraphs: [
    "Whether you are a farmer cooperative, agri-processor, exporter, agritech startup, investor, or policymaker, the Agribusiness Industry Council offers a collaborative platform to shape the future of Africa's agricultural trade.",
    'Join us today to help transform African agriculture, strengthen value chains, and ensure a secure, sustainable food future for the continent.',
  ],
  contactEmail: 'agribusiness@africantradechamber.org',
}
