import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { recipes } from '../../db/schema.js'

export const getRecipes = createServerFn().handler(async () => {
  return db.select().from(recipes).orderBy(desc(recipes.createdAt))
})

export const createRecipe = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      ingredients: z.string().default(''),
      instructions: z.string().default(''),
      calories: z.number().int().nullable(),
      protein: z.number().int().nullable(),
    }),
  )
  .handler(async ({ data }) => {
    const [recipe] = await db.insert(recipes).values(data).returning()
    return recipe
  })

export const deleteRecipe = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    await db.delete(recipes).where(eq(recipes.id, data.id))
    return { success: true }
  })
