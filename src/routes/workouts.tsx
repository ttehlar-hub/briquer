import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/workouts')({
  beforeLoad: () => {
    throw redirect({
      to: '/plans/$member/workouts',
      params: { member: 'tibor' },
      replace: true,
    })
  },
})
