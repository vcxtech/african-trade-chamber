'use client'

import { DefaultListView } from '@payloadcms/ui'
import type { ListViewClientProps } from 'payload'
import React, { useEffect, useMemo, useState } from 'react'

import { MediaGridTable } from './MediaGridTable'
import {
  getStoredViewMode,
  MediaViewToggle,
  type MediaViewMode,
} from './MediaViewToggle'
import './media-grid.scss'

export function MediaListView(props: ListViewClientProps) {
  const [viewMode, setViewMode] = useState<MediaViewMode>('grid')
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setViewMode(getStoredViewMode())
    setHasHydrated(true)
  }, [])

  const beforeActions = useMemo(() => {
    const toggle = (
      <MediaViewToggle
        key="media-view-toggle"
        onChange={setViewMode}
        viewMode={viewMode}
      />
    )

    if (props.beforeActions?.length) {
      return [...props.beforeActions, toggle]
    }

    return [toggle]
  }, [props.beforeActions, viewMode])

  const effectiveMode = hasHydrated ? viewMode : 'grid'
  const Table =
    effectiveMode === 'grid' ? (
      <MediaGridTable collectionSlug={props.collectionSlug} />
    ) : (
      props.Table
    )

  return (
    <DefaultListView
      {...props}
      beforeActions={beforeActions}
      Table={Table}
    />
  )
}
