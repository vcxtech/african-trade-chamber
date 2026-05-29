'use client'

import {
  SelectRow,
  Thumbnail,
  useConfig,
  useListDrawerContext,
  useListQuery,
  useSelection,
} from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import type { ClientUser, CollectionSlug, Data } from 'payload'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

type MediaDoc = Data & {
  alt?: string
  filename?: string
  mimeType?: string
  thumbnailURL?: string
  url?: string
}

type MediaGridTableProps = {
  collectionSlug: CollectionSlug
}

function getThumbnailSrc(doc: MediaDoc): string | undefined {
  return doc.thumbnailURL || doc.url
}

function getCaption(doc: MediaDoc): string {
  if (doc.filename) {
    return doc.filename
  }

  if (doc.alt) {
    return doc.alt.length > 48 ? `${doc.alt.slice(0, 45)}…` : doc.alt
  }

  return 'Untitled'
}

export function MediaGridTable({ collectionSlug }: MediaGridTableProps) {
  const { data } = useListQuery()
  const {
    config: {
      routes: { admin: adminRoute },
    },
    getEntityConfig,
  } = useConfig()
  const router = useRouter()
  const { drawerSlug, isInDrawer, onSelect } = useListDrawerContext()
  const { selected } = useSelection()

  const collectionConfig = getEntityConfig({ collectionSlug })
  const docs = (data?.docs ?? []) as MediaDoc[]

  const handleCardClick = (doc: MediaDoc) => {
    if (isInDrawer && drawerSlug && typeof onSelect === 'function') {
      onSelect({
        collectionSlug,
        doc,
        docID: String(doc.id),
      })
      return
    }

    router.push(
      formatAdminURL({
        adminRoute,
        path: `/collections/${collectionSlug}/${doc.id}`,
      }),
    )
  }

  return (
    <div className="media-grid">
      {docs.map((doc) => {
        const thumbnailSrc = getThumbnailSrc(doc)
        const isSelected = Boolean(selected.get(doc.id))

        return (
          <article
            className={[
              'media-grid__card',
              isSelected && 'media-grid__card--selected',
            ]
              .filter(Boolean)
              .join(' ')}
            key={String(doc.id)}
          >
            <div
              className="media-grid__checkbox"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              <SelectRow
                rowData={
                  doc as {
                    _isLocked: boolean
                    _userEditing: ClientUser
                    id: string
                  }
                }
              />
            </div>

            <button
              className="media-grid__thumb"
              onClick={() => handleCardClick(doc)}
              type="button"
            >
              {thumbnailSrc ? (
                <Thumbnail fileSrc={thumbnailSrc} size="expand" />
              ) : (
                <Thumbnail
                  collectionSlug={collectionSlug}
                  doc={doc}
                  size="expand"
                  uploadConfig={collectionConfig?.upload}
                />
              )}
            </button>

            <div className="media-grid__caption" title={getCaption(doc)}>
              {getCaption(doc)}
            </div>
          </article>
        )
      })}
    </div>
  )
}
