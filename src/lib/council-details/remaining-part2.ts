import type { CouncilDetailData } from '@/types/council-page'
import { councilDetail, u } from './shared'

export const healthcareDetail: CouncilDetailData = councilDetail({
  slug: 'healthcare',
  title: 'Healthcare Council',
  tagline: "Advancing Trade, Innovation, and Investment in Africa's Health Sector",
  introParagraphs: [
    "The Healthcare Council of the African Trade Chamber is a collaborative platform dedicated to strengthening Africa's healthcare systems through trade in pharmaceuticals, medical technologies, and healthcare investment. The Council brings together industry leaders, policymakers, investors, and health institutions to improve access to quality healthcare and foster innovation across the continent.",
    "Our mission is to position healthcare trade and investment as a cornerstone of Africa's socio-economic development — improving health outcomes while creating business opportunities.",
  ],
  focusAreas: [
    { title: 'Pharmaceutical Trade & Manufacturing', description: 'We promote local production, regional distribution, and global partnerships to improve the availability, affordability, and quality of essential medicines.', imageUrl: u('2025/11/2148776135.jpg'), imageAlt: 'Pharmaceutical Trade' },
    { title: 'Medical Technology & Innovation', description: 'The Council supports the adoption of cutting-edge medical devices, diagnostics, telemedicine, and health IT systems to enhance healthcare delivery.', imageUrl: u('2025/11/133575.jpg'), imageAlt: 'Medical Technology' },
    { title: 'Healthcare Infrastructure & Investment', description: "We facilitate investment in hospitals, clinics, research centers, and supply chains to strengthen Africa's health sector capacity.", imageUrl: u('2025/11/2147612303.jpg'), imageAlt: 'Healthcare Infrastructure' },
    { title: 'Policy & Standards Harmonization', description: 'The Council works with governments and regional bodies to align regulations, certifications, and quality standards for pharmaceuticals and medical equipment.', imageUrl: u('2025/11/124655.jpg'), imageAlt: 'Policy & Standards' },
  ],
  activities: [
    { title: 'Policy Advocacy', description: 'Engage with health ministries, regulators, and trade bodies to create an enabling environment for healthcare trade and innovation.' },
    { title: 'Trade & Investment Facilitation', description: 'Organize healthcare trade fairs, investment forums, and B2B matchmaking between African health enterprises and global partners.' },
    { title: 'Capacity Building', description: 'Deliver training for healthcare professionals, pharmaceutical manufacturers, and medical technology providers.' },
    { title: 'Research & Insights', description: 'Provide members with market data, healthcare industry trends, and investment opportunities.' },
    { title: 'Innovation Platforms', description: 'Showcase African health innovations and technologies through exhibitions and digital platforms.' },
  ],
  benefits: [
    'Access to healthcare-specific trade and investment opportunities',
    'Networking with health sector leaders, policymakers, and investors',
    'Visibility in African Trade Chamber publications and media platforms',
    'Market intelligence and research tailored to the healthcare sector',
    'Opportunities to showcase solutions at high-profile health industry events',
  ],
  benefitsImageUrl: u('2025/11/2611.jpg'),
  ctaParagraphs: [
    'Whether you are a pharmaceutical company, medical device manufacturer, healthcare provider, investor, or policy institution, the Healthcare Council offers a platform to grow your business and improve health outcomes in Africa.',
    "Join us today to expand healthcare trade, accelerate innovation, and strengthen Africa's health systems.",
  ],
  contactEmail: 'healthcare@africantradechamber.org',
})

export const tourismHospitalityDetail: CouncilDetailData = councilDetail({
  slug: 'tourism-hospitality',
  title: 'Tourism & Hospitality Council',
  tagline: "Strengthening Africa's Tourism Competitiveness and Hospitality Excellence",
  introParagraphs: [
    "The Tourism & Hospitality Council of the African Trade Chamber is a dedicated platform for advancing Africa's tourism and hospitality industries as engines for economic growth, cultural exchange, and investment. The Council unites tourism boards, hospitality operators, investors, policymakers, and service providers to develop regional tourism strategies, raise industry standards, and promote travel-related investments across the continent.",
    'Our mission is to position Africa as a world-class tourism destination by fostering innovation, service excellence, and cross-border cooperation in the travel and hospitality sectors.',
  ],
  focusAreas: [
    { title: 'Regional Tourism Strategies', description: "We work with tourism authorities and stakeholders to design and implement coordinated marketing campaigns, tourism corridors, and regional travel packages that enhance Africa's appeal.", imageUrl: u('2025/11/photo-1488646953014-85cb44e25828.jpg'), imageAlt: 'Regional Tourism' },
    { title: 'Hospitality Standards & Service Excellence', description: 'The Council promotes internationally recognized service standards, staff training programs, and quality assurance systems to elevate hospitality experiences across Africa.', imageUrl: u('2025/11/photo-1564501049412-61c2a3083791.jpg'), imageAlt: 'Hospitality Standards' },
    { title: 'Travel-Related Investment Promotion', description: 'We connect investors with opportunities in hotels, resorts, eco-tourism, cultural attractions, and travel infrastructure.', imageUrl: u('2025/11/photo-1460472178825-e5240623afd5.jpg'), imageAlt: 'Investment Promotion' },
    { title: 'Sustainable & Inclusive Tourism', description: 'We advocate for tourism development that preserves cultural heritage, protects the environment, and benefits local communities.', imageUrl: u('2025/11/photo-1516026672322-bc52d61a55d5.jpg'), imageAlt: 'Sustainable Tourism' },
  ],
  activities: [
    { title: 'Policy & Industry Advocacy', description: 'Engage with governments and industry bodies to improve travel facilitation, visa processes, and tourism infrastructure.' },
    { title: 'Trade & Investment Platforms', description: 'Organize tourism and hospitality expos, B2B meetings, and investment forums.' },
    { title: 'Capacity Building', description: 'Offer training for hospitality professionals, tour operators, and destination managers.' },
    { title: 'Market Insights', description: 'Provide research on tourism trends, market opportunities, and consumer preferences.' },
    { title: 'Destination Marketing Support', description: "Partner with tourism boards to enhance Africa's presence in international travel markets." },
  ],
  benefits: [
    'Access to tourism trade fairs, expos, and marketing platforms',
    'Networking with industry leaders, investors, and tourism boards',
    'Opportunities to showcase destinations and hospitality services',
    'Market intelligence and industry-specific research',
    'Visibility in African Trade Chamber publications and global tourism events',
  ],
  benefitsImageUrl: u('2025/11/78785.jpg'),
  ctaParagraphs: [
    "Whether you are a hotel group, tour operator, destination manager, travel investor, or government tourism agency, the Tourism & Hospitality Council offers a platform to grow Africa's tourism economy.",
    "Join us today to develop competitive destinations, raise hospitality standards, and attract investment to Africa's travel sector.",
  ],
  contactEmail: 'tourism@africantradechamber.org',
})

export const creativesDetail: CouncilDetailData = councilDetail({
  slug: 'creatives',
  title: 'Creatives Council',
  tagline: "Growing Africa's Creative Industries through Trade and Investment",
  introParagraphs: [
    "The Creatives Council of the African Trade Chamber grows Africa's creative industries by expanding market access, fostering cultural exchange, and promoting investment in creative enterprises.",
    'The Council connects artists, producers, cultural institutions, and investors to unlock trade opportunities in film, music, design, fashion, and digital content across the continent.',
  ],
  focusAreas: [
    { title: 'Creative Industry Development', description: 'We support policies and programmes that strengthen creative ecosystems, intellectual property frameworks, and producer networks.', imageUrl: u('2025/10/cultural.jpg'), imageAlt: 'Creative Industry Development' },
    { title: 'Market Access & Export Promotion', description: 'The Council facilitates access to regional and global markets for African creative goods and services.', imageUrl: u('2025/10/cultural.jpg'), imageAlt: 'Market Access' },
    { title: 'Cultural Exchange & Collaboration', description: 'We promote cross-border collaborations, festivals, and partnerships that celebrate African culture.', imageUrl: u('2025/10/cultural.jpg'), imageAlt: 'Cultural Exchange' },
    { title: 'Investment in the Creative Economy', description: 'We connect creative entrepreneurs with financiers, brands, and platforms to scale ventures.', imageUrl: u('2025/10/cultural.jpg'), imageAlt: 'Creative Economy Investment' },
  ],
  activities: [
    { title: 'Trade & Showcase Platforms', description: 'Organize expos, showcases, and B2B sessions for creative enterprises.' },
    { title: 'Policy Advocacy', description: 'Engage on copyright, licensing, and trade in services frameworks affecting creatives.' },
    { title: 'Capacity Building', description: 'Deliver training on export readiness, digital distribution, and business management.' },
    { title: 'Partnership Facilitation', description: 'Connect creators with distributors, brands, and international partners.' },
    { title: 'Market Intelligence', description: 'Provide insights on trends and opportunities in African creative markets.' },
  ],
  benefits: [
    'Access to creative industry trade and investment platforms',
    'Networking with producers, investors, and cultural institutions',
    'Visibility through African Trade Chamber events and media',
    'Policy engagement on creative economy issues',
    'Capacity-building and export-readiness support',
  ],
  benefitsImageUrl: u('2025/10/cultural.jpg'),
  ctaParagraphs: [
    "Whether you are a creative enterprise, investor, festival organizer, or policymaker, the Creatives Council offers a platform to grow Africa's creative economy.",
    'Join us today to expand market access, attract investment, and celebrate African creativity on global stages.',
  ],
  contactEmail: 'creatives@africantradechamber.org',
})

export const infrastructureDevelopmentDetail: CouncilDetailData = councilDetail({
  slug: 'infrastructure-development',
  title: 'Infrastructure Development Council',
  tagline: "Building the Foundations for Africa's Trade and Integration",
  introParagraphs: [
    'The Infrastructure Development Council of the African Trade Chamber is a strategic platform that brings together policymakers, investors, developers, and industry stakeholders to drive infrastructure investment and public-private partnerships (PPPs) across Africa. The Council focuses on creating the physical and digital infrastructure necessary to boost trade facilitation, enhance connectivity, and accelerate regional integration.',
    "Our mission is to position infrastructure development as a catalyst for Africa's economic growth, competitiveness, and sustainable trade expansion.",
  ],
  focusAreas: [
    { title: 'Trade-Related Infrastructure', description: 'We promote the development of ports, roads, railways, airports, and border facilities that reduce trade costs, improve logistics efficiency, and connect African markets.', imageUrl: u('2025/11/photo-1541888946425-d81bb19240f5.jpg'), imageAlt: 'Trade Infrastructure' },
    { title: 'Public-Private Partnerships (PPPs)', description: 'The Council facilitates collaboration between governments and private sector players to mobilize resources, share risks, and deliver impactful infrastructure projects.', imageUrl: u('2025/11/4066-1.jpg'), imageAlt: 'PPPs' },
    { title: 'Regional Integration Corridors', description: 'We advocate for the development of cross-border transport and energy corridors that align with AfCFTA objectives and strengthen intra-African trade.', imageUrl: u('2025/11/89014.jpg'), imageAlt: 'Integration Corridors' },
    { title: 'Digital Infrastructure', description: 'From broadband expansion to smart logistics systems, we support the deployment of ICT infrastructure that enables digital trade and e-commerce growth.', imageUrl: u('2025/11/75857.jpg'), imageAlt: 'Digital Infrastructure' },
  ],
  activities: [
    { title: 'Policy Advocacy', description: 'Engage with governments, regional bodies, and financiers to create enabling environments for infrastructure investment.' },
    { title: 'Investment Facilitation', description: 'Connect project developers with local and international investors, DFIs, and multilateral agencies.' },
    { title: 'Infrastructure Forums', description: 'Host investment conferences, B2B meetings, and project showcase events.' },
    { title: 'Capacity Building', description: 'Provide training and technical support for PPP structuring, project management, and infrastructure financing.' },
    { title: 'Market Intelligence', description: 'Deliver research on infrastructure needs, investment trends, and regional project pipelines.' },
  ],
  benefits: [
    'Access to infrastructure investment opportunities and project pipelines',
    'Networking with government agencies, financiers, and developers',
    'Opportunities to participate in high-level policy and project planning forums',
    'Visibility in African Trade Chamber publications and global investment platforms',
    'Market intelligence and sector-specific research',
  ],
  benefitsImageUrl: u('2025/11/photo-1521791136064-7986c2920216.jpg'),
  ctaParagraphs: [
    "Whether you are an investor, infrastructure developer, government agency, financier, or technology provider, the Infrastructure Development Council offers a platform to accelerate Africa's infrastructure transformation.",
    'Join us today to promote investment, enable trade facilitation, and strengthen regional integration.',
  ],
  contactEmail: 'infrastructure@africantradechamber.org',
})
