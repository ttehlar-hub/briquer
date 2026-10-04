import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/routines')({
  beforeLoad: () => {
    throw redirect({
      to: '/plans/$member/routines',
      params: { member: 'tibor' },
      replace: true,
    })
  },
})
