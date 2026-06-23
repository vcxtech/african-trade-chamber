import type { Access, AccessArgs, FieldAccess, GlobalConfig, PayloadRequest } from 'payload'
import type { User as ConfigUser } from '@/payload-types'

export type UserRole = 'admin' | 'editor'

export type ContentArea =
  | 'communications'
  | 'homepage'
  | 'programs'
  | 'membership'
  | 'careers'

export const ALL_CONTENT_AREAS: ContentArea[] = [
  'communications',
  'homepage',
  'programs',
  'membership',
  'careers',
]

export type AtcUser = ConfigUser & {
  role?: UserRole | null
  contentAreas?: ContentArea[] | null
}

function getUser(req: PayloadRequest): AtcUser | null {
  return (req.user as AtcUser | null | undefined) ?? null
}

export function isLoggedIn({ req }: AccessArgs): boolean {
  return Boolean(req.user)
}

export function isAdmin({ req }: AccessArgs): boolean {
  return getUser(req)?.role === 'admin'
}

export function isEditor({ req }: AccessArgs): boolean {
  return getUser(req)?.role === 'editor'
}

export function hasContentArea(user: AtcUser | null | undefined, area: ContentArea): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  const areas = user.contentAreas
  if (!areas || areas.length === 0) return false
  return areas.includes(area)
}

export function canReadArea(user: AtcUser | null | undefined, area: ContentArea): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  if (user.role === 'editor') {
    return hasContentArea(user, area)
  }
  return false
}

export function canWriteArea(user: AtcUser | null | undefined, area: ContentArea): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  if (user.role === 'editor') return hasContentArea(user, area)
  return false
}

export function canDeleteInArea(
  user: AtcUser | null | undefined,
  area: ContentArea,
  editorCanDelete = true,
): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  if (user.role === 'editor') return editorCanDelete && hasContentArea(user, area)
  return false
}

export function adminOnlyAccess(): {
  create: Access
  delete: Access
  read: Access
  update: Access
} {
  return {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  }
}

type ContentCollectionAccessOptions = {
  editorCanDelete?: boolean
}

export function contentCollectionAccess(
  area: ContentArea,
  options: ContentCollectionAccessOptions = {},
): {
  create: Access
  delete: Access
  read: Access
  update: Access
} {
  const { editorCanDelete = true } = options
  return {
    read: ({ req }) => canReadArea(getUser(req), area),
    create: ({ req }) => canWriteArea(getUser(req), area),
    update: ({ req }) => canWriteArea(getUser(req), area),
    delete: ({ req }) => canDeleteInArea(getUser(req), area, editorCanDelete),
  }
}

export function contentGlobalAccess(area: ContentArea): {
  read: Access
  update: Access
} {
  return {
    read: ({ req }) => canReadArea(getUser(req), area),
    update: ({ req }) => canWriteArea(getUser(req), area),
  }
}

export function hideUnlessAdmin() {
  return ({ user }: { user: unknown }) => (user as AtcUser | null)?.role !== 'admin'
}

export function hideUnlessArea(area: ContentArea) {
  return ({ user }: { user: unknown }) => {
    const atcUser = user as AtcUser | null
    if (!atcUser) return true
    if (atcUser.role === 'admin') return false
    return !hasContentArea(atcUser, area)
  }
}

export function hideUnlessAdminOrArea(area: ContentArea) {
  return ({ user }: { user: unknown }) => {
    const atcUser = user as AtcUser | null
    if (!atcUser) return true
    if (atcUser.role === 'admin') return false
    return !hasContentArea(atcUser, area)
  }
}

export function formSubmissionAccess(): {
  create: Access
  delete: Access
  read: Access
  update: Access
} {
  return {
    create: () => false,
    read: ({ req }) => {
      const user = getUser(req)
      if (!user) return false
      if (user.role === 'admin') return true
      return hasContentArea(user, 'membership')
    },
    update: isAdmin,
    delete: isAdmin,
  }
}

export function formAttachmentAccess(): {
  create: Access
  delete: Access
  read: Access
  update: Access
} {
  return {
    create: () => false,
    read: ({ req }) => {
      const user = getUser(req)
      if (!user) return false
      if (user.role === 'admin') return true
      return hasContentArea(user, 'membership')
    },
    update: isAdmin,
    delete: isAdmin,
  }
}

export function mediaCollectionAccess(): {
  create: Access
  delete: Access
  read: Access
  update: Access
} {
  const areaAccess = contentCollectionAccess('communications', { editorCanDelete: false })
  return {
    read: () => true,
    create: areaAccess.create,
    update: areaAccess.update,
    delete: areaAccess.delete,
  }
}

export const adminFieldUpdate: FieldAccess = ({ req }) => isAdmin({ req })

export function withContentAreaGlobal(
  global: GlobalConfig,
  area: ContentArea,
): GlobalConfig {
  return {
    ...global,
    access: contentGlobalAccess(area),
    admin: {
      ...global.admin,
      hidden: hideUnlessArea(area),
    },
  }
}

export function roleLabel(role: UserRole | null | undefined): string {
  switch (role) {
    case 'admin':
      return 'Administrator'
    case 'editor':
      return 'Editor'
    default:
      return 'User'
  }
}

export function contentAreasLabel(areas: ContentArea[] | null | undefined): string {
  if (!areas || areas.length === 0) return 'All content areas'
  return areas
    .map((area) => {
      switch (area) {
        case 'communications':
          return 'Communications'
        case 'homepage':
          return 'Homepage'
        case 'programs':
          return 'Programs'
        case 'membership':
          return 'Membership'
        case 'careers':
          return 'Careers'
        default:
          return area
      }
    })
    .join(', ')
}
