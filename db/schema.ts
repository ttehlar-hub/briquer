import { pgTable, serial, text, integer, real, timestamp } from 'drizzle-orm/pg-core'

export const routines = pgTable('routines', {
  id: serial().primaryKey(),
  name: text().notNull(),
  notes: text().notNull().default(''),
  createdAt: timestamp('created_at').defaultNow(),
})

export const routineExercises = pgTable('routine_exercises', {
  id: serial().primaryKey(),
  routineId: integer('routine_id')
    .notNull()
    .references(() => routines.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  sets: integer().notNull().default(3),
  reps: integer().notNull().default(10),
  position: integer().notNull().default(0),
})

export const workouts = pgTable('workouts', {
  id: serial().primaryKey(),
  routineId: integer('routine_id').references(() => routines.id, {
    onDelete: 'set null',
  }),
  date: timestamp().notNull().defaultNow(),
  notes: text().notNull().default(''),
  createdAt: timestamp('created_at').defaultNow(),
})

export const workoutExercises = pgTable('workout_exercises', {
  id: serial().primaryKey(),
  workoutId: integer('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  sets: integer().notNull().default(3),
  reps: integer().notNull().default(10),
  weight: real().notNull().default(0),
  notes: text().notNull().default(''),
})

export const recipes = pgTable('recipes', {
  id: serial().primaryKey(),
  name: text().notNull(),
  ingredients: text().notNull().default(''),
  instructions: text().notNull().default(''),
  calories: integer(),
  protein: integer(),
  createdAt: timestamp('created_at').defaultNow(),
})
