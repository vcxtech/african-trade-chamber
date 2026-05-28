import type { HomepageSectionsData } from '@/types/homepage'
import { localHomepageImage } from '@/lib/homepage-images'

const img = localHomepageImage

export const defaultHomepageSections: HomepageSectionsData = {
  featureCards: [
    {
      id: '1',
      title: 'Who We Are',
      description:
        'The African Trade Chamber is a continental trade support and facilitation institution working to connect businesses, governments, and development partners to advance trade, investment, and economic growth across Africa.',
      linkText: 'Learn more',
      linkUrl: '/about',
    },
    {
      id: '2',
      title: 'Our Vision',
      description:
        'An interconnected and competitive African private sector that drives inclusive growth and prosperity through trade, investment, and innovation across the continent and global markets.',
      linkText: 'Learn more',
      linkUrl: '/about',
    },
    {
      id: '3',
      title: 'Our Mission',
      description:
        'To bridge businesses to African and global markets by facilitating market access, supporting enterprise growth, and advancing policy environments that enable sustainable trade and investment.',
      linkText: 'Learn more',
      linkUrl: '/about',
    },
  ],
  wwd: {
    headerTitle: 'Unlocking Trade. Enabling Growth. Connecting businesses to Key Markets.',
    headerContent:
      'ATC provides a suite of trade facilitation, business support, and policy engagement services that help companies navigate markets, expand operations, and connect with strategic partners across Africa and beyond. We also undertake strategic capacity building initiatives and fellowships to support business leaders and professional.||Our work is built around six (6) core service areas:',
    intro: {
      title: 'Our Services',
      description:
        'We offer comprehensive trade facilitation and business support services designed to help companies successfully navigate African markets and expand their operations across the continent.',
      imageUrl: img('Our Services.jpg'),
      buttonText: 'View all services',
      buttonUrl: '/what-we-do',
    },
    services: [
      {
        title: 'Policy Advocacy',
        description:
          'Engage with governments and regionals bodies to shape agribusiness-friendly policies and harmonized trade regulations under frameworks like the AfCFTA',
        imageUrl: img('Trade & Market Briefs.jpg'),
        buttonText: 'Learn more',
        buttonUrl: '/policy-government-engagement',
      },
      {
        title: 'Trade Mission & Expos',
        description:
          'Organize B2B and B2G engagements, trade fairs, and marker development mission to showcase African agricultural products globally.',
        imageUrl: img('Trade Mission & Expos.jpg'),
        buttonText: 'Learn more',
        buttonUrl: '/events/trade-missions',
      },
      {
        title: 'Investment Promotion',
        description:
          'Facilities partnership between agribusiness enterprise and investors, including private equity, development mission to showcase African agricultural products globally',
        imageUrl: img('Investment Promotion.jpg'),
        buttonText: 'Learn more',
        buttonUrl: '/investment-promotion',
      },
      {
        title: 'Capacity Building',
        description:
          'Delivers training, technical assistance and knowledge sharing platforms to strengthen skills, productivity and business operations',
        imageUrl: img('Capacity Building.jpg'),
        buttonText: 'Learn more',
        buttonUrl: '/capacity-building',
      },
    ],
  },
  industryCouncils: {
    headerTitle: 'Industry Councils',
    headerDescription:
      "ATC's Industry Councils serve as platforms for focused dialogue, collaboration, and strategic action across key sectors. They bring together business leaders, experts, policymakers, and development actors to address sector-specific challenges, promote investment, and unlock trade opportunities across the continent.",
    headerButtonText: 'View all councils',
    headerButtonUrl: '/councils/industry',
    intro: {
      imageUrl: img('Industry council.jpg'),
      title: 'Industry Council',
      text: 'Our councils facilitate sector-specific collaboration, policy advocacy, and business networking to drive growth across Africa.',
      buttonText: 'View all councils',
      buttonUrl: '/councils/industry',
    },
    councils: [
      {
        title: 'Agribusiness Council',
        description:
          'Supports agricultural transformation, value chain development, and food security through trade in agribusiness.',
        imageUrl: img('Agribusiness Council.avif'),
        buttonText: 'Learn more',
        buttonUrl: '/councils/agribusiness',
      },
      {
        title: 'Energy Council',
        description:
          'Advances trade, investment, and innovation in power, oil and gas, and renewable energy across Africa.',
        imageUrl: img('Energy Council.avif'),
        buttonText: 'Learn more',
        buttonUrl: '/councils/energy',
      },
      {
        title: 'Manufacturing Council',
        description:
          'Drives industrial competitiveness, export growth, and development of regional production networks in Africa.',
        imageUrl: img('Manufacturing Council.jpeg'),
        buttonText: 'Learn more',
        buttonUrl: '/councils/manufacturing',
      },
      {
        title: 'Technology & Innovation Council',
        description:
          'Promotes digital solutions, tech partnerships, and innovation to boost productivity and market access in Africa.',
        imageUrl: img('Technology & Innovation Council.avif'),
        buttonText: 'Learn more',
        buttonUrl: '/councils/technology-innovation',
      },
    ],
  },
  crossSector: {
    intro: {
      title: 'Cross-Sector Councils',
      description:
        "ATC's Cross-Sector Councils address key development priorities and cross-cutting trade issues. These councils offer targeted support, advocacy, and programming for underrepresented groups across the trade ecosystem.",
      buttonText: 'Learn more',
      buttonUrl: '/councils/cross-sector',
    },
    councils: [
      {
        title: 'Research & Policy Council',
        description:
          'Shaping trade through evidence-based research and policy advocacy.',
        imageUrl: img('Research & Policy Council.jpg'),
        buttonText: 'Learn more',
        buttonUrl: '/councils/research-policy',
      },
      {
        title: 'Young Entrepreneurs Council',
        description:
          'Igniting the future of Africa through Youth-Led Innovation and Entrepreneurship',
        imageUrl: img('Young Entrepreneurs Council.jpeg'),
        buttonText: 'Learn more',
        buttonUrl: '/councils/young-entrepreneurs',
      },
      {
        title: 'Women Entrepreneurs Council',
        description:
          'Championing women-led enterprises through finance, markets, mentorship, and policy advocacy.',
        imageUrl: img('Women Entrepreneurs Council.jpg'),
        buttonText: 'Learn more',
        buttonUrl: '/councils/women-entrepreneurs',
      },
    ],
  },
  membership: {
    sectionTitle: 'Membership',
    sectionDescription:
      'Joining the African Trade Chamber connects your business to a powerful ecosystem of enterprises, institutions, and decision-makers committed to advancing trade and investment across Africa and global markets.',
    sectionCtaText: 'Apply for membership',
    sectionCtaUrl: '/membership/apply',
    cards: [
      {
        title: 'Membership Benefits',
        description:
          'Access trade facilitation services, business matchmaking, investment promotion, policy dialogues, visibility opportunities, training, and eligibility for the Africa Trade Awards.',
        imageUrl: img('Membership Benefits.jpg'),
        buttonText: 'Explore Benefits',
        buttonUrl: '/membership/why-join',
      },
      {
        title: 'Membership Categories',
        description:
          "Choose from Premier, Standard, Emerging Corporate, SME, Institutional, or Professional membership tiers, tailored to your organization's size and goals.",
        imageUrl: img('Membership Categories.jpg'),
        buttonText: 'View Categories',
        buttonUrl: '/membership/categories',
      },
      {
        title: 'Partnership Opportunities',
        description:
          'Collaborate with ATC on trade missions, sector initiatives, policy dialogues, capacity building programs, and strategic events across Africa.',
        imageUrl: img('Partnership Opportunities.webp'),
        buttonText: 'Explore Partnerships',
        buttonUrl: '/partnerships',
      },
    ],
  },
  insights: {
    sectionTitle: 'Insights',
    sectionDescription:
      "ATC produces high-quality insights that help businesses, policymakers, and development partners understand Africa's trade landscape, identify opportunities, and make informed decisions.",
    sectionCtaText: 'See all insight publications',
    sectionCtaUrl: '/insights',
    cards: [
      {
        title: 'Trade & Market Briefs',
        description:
          'Concise, country-specific briefs that offer practical intelligence on trade trends, regulatory updates, and market entry strategies.',
        imageUrl: img('Trade & Market Briefs.jpg'),
        buttonText: 'Learn more',
        buttonUrl: '/insights/trade-market-briefs',
      },
      {
        title: 'Sector Reports',
        description:
          'In-depth studies of strategic sectors such as agribusiness, energy, manufacturing, and technology across African markets.',
        imageUrl: img('Sector Reports.avif'),
        buttonText: 'Learn more',
        buttonUrl: '/insights/sector-reports',
      },
      {
        title: 'Investment Snapshots',
        description:
          'Visual summaries profiling investment hotspots, active funds, and sector attractiveness across the continent.',
        imageUrl: img('Investment Snapshots.jpg'),
        buttonText: 'Learn more',
        buttonUrl: '/insights/investment-landscape-snapshots',
      },
    ],
  },
  events: {
    sectionTitle: 'Events',
    sectionDescription:
      'ATC events bring together business leaders, policymakers, investors, and experts to exchange knowledge, build partnerships, and unlock trade and investment opportunities across the continent and globally.',
    sectionCtaText: 'See all upcoming events',
    sectionCtaUrl: '/events',
    cards: [
      {
        title: 'Africa Trade Summit',
        description:
          "The African Trade Chamber's flagship annual convening, focused on driving private sector-led growth across the continent.",
        imageUrl: img('Africa Trade Summit.png'),
        buttonText: 'Learn more',
        buttonUrl: '/events/africa-trade-summit',
      },
      {
        title: 'Africa Trade Awards',
        description:
          'An annual recognition program honoring outstanding achievements in trade, export excellence, innovation, and business leadership.',
        imageUrl: img('Africa Trade Awards.jpg'),
        buttonText: 'Learn more',
        buttonUrl: 'https://www.africatradeawards.com/',
      },
      {
        title: 'Trade Missions & Investment',
        description:
          'Multi-country trade missions, targeted investment forums, and sectoral expos to support business expansion and capital access.',
        imageUrl: img('Trade Missions & Investment.jpg'),
        buttonText: 'Learn more',
        buttonUrl: '/events/trade-missions',
      },
    ],
  },
  getInvolved: {
    sectionTitle: 'Get Involved',
    sectionDescription:
      "Join the African Trade Chamber and play an active role in strengthening Africa's private sector through membership, partnership, volunteering, or contributing to our initiatives.",
    sectionCtaText: 'Explore all ways to contribute',
    sectionCtaUrl: '/get-involved',
    cards: [
      {
        title: 'Join the Chamber',
        description:
          "Become a member and gain access to ATC's full range of services, networking opportunities, and business support resources.",
        imageUrl: img('Join us today.jpg'),
        buttonText: 'Join Now',
        buttonUrl: '/membership',
      },
      {
        title: 'Partner or Sponsor',
        description:
          'Collaborate with ATC on projects, programs, or events that extend our impact across African markets.',
        imageUrl: img('Partner or Sponsor.jpg'),
        buttonText: 'Explore Partnerships',
        buttonUrl: '/partnerships',
      },
      {
        title: 'Donate',
        description:
          'Support our work in facilitating trade and empowering African businesses through one-time or sustaining contributions.',
        imageUrl: img('Donate.webp'),
        buttonText: 'Learn more',
        buttonUrl: '/donate',
      },
    ],
  },
  news: {
    sectionTitle: 'News',
    sectionDescription:
      'Stay informed with the latest developments, announcements, and media coverage from the African Trade Chamber.',
    sectionCtaText: 'See all news articles',
    sectionCtaUrl: '/news',
    cards: [
      {
        title: 'Chamber News & Updates',
        description:
          'Follow our organizational news, milestone achievements, and strategic engagements with policymakers and business leaders across Africa.',
        imageUrl: img('Chamber News & Updates.webp'),
        buttonText: 'View Updates',
        buttonUrl: '/news',
      },
      {
        title: 'Member News',
        description:
          'Read stories and announcements from ATC members, including business expansions, new ventures, and cross-border partnerships.',
        imageUrl: img('Member News.webp'),
        buttonText: 'Read Member News',
        buttonUrl: '/news?category=member',
      },
      {
        title: 'Press Releases',
        description:
          'Access official ATC statements on major initiatives, partnerships, and events.',
        imageUrl: img('Press Releases.jpg'),
        buttonText: 'View Releases',
        buttonUrl: '/news?category=press',
      },
    ],
  },
}
