import { SiteSearchResults } from '@/components/search/SiteSearchResults'
import { searchSite } from '@/lib/cms-search'

export const metadata = {
  title: 'Search',
  robots: { index: false, follow: false },
}

type Props = {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''
  const results = query ? await searchSite(query) : { query: '', pages: [], news: [], insights: [], jobs: [], total: 0 }

  return (
    <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] py-8">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <header className="mb-8 rounded-[15px] bg-[#002740] px-6 py-8 text-center text-white shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
          <h1 className="text-2xl font-bold md:text-3xl">Search</h1>
          {query ? (
            <p className="mt-2 text-sm text-white/85">Results for &ldquo;{query}&rdquo;</p>
          ) : (
            <p className="mt-2 text-sm text-white/85">Find pages, news, insights, and careers</p>
          )}
        </header>
        <SiteSearchResults results={results} />
      </div>
    </div>
  )
}
