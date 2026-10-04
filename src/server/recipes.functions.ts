import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { recipes } from '../../db/schema.js'
import { memberInputSchema } from './member-input'

export const getRecipes = createServerFn()
  .inputValidator(memberInputSchema)
  .handler(async ({ data }) => {
    return db
      .select()
      .from(recipes)
      .where(eq(recipes.memberId, data.memberId))
      .orderBy(desc(recipes.createdAt))
  })

export const createRecipe = createServerFn({ method: 'POST' })
  .inputValidator(
    memberInputSchema.extend({
      name: z.string().min(1),
      ingredients: z.string().default(''),
      instructions: z.string().default(''),
      calories: z.number().int().nullable(),
      protein: z.number().int().nullable(),
      carbs: z.number().int().nullable(),
      fats: z.number().int().nullable(),
    }),
  )
  .handler(async ({ data }) => {
    const [recipe] = await db.insert(recipes).values(data).returning()
    return recipe
  })

export const deleteRecipe = createServerFn({ method: 'POST' })
  .inputValidator(memberInputSchema.extend({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(recipes)
      .where(and(eq(recipes.id, data.id), eq(recipes.memberId, data.memberId)))
      .returning({ id: recipes.id })
    if (deleted.length === 0) throw new Error('Recipe not found for this profile.')
    return { success: true }
  })
