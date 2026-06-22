'use client'

import type { ComponentType } from 'react'
import { CollapsibleField } from '@payloadcms/ui'
import type { ClientFieldProps } from 'payload'

import { useTeamMemberIsFellow } from './useTeamMemberIsFellow'

export function FellowshipDetailsCollapsible(props: ClientFieldProps) {
  const { isFellow, loading, hasCategory } = useTeamMemberIsFellow()

  if (loading || !hasCategory || !isFellow) return null

  const Field = CollapsibleField as ComponentType<ClientFieldProps>
  return <Field {...props} />
}
