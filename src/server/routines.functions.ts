import { createServerFn } from '@tanstack/react-start'
import { and, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { routines, routineExercises } from '../../db/schema.js'
import { memberInputSchema } from './member-input'

const ExerciseInput = z.object({
  name: z.string().min(1),
  sets: z.number().int().min(1),
  reps: z.number().int().min(1),
})

export const getRoutines = createServerFn()
  .inputValidator(memberInputSchema)
  .handler(async ({ data }) => {
    const allRoutines = await db
      .select()
      .from(routines)
      .where(eq(routines.memberId, data.memberId))
      .orderBy(routines.id)
    const allExercises = allRoutines.length > 0
      ? await db
          .select()
          .from(routineExercises)
          .where(inArray(routineExercises.routineId, allRoutines.map((routine) => routine.id)))
          .orderBy(routineExercises.position)
      : []

    return allRoutines.map((routine) => ({
      ...routine,
      exercises: allExercises.filter((exercise) => exercise.routineId === routine.id),
    }))
  })

export const createRoutine = createServerFn({ method: 'POST' })
  .inputValidator(
    memberInputSchema.extend({
      name: z.string().min(1),
      notes: z.string().default(''),
      exercises: z.array(ExerciseInput).default([]),
    }),
  )
  .handler(async ({ data }) => {
    const [routine] = await db
      .insert(routines)
      .values({ memberId: data.memberId, name: data.name, notes: data.notes })
      .returning()

    if (data.exercises.length > 0) {
      await db.insert(routineExercises).values(
        data.exercises.map((exercise, index) => ({
          routineId: routine.id,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          position: index,
        })),
      )
    }

    return routine
  })

export const deleteRoutine = createServerFn({ method: 'POST' })
  .inputValidator(memberInputSchema.extend({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(routines)
      .where(and(eq(routines.id, data.id), eq(routines.memberId, data.memberId)))
      .returning({ id: routines.id })
    if (deleted.length === 0) throw new Error('Routine not found for this profile.')
    return { success: true }
  })
