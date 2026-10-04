import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { workouts, workoutExercises, routines, workoutStatus } from '../../db/schema.js'
import { memberInputSchema } from './member-input'

const ExerciseInput = z.object({
  name: z.string().min(1),
  sets: z.number().int().min(1),
  reps: z.number().int().min(1),
  weight: z.number().min(0),
  notes: z.string().default(''),
})

const WorkoutStatus = z.enum(workoutStatus.enumValues)

export const getWorkouts = createServerFn()
  .inputValidator(memberInputSchema)
  .handler(async ({ data }) => {
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
      .leftJoin(routines, and(eq(workouts.routineId, routines.id), eq(workouts.memberId, routines.memberId)))
      .where(eq(workouts.memberId, data.memberId))
      .orderBy(desc(workouts.date))

    const allExercises = allWorkouts.length > 0
      ? await db
          .select()
          .from(workoutExercises)
          .where(inArray(workoutExercises.workoutId, allWorkouts.map((workout) => workout.id)))
      : []

    return allWorkouts.map((workout) => ({
      ...workout,
      exercises: allExercises.filter((exercise) => exercise.workoutId === workout.id),
    }))
  })

export const createWorkout = createServerFn({ method: 'POST' })
  .inputValidator(
    memberInputSchema.extend({
      routineId: z.number().int().positive().nullable(),
      date: z.string(),
      notes: z.string().default(''),
      status: WorkoutStatus.default('logged'),
      exercises: z.array(ExerciseInput).default([]),
    }),
  )
  .handler(async ({ data }) => {
    // A routine selected for one person must never populate another person's workout.
    if (data.routineId !== null) {
      const [routine] = await db
        .select({ id: routines.id })
        .from(routines)
        .where(and(eq(routines.id, data.routineId), eq(routines.memberId, data.memberId)))
      if (!routine) throw new Error('Routine not found for this profile.')
    }

    const [workout] = await db
      .insert(workouts)
      .values({
        memberId: data.memberId,
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
  .inputValidator(memberInputSchema.extend({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const [workout] = await db
      .update(workouts)
      .set({ status: 'logged', loggedAt: new Date() })
      .where(and(eq(workouts.id, data.id), eq(workouts.memberId, data.memberId)))
      .returning()
    if (!workout) throw new Error('Workout not found for this profile.')
    return workout
  })

export const deleteWorkout = createServerFn({ method: 'POST' })
  .inputValidator(memberInputSchema.extend({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const deleted = await db
      .delete(workouts)
      .where(and(eq(workouts.id, data.id), eq(workouts.memberId, data.memberId)))
      .returning({ id: workouts.id })
    if (deleted.length === 0) throw new Error('Workout not found for this profile.')
    return { success: true }
  })
