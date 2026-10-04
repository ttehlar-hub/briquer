import { ClipboardList, Dumbbell, UtensilsCrossed } from 'lucide-react'

export const planSections = [
  {
    to: '/plans/$member/workouts',
    title: 'Workouts',
    icon: Dumbbell,
    number: '01',
    description: 'Show up. Move. Track your progress.',
    action: 'Start training',
  },
  {
    to: '/plans/$member/routines',
    title: 'Routines',
    icon: ClipboardList,
    number: '02',
    description: 'A little structure for stronger days.',
    action: 'Find your rhythm',
  },
  {
    to: '/plans/$member/nutrition',
    title: 'Nutrition',
    icon: UtensilsCrossed,
    number: '03',
    description: 'Simple meals to fuel your everyday.',
    action: 'Fuel your day',
  },
] as const
