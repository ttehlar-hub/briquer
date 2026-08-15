import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Trash2, UtensilsCrossed, Flame, Target, Scale } from 'lucide-react'
import {
  getRecipes,
  createRecipe,
  deleteRecipe,
} from '../server/recipes.functions'

export const Route = createFileRoute('/nutrition')({
  loader: async () => ({ recipes: await getRecipes() }),
  component: NutritionPage,
})

function NutritionPage() {
  const { recipes } = Route.useLoaderData()
  const router = useRouter()

  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await createRecipe({
        data: {
          name,
          ingredients,
          instructions,
          calories: calories ? Number(calories) : null,
          protein: protein ? Number(protein) : null,
        },
      })
      setName('')
      setIngredients('')
      setInstructions('')
      setCalories('')
      setProtein('')
      await router.invalidate()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    await deleteRecipe({ data: { id } })
    await router.invalidate()
  }

  const macroTargets = [
    { label: 'Calories', value: '~2,400 kcal/day', note: 'slight deficit to reveal abs while keeping strength', icon: Flame },
    { label: 'Protein', value: '220g', note: '2.2g/kg — non-negotiable', icon: Target },
    { label: 'Fats', value: '75g', note: '', icon: UtensilsCrossed },
    { label: 'Carbs', value: '200g', note: 'fuel your heavy lifts', icon: Scale },
  ]

  const sampleMeals = [
    {
      name: 'Meal 1 — Pre-Gym (5:30 AM)',
      items: 'Coffee (black), 1 banana + 1 scoop whey in water',
      macros: '~200 cal | 30P / 25C / 2F',
    },
    {
      name: 'Meal 2 — Post-Gym (8:00 AM)',
      items: '5 whole eggs scrambled, 2 slices whole grain toast, handful spinach',
      macros: '~550 cal | 35P / 30C / 30F',
    },
    {
      name: 'Meal 3 — Lunch (12:00 PM)',
      items: '250g grilled chicken breast, 200g cooked white rice, big mixed salad + olive oil',
      macros: '~650 cal | 55P / 65C / 15F',
    },
    {
      name: 'Meal 4 — Afternoon (3:30 PM)',
      items: '250g full-fat Greek yogurt, 40g oats, 1 scoop whey, handful almonds',
      macros: '~500 cal | 50P / 40C / 15F',
    },
    {
      name: 'Meal 5 — Dinner (7:00 PM)',
      items: '200g salmon or beef steak, 200g sweet potato, steamed broccoli + green beans',
      macros: '~500 cal | 45P / 35C / 13F',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Nutrition recipes</h1>
      <p className="text-gray-500 mb-8">
        Keep the meals and recipes that fuel your training.
      </p>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-rose-500 p-2 rounded-lg">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Six-Pack Nutrition Plan</h2>
            <p className="text-sm text-gray-500">
              Current stats: 99kg | Goal: muscular with visible abs
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          This is where your six-pack happens. Not in the gym. A slow recomp cut to
          reveal abs while keeping strength.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {macroTargets.map((target) => (
            <div key={target.label} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <target.icon className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {target.label}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{target.value}</p>
              {target.note && <p className="text-xs text-gray-500 mt-1">{target.note}</p>}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Sample Eating Day</h3>
          {sampleMeals.map((meal) => (
            <div
              key={meal.name}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-2 border-b border-gray-100 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{meal.name}</p>
                <p className="text-sm text-gray-500">{meal.items}</p>
              </div>
              <p className="text-sm font-medium text-rose-600 whitespace-nowrap">{meal.macros}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-700">
          <span className="font-semibold">Daily Total:</span>
          <span>~2,400 cal | 215P / 195C / 75F</span>
          <span className="text-emerald-600 font-medium">✅</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6 space-y-4 lg:col-span-1 h-fit"
        >
          <h2 className="text-lg font-semibold text-gray-900">New recipe</h2>
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="High-protein chicken bowl"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Ingredients</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={3}
              placeholder="200g chicken breast, 150g rice, broccoli..."
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder="Grill the chicken, steam the broccoli..."
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Calories</label>
              <input
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                type="number"
                min={0}
                placeholder="550"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Protein (g)</label>
              <input
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                type="number"
                min={0}
                placeholder="45"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg py-2 text-sm disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save recipe'}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {recipes.length === 0 && (
            <p className="text-gray-500 text-sm">No recipes yet — add your first one.</p>
          )}
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500 p-2 rounded-lg">
                    <UtensilsCrossed className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{recipe.name}</h3>
                    <p className="text-sm text-gray-500">
                      {recipe.calories != null && `${recipe.calories} kcal`}
                      {recipe.calories != null && recipe.protein != null && ' · '}
                      {recipe.protein != null && `${recipe.protein}g protein`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(recipe.id)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label="Delete recipe"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {recipe.ingredients && (
                <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">
                  <span className="font-medium">Ingredients: </span>
                  {recipe.ingredients}
                </p>
              )}
              {recipe.instructions && (
                <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                  <span className="font-medium">Instructions: </span>
                  {recipe.instructions}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
