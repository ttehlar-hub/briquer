import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/nutrition')({
  beforeLoad: () => {
    throw redirect({
      to: '/plans/$member/nutrition',
      params: { member: 'tibor' },
      replace: true,
    })
  },
})
