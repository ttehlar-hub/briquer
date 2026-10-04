import { expect, test, type Page } from '@playwright/test'
import { NetlifyDB } from '@netlify/database-dev'

const modules = {
  routines: '/src/server/routines.functions.ts',
  recipes: '/src/server/recipes.functions.ts',
  workouts: '/src/server/workouts.functions.ts',
} as const

type ApiResult<T> = { ok: true; result: T } | { ok: false; error: string }
type SavedEntry = { id: number; memberId: string; name: string; exercises?: { name: string }[] }
type SavedWorkout = { id: number; notes: string; status: string; loggedAt: string | null; exercises: { name: string }[] }

// Invoke the actual browser RPCs so validation, serialization and database filters
// are exercised together, not mocked out by a unit-test implementation.
async function invoke<T>(page: Page, module: keyof typeof modules, name: string, data: Record<string, unknown>) {
  return page.evaluate(async ({ path, name, data }) => {
    const api = await import(path)
    try {
      return { ok: true, result: await api[name]({ data }) }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) }
    }
  }, { path: modules[module], name, data }) as Promise<ApiResult<T>>
}

async function call<T>(page: Page, module: keyof typeof modules, name: string, data: Record<string, unknown>) {
  const result = await invoke<T>(page, module, name, data)
  if (!result.ok) throw new Error(result.error)
  return result.result
}

async function visit(page: Page, path: string) {
  await page.goto(path)
  // SSR content is visible before its event handlers are attached.
  await expect(page.locator('body')).toHaveAttribute('data-hydrated', 'true')
}

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
}

test('entry page asks for a profile and previews the three essentials', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await visit(page, '/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Stronger,together.')
  await expect(page.getByRole('heading', { name: 'Who’s training today?' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Open Tibor’s plan' })).toHaveAttribute('href', '/plans/tibor')
  await expect(page.getByRole('link', { name: 'Open Janka’s plan' })).toHaveAttribute('href', '/plans/janka')
  for (const section of ['Workouts', 'Routines', 'Nutrition']) {
    await expect(page.getByRole('heading', { name: section, exact: true })).toBeVisible()
  }
  await page.getByRole('link', { name: 'Open Tibor’s plan' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your plan, Tibor.')
  expect(errors).toEqual([])
})

for (const member of [{ id: 'tibor', name: 'Tibor' }, { id: 'janka', name: 'Janka' }]) {
  test(`${member.name} gets the same three sections with profile-specific links`, async ({ page }) => {
    await visit(page, '/')
    await page.getByRole('link', { name: `Open ${member.name}’s plan` }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`Your plan, ${member.name}.`)
    const sections = page.getByRole('navigation', { name: `${member.name}’s three plan sections` })
    await expect(sections.getByRole('link')).toHaveCount(3)
    for (const section of ['Workouts', 'Routines', 'Nutrition']) {
      await expect(sections.getByRole('link', { name: new RegExp(section) }))
        .toHaveAttribute('href', `/plans/${member.id}/${section.toLowerCase()}`)
    }
    await sections.getByRole('link', { name: /Routines/ }).click()
    await expect(page).toHaveURL(`/plans/${member.id}/routines`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Routines')
    await page.getByRole('link', { name: `Switch profile, currently ${member.name}` }).click()
    await expect(page.getByRole('heading', { name: 'Who’s training today?' })).toBeVisible()
  })
}

test('unknown profiles return to the chooser instead of loading another person’s plan', async ({ page }) => {
  for (const suffix of ['', '/workouts', '/routines', '/nutrition']) {
    await visit(page, `/plans/unknown${suffix}`)
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: 'Who’s training today?' })).toBeVisible()
  }
})

test('existing section bookmarks still open Tibor’s plan', async ({ page }) => {
  for (const path of ['/workouts', '/routines', '/nutrition', '/workouts/olympic-lifting']) {
    await visit(page, path)
    await expect(page).toHaveURL(`/plans/tibor${path}`)
    await expect(page.getByRole('link', { name: 'Switch profile, currently Tibor' })).toBeVisible()
  }
})

test('Janka’s Olympic lifting link and back link keep her profile', async ({ page }) => {
  await visit(page, '/plans/janka/workouts')
  await expect(page.getByText('Janka’s starter setup', { exact: false })).toBeVisible()
  await page.getByText('Day 6 · Olympic Lifting — Full Body', { exact: true }).click()
  await page.getByRole('link', { name: 'Open Day 6 session' }).click()
  await expect(page).toHaveURL('/plans/janka/workouts/olympic-lifting')
  await page.getByRole('link', { name: 'Back to workouts' }).click()
  await expect(page).toHaveURL('/plans/janka/workouts')
})

test('mobile chooser, overview and menu stay usable without horizontal scrolling', async ({ page }) => {
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 812 })
    await visit(page, '/')
    await expect(page.getByRole('link', { name: 'Open Janka’s plan' })).toBeVisible()
    await expectNoOverflow(page)
    await page.getByRole('link', { name: 'Open Janka’s plan' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your plan, Janka.')
    await expectNoOverflow(page)
  }
  const menu = page.getByRole('button', { name: 'Open menu' })
  await menu.click()
  await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Nutrition' }).click()
  await expect(page).toHaveURL('/plans/janka/nutrition')
  await expect(page.getByText('Janka’s starter setup', { exact: false })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
  await expectNoOverflow(page)
})

test('switching profiles clears unsaved routine form state', async ({ page }) => {
  await visit(page, '/plans/tibor/routines')
  await page.getByLabel('Name', { exact: true }).fill('Unsaved Tibor routine')
  await page.getByRole('link', { name: 'Switch profile, currently Tibor' }).click()
  await page.getByRole('link', { name: 'Open Janka’s plan' }).click()
  await page.getByRole('navigation', { name: 'Janka’s three plan sections' }).getByRole('link', { name: /Routines/ }).click()
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('')
})

test('all saved entries and mutations are scoped to the selected profile', async ({ page }) => {
  await visit(page, '/')
  const prefix = `family-test-${Date.now()}`
  const cleanup: { module: keyof typeof modules; fn: string; id: number; memberId: string }[] = []
  const saved: Record<string, { routine: SavedEntry; recipe: SavedEntry; workout: SavedWorkout }> = {}
  try {
    for (const memberId of ['tibor', 'janka']) {
      const routine = await call<SavedEntry>(page, 'routines', 'createRoutine', {
        memberId, name: `${prefix}-${memberId}-routine`,
        exercises: [{ name: `${prefix}-${memberId}-exercise`, sets: 3, reps: 10 }],
      })
      cleanup.push({ module: 'routines', fn: 'deleteRoutine', id: routine.id, memberId })
      const recipe = await call<SavedEntry>(page, 'recipes', 'createRecipe', {
        memberId, name: `${prefix}-${memberId}-recipe`, calories: 400, protein: 30, carbs: 40, fats: 10,
      })
      cleanup.push({ module: 'recipes', fn: 'deleteRecipe', id: recipe.id, memberId })
      const workout = await call<SavedWorkout>(page, 'workouts', 'createWorkout', {
        memberId, routineId: routine.id, date: '2026-10-04', notes: `${prefix}-${memberId}`,
        status: 'draft', exercises: [{ name: `${prefix}-${memberId}-exercise`, sets: 3, reps: 10, weight: 20 }],
      })
      cleanup.push({ module: 'workouts', fn: 'deleteWorkout', id: workout.id, memberId })
      expect(routine.memberId).toBe(memberId)
      expect(recipe.memberId).toBe(memberId)
      saved[memberId] = { routine, recipe, workout }
    }

    for (const memberId of ['tibor', 'janka']) {
      const routines = await call<SavedEntry[]>(page, 'routines', 'getRoutines', { memberId })
      const recipes = await call<SavedEntry[]>(page, 'recipes', 'getRecipes', { memberId })
      const workouts = await call<SavedWorkout[]>(page, 'workouts', 'getWorkouts', { memberId })
      expect(routines.filter((entry) => entry.name.startsWith(prefix)).map((entry) => entry.id)).toEqual([saved[memberId].routine.id])
      expect(recipes.filter((entry) => entry.name.startsWith(prefix)).map((entry) => entry.id)).toEqual([saved[memberId].recipe.id])
      expect(workouts.filter((entry) => entry.notes.startsWith(prefix)).map((entry) => entry.id)).toEqual([saved[memberId].workout.id])
      expect(routines.find((entry) => entry.id === saved[memberId].routine.id)?.exercises?.[0].name).toBe(`${prefix}-${memberId}-exercise`)
      expect(workouts.find((entry) => entry.id === saved[memberId].workout.id)?.exercises[0].name).toBe(`${prefix}-${memberId}-exercise`)

      const other = saved[memberId === 'tibor' ? 'janka' : 'tibor']
      for (const [module, fn, id] of [
        ['routines', 'deleteRoutine', other.routine.id],
        ['recipes', 'deleteRecipe', other.recipe.id],
        ['workouts', 'confirmWorkout', other.workout.id],
        ['workouts', 'deleteWorkout', other.workout.id],
      ] as const) {
        const result = await invoke(page, module, fn, { memberId, id })
        expect(result.ok).toBe(false)
        if (!result.ok) expect(result.error).toContain('not found for this profile')
      }
      expect((await invoke(page, 'workouts', 'createWorkout', {
        memberId, routineId: other.routine.id, date: '2026-10-04', exercises: [],
      })).ok).toBe(false)
    }

    const confirmed = await call<SavedWorkout>(page, 'workouts', 'confirmWorkout', {
      memberId: 'janka', id: saved.janka.workout.id,
    })
    expect(confirmed.status).toBe('logged')
    expect(confirmed.loggedAt).not.toBeNull()
    const tiborWorkouts = await call<SavedWorkout[]>(page, 'workouts', 'getWorkouts', { memberId: 'tibor' })
    expect(tiborWorkouts.find((entry) => entry.id === saved.tibor.workout.id)?.status).toBe('draft')

    for (const module of ['routines', 'recipes', 'workouts'] as const) {
      const fn = { routines: 'getRoutines', recipes: 'getRecipes', workouts: 'getWorkouts' }[module]
      expect((await invoke(page, module, fn, { memberId: 'unknown' })).ok).toBe(false)
      expect((await invoke(page, module, fn, {})).ok).toBe(false)
    }
  } finally {
    for (const entry of cleanup.reverse()) {
      await call(page, entry.module, entry.fn, { id: entry.id, memberId: entry.memberId })
    }
  }
})

test('Janka can save a routine through the UI without it appearing in Tibor’s list', async ({ page }) => {
  const name = `Janka UI test ${Date.now()}`
  await visit(page, '/plans/janka/routines')
  try {
    await page.getByLabel('Name', { exact: true }).fill(name)
    await page.getByLabel('Exercise 1 name').fill('Goblet squat')
    await page.getByRole('button', { name: 'Save routine' }).click()
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
    await page.getByRole('link', { name: 'Switch profile, currently Janka' }).click()
    await page.getByRole('link', { name: 'Open Tibor’s plan' }).click()
    await page.getByRole('navigation', { name: 'Tibor’s three plan sections' }).getByRole('link', { name: /Routines/ }).click()
    await expect(page.getByRole('heading', { name, exact: true })).toHaveCount(0)
  } finally {
    const routines = await call<SavedEntry[]>(page, 'routines', 'getRoutines', { memberId: 'janka' })
    for (const routine of routines.filter((entry) => entry.name === name)) {
      await call(page, 'routines', 'deleteRoutine', { id: routine.id, memberId: 'janka' })
    }
  }
})

test('Janka can save a recipe through the UI without it appearing in Tibor’s list', async ({ page }) => {
  const name = `Janka recipe UI test ${Date.now()}`
  await visit(page, '/plans/janka/nutrition')
  try {
    await page.getByLabel('Name', { exact: true }).fill(name)
    await page.getByLabel('Ingredients', { exact: true }).fill('Chicken, rice, vegetables')
    await page.getByLabel('Calories', { exact: true }).fill('420')
    await page.getByLabel('Protein (g)', { exact: true }).fill('32')
    await page.getByRole('button', { name: 'Save recipe' }).click()
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
    await visit(page, '/plans/tibor/nutrition')
    await expect(page.getByRole('heading', { name, exact: true })).toHaveCount(0)
  } finally {
    const recipes = await call<SavedEntry[]>(page, 'recipes', 'getRecipes', { memberId: 'janka' })
    for (const recipe of recipes.filter((entry) => entry.name === name)) {
      await call(page, 'recipes', 'deleteRecipe', { id: recipe.id, memberId: 'janka' })
    }
  }
})

test('Janka can save and confirm a workout draft in her own log', async ({ page }) => {
  const notes = `Janka workout UI test ${Date.now()}`
  await visit(page, '/plans/janka/workouts')
  try {
    await page.getByLabel('Notes', { exact: true }).fill(notes)
    await page.getByLabel('Exercise 1 name').fill('Goblet squat')
    await page.getByRole('button', { name: 'Save as draft (not logged yet)' }).click()
    const session = page.locator('.panel').filter({ has: page.getByText(notes, { exact: true }) })
    await expect(session.getByText('Draft — not logged yet')).toBeVisible()
    await session.getByRole('button', { name: 'Confirm session as logged' }).click()
    await expect(session.getByText('Logged', { exact: true })).toBeVisible()
    await visit(page, '/plans/tibor/workouts')
    await expect(page.getByText(notes, { exact: true })).toHaveCount(0)
  } finally {
    const workouts = await call<SavedWorkout[]>(page, 'workouts', 'getWorkouts', { memberId: 'janka' })
    for (const workout of workouts.filter((entry) => entry.notes === notes)) {
      await call(page, 'workouts', 'deleteWorkout', { id: workout.id, memberId: 'janka' })
    }
  }
})

test('migration preserves legacy records under Tibor and gives Janka an empty log', async () => {
  const db = new NetlifyDB()
  try {
    await db.start()
    await db.applyMigrations('netlify/database/migrations', '20261003161716_add_workout_status')
    await db.exec(`
      INSERT INTO routines (name) VALUES ('Existing routine');
      INSERT INTO workouts (notes) VALUES ('Existing session');
      INSERT INTO recipes (name) VALUES ('Existing recipe');
    `)
    await db.applyMigrations('netlify/database/migrations')
    for (const table of ['routines', 'workouts', 'recipes']) {
      const result = await db.query<{ member_id: string }>(`SELECT member_id FROM ${table}`)
      expect(result.rows).toEqual([{ member_id: 'tibor' }])
      const janka = await db.query(`SELECT id FROM ${table} WHERE member_id = 'janka'`)
      expect(janka.rows).toEqual([])
    }
    expect(await db.applyMigrations('netlify/database/migrations')).toEqual([])
  } finally {
    await db.stop()
  }
})
