import type { CouncilDetailData } from '@/types/council-page'
import { councilDetail, u } from './shared'

export const customsDetail: CouncilDetailData = councilDetail({
  slug: 'customs',
  title: 'Customs Council',
  tagline: 'Streamlining Customs Processes to Facilitate Trade Across Africa',
  introParagraphs: [
    'The Customs Council of the African Trade Chamber is committed to improving the efficiency, transparency, and harmonization of customs procedures across African borders. By bringing together customs authorities, trade stakeholders, and industry experts, the Council works to remove barriers to trade, enhance compliance, and combat illicit trade practices that undermine economic growth.',
    "Our mission is to create a seamless, secure, and business-friendly customs environment that supports Africa's integration into regional and global value chains under the African Continental Free Trade Area (AfCFTA).",
  ],
  focusAreas: [
    { title: 'Harmonization of Customs Practices', description: 'Promoting alignment of customs procedures, documentation, and systems across African countries to simplify cross-border trade.', imageUrl: u('2025/11/2150690158.jpg'), imageAlt: 'Harmonization' },
    { title: 'Compliance Support', description: 'Providing training, guidelines, and advisory services to help traders and businesses comply with customs regulations and standards.', imageUrl: u('2025/11/63893.jpg'), imageAlt: 'Compliance Support' },
    { title: 'Anti-Illicit Trade Strategies', description: 'Collaborating with governments, security agencies, and private sector partners to prevent smuggling, counterfeiting, and other forms of illicit trade.', imageUrl: u('2025/11/40566.jpg'), imageAlt: 'Anti-Illicit Trade' },
    { title: 'Capacity Building for Customs Officials', description: 'Enhancing the skills and knowledge of customs officers to improve efficiency, service delivery, and trade facilitation.', imageUrl: u('2025/11/120545.jpg'), imageAlt: 'Capacity Building' },
    { title: 'Technology Adoption', description: 'Encouraging the use of digital systems, single-window platforms, and automation to speed up clearance processes and reduce bottlenecks.', imageUrl: u('2025/11/129882-1.jpg'), imageAlt: 'Technology Adoption' },
  ],
  activities: [
    { title: 'Policy Advocacy', description: 'Engage with policymakers to streamline customs regulations and eliminate unnecessary barriers.' },
    { title: 'Public-Private Dialogue', description: 'Facilitate discussions between customs authorities and the private sector to resolve operational challenges.' },
    { title: 'Training & Workshops', description: 'Offer specialized training on customs procedures, compliance, and trade facilitation tools.' },
    { title: 'Research & Insights', description: 'Provide data-driven analysis on customs performance and cross-border trade trends.' },
    { title: 'Regional Cooperation', description: 'Promote collaboration between customs administrations in neighboring countries.' },
  ],
  benefitsIntro: 'Members of the Customs Council gain:',
  benefits: [
    'Access to policy dialogues with customs authorities and regional trade bodies',
    'Participation in training programs and compliance workshops',
    'Opportunities to contribute to customs modernization initiatives',
    'Networking with trade facilitation and customs experts across Africa',
    'Regular updates on policy changes and best practices in customs',
  ],
  benefitsImageUrl: u('2025/11/2150690161-1.jpg'),
  ctaParagraphs: [
    'If you are a trader, logistics provider, customs official, policymaker, or trade association passionate about improving customs operations, the Customs Council offers a platform for influence, collaboration, and growth.',
    "Join us today and be part of Africa's drive toward efficient, transparent, and secure cross-border trade.",
  ],
  contactEmail: 'customs@africantradechamber.org',
})

export const professionalServicesDetail: CouncilDetailData = councilDetail({
  slug: 'professional-services',
  title: 'Professional Services Council',
  tagline: "Empowering Africa's Service Sector for Regional and Global Competitiveness",
  introParagraphs: [
    "The Professional Services Council of the African Trade Chamber serves as a strategic platform for law firms, accounting practices, engineering companies, consulting agencies, and other service-based enterprises to access new markets, forge partnerships, and contribute to Africa's socio-economic development.",
    "With Africa's economies rapidly integrating under the African Continental Free Trade Area (AfCFTA), professional services are vital in enabling cross-border transactions, supporting business growth, and ensuring regulatory compliance. The Council works to connect service providers with clients, projects, and opportunities across the continent and beyond.",
  ],
  focusAreas: [
    { title: 'Market Access & Networking', description: 'Creating opportunities for service firms to connect with clients, investors, and partners in diverse African markets.', imageUrl: u('2025/11/122699.jpg'), imageAlt: 'Market Access' },
    { title: 'Policy & Regulatory Engagement', description: 'Advocating for policies that enable the free movement of professional services and the recognition of qualifications across borders.', imageUrl: u('2025/11/1103.jpg'), imageAlt: 'Policy Engagement' },
    { title: 'Capacity Building & Skills Development', description: 'Providing training, mentorship, and professional development programs to enhance competitiveness and service quality.', imageUrl: u('2025/11/30636.jpg'), imageAlt: 'Capacity Building' },
    { title: 'Standards & Best Practices', description: 'Promoting adherence to international standards, ethics, and best practices within professional service industries.', imageUrl: u('2025/11/125137.jpg'), imageAlt: 'Standards' },
    { title: 'Cross-Border Collaboration', description: 'Facilitating joint ventures, consortiums, and multi-country projects that require integrated service offerings.', imageUrl: u('2025/11/1163.jpg'), imageAlt: 'Cross-Border Collaboration' },
  ],
  activities: [
    { title: 'Business Matchmaking', description: 'Connect firms with clients, partners, and project leads in key growth sectors.' },
    { title: 'Trade Missions & Networking Events', description: 'Organize regional and international delegations for market exploration.' },
    { title: 'Policy Advocacy', description: 'Work with governments and professional bodies to remove barriers to service trade.' },
    { title: 'Knowledge Sharing', description: 'Host seminars, webinars, and publications on trends in professional services.' },
    { title: 'Market Intelligence', description: 'Provide insights on sector-specific opportunities and challenges.' },
  ],
  benefits: [
    'Priority access to tenders, contracts, and project partnerships',
    'Participation in high-level policy and regulatory discussions',
    'Inclusion in regional and international trade missions',
    'Opportunities to showcase expertise through Chamber platforms',
    'Access to research, market data, and industry intelligence',
  ],
  benefitsImageUrl: u('2025/11/2149034565.jpg'),
  ctaParagraphs: [
    'If you are a professional services provider seeking to expand across borders, shape industry policy, and collaborate on transformational projects, the Professional Services Council is your gateway to growth.',
    "Join us today and be part of Africa's service-led economic transformation.",
  ],
  contactEmail: 'professionalservices@africantradechamber.org',
})

export const technologyInnovationDetail: CouncilDetailData = councilDetail({
  slug: 'technology-innovation',
  title: 'Technology & Innovation Council',
  tagline: "Powering Africa's digital transformation through innovation, partnerships, and investment.",
  introParagraphs: [
    "The Technology & Innovation Council of the African Trade Chamber accelerates Africa's digital transformation by fostering innovation, supporting tech entrepreneurship, and promoting trade and investment in digital and emerging technologies.",
    'We bring together startups, scale-ups, corporates, investors, academia, and policymakers to build a thriving pan-African innovation ecosystem that enables competitiveness and inclusive growth.',
  ],
  focusAreas: [
    { title: 'Digital Transformation', description: 'Adopting digital tools and platforms to increase productivity and market access.', imageUrl: u('2025/11/photo-1518770660439-4636190af475.jpg'), imageAlt: 'Digital Transformation' },
    { title: 'Innovation & Startups', description: 'Incubation, acceleration, and access to capital for tech-enabled enterprises.', imageUrl: u('2025/11/119174.jpg'), imageAlt: 'Innovation & Startups' },
    { title: 'Emerging Technologies', description: 'Responsible adoption of AI, IoT, blockchain, and cloud for efficiency and new models.', imageUrl: u('2025/11/photo-1550751827-4bd374c3f58b.jpg'), imageAlt: 'Emerging Technologies' },
    { title: 'Digital Trade & E-Commerce', description: 'Facilitating e-commerce, fintech adoption, and interoperable markets under the AfCFTA.', imageUrl: u('2025/11/photo-1498050108023-c5249f4df085.jpg'), imageAlt: 'Digital Trade' },
  ],
  activities: [
    { title: 'Policy Advocacy', description: 'Engagement on data policy, digital trade, standards, and enabling regulation.' },
    { title: 'Innovation Forums', description: 'Demo days, hackathons, and B2B platforms connecting innovators with markets and investors.' },
    { title: 'Capacity Building', description: 'Training on digital skills, product development, cybersecurity, and export readiness.' },
    { title: 'Investment & Partnerships', description: 'Facilitating venture, corporate, and development finance into scalable tech solutions.' },
    { title: 'Research & Insights', description: 'Market intelligence on digital economy trends and opportunities.' },
  ],
  benefits: [
    'Access to policy dialogues and standard-setting discussions',
    'Participation in innovation showcases and trade missions',
    'Connections to investors, partners, and pilot customers',
    'Capacity-building programs and expert networks',
    'Visibility on African Trade Chamber platforms',
  ],
  benefitsImageUrl: u('2025/11/1789.jpg'),
  ctaParagraphs: [
    'If you are building or enabling technology-driven solutions for African markets, the Technology & Innovation Council is your platform to scale and collaborate.',
    "Join us to power Africa's digital and innovation-led growth.",
  ],
  contactEmail: 'techinnovation@africantradechamber.org',
})

export const researchPolicyDetail: CouncilDetailData = councilDetail({
  slug: 'research-policy',
  title: 'Research & Policy Council',
  tagline: "Shaping trade through evidence-based research and policy advocacy.",
  introParagraphs: [
    "The Research & Policy Council of the African Trade Chamber serves as a hub for academics, policy experts, industry leaders, and trade practitioners to collaborate on research, develop actionable policy recommendations, and advance evidence-based advocacy for Africa's economic transformation.",
    "In an era of rapid global change, informed decision-making is critical to ensuring Africa's integration into regional and global markets. The Council fosters rigorous analysis, data-driven insights, and innovative policy frameworks that support inclusive and sustainable trade growth across the continent.",
  ],
  focusAreas: [
    { title: 'Trade Policy Research', description: 'Studies on trade agreements, sectoral trends, and market integration under frameworks such as the AfCFTA.', imageUrl: u('2025/11/77702.jpg'), imageAlt: 'Trade Policy Research' },
    { title: 'Evidence-Based Advocacy', description: 'Fact-based positions to influence trade legislation, regulations, and government strategies.', imageUrl: u('2025/11/2148884016.jpg'), imageAlt: 'Evidence-Based Advocacy' },
    { title: 'Capacity Building', description: 'Strengthening the ability of institutions and industry to design and implement effective policies.', imageUrl: u('2025/11/7628.jpg'), imageAlt: 'Capacity Building' },
    { title: 'Strategic Foresight', description: "Analyzing global shifts, emerging patterns, and future opportunities for Africa's trade sectors.", imageUrl: u('2025/11/45583.jpg'), imageAlt: 'Strategic Foresight' },
  ],
  activities: [
    { title: 'Policy Briefs & Reports', description: 'Publications that inform government, business, and civil society on critical trade issues.' },
    { title: 'Stakeholder Dialogues', description: 'Conferences, forums, and workshops engaging decision-makers in policy discussions.' },
    { title: 'Research Partnerships', description: 'Collaborations with universities, think tanks, and industry bodies for high-quality studies.' },
    { title: 'Monitoring & Evaluation', description: 'Tracking policy impact and recommending improvements.' },
  ],
  benefitsIntro: 'Members of the Research & Policy Council gain:',
  benefits: [
    'Access to exclusive trade research and policy analysis',
    'Contribute to high-impact policy publications',
    'Invitations to expert roundtables and policy dialogues',
    'Networking with academics, policymakers, and business leaders',
    'Visibility as a thought leader in African trade policy',
  ],
  benefitsImageUrl: u('2025/11/2150690158.jpg'),
  ctaParagraphs: [
    "If you are passionate about shaping the future of Africa's trade through research, policy development, and strategic advocacy, the Research & Policy Council offers the ideal platform to make an impact.",
    "Join us today and contribute to Africa's evidence-based trade transformation.",
  ],
  contactEmail: 'researchpolicy@africantradechamber.org',
})

export const womenEntrepreneursDetail: CouncilDetailData = councilDetail({
  slug: 'women-entrepreneurs',
  title: 'Women Entrepreneurs Council',
  tagline: 'Championing women-led enterprises through finance, markets, mentorship, and policy advocacy.',
  introParagraphs: [
    "The Women Entrepreneurs Council of the African Trade Chamber is a dedicated platform that champions the advancement of women in trade and entrepreneurship across Africa. The Council brings together women business owners, investors, policymakers, and development partners to promote mentorship, access to finance, capacity building, and inclusive policies that empower women-led enterprises to thrive in regional and global markets.",
    'Our mission is to break barriers, unlock opportunities, and create an enabling environment where African women entrepreneurs can lead economic growth and innovation.',
  ],
  focusAreas: [
    { title: 'Mentorship & Networking', description: 'Connecting women entrepreneurs with mentors, role models, and peer networks to share knowledge and build supportive communities.', imageUrl: u('2025/11/2150690136.jpg'), imageAlt: 'Mentorship' },
    { title: 'Access to Finance', description: 'Advocating for access to credit, grants, investment, and financial services tailored to women-led businesses.', imageUrl: u('2025/11/2150377127.jpg'), imageAlt: 'Access to Finance' },
    { title: 'Capacity Building', description: 'Training programs focused on business skills, digital literacy, export readiness, and leadership development.', imageUrl: u('2025/11/19611-1.jpg'), imageAlt: 'Capacity Building' },
    { title: 'Policy Advocacy', description: "Advancing gender-responsive trade policies and removing systemic barriers to women's economic participation.", imageUrl: u('2025/11/14612.jpg'), imageAlt: 'Policy Advocacy' },
  ],
  activities: [
    { title: 'Mentorship Programs', description: 'Structured mentorship and coaching for women entrepreneurs at all growth stages.' },
    { title: 'Financial Inclusion Initiatives', description: 'Partnerships with financial institutions and investors to expand funding opportunities.' },
    { title: 'Training & Workshops', description: 'Tailored capacity-building on finance, marketing, export compliance, and leadership.' },
    { title: 'Policy Engagement', description: "Represent women's trade interests in policy dialogues and advocacy campaigns." },
    { title: 'Visibility & Recognition', description: 'Showcase successful women entrepreneurs through media, events, and awards.' },
  ],
  benefitsIntro: 'Members of the Women Entrepreneurs Council enjoy:',
  benefits: [
    'Access to mentorship networks and business support services',
    'Opportunities to connect with financiers and impact investors',
    'Participation in exclusive training and capacity-building programs',
    'Representation in gender-responsive policy advocacy',
    'Visibility in African Trade Chamber platforms and media',
  ],
  benefitsImageUrl: u('2025/10/education.jpeg'),
  ctaParagraphs: [
    'If you are a woman entrepreneur, investor, policymaker, or organization committed to empowering women in trade, the Women Entrepreneurs Council offers a powerful platform to grow, connect, and lead.',
    "Join us today to champion women's economic empowerment and advance inclusive trade in Africa.",
  ],
  contactEmail: 'womenentrepreneurs@africantradechamber.org',
  extraSection: {
    title: 'How We Work',
    intro: 'We collaborate with chambers, associations, and partners to unlock markets and finance for women-led MSMEs across Africa.',
    items: [
      { title: 'Market Access', description: 'Trade missions, B2B matchmaking, and e-commerce readiness for cross-border sales.' },
      { title: 'Finance Readiness', description: 'Investor pitch prep, credit facilitation, and blended finance pathways.' },
      { title: 'Policy & Advocacy', description: 'Evidence-based engagement on procurement, collateral reform, and gender-lens policies.' },
    ],
  },
})

export const youngEntrepreneursDetail: CouncilDetailData = councilDetail({
  slug: 'young-entrepreneurs',
  title: 'Young Entrepreneurs Council',
  tagline: "Igniting Africa's Future through Youth-Led Innovation and Entrepreneurship",
  introParagraphs: [
    "The Young Entrepreneurs Council of the African Trade Chamber is a vibrant platform dedicated to empowering Africa's youth by fostering entrepreneurship, innovation, and inclusive economic participation. The Council brings together young business founders, educators, investors, and policymakers to promote education, startup support, and access to markets, ensuring the next generation of African leaders drives sustainable growth and development.",
    'Our mission is to cultivate a dynamic ecosystem where young entrepreneurs can innovate, scale, and connect across Africa and beyond.',
  ],
  focusAreas: [
    { title: 'Innovation & Entrepreneurship', description: "Encouraging creative business solutions and startups that address Africa's unique challenges and opportunities.", imageUrl: u('2025/11/2151737252.jpg'), imageAlt: 'Innovation' },
    { title: 'Education & Skills Development', description: 'Promoting entrepreneurship education, mentorship, and vocational training tailored to youth needs.', imageUrl: u('2025/11/2149891363.jpg'), imageAlt: 'Education' },
    { title: 'Startup Support & Financing', description: 'Facilitating access to seed funding, venture capital, incubation, and acceleration programs.', imageUrl: u('2025/11/5037.jpg'), imageAlt: 'Startup Support' },
    { title: 'Market Access & Networking', description: 'Connecting young entrepreneurs with regional and global market networks, investors, and partners.', imageUrl: u('2025/11/2148777508.jpg'), imageAlt: 'Market Access' },
    { title: 'Policy Advocacy', description: 'Advocating for youth-friendly policies that reduce barriers and foster a supportive business environment.', imageUrl: u('2025/11/2151152387.jpg'), imageAlt: 'Policy Advocacy' },
  ],
  activities: [
    { title: 'Mentorship & Coaching', description: 'Provide structured mentorship programs linking young entrepreneurs with experienced industry leaders.' },
    { title: 'Funding Facilitation', description: 'Partner with investors and financial institutions to unlock capital tailored for youth-led ventures.' },
    { title: 'Workshops & Training', description: 'Deliver skill-building sessions on business management, innovation, digital tools, and market strategies.' },
    { title: 'Networking Events', description: 'Organize forums, pitch competitions, and trade missions to showcase youth entrepreneurship.' },
    { title: 'Policy Engagement', description: 'Engage with governments to promote reforms that support youth entrepreneurship and economic inclusion.' },
  ],
  benefitsIntro: 'Members of the Young Entrepreneurs Council receive:',
  benefits: [
    'Access to mentorship and startup support networks',
    'Opportunities to participate in funding and investment programs',
    'Invitations to youth-focused trade and innovation events',
    'Representation in policy dialogues targeting youth economic empowerment',
    'Visibility through African Trade Chamber media and platforms',
  ],
  benefitsImageUrl: u('2025/11/52225.jpg'),
  ctaParagraphs: [
    "If you are a young entrepreneur, investor, educator, or policymaker passionate about empowering Africa's youth, the Young Entrepreneurs Council is your gateway to collaboration, growth, and impact.",
    "Join us today to ignite innovation, unlock opportunities, and build Africa's entrepreneurial future.",
  ],
  contactEmail: 'youngentrepreneurs@africantradechamber.org',
})
