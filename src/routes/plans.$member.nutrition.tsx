import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Flame,
  Target,
  UtensilsCrossed,
  Scale,
  Trash2,
  Youtube,
  Moon,
  Clock,
  ChefHat,
  ShoppingBasket,
} from 'lucide-react'
import { MemberSetupNotice } from '../components/MemberSetupNotice'
import {
  getRecipes,
  createRecipe,
  deleteRecipe,
} from '../server/recipes.functions'

export const Route = createFileRoute('/plans/$member/nutrition')({
  loader: async ({ context }) => ({
    recipes: await getRecipes({ data: { memberId: context.member.id } }),
  }),
  component: NutritionPage,
})

type Macros = {
  calories: number
  protein: number
  carbs: number
  fats: number
}

type MealPlanEntry = {
  slot: string
  title: string
  time: string
  ingredients: string[]
  steps: string[]
  macros: Macros
  youtubeQuery: string
}

const youtubeSearchUrl = (query: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`

const TVAROH_SHAKE = {
  title: 'Tvaroh Protein Shake',
  time: '10:00 PM',
  note: 'Slow-digesting tvaroh (quark) casein feeds your muscles through the night. Non-negotiable on both plans.',
  ingredients: [
    '250g low-fat tvaroh (quark)',
    '1 scoop (30g) whey protein',
    '200ml cold water or milk',
    'Pinch of cinnamon',
    'Ice cubes (optional)',
  ],
  steps: [
    'Add tvaroh, whey and liquid to a blender.',
    'Blend 20–30 seconds until completely smooth.',
    'Dust with cinnamon and sip slowly before bed.',
  ],
  macros: { calories: 320, protein: 55, carbs: 15, fats: 3 },
  youtubeQuery: 'tvaroh quark protein shake recipe',
} as const

const FOUR_MEAL_PLAN: MealPlanEntry[] = [
  {
    slot: 'Meal 1',
    title: 'Pre-Gym Ignition',
    time: '5:30 AM',
    ingredients: [
      '1 ripe banana',
      '1 scoop (30g) whey protein',
      '300ml cold water',
      '1 black coffee',
    ],
    steps: [
      'Shake the whey with cold water and ice.',
      'Eat the banana on the way to the gym.',
      'Drink the coffee black, 20–30 min before lifting.',
    ],
    macros: { calories: 250, protein: 27, carbs: 30, fats: 2 },
    youtubeQuery: 'pre workout breakfast banana whey shake',
  },
  {
    slot: 'Meal 2',
    title: 'Post-Gym Rebuild',
    time: '8:00 AM',
    ingredients: [
      '4 whole eggs + 100ml egg whites',
      '2 slices whole grain toast',
      'Handful of spinach',
      '1 tsp butter',
      'Salt & pepper',
    ],
    steps: [
      'Melt butter in a pan over medium heat.',
      'Scramble eggs, whites and spinach until just set.',
      'Toast the bread and plate everything hot.',
    ],
    macros: { calories: 550, protein: 40, carbs: 30, fats: 28 },
    youtubeQuery: 'high protein scrambled eggs breakfast recipe',
  },
  {
    slot: 'Meal 3',
    title: 'Lunch Power Bowl',
    time: '12:30 PM',
    ingredients: [
      '250g chicken breast',
      '200g white rice (cooked)',
      'Big mixed salad',
      '1 tbsp olive oil',
      'Lemon, salt & pepper',
    ],
    steps: [
      'Cook the rice and keep it warm.',
      'Season the chicken and grill 5–6 min per side.',
      'Slice over rice and salad, dress with olive oil and lemon.',
    ],
    macros: { calories: 700, protein: 60, carbs: 70, fats: 18 },
    youtubeQuery: 'grilled chicken rice bowl meal prep',
  },
  {
    slot: 'Meal 4',
    title: 'Dinner Recovery',
    time: '6:30 PM',
    ingredients: [
      '200g salmon fillet (or lean beef steak)',
      '250g sweet potato',
      'Broccoli & green beans',
      '1 tsp olive oil',
      'Lemon wedge',
    ],
    steps: [
      'Bake the sweet potato at 200°C for ~25 min.',
      'Sear the salmon skin-side down until crispy.',
      'Steam the greens and finish everything with lemon.',
    ],
    macros: { calories: 600, protein: 46, carbs: 45, fats: 24 },
    youtubeQuery: 'baked salmon sweet potato dinner recipe',
  },
]

const THREE_MEAL_PLAN: MealPlanEntry[] = [
  {
    slot: 'Meal 1',
    title: 'Big Breakfast',
    time: '8:00 AM',
    ingredients: [
      '5 whole eggs + 100ml egg whites',
      '3 slices whole grain toast',
      'Handful of spinach',
      '1 banana',
      '1 tsp butter, black coffee',
    ],
    steps: [
      'Scramble eggs, whites and spinach in butter.',
      'Toast the bread and pile the plate.',
      'Finish with the banana and black coffee.',
    ],
    macros: { calories: 680, protein: 46, carbs: 58, fats: 28 },
    youtubeQuery: 'big high protein breakfast eggs toast',
  },
  {
    slot: 'Meal 2',
    title: 'Lunch Power Bowl',
    time: '1:00 PM',
    ingredients: [
      '300g chicken breast',
      '280g white rice (cooked)',
      'Big mixed salad',
      '1 tbsp olive oil',
      'Lemon, salt & pepper',
    ],
    steps: [
      'Cook the rice and keep it warm.',
      'Season the chicken and grill until golden.',
      'Slice over rice and salad, dress with olive oil and lemon.',
    ],
    macros: { calories: 820, protein: 70, carbs: 80, fats: 20 },
    youtubeQuery: 'grilled chicken rice bowl meal prep',
  },
  {
    slot: 'Meal 3',
    title: 'Dinner Recovery',
    time: '7:00 PM',
    ingredients: [
      '220g salmon fillet (or lean beef steak)',
      '280g sweet potato',
      'Broccoli & green beans',
      '1 tsp olive oil',
      'Lemon wedge',
    ],
    steps: [
      'Bake the sweet potato at 200°C for ~25 min.',
      'Sear the salmon skin-side down until crispy.',
      'Steam the greens and finish everything with lemon.',
    ],
    macros: { calories: 650, protein: 50, carbs: 50, fats: 25 },
    youtubeQuery: 'baked salmon sweet potato dinner recipe',
  },
]

const MEAL_PLANS: Record<3 | 4, MealPlanEntry[]> = {
  3: THREE_MEAL_PLAN,
  4: FOUR_MEAL_PLAN,
}

const PLAN_NOTES: Record<3 | 4, string> = {
  3: 'Three bigger meals + the bedtime shake. Fewer sitting downs, same fuel.',
  4: 'Four meals + the bedtime shake. Steady fuel for heavy training days.',
}

const sumMacros = (macrosList: Macros[]): Macros =>
  macrosList.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fats: acc.fats + m.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  )

function YouTubeLink({
  query,
  label = 'Watch recipe on YouTube',
}: {
  query: string
  label?: string
}) {
  return (
    <a
      href={youtubeSearchUrl(query)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
    >
      <Youtube className="w-4 h-4" />
      {label}
    </a>
  )
}

function MacroStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <span
      className={`inline-flex items-baseline gap-1 rounded-lg px-2 py-1 text-xs font-bold ${
        accent ? 'bg-volt-400/10 text-volt-400' : 'bg-white/[0.06] text-bone-300'
      }`}
    >
      {value}
      <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{label}</span>
    </span>
  )
}

function MealCard({ meal }: { meal: MealPlanEntry }) {
  return (
    <article className="panel p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="rounded-lg bg-volt-400 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-950">
          {meal.slot}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-bone-500">
          <Clock className="w-3.5 h-3.5" />
          {meal.time}
        </span>
        <div className="ml-auto flex flex-wrap gap-1.5">
          <MacroStat value={`${meal.macros.calories}`} label="kcal" accent />
          <MacroStat value={`${meal.macros.protein}g`} label="P" />
          <MacroStat value={`${meal.macros.carbs}g`} label="C" />
          <MacroStat value={`${meal.macros.fats}g`} label="F" />
        </div>
      </div>

      <h3 className="section-title text-lg mb-4">{meal.title}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="tile">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-bone-500 mb-2">
            <ShoppingBasket className="w-3.5 h-3.5 text-volt-400" />
            Ingredients
          </p>
          <ul className="space-y-1">
            {meal.ingredients.map((ingredient) => (
              <li key={ingredient} className="flex gap-2 text-sm text-bone-300">
                <span className="text-volt-400">•</span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
        <div className="tile">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-bone-500 mb-2">
            <ChefHat className="w-3.5 h-3.5 text-volt-400" />
            Prep
          </p>
          <ol className="space-y-1">
            {meal.steps.map((step, index) => (
              <li key={step} className="flex gap-2 text-sm text-bone-300">
                <span className="font-bold text-volt-400">{index + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <YouTubeLink query={meal.youtubeQuery} />
    </article>
  )
}

function NutritionPage() {
  const { recipes } = Route.useLoaderData()
  const { member } = Route.useRouteContext()
  const router = useRouter()

  const [mealCount, setMealCount] = useState<3 | 4>(4)

  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fats, setFats] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await createRecipe({
        data: {
          memberId: member.id,
          name,
          ingredients,
          instructions,
          calories: calories ? Number(calories) : null,
          protein: protein ? Number(protein) : null,
          carbs: carbs ? Number(carbs) : null,
          fats: fats ? Number(fats) : null,
        },
      })
      setName('')
      setIngredients('')
      setInstructions('')
      setCalories('')
      setProtein('')
      setCarbs('')
      setFats('')
      await router.invalidate()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    await deleteRecipe({ data: { id, memberId: member.id } })
    await router.invalidate()
  }

  const macroTargets = [
    { label: 'Calories', value: '~2,400 kcal/day', note: 'slight deficit to reveal abs while keeping strength', icon: Flame },
    { label: 'Protein', value: '220g', note: '2.2g/kg — non-negotiable', icon: Target },
    { label: 'Fats', value: '75g', note: '', icon: UtensilsCrossed },
    { label: 'Carbs', value: '200g', note: 'fuel your heavy lifts', icon: Scale },
  ]

  const activeMeals = MEAL_PLANS[mealCount]
  const totals = sumMacros([...activeMeals.map((meal) => meal.macros), TVAROH_SHAKE.macros])

  return (
    <div className="page-shell">
      <div className="pt-6 sm:pt-10 pb-10">
        <p className="kicker mb-3">{member.name}’s nutrition</p>
        <h1 className="display-title text-4xl sm:text-5xl">Nutrition recipes</h1>
        <p className="mt-3 max-w-xl text-bone-300">
          Keep the meals and recipes that fuel your training.
        </p>
        <MemberSetupNotice member={member} />
      </div>

      <div className="panel p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
          <div className="flex items-center gap-3 flex-1">
            <span className="bg-volt-400/10 border border-volt-400/30 text-volt-400 p-2.5 rounded-xl">
              <Flame className="w-5 h-5" />
            </span>
            <div>
              <h2 className="section-title">Six-Pack Nutrition Plan</h2>
              <p className="text-sm text-bone-500">
                {member.id === 'tibor' ? 'Current stats' : 'Template stats (Tibor)'}: 99kg | Goal: muscular with visible abs
              </p>
            </div>
          </div>

          <div
            className="inline-flex self-start sm:self-center rounded-xl border border-white/10 bg-black/30 p-1"
            role="group"
            aria-label="Meals per day"
          >
            {([3, 4] as const).map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setMealCount(count)}
                aria-pressed={mealCount === count}
                className={`rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wider transition ${
                  mealCount === count
                    ? 'bg-volt-400 text-ink-950'
                    : 'text-bone-500 hover:text-white'
                }`}
              >
                {count} meals
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-bone-300 mb-5">
          This is where your six-pack happens. Not in the gym. A slow recomp cut to
          reveal abs while keeping strength. {PLAN_NOTES[mealCount]}
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

        <h3 className="section-title text-base mb-3">
          Sample Eating Day — {mealCount} meals + bedtime shake
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activeMeals.map((meal) => (
            <MealCard key={meal.slot} meal={meal} />
          ))}

          <article className="panel p-5 sm:p-6 border-volt-400/25">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-volt-400 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-950">
                <Moon className="w-3 h-3" />
                Bedtime
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-bone-500">
                <Clock className="w-3.5 h-3.5" />
                {TVAROH_SHAKE.time}
              </span>
              <div className="ml-auto flex flex-wrap gap-1.5">
                <MacroStat value={`${TVAROH_SHAKE.macros.calories}`} label="kcal" accent />
                <MacroStat value={`${TVAROH_SHAKE.macros.protein}g`} label="P" />
                <MacroStat value={`${TVAROH_SHAKE.macros.carbs}g`} label="C" />
                <MacroStat value={`${TVAROH_SHAKE.macros.fats}g`} label="F" />
              </div>
            </div>

            <h3 className="section-title text-lg mb-2">{TVAROH_SHAKE.title}</h3>
            <p className="text-sm text-bone-500 mb-4">{TVAROH_SHAKE.note}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="tile">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-bone-500 mb-2">
                  <ShoppingBasket className="w-3.5 h-3.5 text-volt-400" />
                  Ingredients
                </p>
                <ul className="space-y-1">
                  {TVAROH_SHAKE.ingredients.map((ingredient) => (
                    <li key={ingredient} className="flex gap-2 text-sm text-bone-300">
                      <span className="text-volt-400">•</span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="tile">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-bone-500 mb-2">
                  <ChefHat className="w-3.5 h-3.5 text-volt-400" />
                  Prep
                </p>
                <ol className="space-y-1">
                  {TVAROH_SHAKE.steps.map((step, index) => (
                    <li key={step} className="flex gap-2 text-sm text-bone-300">
                      <span className="font-bold text-volt-400">{index + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <YouTubeLink query={TVAROH_SHAKE.youtubeQuery} />
          </article>
        </div>

        <div className="mt-5 pt-5 border-t border-white/[0.06] flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="font-bold uppercase tracking-wider text-bone-100">Daily Total:</span>
          <span className="text-bone-300">
            ~{totals.calories.toLocaleString()} cal | {totals.protein}P / {totals.carbs}C / {totals.fats}F
          </span>
          <span className="ml-auto text-volt-400 font-bold uppercase tracking-wider text-xs">
            {totals.protein >= 220 ? 'Protein locked in' : 'Add protein'}
          </span>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
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
            <div>
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
            <div>
              <label className="field-label" htmlFor="recipe-carbs">Carbs (g)</label>
              <input
                id="recipe-carbs"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                type="number"
                min={0}
                placeholder="60"
                className="field"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="recipe-fats">Fats (g)</label>
              <input
                id="recipe-fats"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
                type="number"
                min={0}
                placeholder="15"
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
          {recipes.map((recipe) => {
            const hasMacros =
              recipe.calories != null ||
              recipe.protein != null ||
              recipe.carbs != null ||
              recipe.fats != null
            return (
              <div key={recipe.id} className="panel p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="bg-volt-400/10 border border-volt-400/30 text-volt-400 p-2.5 rounded-xl shrink-0">
                      <UtensilsCrossed className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-bone-100">{recipe.name}</h3>
                      {hasMacros && (
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {recipe.calories != null && (
                            <MacroStat value={`${recipe.calories}`} label="kcal" accent />
                          )}
                          {recipe.protein != null && (
                            <MacroStat value={`${recipe.protein}g`} label="P" />
                          )}
                          {recipe.carbs != null && (
                            <MacroStat value={`${recipe.carbs}g`} label="C" />
                          )}
                          {recipe.fats != null && (
                            <MacroStat value={`${recipe.fats}g`} label="F" />
                          )}
                        </div>
                      )}
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
                <div className="mt-4">
                  <YouTubeLink query={`${recipe.name} recipe`} label="Find video on YouTube" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
