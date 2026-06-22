type TestimonialRow = Record<string, unknown>

export function hasTestimonialContent(rows: unknown): boolean {
  if (!Array.isArray(rows)) return false
  return rows.some((row) => {
    if (!row || typeof row !== 'object') return false
    const item = row as TestimonialRow
    return Boolean(String(item.quote ?? '').trim() && String(item.name ?? '').trim())
  })
}

export function applyFellowshipCohortBeforeChange(data: Record<string, unknown>): void {
  const year = data.cohortYear
  if (year === '2025' || year === '2026' || year === 2025 || year === 2026) {
    const y = String(year)
    data.exploreUrl = `/fellowship/${y}`
    data.exploreExternal = false
  }

  if (
    hasTestimonialContent(data.fellowTestimonials) ||
    hasTestimonialContent(data.resourceTestimonials)
  ) {
    data.showTestimonials = true
  }
}

export function mergeFellowshipCohortSeedData(
  existing: Record<string, unknown> | null | undefined,
  seedData: Record<string, unknown>,
): Record<string, unknown> {
  if (!existing) return seedData

  const existingFellow = existing.fellowTestimonials
  const existingResource = existing.resourceTestimonials
  const hasFellow = hasTestimonialContent(existingFellow)
  const hasResource = hasTestimonialContent(existingResource)
  const hasAnyTestimonials = hasFellow || hasResource

  return {
    ...seedData,
    showTestimonials: hasAnyTestimonials
      ? true
      : existing.showTestimonials !== undefined && existing.showTestimonials !== null
        ? existing.showTestimonials
        : seedData.showTestimonials,
    fellowTestimonials: hasFellow ? existingFellow : seedData.fellowTestimonials,
    resourceTestimonials: hasResource ? existingResource : seedData.resourceTestimonials,
  }
}
