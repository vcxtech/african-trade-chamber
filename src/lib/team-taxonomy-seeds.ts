export type TeamCategorySeed = {
  name: string
  slug: string
  showOnAbout: boolean
  isFellow: boolean
  sortOrder: number
}

export const TEAM_CATEGORY_SEEDS: TeamCategorySeed[] = [
  { name: 'Board of Directors', slug: 'board', showOnAbout: true, isFellow: false, sortOrder: 0 },
  { name: 'Facilitators', slug: 'facilitators', showOnAbout: false, isFellow: false, sortOrder: 1 },
  { name: 'Fellow', slug: 'fellow', showOnAbout: false, isFellow: true, sortOrder: 2 },
  { name: 'Guest Speakers', slug: 'guest-speakers', showOnAbout: false, isFellow: false, sortOrder: 3 },
  { name: 'Mentors', slug: 'mentors', showOnAbout: false, isFellow: false, sortOrder: 4 },
  {
    name: 'Secretariat Management',
    slug: 'secretariat',
    showOnAbout: true,
    isFellow: false,
    sortOrder: 5,
  },
  { name: 'Advisory Board', slug: 'advisory', showOnAbout: true, isFellow: false, sortOrder: 6 },
]

export const FELLOW_COUNTRY_SEEDS: { name: string; sortOrder: number }[] = [
  { name: 'ALGERIA', sortOrder: 0 },
  { name: 'BOTSWANA', sortOrder: 1 },
  { name: 'BURKINA FASO', sortOrder: 2 },
  { name: 'CONGO', sortOrder: 3 },
  { name: "CÔTE D'IVOIRE", sortOrder: 4 },
  { name: 'DEMOCRATIC REPUBLIC OF CONGO', sortOrder: 5 },
  { name: 'ETHIOPIA', sortOrder: 6 },
  { name: 'ESWATINI', sortOrder: 7 },
  { name: 'GHANA', sortOrder: 8 },
  { name: 'KENYA', sortOrder: 9 },
  { name: 'LESOTHO', sortOrder: 10 },
  { name: 'MALI', sortOrder: 11 },
  { name: 'MAURITIUS', sortOrder: 12 },
  { name: 'NAMIBIA', sortOrder: 13 },
  { name: 'NIGER', sortOrder: 14 },
  { name: 'NIGERIA', sortOrder: 15 },
  { name: 'RWANDA', sortOrder: 16 },
  { name: 'SIERRA LEONE', sortOrder: 17 },
  { name: 'SOUTH AFRICA', sortOrder: 18 },
  { name: 'SOUTH SUDAN', sortOrder: 19 },
  { name: 'ST LUCIA', sortOrder: 20 },
  { name: 'TOGO', sortOrder: 21 },
  { name: 'TRINIDAD AND TOBAGO', sortOrder: 22 },
  { name: 'ZAMBIA', sortOrder: 23 },
  { name: 'ZIMBABWE', sortOrder: 24 },
]

export function countryNameToSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function normalizeCountryKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[''`´]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const COUNTRY_ALIASES: Record<string, string> = {
  "cote d'ivoire": "cote d'ivoire",
  'cote divoire': "cote d'ivoire",
  'ivory coast': "cote d'ivoire",
  drc: 'democratic republic of congo',
  'dr congo': 'democratic republic of congo',
  'democratic republic of the congo': 'democratic republic of congo',
  'st. lucia': 'st lucia',
  'saint lucia': 'st lucia',
  'trinidad & tobago': 'trinidad and tobago',
}

export function resolveCountrySeedName(raw: string | undefined | null): string | undefined {
  if (!raw?.trim()) return undefined
  const key = normalizeCountryKey(raw)
  const alias = COUNTRY_ALIASES[key]
  const lookup = alias ?? key
  for (const seed of FELLOW_COUNTRY_SEEDS) {
    if (normalizeCountryKey(seed.name) === lookup) return seed.name
  }
  return undefined
}

export type TaxonomyMaps = {
  categoryBySlug: Map<string, number | string>
  countryBySlug: Map<string, number | string>
  countryByName: Map<string, number | string>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function upsertTeamTaxonomies(payload: any): Promise<TaxonomyMaps> {
  const categoryBySlug = new Map<string, number | string>()
  const countryBySlug = new Map<string, number | string>()
  const countryByName = new Map<string, number | string>()

  for (const row of TEAM_CATEGORY_SEEDS) {
    const existing = await payload.find({
      collection: 'team-member-categories',
      where: { slug: { equals: row.slug } },
      limit: 1,
    })
    const data = {
      name: row.name,
      slug: row.slug,
      showOnAbout: row.showOnAbout,
      isFellow: row.isFellow,
      sortOrder: row.sortOrder,
    }
    if (existing.docs[0]) {
      const doc = await payload.update({
        collection: 'team-member-categories',
        id: existing.docs[0].id,
        data,
      })
      categoryBySlug.set(row.slug, doc.id)
    } else {
      const doc = await payload.create({ collection: 'team-member-categories', data })
      categoryBySlug.set(row.slug, doc.id)
    }
  }

  for (const row of FELLOW_COUNTRY_SEEDS) {
    const slug = countryNameToSlug(row.name)
    const existing = await payload.find({
      collection: 'fellow-countries',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const data = { name: row.name, slug, sortOrder: row.sortOrder }
    if (existing.docs[0]) {
      const doc = await payload.update({
        collection: 'fellow-countries',
        id: existing.docs[0].id,
        data,
      })
      countryBySlug.set(slug, doc.id)
      countryByName.set(normalizeCountryKey(row.name), doc.id)
    } else {
      const doc = await payload.create({ collection: 'fellow-countries', data })
      countryBySlug.set(slug, doc.id)
      countryByName.set(normalizeCountryKey(row.name), doc.id)
    }
  }

  return { categoryBySlug, countryBySlug, countryByName }
}

export function resolveCategoryId(
  maps: TaxonomyMaps,
  category: unknown,
): number | string | undefined {
  if (category == null) return undefined
  if (typeof category === 'number' || typeof category === 'string') {
    if (typeof category === 'string' && maps.categoryBySlug.has(category)) {
      return maps.categoryBySlug.get(category)
    }
    return category
  }
  if (typeof category === 'object') {
    const row = category as { id?: number | string; slug?: string }
    if (row.id != null) return row.id
    if (row.slug && maps.categoryBySlug.has(row.slug)) {
      return maps.categoryBySlug.get(row.slug)
    }
  }
  return undefined
}

export function resolveCountryId(
  maps: TaxonomyMaps,
  country: unknown,
): number | string | undefined {
  if (country == null) return undefined
  if (typeof country === 'number') return country
  if (typeof country === 'string') {
    const seedName = resolveCountrySeedName(country)
    if (seedName) {
      const id = maps.countryByName.get(normalizeCountryKey(seedName))
      if (id != null) return id
    }
    const slug = countryNameToSlug(country)
    if (maps.countryBySlug.has(slug)) return maps.countryBySlug.get(slug)
    return undefined
  }
  if (typeof country === 'object') {
    const row = country as { id?: number | string; name?: string; slug?: string }
    if (row.id != null) return row.id
    if (row.name) {
      const seedName = resolveCountrySeedName(row.name)
      if (seedName) return maps.countryByName.get(normalizeCountryKey(seedName))
    }
    if (row.slug && maps.countryBySlug.has(row.slug)) {
      return maps.countryBySlug.get(row.slug)
    }
  }
  return undefined
}

export function normalizeCohortYear(value: unknown): '2025' | '2026' | undefined {
  if (value === '2025' || value === '2026') return value
  if (value === 2025 || value === '2025') return '2025'
  if (value === 2026 || value === '2026') return '2026'
  return undefined
}

const LEGACY_CATEGORY_SLUGS = new Set([
  'advisory',
  'board',
  'secretariat',
  'fellow',
  'facilitators',
  'guest-speakers',
  'mentors',
])

export function legacyCategorySlug(category: unknown): string | undefined {
  if (typeof category === 'string' && LEGACY_CATEGORY_SLUGS.has(category)) {
    return category
  }
  return undefined
}
