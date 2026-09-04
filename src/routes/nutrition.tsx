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
    <div className="page-shell">
      <div className="pt-6 sm:pt-10 pb-10">
        <p className="kicker mb-3">Fuel the machine</p>
        <h1 className="display-title text-4xl sm:text-5xl">Nutrition recipes</h1>
        <p className="mt-3 max-w-xl text-bone-300">
          Keep the meals and recipes that fuel your training.
        </p>
      </div>

      <div className="panel p-6 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="bg-volt-400/10 border border-volt-400/30 text-volt-400 p-2.5 rounded-xl">
            <Flame className="w-5 h-5" />
          </span>
          <div>
            <h2 className="section-title">Six-Pack Nutrition Plan</h2>
            <p className="text-sm text-bone-500">
              Current stats: 99kg | Goal: muscular with visible abs
            </p>
          </div>
        </div>

        <p className="text-sm text-bone-300 mb-5">
          This is where your six-pack happens. Not in the gym. A slow recomp cut to
          reveal abs while keeping strength.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {macroTargets.map((target) => (
            <div key={target.label} className="tile">
              <div className="flex items-center gap-2 mb-1.5">
                <target.icon className="w-4 h-4 text-volt-400" />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-bone-500">
                  {target.label}
                </span>
              </div>
              <p className="text-lg font-bold text-bone-100">{target.value}</p>
              {target.note && <p className="text-xs text-bone-500 mt-1">{target.note}</p>}
            </div>
          ))}
        </div>

        <div className="space-y-1">
          <h3 className="section-title text-base mb-3">Sample Eating Day</h3>
          {sampleMeals.map((meal) => (
            <div
              key={meal.name}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 border-b border-white/[0.06] last:border-0"
            >
              <div>
                <p className="text-sm font-semibold text-bone-100">{meal.name}</p>
                <p className="text-sm text-bone-500">{meal.items}</p>
              </div>
              <p className="text-sm font-bold text-volt-400 whitespace-nowrap">{meal.macros}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-5 border-t border-white/[0.06] flex flex-wrap items-center gap-2 text-sm">
          <span className="font-bold uppercase tracking-wider text-bone-100">Daily Total:</span>
          <span className="text-bone-300">~2,400 cal | 215P / 195C / 75F</span>
          <span className="ml-auto text-volt-400 font-bold uppercase tracking-wider text-xs">On track</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <form
          onSubmit={handleSubmit}
          className="panel p-6 space-y-5 lg:col-span-1 h-fit"
        >
          <h2 className="section-title">New recipe</h2>
          <div>
            <label className="field-label" htmlFor="recipe-name">Name</label>
            <input
              id="recipe-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="High-protein chicken bowl"
              required
              className="field"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="recipe-ingredients">Ingredients</label>
            <textarea
              id="recipe-ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={3}
              placeholder="200g chicken breast, 150g rice, broccoli..."
              className="field"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="recipe-instructions">Instructions</label>
            <textarea
              id="recipe-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder="Grill the chicken, steam the broccoli..."
              className="field"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="field-label" htmlFor="recipe-calories">Calories</label>
              <input
                id="recipe-calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                type="number"
                min={0}
                placeholder="550"
                className="field"
              />
            </div>
            <div className="flex-1">
              <label className="field-label" htmlFor="recipe-protein">Protein (g)</label>
              <input
                id="recipe-protein"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                type="number"
                min={0}
                placeholder="45"
                className="field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-volt w-full"
          >
            {submitting ? 'Saving...' : 'Save recipe'}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {recipes.length === 0 && (
            <div className="panel p-8 text-center">
              <p className="display-title text-xl text-bone-500">No recipes yet</p>
              <p className="text-sm text-bone-700 mt-2">Add your first recipe with the form on the left.</p>
            </div>
          )}
          {recipes.map((recipe) => (
            <div key={recipe.id} className="panel p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="bg-volt-400/10 border border-volt-400/30 text-volt-400 p-2.5 rounded-xl shrink-0">
                    <UtensilsCrossed className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-bone-100">{recipe.name}</h3>
                    <p className="text-sm text-bone-500">
                      {recipe.calories != null && `${recipe.calories} kcal`}
                      {recipe.calories != null && recipe.protein != null && ' · '}
                      {recipe.protein != null && `${recipe.protein}g protein`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(recipe.id)}
                  className="text-bone-700 hover:text-red-400 transition shrink-0"
                  aria-label="Delete recipe"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {recipe.ingredients && (
                <p className="mt-3 text-sm text-bone-300 whitespace-pre-wrap">
                  <span className="font-semibold text-bone-100">Ingredients: </span>
                  {recipe.ingredients}
                </p>
              )}
              {recipe.instructions && (
                <p className="mt-2 text-sm text-bone-300 whitespace-pre-wrap">
                  <span className="font-semibold text-bone-100">Instructions: </span>
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
