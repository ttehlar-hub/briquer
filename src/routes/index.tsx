import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUpRight, ClipboardList, Dumbbell, UtensilsCrossed } from 'lucide-react'
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
      count: workouts.length,
      description: 'Log the sets, reps and weight from every session.',
    },
    {
      to: '/routines' as const,
      title: 'Routines',
      icon: ClipboardList,
      count: routines.length,
      description: 'Plan reusable exercise routines to follow.',
    },
    {
      to: '/nutrition' as const,
      title: 'Nutrition Recipes',
      icon: UtensilsCrossed,
      count: recipes.length,
      description: 'Keep the recipes that fuel your training.',
    },
  ]

  return (
    <div className="page-shell">
      <section className="pt-6 sm:pt-14 pb-10">
        <p className="kicker mb-3">Your training log</p>
        <h1 className="display-title text-4xl sm:text-6xl">
          Welcome back to<br className="hidden sm:block" /> your gym log
        </h1>
        <p className="mt-4 max-w-xl text-bone-300">
          Everything about your training — sessions, routines and nutrition — in one place.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="panel group p-6 transition duration-200 hover:border-volt-400/40 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <span className="bg-volt-400/10 border border-volt-400/30 text-volt-400 p-3 rounded-xl">
                <card.icon className="w-6 h-6" />
              </span>
              <ArrowUpRight className="w-5 h-5 text-bone-700 transition group-hover:text-volt-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="display-title text-4xl mt-5 text-volt-400">{card.count}</p>
            <h2 className="section-title mt-1.5">{card.title}</h2>
            <p className="text-sm text-bone-500 mt-1.5">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
