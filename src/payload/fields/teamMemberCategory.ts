type CategoryRef = string | number | { slug?: string; isFellow?: boolean } | null | undefined

export function isFellowCategory(category: CategoryRef): boolean {
  if (category == null) return false
  if (typeof category === 'object') {
    if (category.isFellow === true) return true
    return category.slug === 'fellow'
  }
  return false
}

export function isNonFellowCategory(category: CategoryRef): boolean {
  if (category == null) return false
  return !isFellowCategory(category)
}
