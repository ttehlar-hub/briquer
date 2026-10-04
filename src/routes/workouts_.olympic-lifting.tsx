import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/workouts_/olympic-lifting')({
  beforeLoad: () => {
    throw redirect({
      to: '/plans/$member/workouts/olympic-lifting',
      params: { member: 'tibor' },
      replace: true,
    })
  },
})
