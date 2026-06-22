import { TEAM_CATEGORY_LABELS } from '@/lib/about-defaults'
import { getPayloadClient } from '@/lib/cms'
import { resolvePayloadMediaAlt, resolvePayloadMediaUrl } from '@/lib/payload-media'
import { resolveMemberImageUrl } from '@/lib/wp-uploads'
import type { TeamMember, TeamMemberCategory } from '@/types/about-page'
import type { Fellow } from '@/types/fellow'

type CategoryDoc = {
  id?: string | number
  slug?: string
  name?: string
  showOnAbout?: boolean
  isFellow?: boolean
}

type CountryDoc = {
  id?: string | number
  name?: string
}

function readCategory(doc: Record<string, unknown>): {
  slug: string
  label: string
  isFellow: boolean
} {
  const raw = doc.category
  if (raw && typeof raw === 'object') {
    const cat = raw as CategoryDoc
    const slug = cat.slug || 'advisory'
    return {
      slug,
      label: cat.name || TEAM_CATEGORY_LABELS[slug as TeamMemberCategory] || slug,
      isFellow: cat.isFellow === true || slug === 'fellow',
    }
  }
  const legacy = String(raw ?? 'advisory')
  return {
    slug: legacy,
    label: TEAM_CATEGORY_LABELS[legacy as TeamMemberCategory] ?? legacy,
    isFellow: legacy === 'fellow',
  }
}

function readCountryName(doc: Record<string, unknown>): string | undefined {
  const raw = doc.country
  if (raw == null) return undefined
  if (typeof raw === 'object') {
    const name = (raw as CountryDoc).name
    return name ? String(name) : undefined
  }
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  return undefined
}

function mapDoc(doc: Record<string, unknown>): TeamMember {
  const { slug: categorySlug, label: categoryLabel } = readCategory(doc)
  const category = categorySlug as TeamMemberCategory
  const media = doc.photo
  const name = String(doc.name ?? '')
  const rawImage = resolvePayloadMediaUrl(media, doc.imageUrl as string | undefined)

  return {
    id: String(doc.id),
    name,
    slug: String(doc.slug ?? ''),
    position: doc.position ? String(doc.position) : undefined,
    category,
    categoryLabel,
    bio: doc.bio ? String(doc.bio) : undefined,
    imageUrl: resolveMemberImageUrl(rawImage),
    imageAlt: resolvePayloadMediaAlt(media, null, name),
    sortOrder: typeof doc.sortOrder === 'number' ? doc.sortOrder : 0,
  }
}

function mapFellowDoc(doc: Record<string, unknown>): Fellow {
  const media = doc.photo
  const name = String(doc.name ?? '')
  const rawImage = resolvePayloadMediaUrl(media, doc.imageUrl as string | undefined)
  const cohortRaw = doc.cohortYear
  const cohortYear =
    cohortRaw === '2025' || cohortRaw === 2025
      ? 2025
      : cohortRaw === '2026' || cohortRaw === 2026
        ? 2026
        : undefined

  return {
    id: String(doc.id),
    name,
    slug: String(doc.slug ?? ''),
    position: doc.position ? String(doc.position) : undefined,
    country: readCountryName(doc),
    memberCode: doc.memberCode ? String(doc.memberCode) : undefined,
    cohortYear,
    bio: doc.bio ? String(doc.bio) : undefined,
    imageUrl: resolveMemberImageUrl(rawImage),
    imageAlt: resolvePayloadMediaAlt(media, null, name),
    postDate: doc.postDate ? String(doc.postDate) : undefined,
    sortOrder: typeof doc.sortOrder === 'number' ? doc.sortOrder : 0,
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []

    const aboutCategories = await payload.find({
      collection: 'team-member-categories',
      where: { showOnAbout: { equals: true } },
      limit: 50,
    })
    const categoryIds = aboutCategories.docs.map((doc) => doc.id)
    if (!categoryIds.length) return []

    const result = await payload.find({
      collection: 'team-members',
      where: {
        and: [{ published: { equals: true } }, { category: { in: categoryIds } }],
      },
      sort: 'sortOrder',
      limit: 500,
      depth: 1,
    })
    return result.docs.map((doc) => mapDoc(doc as unknown as Record<string, unknown>))
  } catch {
    return []
  }
}

export async function getFellows(options?: { year?: number }): Promise<Fellow[]> {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []

    const fellowCategory = await payload.find({
      collection: 'team-member-categories',
      where: { slug: { equals: 'fellow' } },
      limit: 1,
    })
    const fellowCategoryId = fellowCategory.docs[0]?.id
    if (fellowCategoryId == null) return []

    const yearFilter =
      options?.year != null
        ? [{ cohortYear: { equals: String(options.year) } }]
        : []

    const result = await payload.find({
      collection: 'team-members',
      where: {
        and: [
          { published: { equals: true } },
          { category: { equals: fellowCategoryId } },
          ...yearFilter,
        ],
      },
      sort: '-postDate',
      limit: 200,
      depth: 1,
    })

    const fellows = result.docs.map((doc) =>
      mapFellowDoc(doc as unknown as Record<string, unknown>),
    )

    return fellows.sort((a, b) => {
      const da = a.postDate || ''
      const db = b.postDate || ''
      return db.localeCompare(da)
    })
  } catch {
    return []
  }
}
