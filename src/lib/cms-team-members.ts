import { TEAM_CATEGORY_LABELS } from '@/lib/about-defaults'
import { getPayloadClient } from '@/lib/cms'
import { resolvePayloadMediaAlt, resolvePayloadMediaUrl } from '@/lib/payload-media'
import { resolveMemberImageUrl } from '@/lib/wp-uploads'
import type { TeamMember, TeamMemberCategory } from '@/types/about-page'
import type { Fellow, FellowSocialLinks } from '@/types/fellow'

function mapSocialLinks(raw: unknown): FellowSocialLinks | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const row = raw as Record<string, unknown>
  const links: FellowSocialLinks = {}
  if (row.instagram) links.instagram = String(row.instagram)
  if (row.x) links.x = String(row.x)
  if (row.tiktok) links.tiktok = String(row.tiktok)
  if (row.facebook) links.facebook = String(row.facebook)
  if (row.linkedin) links.linkedin = String(row.linkedin)
  return Object.keys(links).length ? links : undefined
}

function mapDoc(doc: Record<string, unknown>): TeamMember {
  const category = (doc.category as TeamMemberCategory) || 'advisory'
  const media = doc.photo
  const name = String(doc.name ?? '')
  const rawImage = resolvePayloadMediaUrl(media, doc.imageUrl as string | undefined)

  return {
    id: String(doc.id),
    name,
    slug: String(doc.slug ?? ''),
    position: doc.position ? String(doc.position) : undefined,
    category,
    categoryLabel: TEAM_CATEGORY_LABELS[category] ?? category,
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

  return {
    id: String(doc.id),
    name,
    slug: String(doc.slug ?? ''),
    position: doc.position ? String(doc.position) : undefined,
    country: doc.country ? String(doc.country) : undefined,
    memberCode: doc.memberCode ? String(doc.memberCode) : undefined,
    cohortYear: typeof doc.cohortYear === 'number' ? doc.cohortYear : undefined,
    bio: doc.bio ? String(doc.bio) : undefined,
    imageUrl: resolveMemberImageUrl(rawImage),
    imageAlt: resolvePayloadMediaAlt(media, null, name),
    socialLinks: mapSocialLinks(doc.socialLinks),
    postDate: doc.postDate ? String(doc.postDate) : undefined,
    sortOrder: typeof doc.sortOrder === 'number' ? doc.sortOrder : 0,
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'team-members',
      where: {
        and: [
          { published: { equals: true } },
          { category: { in: ['advisory', 'board', 'secretariat'] } },
        ],
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

    const result = await payload.find({
      collection: 'team-members',
      where: {
        and: [
          { published: { equals: true } },
          { category: { equals: 'fellow' } },
          ...(options?.year ? [{ cohortYear: { equals: options.year } }] : []),
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
