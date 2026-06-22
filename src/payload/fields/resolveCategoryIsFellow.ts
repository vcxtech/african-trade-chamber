import type { PayloadRequest } from 'payload'
import { isFellowCategory } from './teamMemberCategory'

export async function resolveCategoryIsFellow(
  req: PayloadRequest,
  category: unknown,
): Promise<boolean> {
  if (category == null) return false
  if (typeof category === 'object') {
    return isFellowCategory(category as { slug?: string; isFellow?: boolean })
  }

  const id = typeof category === 'number' || typeof category === 'string' ? category : null
  if (id == null || !req.payload) return false

  try {
    const doc = await req.payload.findByID({
      collection: 'team-member-categories',
      id,
      depth: 0,
    })
    return isFellowCategory(doc as { slug?: string; isFellow?: boolean })
  } catch {
    return false
  }
}
