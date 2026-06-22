'use client'

import { useEffect, useState } from 'react'
import { useFormFields } from '@payloadcms/ui'

import { isFellowCategory } from '@/payload/fields/teamMemberCategory'

type CategoryDoc = {
  id?: number | string
  slug?: string
  isFellow?: boolean
}

const fellowByIdCache = new Map<string, boolean>()

function categoryValueIsFellow(value: unknown): boolean | null {
  if (value == null || value === '') return null
  if (typeof value === 'object') {
    return isFellowCategory(value as CategoryDoc)
  }
  return null
}

async function fetchCategoryIsFellow(id: string | number): Promise<boolean> {
  const key = String(id)
  if (fellowByIdCache.has(key)) {
    return fellowByIdCache.get(key)!
  }
  const res = await fetch(`/api/team-member-categories/${key}`, { credentials: 'include' })
  if (!res.ok) {
    fellowByIdCache.set(key, false)
    return false
  }
  const doc = (await res.json()) as CategoryDoc
  const isFellow = isFellowCategory(doc)
  fellowByIdCache.set(key, isFellow)
  return isFellow
}

export function useTeamMemberIsFellow(): {
  isFellow: boolean
  loading: boolean
  hasCategory: boolean
  categoryId: string | number | null
} {
  const categoryValue = useFormFields(([fields]) => fields.category?.value as unknown)
  const [isFellow, setIsFellow] = useState(false)
  const [loading, setLoading] = useState(false)

  const hasCategory = categoryValue != null && categoryValue !== ''
  const categoryId =
    typeof categoryValue === 'object' && categoryValue !== null
      ? ((categoryValue as CategoryDoc).id ?? null)
      : typeof categoryValue === 'number' || typeof categoryValue === 'string'
        ? categoryValue
        : null

  useEffect(() => {
    let cancelled = false

    async function resolve() {
      if (!hasCategory) {
        setIsFellow(false)
        setLoading(false)
        return
      }

      const fromObject = categoryValueIsFellow(categoryValue)
      if (fromObject != null) {
        setIsFellow(fromObject)
        setLoading(false)
        return
      }

      if (categoryId == null) {
        setIsFellow(false)
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const fellow = await fetchCategoryIsFellow(categoryId)
        if (!cancelled) {
          setIsFellow(fellow)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setIsFellow(false)
          setLoading(false)
        }
      }
    }

    void resolve()
    return () => {
      cancelled = true
    }
  }, [categoryValue, categoryId, hasCategory])

  return { isFellow, loading, hasCategory, categoryId }
}
