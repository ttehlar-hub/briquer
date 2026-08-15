import { createFileRoute, Link } from '@tanstack/react-router'
import { Dumbbell, ClipboardList, UtensilsCrossed } from 'lucide-react'
import { getWorkouts } from '../server/workouts.functions'
import { getRoutines } from '../server/routines.functions'
import { getRecipes } from '../server/recipes.functions'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [workouts, routines, recipes] = await Promise.all([
      getWorkouts(),
      getRoutines(),
      getRecipes(),
    ])
    return { workouts, routines, recipes }
  },
  component: Home,
})

function Home() {
  const { workouts, routines, recipes } = Route.useLoaderData()

  const cards = [
    {
      to: '/workouts' as const,
      title: 'Workout Sessions',
      icon: Dumbbell,
      color: 'bg-emerald-500',
      count: workouts.length,
      description: 'Log the sets, reps and weight from every session.',
    },
    {
      to: '/routines' as const,
      title: 'Routines',
      icon: ClipboardList,
      color: 'bg-blue-500',
      count: routines.length,
      description: 'Plan reusable exercise routines to follow.',
    },
    {
      to: '/nutrition' as const,
      title: 'Nutrition Recipes',
      icon: UtensilsCrossed,
      color: 'bg-amber-500',
      count: recipes.length,
      description: 'Keep the recipes that fuel your training.',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back to your gym log
      </h1>
      <p className="text-gray-500 mb-8">
        Everything about your training — sessions, routines and nutrition — in
        one place.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className={`${card.color} p-3 rounded-lg inline-flex mb-4`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.count}</p>
            <h2 className="text-lg font-semibold text-gray-900 mt-1">
              {card.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
