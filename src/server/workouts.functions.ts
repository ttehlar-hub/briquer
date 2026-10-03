import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { workouts, workoutExercises, routines, workoutStatus } from '../../db/schema.js'

const ExerciseInput = z.object({
  name: z.string().min(1),
  sets: z.number().int().min(1),
  reps: z.number().int().min(1),
  weight: z.number().min(0),
  notes: z.string().default(''),
})

const WorkoutStatus = z.enum(workoutStatus.enumValues)

export const getWorkouts = createServerFn().handler(async () => {
  const allWorkouts = await db
    .select({
      id: workouts.id,
      routineId: workouts.routineId,
      routineName: routines.name,
      date: workouts.date,
      notes: workouts.notes,
      status: workouts.status,
      loggedAt: workouts.loggedAt,
    })
    .from(workouts)
    .leftJoin(routines, eq(workouts.routineId, routines.id))
    .orderBy(desc(workouts.date))

  const allExercises = await db.select().from(workoutExercises)

  return allWorkouts.map((workout) => ({
    ...workout,
    exercises: allExercises.filter((e) => e.workoutId === workout.id),
  }))
})

export const createWorkout = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      routineId: z.number().nullable(),
      date: z.string(),
      notes: z.string().default(''),
      status: WorkoutStatus.default('logged'),
      exercises: z.array(ExerciseInput).default([]),
    }),
  )
  .handler(async ({ data }) => {
    const [workout] = await db
      .insert(workouts)
      .values({
        routineId: data.routineId,
        date: new Date(data.date),
        notes: data.notes,
        status: data.status,
        loggedAt: data.status === 'logged' ? new Date() : null,
      })
      .returning()

    if (data.exercises.length > 0) {
      await db.insert(workoutExercises).values(
        data.exercises.map((exercise) => ({
          workoutId: workout.id,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          notes: exercise.notes,
        })),
      )
    }

    return workout
  })

export const confirmWorkout = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    const [workout] = await db
      .update(workouts)
      .set({ status: 'logged', loggedAt: new Date() })
      .where(eq(workouts.id, data.id))
      .returning()
    return workout
  })

export const deleteWorkout = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    await db.delete(workouts).where(eq(workouts.id, data.id))
    return { success: true }
  })
