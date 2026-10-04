import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getFamilyMember } from '../lib/members'

export const Route = createFileRoute('/plans/$member')({
  beforeLoad: ({ params }) => {
    const member = getFamilyMember(params.member)
    if (!member) throw redirect({ to: '/', replace: true })
    return { member }
  },
  head: ({ params }) => {
    const member = getFamilyMember(params.member)
    return { meta: [{ title: member ? `${member.name}’s plan | GymTibTracker` : 'Choose your plan | GymTibTracker' }] }
  },
  component: MemberLayout,
})

function MemberLayout() {
  const { member } = Route.useRouteContext()
  // A profile change must not carry unsaved forms into another person's log.
  return <Outlet key={member.id} />
}
