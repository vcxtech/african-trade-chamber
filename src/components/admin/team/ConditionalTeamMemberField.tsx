'use client'

import type { ComponentType } from 'react'
import { fieldComponents } from '@payloadcms/ui'
import type { ClientFieldProps } from 'payload'

import { useTeamMemberIsFellow } from './useTeamMemberIsFellow'

type ShowWhen = 'fellow' | 'non-fellow'

function readShowWhen(field: ClientFieldProps['field']): ShowWhen | undefined {
  if (!field) return undefined
  const custom = field.admin?.custom
  if (custom && typeof custom === 'object' && 'showWhen' in custom) {
    const value = (custom as { showWhen?: unknown }).showWhen
    if (value === 'fellow' || value === 'non-fellow') return value
  }
  return undefined
}

function renderDefaultField(props: ClientFieldProps) {
  if (!props.field) return null
  const DefaultField = fieldComponents[
    props.field.type as keyof typeof fieldComponents
  ] as ComponentType<ClientFieldProps> | undefined
  if (!DefaultField) return null
  return <DefaultField {...props} />
}

export function ConditionalTeamMemberField(props: ClientFieldProps) {
  const showWhen = readShowWhen(props.field)
  const { isFellow, loading, hasCategory } = useTeamMemberIsFellow()

  if (!showWhen) {
    return renderDefaultField(props)
  }

  if (loading) return null

  if (showWhen === 'fellow') {
    if (!hasCategory || !isFellow) return null
  } else if (showWhen === 'non-fellow') {
    if (!hasCategory || isFellow) return null
  }

  return renderDefaultField(props)
}
