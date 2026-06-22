const CONDITIONAL_FIELD = '/components/admin/team/ConditionalTeamMemberField#ConditionalTeamMemberField'

export function teamMemberShowWhen(showWhen: 'fellow' | 'non-fellow') {
  return {
    components: {
      Field: CONDITIONAL_FIELD,
    },
    custom: { showWhen },
  }
}

export const FELLOWSHIP_COLLAPSIBLE_FIELD =
  '/components/admin/team/FellowshipDetailsCollapsible#FellowshipDetailsCollapsible'
