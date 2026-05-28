import type { CouncilDetailData } from '@/types/council-page'
import { councilDetail, u } from './shared'

export const manufacturingDetail: CouncilDetailData = councilDetail({
  slug: 'manufacturing',
  title: 'Manufacturing Council',
  tagline: "Driving Africa's Industrial Competitiveness and Export Growth",
  introParagraphs: [
    "The Manufacturing Council of the African Trade Chamber is a dedicated platform for advancing Africa's manufacturing sector as a catalyst for economic transformation, job creation, and trade expansion. The Council brings together manufacturers, policymakers, investors, and trade partners to strengthen industrial capacity, enhance competitiveness, and integrate African industries into regional and global value chains.",
    'Our mission is to position manufacturing as a key driver of sustainable growth by fostering innovation, improving productivity, and building strong regional production networks.',
  ],
  focusAreas: [
    { title: 'Industrial Competitiveness', description: "We support policies, partnerships, and innovations that improve productivity, quality standards, and cost efficiency across Africa's manufacturing sector.", imageUrl: u('2025/11/125792.jpg'), imageAlt: 'Industrial Competitiveness' },
    { title: 'Export Growth & Market Access', description: 'The Council facilitates trade opportunities and access to regional and international markets for African-manufactured goods, enabling businesses to compete globally.', imageUrl: u('2025/11/107667.jpg'), imageAlt: 'Export Growth' },
    { title: 'Regional Production Networks', description: 'We promote cross-border manufacturing collaboration under the AfCFTA framework, enabling shared industrial infrastructure, supply chain integration, and economies of scale.', imageUrl: u('2025/11/33025.jpg'), imageAlt: 'Regional Production Networks' },
    { title: 'Innovation & Technology Adoption', description: 'From automation to green manufacturing, the Council champions technology transfer and sustainable production methods that enhance competitiveness and environmental responsibility.', imageUrl: u('2025/11/75857.jpg'), imageAlt: 'Innovation' },
  ],
  activities: [
    { title: 'Policy Advocacy', description: 'Engage with governments and trade blocs to create enabling policies for manufacturing growth and export competitiveness.' },
    { title: 'Trade & Investment Facilitation', description: 'Organize manufacturing trade fairs, B2B matchmaking, and investment forums that connect African producers with buyers and investors.' },
    { title: 'Capacity Building', description: 'Provide training programs, technical assistance, and skills development initiatives for manufacturing enterprises.' },
    { title: 'Standards & Quality Promotion', description: 'Support compliance with international product standards, certifications, and quality assurance processes to expand market reach.' },
    { title: 'Research & Insights', description: 'Deliver sector-specific market intelligence, trends analysis, and investment opportunity reports.' },
  ],
  benefits: [
    'Access to exclusive manufacturing policy dialogues and industry roundtables',
    'Opportunities to showcase products at African Trade Chamber and partner events',
    'Market intelligence and research tailored to manufacturing trends',
    'Visibility on African and international platforms',
    'Networking with leading manufacturers, trade partners, and investors',
  ],
  benefitsImageUrl: u('2025/11/119419.jpg'),
  ctaParagraphs: [
    "Whether you are a small-scale producer, an industrial manufacturer, an investor, or a policy stakeholder, the Manufacturing Council provides a powerful platform to shape the future of Africa's manufacturing sector.",
    'Join us today to strengthen industrial competitiveness, grow exports, and build robust regional production networks.',
  ],
  contactEmail: 'manufacturing@africantradechamber.org',
})

export const tradeFinanceDetail: CouncilDetailData = councilDetail({
  slug: 'trade-finance',
  title: 'Trade Finance Council',
  tagline: 'Enabling Trade through Access to Credit, Financial Instruments, and Risk Mitigation',
  introParagraphs: [
    "The Trade Finance Council of the African Trade Chamber is a dedicated platform for strengthening access to finance for Africa's exporters, importers, and traders. The Council brings together banks, development finance institutions, trade credit insurers, policymakers, and private sector leaders to expand the availability and affordability of trade finance solutions across the continent.",
    'Our mission is to make trade finance more accessible, innovative, and inclusive — ensuring African businesses can seize opportunities in regional and global markets.',
  ],
  focusAreas: [
    { title: 'Access to Trade Credit', description: 'We advocate for and facilitate financial solutions that provide working capital to exporters and importers, enabling them to fulfil orders and expand market reach.', imageUrl: u('2025/11/125550.jpg'), imageAlt: 'Access to Trade Credit' },
    { title: 'Innovative Financial Instruments', description: 'The Council promotes the use of modern trade finance products such as letters of credit, supply chain finance, forfaiting, factoring, and digital trade platforms.', imageUrl: u('2025/11/126119.jpg'), imageAlt: 'Innovative Financial Instruments' },
    { title: 'Risk Mitigation', description: 'We work with partners to expand trade credit insurance, guarantees, and other risk management tools that protect African businesses from payment default, currency volatility, and geopolitical risks.', imageUrl: u('2025/11/110239.jpg'), imageAlt: 'Risk Mitigation' },
    { title: 'Capacity Building in Trade Finance', description: 'The Council delivers training and knowledge-sharing programs to strengthen the capabilities of banks, SMEs, and corporates in structuring and managing trade finance transactions.', imageUrl: u('2025/11/91001.jpg'), imageAlt: 'Capacity Building' },
  ],
  activities: [
    { title: 'Policy & Regulatory Engagement', description: 'Advocate for policy reforms that improve the trade finance environment and lower barriers for SMEs.' },
    { title: 'Partnership Facilitation', description: 'Connect African businesses with banks, export credit agencies, and fintech innovators offering trade finance solutions.' },
    { title: 'Market Intelligence', description: 'Provide members with insights into trade finance trends, regional financing gaps, and opportunities.' },
    { title: 'Training & Technical Assistance', description: 'Deliver targeted capacity-building programs to improve access to and management of trade finance.' },
    { title: 'Networking Platforms', description: 'Host forums, roundtables, and B2B events for financiers, exporters, and importers to engage and collaborate.' },
  ],
  benefits: [
    'Access to finance-focused trade missions, workshops, and investor forums',
    'Networking with leading trade finance providers, insurers, and policymakers',
    'Exposure to innovative financial instruments and digital trade platforms',
    'Inclusion in market intelligence reports and policy advocacy initiatives',
    'Opportunities to showcase expertise at African Trade Chamber events',
  ],
  benefitsImageUrl: u('2025/11/4066.jpg'),
  ctaParagraphs: [
    "Whether you are a bank, export credit agency, SME, corporate exporter, or trade-focused fintech, the Trade Finance Council provides a platform to unlock capital, manage risk, and accelerate Africa's trade growth.",
    "Join us today to expand financial access and strengthen Africa's position in global trade.",
  ],
  contactEmail: 'tradefinance@africantradechamber.org',
})

export const transportLogisticsDetail: CouncilDetailData = councilDetail({
  slug: 'transport-logistics',
  title: 'Transport & Logistics Council',
  tagline: "Strengthening Africa's Connectivity for Competitive Trade",
  introParagraphs: [
    "The Transport & Logistics Council of the African Trade Chamber is a strategic platform dedicated to improving Africa's trade infrastructure, logistics efficiency, and regional connectivity. The Council brings together transport operators, logistics providers, infrastructure developers, policymakers, and investors to address barriers to movement of goods and services across the continent.",
    'Our mission is to make African trade faster, more efficient, and more cost-effective by fostering world-class logistics networks, modern transport systems, and integrated cross-border infrastructure.',
  ],
  focusAreas: [
    { title: 'Trade Infrastructure Development', description: "We promote investment in ports, roads, railways, airports, and inland transport facilities to strengthen Africa's position in regional and global trade.", imageUrl: u('2025/11/photo-1541888946425-d81bb19240f5.jpg'), imageAlt: 'Trade Infrastructure' },
    { title: 'Logistics Efficiency', description: 'The Council works to reduce transit times, streamline customs processes, and improve supply chain management for businesses engaged in intra-African and international trade.', imageUrl: u('2025/11/photo-1494412574643-ff11b0a5c1c3.jpg'), imageAlt: 'Logistics Efficiency' },
    { title: 'Regional & Continental Connectivity', description: "We advocate for transport corridors, multimodal logistics systems, and harmonized regulations that connect African regions and support AfCFTA's integration goals.", imageUrl: u('2025/11/2152005448.jpg'), imageAlt: 'Connectivity' },
    { title: 'Technology in Logistics', description: 'From digital freight platforms to smart warehousing and cargo tracking, the Council promotes innovation that improves transparency, efficiency, and reliability in logistics services.', imageUrl: u('2025/11/129882.jpg'), imageAlt: 'Technology in Logistics' },
  ],
  activities: [
    { title: 'Policy Advocacy', description: 'Engage with governments, trade blocs, and infrastructure agencies to improve transport and logistics policies.' },
    { title: 'Investment Facilitation', description: 'Connect project developers and operators with investors, development finance institutions, and public-private partnerships.' },
    { title: 'Trade & Logistics Forums', description: 'Organize events, exhibitions, and B2B meetings focused on infrastructure, logistics, and connectivity.' },
    { title: 'Capacity Building', description: 'Deliver training programs on logistics best practices, customs procedures, and supply chain optimization.' },
    { title: 'Research & Insights', description: 'Provide members with data and reports on transport infrastructure trends, logistics performance, and emerging opportunities.' },
  ],
  benefits: [
    'Access to trade infrastructure and logistics investment opportunities',
    'Networking with industry leaders, policymakers, and regional bodies',
    'Opportunities to participate in high-profile trade and logistics events',
    'Market intelligence on infrastructure development and logistics innovations',
    'Visibility through African Trade Chamber publications and media channels',
  ],
  benefitsImageUrl: u('2025/11/1256.jpg'),
  ctaParagraphs: [
    "Whether you are a transport operator, logistics company, infrastructure developer, government agency, or technology provider, the Transport & Logistics Council offers a platform to transform Africa's trade connectivity.",
    "Join us today to build efficient, integrated, and competitive logistics networks for the continent's future.",
  ],
  contactEmail: 'transport@africantradechamber.org',
})

export const miningExtractivesDetail: CouncilDetailData = councilDetail({
  slug: 'mining-extractives',
  title: 'Mining & Extractives Council',
  tagline: 'Advancing Responsible Resource Development and Local Value Addition',
  introParagraphs: [
    "The Mining & Extractives Council of the African Trade Chamber is a high-level platform that brings together industry leaders, policymakers, investors, and communities to promote sustainable development, investment, and local beneficiation in Africa's mining and natural resources sector.",
    "Our mission is to ensure that Africa's vast mineral wealth drives inclusive growth, industrialization, and environmental stewardship while strengthening the continent's role in global resource markets.",
  ],
  focusAreas: [
    { title: 'Responsible Resource Development', description: 'We champion ethical, environmentally responsible, and socially inclusive mining practices that respect local communities and safeguard ecosystems.', imageUrl: u('2025/11/2150950181-1.jpg'), imageAlt: 'Responsible Development' },
    { title: 'Investment Facilitation', description: 'The Council connects mining companies, governments, and investors to promote exploration, production, and downstream development opportunities.', imageUrl: u('2025/11/126815.jpg'), imageAlt: 'Investment Facilitation' },
    { title: 'Local Value Addition & Beneficiation', description: 'We advocate for processing and manufacturing within Africa to create jobs, build skills, and increase the value captured from natural resources.', imageUrl: u('2025/11/32699.jpg'), imageAlt: 'Beneficiation' },
    { title: 'Policy & Governance', description: 'We work with governments, regional bodies, and industry stakeholders to strengthen regulatory frameworks that ensure transparency, fair revenue sharing, and long-term sustainability.', imageUrl: u('2025/11/132841.jpg'), imageAlt: 'Policy & Governance' },
  ],
  activities: [
    { title: 'Policy Advocacy', description: 'Engage with policymakers to develop mining laws and frameworks that attract investment while protecting local interests.' },
    { title: 'Trade & Investment Platforms', description: 'Host mining investment forums, trade shows, and B2B matchmaking events to connect African projects with global partners.' },
    { title: 'Capacity Building', description: 'Deliver training programs for artisanal miners, small-scale operators, and mining communities.' },
    { title: 'Sustainability & ESG Promotion', description: 'Promote best practices in environmental, social, and governance (ESG) compliance for mining and extractives.' },
    { title: 'Market Insights', description: 'Provide members with reports on commodity trends, exploration opportunities, and global demand outlooks.' },
  ],
  benefits: [
    'Access to mining investment opportunities and strategic partnerships',
    'Visibility in African Trade Chamber publications and industry events',
    'Market intelligence and policy updates specific to mining and natural resources',
    'Participation in advocacy initiatives and sustainability programs',
    'Networking with global mining companies, financiers, and regulators',
  ],
  benefitsImageUrl: u('2025/11/2151229997.jpg'),
  ctaParagraphs: [
    "Whether you are a mining company, equipment supplier, government agency, financier, or community organization, the Mining & Extractives Council provides a collaborative platform to shape the future of Africa's resource sector.",
    "Join us today to promote responsible development, attract investment, and drive local value creation in Africa's mining industry.",
  ],
  contactEmail: 'mining@africantradechamber.org',
})
