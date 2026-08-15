import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { routines, routineExercises } from '../../db/schema.js'

const ExerciseInput = z.object({
  name: z.string().min(1),
  sets: z.number().int().min(1),
  reps: z.number().int().min(1),
})

export const getRoutines = createServerFn().handler(async () => {
  const allRoutines = await db.select().from(routines).orderBy(routines.id)
  const allExercises = await db
    .select()
    .from(routineExercises)
    .orderBy(routineExercises.position)

  return allRoutines.map((routine) => ({
    ...routine,
    exercises: allExercises.filter((e) => e.routineId === routine.id),
  }))
})

export const createRoutine = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      notes: z.string().default(''),
      exercises: z.array(ExerciseInput).default([]),
    }),
  )
  .handler(async ({ data }) => {
    const [routine] = await db
      .insert(routines)
      .values({ name: data.name, notes: data.notes })
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
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    await db.delete(routines).where(eq(routines.id, data.id))
    return { success: true }
  })
