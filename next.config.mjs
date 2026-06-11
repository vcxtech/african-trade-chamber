import { withPayload } from '@payloadcms/next/withPayload'
import { wpRedirects } from './redirects/wp-redirects.mjs'

function serverMediaPattern() {
  const url = process.env.NEXT_PUBLIC_SERVER_URL
  if (!url) return null
  try {
    const parsed = new URL(url)
    return {
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
      pathname: '/api/media/file/**',
    }
  } catch {
    return null
  }
}

const deployMediaPattern = serverMediaPattern()

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Required when running behind Coolify/Traefik/nginx so auth cookies and redirects use the public host.
  experimental: {
    trustHost: true,
  },
  images: {
    remotePatterns: [
      ...(deployMediaPattern ? [deployMediaPattern] : []),
      {
        protocol: 'https',
        hostname: 'africantradechamber.org',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'africantradechamber.org',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3002',
        pathname: '/api/media/file/**',
      },
      {
        protocol: 'https',
        hostname: 'africantradechamber.org',
        pathname: '/api/media/file/**',
      },
      {
        protocol: 'http',
        hostname: 'africantradechamber.org',
        pathname: '/api/media/file/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/wp-content/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/future-trade-leaders-fellowship-community-2025',
        destination: '/fellowship/2025',
        permanent: true,
      },
      {
        source: '/future-trade-leaders-fellowship-community-2025/',
        destination: '/fellowship/2025',
        permanent: true,
      },
      {
        source: '/membership-registration',
        destination: '/membership/apply',
        permanent: true,
      },
      {
        source: '/membership-registration/',
        destination: '/membership/apply',
        permanent: true,
      },
      {
        source: '/2026-future-trade-leaders-fellowship-application-form',
        destination: '/fellowship/apply',
        permanent: true,
      },
      {
        source: '/2026-future-trade-leaders-fellowship-application-form/',
        destination: '/fellowship/apply',
        permanent: true,
      },
      {
        source: '/future-trade-leaders-fellowship',
        destination: '/fellowship',
        permanent: true,
      },
      {
        source: '/future-trade-leaders-fellowship/',
        destination: '/fellowship',
        permanent: true,
      },
      {
        source: '/careers-opportunities',
        destination: '/careers',
        permanent: true,
      },
      {
        source: '/careers-opportunities/',
        destination: '/careers',
        permanent: true,
      },
      {
        source: '/donate/',
        destination: '/donate',
        permanent: true,
      },
      {
        source: '/volunteer/',
        destination: '/volunteer',
        permanent: true,
      },
      {
        source: '/partnerships/',
        destination: '/partnerships',
        permanent: true,
      },
      {
        source: '/get-involved/',
        destination: '/get-involved',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/about-us/',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/chamber-news.html',
        destination: '/news',
        permanent: true,
      },
      {
        source: '/member-news.html',
        destination: '/news?category=member',
        permanent: true,
      },
      {
        source: '/press-releases.html',
        destination: '/news?category=press',
        permanent: true,
      },
      {
        source: '/market-support/',
        destination: '/market-support',
        permanent: true,
      },
      {
        source: '/trade-facilitation-expansion/',
        destination: '/trade-facilitation-expansion',
        permanent: true,
      },
      {
        source: '/b2b-b2g-matchmaking/',
        destination: '/b2b-b2g-matchmaking',
        permanent: true,
      },
      {
        source: '/investment-promotion/',
        destination: '/investment-promotion',
        permanent: true,
      },
      {
        source: '/policy-government-engagement/',
        destination: '/policy-government-engagement',
        permanent: true,
      },
      {
        source: '/capacity-building/',
        destination: '/capacity-building',
        permanent: true,
      },
      {
        source: '/africa-trade-summit',
        destination: '/events/africa-trade-summit',
        permanent: true,
      },
      {
        source: '/africa-trade-summit/',
        destination: '/events/africa-trade-summit',
        permanent: true,
      },
      {
        source: '/trade-missions-investment-events',
        destination: '/events/trade-missions',
        permanent: true,
      },
      {
        source: '/trade-missions-investment-events/',
        destination: '/events/trade-missions',
        permanent: true,
      },
      {
        source: '/calendar-of-events',
        destination: '/events/calendar',
        permanent: true,
      },
      {
        source: '/calendar-of-events/',
        destination: '/events/calendar',
        permanent: true,
      },
      {
        source: '/atc-event',
        destination: '/events',
        permanent: true,
      },
      {
        source: '/atc-event/',
        destination: '/events',
        permanent: true,
      },
      {
        source: '/sponsorship',
        destination: '/events/sponsorship',
        permanent: true,
      },
      {
        source: '/sponsorship/',
        destination: '/events/sponsorship',
        permanent: true,
      },
      {
        source: '/agribusiness-industry-council',
        destination: '/councils/agribusiness',
        permanent: true,
      },
      {
        source: '/agribusiness-industry-council/',
        destination: '/councils/agribusiness',
        permanent: true,
      },
      {
        source: '/energy-council',
        destination: '/councils/energy',
        permanent: true,
      },
      {
        source: '/energy-council/',
        destination: '/councils/energy',
        permanent: true,
      },
      {
        source: '/manufacturing-council',
        destination: '/councils/manufacturing',
        permanent: true,
      },
      {
        source: '/manufacturing-council/',
        destination: '/councils/manufacturing',
        permanent: true,
      },
      {
        source: '/trade-finance-council',
        destination: '/councils/trade-finance',
        permanent: true,
      },
      {
        source: '/trade-finance-council/',
        destination: '/councils/trade-finance',
        permanent: true,
      },
      {
        source: '/transport-logistics-council',
        destination: '/councils/transport-logistics',
        permanent: true,
      },
      {
        source: '/transport-logistics-council/',
        destination: '/councils/transport-logistics',
        permanent: true,
      },
      {
        source: '/mining-extractives-council',
        destination: '/councils/mining-extractives',
        permanent: true,
      },
      {
        source: '/mining-extractives-council/',
        destination: '/councils/mining-extractives',
        permanent: true,
      },
      {
        source: '/healthcare-council',
        destination: '/councils/healthcare',
        permanent: true,
      },
      {
        source: '/healthcare-council/',
        destination: '/councils/healthcare',
        permanent: true,
      },
      {
        source: '/tourism-hospitality-council',
        destination: '/councils/tourism-hospitality',
        permanent: true,
      },
      {
        source: '/tourism-hospitality-council/',
        destination: '/councils/tourism-hospitality',
        permanent: true,
      },
      {
        source: '/creatives-council',
        destination: '/councils/creatives',
        permanent: true,
      },
      {
        source: '/creatives-council/',
        destination: '/councils/creatives',
        permanent: true,
      },
      {
        source: '/infrastructure-development-council',
        destination: '/councils/infrastructure-development',
        permanent: true,
      },
      {
        source: '/infrastructure-development-council/',
        destination: '/councils/infrastructure-development',
        permanent: true,
      },
      {
        source: '/customs-council',
        destination: '/councils/customs',
        permanent: true,
      },
      {
        source: '/customs-council/',
        destination: '/councils/customs',
        permanent: true,
      },
      {
        source: '/professional-services-council',
        destination: '/councils/professional-services',
        permanent: true,
      },
      {
        source: '/professional-services-council/',
        destination: '/councils/professional-services',
        permanent: true,
      },
      {
        source: '/technology-innovation-council',
        destination: '/councils/technology-innovation',
        permanent: true,
      },
      {
        source: '/technology-innovation-council/',
        destination: '/councils/technology-innovation',
        permanent: true,
      },
      {
        source: '/research-policy-council',
        destination: '/councils/research-policy',
        permanent: true,
      },
      {
        source: '/research-policy-council/',
        destination: '/councils/research-policy',
        permanent: true,
      },
      {
        source: '/women-entrepreneurs-council',
        destination: '/councils/women-entrepreneurs',
        permanent: true,
      },
      {
        source: '/women-entrepreneurs-council/',
        destination: '/councils/women-entrepreneurs',
        permanent: true,
      },
      {
        source: '/young-entrepreneurs-council',
        destination: '/councils/young-entrepreneurs',
        permanent: true,
      },
      {
        source: '/young-entrepreneurs-council/',
        destination: '/councils/young-entrepreneurs',
        permanent: true,
      },
      {
        source: '/sme-council',
        destination: '/councils/sme',
        permanent: true,
      },
      {
        source: '/sme-council/',
        destination: '/councils/sme',
        permanent: true,
      },
      {
        source: '/trade-market-briefs',
        destination: '/insights/trade-market-briefs',
        permanent: true,
      },
      {
        source: '/trade-market-briefs/',
        destination: '/insights/trade-market-briefs',
        permanent: true,
      },
      {
        source: '/sector-reports',
        destination: '/insights/sector-reports',
        permanent: true,
      },
      {
        source: '/sector-reports/',
        destination: '/insights/sector-reports',
        permanent: true,
      },
      {
        source: '/investment-landscape-snapshots',
        destination: '/insights/investment-landscape-snapshots',
        permanent: true,
      },
      {
        source: '/investment-landscape-snapshots/',
        destination: '/insights/investment-landscape-snapshots',
        permanent: true,
      },
      {
        source: '/policy-advocacy',
        destination: '/insights/policy-papers',
        permanent: true,
      },
      {
        source: '/policy-advocacy/',
        destination: '/insights/policy-papers',
        permanent: true,
      },
      {
        source: '/newsletter-content',
        destination: '/newsletter-archive',
        permanent: true,
      },
      {
        source: '/newsletter-content/',
        destination: '/newsletter-archive',
        permanent: true,
      },
      {
        source: '/sector-report-on-agribusiness-in-ghana',
        destination: '/insights/sector-reports/sector-report-on-agribusiness-in-ghana',
        permanent: true,
      },
      {
        source: '/sector-report-on-agribusiness-in-ghana/',
        destination: '/insights/sector-reports/sector-report-on-agribusiness-in-ghana',
        permanent: true,
      },
      ...wpRedirects,
    ]
  },
}

export default withPayload(nextConfig)
