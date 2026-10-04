import { pgTable, serial, text, integer, real, timestamp, pgEnum, index } from 'drizzle-orm/pg-core'
import type { MemberId } from '../src/lib/members'

export const workoutStatus = pgEnum('workout_status', ['draft', 'logged'])

export const routines = pgTable('routines', {
  id: serial().primaryKey(),
  // Legacy entries belong to Tibor; new writes always specify a family member.
  memberId: text('member_id').$type<MemberId>().notNull().default('tibor'),
  name: text().notNull(),
  notes: text().notNull().default(''),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [index('routines_member_id_idx').on(table.memberId)])

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
  // Legacy entries belong to Tibor; new writes always specify a family member.
  memberId: text('member_id').$type<MemberId>().notNull().default('tibor'),
  routineId: integer('routine_id').references(() => routines.id, {
    onDelete: 'set null',
  }),
  date: timestamp().notNull().defaultNow(),
  notes: text().notNull().default(''),
  /** 'draft' = in progress / not yet confirmed, 'logged' = confirmed as done */
  status: workoutStatus().notNull().default('logged'),
  loggedAt: timestamp('logged_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [index('workouts_member_id_idx').on(table.memberId)])

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
  // Legacy entries belong to Tibor; new writes always specify a family member.
  memberId: text('member_id').$type<MemberId>().notNull().default('tibor'),
  name: text().notNull(),
  ingredients: text().notNull().default(''),
  instructions: text().notNull().default(''),
  calories: integer(),
  protein: integer(),
  carbs: integer(),
  fats: integer(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [index('recipes_member_id_idx').on(table.memberId)])
