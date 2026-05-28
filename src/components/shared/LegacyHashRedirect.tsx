'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Props = { map: Record<string, string> }

export function LegacyHashRedirect({ map }: Props) {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash) return
    const target = map[hash]
    if (target) router.replace(target)
  }, [map, router])

  return null
}
