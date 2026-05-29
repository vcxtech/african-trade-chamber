'use client'

import { Button, GridViewIcon, ListViewIcon } from '@payloadcms/ui'
import React from 'react'

export const MEDIA_VIEW_STORAGE_KEY = 'atc-media-view'

export type MediaViewMode = 'grid' | 'list'

export function getStoredViewMode(): MediaViewMode {
  if (typeof window === 'undefined') {
    return 'grid'
  }

  const stored = window.localStorage.getItem(MEDIA_VIEW_STORAGE_KEY)
  return stored === 'list' ? 'list' : 'grid'
}

type MediaViewToggleProps = {
  onChange: (mode: MediaViewMode) => void
  viewMode: MediaViewMode
}

export function MediaViewToggle({ onChange, viewMode }: MediaViewToggleProps) {
  const setMode = (mode: MediaViewMode) => {
    window.localStorage.setItem(MEDIA_VIEW_STORAGE_KEY, mode)
    onChange(mode)
  }

  return (
    <div className="media-view-toggle">
      <Button
        aria-label="Grid view"
        buttonStyle="pill"
        className={[
          'media-view-toggle__btn',
          viewMode === 'grid' && 'media-view-toggle__btn--active',
        ]
          .filter(Boolean)
          .join(' ')}
        icon={<GridViewIcon />}
        margin={false}
        onClick={() => setMode('grid')}
      />
      <Button
        aria-label="List view"
        buttonStyle="pill"
        className={[
          'media-view-toggle__btn',
          viewMode === 'list' && 'media-view-toggle__btn--active',
        ]
          .filter(Boolean)
          .join(' ')}
        icon={<ListViewIcon />}
        margin={false}
        onClick={() => setMode('list')}
      />
    </div>
  )
}
