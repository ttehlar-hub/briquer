import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Trash2, Dumbbell, Calendar, TrendingUp, Target } from 'lucide-react'
import {
  getWorkouts,
  createWorkout,
  deleteWorkout,
} from '../server/workouts.functions'
import { getRoutines } from '../server/routines.functions'

export const Route = createFileRoute('/workouts')({
  loader: async () => {
    const [workouts, routines] = await Promise.all([
      getWorkouts(),
      getRoutines(),
    ])
    return { workouts, routines }
  },
  component: WorkoutsPage,
})

type ExerciseDraft = { name: string; sets: string; reps: string; weight: string }

const emptyExercise = (): ExerciseDraft => ({
  name: '',
  sets: '3',
  reps: '10',
  weight: '0',
})

const toDateInputValue = (date: Date) => new Date(date).toISOString().slice(0, 10)

const trainingPlan = [
  {
    day: 'Day 1',
    focus: 'Push (Heavy)',
    exercises: [
      { name: 'Barbell Bench Press', setsReps: '4 × 5', rest: '3 min' },
      { name: 'Overhead Press (barbell)', setsReps: '4 × 5', rest: '3 min' },
      { name: 'Incline Dumbbell Press', setsReps: '3 × 8', rest: '2 min' },
      { name: 'Dips (weighted if possible)', setsReps: '3 × 8', rest: '2 min' },
      { name: 'Lateral Raises', setsReps: '4 × 12', rest: '60s' },
      { name: 'Tricep Pushdowns', setsReps: '3 × 12', rest: '60s' },
      { name: 'Superset: Cable Crunches + Hanging Leg Raises', setsReps: '3 × 15 each', rest: '60s' },
    ],
  },
  {
    day: 'Day 2',
    focus: 'Pull (Heavy)',
    exercises: [
      { name: 'Barbell Deadlift', setsReps: '4 × 5', rest: '3 min' },
      { name: 'Weighted Pull-Ups', setsReps: '4 × 5', rest: '3 min' },
      { name: 'Barbell Row (Pendlay)', setsReps: '4 × 5', rest: '3 min' },
      { name: 'Cable Row (close grip)', setsReps: '3 × 10', rest: '2 min' },
      { name: 'Face Pulls', setsReps: '4 × 15', rest: '60s' },
      { name: 'Barbell Curl', setsReps: '3 × 10', rest: '60s' },
      { name: 'Hammer Curls', setsReps: '3 × 12', rest: '60s' },
    ],
  },
  {
    day: 'Day 3',
    focus: 'Legs (Heavy)',
    exercises: [
      { name: 'Barbell Back Squat', setsReps: '4 × 5', rest: '3 min' },
      { name: 'Romanian Deadlift', setsReps: '4 × 5', rest: '3 min' },
      { name: 'Leg Press', setsReps: '4 × 8', rest: '2 min' },
      { name: 'Walking Lunges (dumbbells)', setsReps: '3 × 10/leg', rest: '2 min' },
      { name: 'Leg Curl', setsReps: '3 × 12', rest: '60s' },
      { name: 'Calf Raises (standing)', setsReps: '4 × 15', rest: '60s' },
      { name: 'Superset: Planks (60s) + Ab Wheel Rollouts', setsReps: '3 rounds', rest: '60s' },
    ],
  },
  {
    day: 'Day 4',
    focus: 'Push (Hypertrophy)',
    exercises: [
      { name: 'Dumbbell Bench Press', setsReps: '4 × 12', rest: '90s' },
      { name: 'Seated Dumbbell OHP', setsReps: '4 × 12', rest: '90s' },
      { name: 'Cable Flyes (low-to-high)', setsReps: '3 × 15', rest: '60s' },
      { name: 'Cable Flyes (high-to-low)', setsReps: '3 × 15', rest: '60s' },
      { name: 'Lateral Raise (drop set)', setsReps: '3 × 12+8+8', rest: '90s' },
      { name: 'Overhead Tricep Extension (cable)', setsReps: '3 × 15', rest: '60s' },
      { name: 'Skull Crushers', setsReps: '3 × 12', rest: '60s' },
      { name: 'Cable Crunches', setsReps: '4 × 20', rest: '45s' },
    ],
  },
  {
    day: 'Day 5',
    focus: 'Pull (Hypertrophy)',
    exercises: [
      { name: 'Lat Pulldown (wide grip)', setsReps: '4 × 12', rest: '90s' },
      { name: 'Seated Cable Row (wide grip)', setsReps: '4 × 12', rest: '90s' },
      { name: 'Single Arm Dumbbell Row', setsReps: '3 × 12/arm', rest: '60s' },
      { name: 'Chest-Supported Row', setsReps: '3 × 15', rest: '60s' },
      { name: 'Rear Delt Flyes', setsReps: '4 × 15', rest: '60s' },
      { name: 'Incline Dumbbell Curl', setsReps: '3 × 12', rest: '60s' },
      { name: 'Cable Curl (rope)', setsReps: '3 × 15', rest: '60s' },
      { name: 'Hanging Leg Raises', setsReps: '3 × 15', rest: '60s' },
    ],
  },
  {
    day: 'Day 6',
    focus: 'Olympic Lifting — Full Body',
    href: '/workouts/olympic-lifting',
    exercises: [],
  },
  {
    day: 'Day 7',
    focus: 'REST',
    exercises: [{ name: 'Light walk, stretching, or nothing. Recover.', setsReps: '', rest: '' }],
  },
]

const weeklyRules = [
  'Hit 220g protein every single day — even rest day',
  '10,000 steps daily (outside of gym)',
  'Sleep 7+ hours',
  '2 abs sessions on Push days, 2 on Legs days = abs 4x/week',
  'No alcohol during the cut phase (or limit to 1-2 drinks per week max)',
  'Drink 3-4 liters of water daily',
]

const timeline = [
  { weeks: 'Weeks 1-2', expectation: 'Adjusting to PPL, possible soreness from new frequency' },
  { weeks: 'Weeks 3-6', expectation: 'Strength going up, waist getting tighter, face leaning out' },
  { weeks: 'Weeks 8-12', expectation: 'Upper abs visible, clear muscle fullness' },
  { weeks: 'Weeks 12-20', expectation: 'Full six-pack visible at ~88-92kg depending on muscle mass' },
]

function WorkoutsPage() {
  const { workouts, routines } = Route.useLoaderData()
  const router = useRouter()

  const [routineId, setRoutineId] = useState<string>('')
  const [date, setDate] = useState(toDateInputValue(new Date()))
  const [notes, setNotes] = useState('')
  const [exercises, setExercises] = useState<ExerciseDraft[]>([emptyExercise()])
  const [submitting, setSubmitting] = useState(false)

  const updateExercise = (index: number, field: keyof ExerciseDraft, value: string) => {
    setExercises((prev) =>
      prev.map((exercise, i) => (i === index ? { ...exercise, [field]: value } : exercise)),
    )
  }

  const applyRoutine = (id: string) => {
    setRoutineId(id)
    const routine = routines.find((r) => r.id === Number(id))
    if (routine && routine.exercises.length > 0) {
      setExercises(
        routine.exercises.map((exercise) => ({
          name: exercise.name,
          sets: String(exercise.sets),
          reps: String(exercise.reps),
          weight: '0',
        })),
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createWorkout({
        data: {
          routineId: routineId ? Number(routineId) : null,
          date,
          notes,
          exercises: exercises
            .filter((exercise) => exercise.name.trim())
            .map((exercise) => ({
              name: exercise.name,
              sets: Number(exercise.sets) || 1,
              reps: Number(exercise.reps) || 1,
              weight: Number(exercise.weight) || 0,
              notes: '',
            })),
        },
      })
      setRoutineId('')
      setNotes('')
      setExercises([emptyExercise()])
      await router.invalidate()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    await deleteWorkout({ data: { id } })
    await router.invalidate()
  }

  return (
    <div className="page-shell">
      <div className="pt-6 sm:pt-10 pb-10">
        <p className="kicker mb-3">Training plan</p>
        <h1 className="display-title text-4xl sm:text-5xl">Workout sessions</h1>
        <p className="mt-3 max-w-xl text-bone-300">
          Log every session with the sets, reps and weight you actually did.
        </p>
      </div>

      <div className="panel p-6 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="bg-volt-400/10 border border-volt-400/30 text-volt-400 p-2.5 rounded-xl">
            <Dumbbell className="w-5 h-5" />
          </span>
          <div>
            <h2 className="section-title">Custom Training Plan</h2>
            <p className="text-sm text-bone-500">
              Push/Pull/Legs 6-day rotation — heavy compounds + hypertrophy work
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="tile">
            <div className="flex items-center gap-2 mb-1.5">
              <Target className="w-4 h-4 text-volt-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-bone-500">Current Stats</span>
            </div>
            <p className="text-sm text-bone-100">99kg | Goal: muscular with visible abs</p>
          </div>
          <div className="tile">
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp className="w-4 h-4 text-volt-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-bone-500">Why PPL?</span>
            </div>
            <p className="text-sm text-bone-100">
              Research shows training each muscle 2x per week builds more muscle than a bro split.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="data-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Focus</th>
              </tr>
            </thead>
            <tbody>
              {trainingPlan.map((day) => (
                <tr key={day.day}>
                  <td className="font-semibold text-bone-100 whitespace-nowrap">{day.day}</td>
                  <td>{day.focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-8">
          {trainingPlan.map((day) =>
            day.focus === 'REST' ? null : day.exercises.length === 0 && 'href' in day && day.href ? (
              <div
                key={day.day}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-volt-400/30 bg-volt-400/10 p-4"
              >
                <h3 className="text-sm font-bold text-volt-200 flex items-center gap-2 uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  {day.day} — {day.focus}
                </h3>
                <Link
                  to={day.href}
                  className="btn-volt px-4 py-2 text-xs"
                >
                  View full Oly day plan
                </Link>
              </div>
            ) : (
              <div key={day.day}>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-volt-400 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {day.day} — {day.focus}
                </h3>
                <div className="overflow-x-auto rounded-xl">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Exercise</th>
                        <th>Sets × Reps</th>
                        <th>Rest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.exercises.map((exercise) => (
                        <tr key={exercise.name}>
                          <td className="text-bone-100">{exercise.name}</td>
                          <td className="whitespace-nowrap">{exercise.setsReps}</td>
                          <td className="whitespace-nowrap">{exercise.rest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ),
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="tile">
            <h3 className="section-title text-base mb-3">Progression Rules</h3>
            <ul className="list-disc list-inside text-sm text-bone-300 space-y-1.5">
              <li>
                <span className="font-semibold text-bone-100">Heavy (5-rep):</span> add 2.5kg when all sets hit 5 reps with good form; otherwise stay.
              </li>
              <li>
                <span className="font-semibold text-bone-100">Hypertrophy (12-15 rep):</span> increase weight when you hit the top of the rep range on all sets.
              </li>
              <li>Focus on controlled tempo: 3 seconds down, 1 second up.</li>
            </ul>
          </div>
          <div className="tile">
            <h3 className="section-title text-base mb-3">Weekly Non-Negotiables</h3>
            <ul className="list-disc list-inside text-sm text-bone-300 space-y-1.5">
              {weeklyRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="section-title text-base mb-3">Realistic Timeline</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {timeline.map((phase) => (
              <div key={phase.weeks} className="tile">
                <p className="text-xs font-bold uppercase tracking-wider text-volt-400">{phase.weeks}</p>
                <p className="text-sm text-bone-300 mt-1.5">{phase.expectation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <form
          onSubmit={handleSubmit}
          className="panel p-6 space-y-5 lg:col-span-1 h-fit"
        >
          <h2 className="section-title">Log a session</h2>

          <div>
            <label className="field-label" htmlFor="workout-date">Date</label>
            <input
              id="workout-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="field"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="workout-routine">Routine (optional)</label>
            <select
              id="workout-routine"
              value={routineId}
              onChange={(e) => applyRoutine(e.target.value)}
              className="field"
            >
              <option value="">No routine</option>
              {routines.map((routine) => (
                <option key={routine.id} value={routine.id}>
                  {routine.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="workout-notes">Notes</label>
            <textarea
              id="workout-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Felt strong today"
              className="field"
            />
          </div>

          <div className="space-y-2.5">
            <span className="field-label">Exercises</span>
            {exercises.map((exercise, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={exercise.name}
                  onChange={(e) => updateExercise(index, 'name', e.target.value)}
                  placeholder="Squat"
                  aria-label={`Exercise ${index + 1} name`}
                  className="field flex-1 min-w-0"
                />
                <input
                  value={exercise.sets}
                  onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                  type="number"
                  min={1}
                  placeholder="Sets"
                  aria-label={`Exercise ${index + 1} sets`}
                  className="field w-14 px-2 shrink-0"
                />
                <input
                  value={exercise.reps}
                  onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                  type="number"
                  min={1}
                  placeholder="Reps"
                  aria-label={`Exercise ${index + 1} reps`}
                  className="field w-14 px-2 shrink-0"
                />
                <input
                  value={exercise.weight}
                  onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                  type="number"
                  min={0}
                  step="0.5"
                  placeholder="kg"
                  aria-label={`Exercise ${index + 1} weight`}
                  className="field w-16 px-2 shrink-0"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setExercises((prev) => [...prev, emptyExercise()])}
              className="btn-ghost w-full py-2 text-xs"
            >
              Add exercise
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-volt w-full"
          >
            {submitting ? 'Saving...' : 'Save session'}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {workouts.length === 0 && (
            <div className="panel p-8 text-center">
              <p className="display-title text-xl text-bone-500">No sessions logged yet</p>
              <p className="text-sm text-bone-700 mt-2">Log your first session with the form on the left.</p>
            </div>
          )}
          {workouts.map((workout) => (
            <div key={workout.id} className="panel p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="bg-volt-400/10 border border-volt-400/30 text-volt-400 p-2.5 rounded-xl shrink-0">
                    <Dumbbell className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-bone-100">
                      {toDateInputValue(workout.date)}
                      {workout.routineName && (
                        <span className="text-bone-500 font-normal"> · {workout.routineName}</span>
                      )}
                    </h3>
                    {workout.notes && (
                      <p className="text-sm text-bone-500">{workout.notes}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(workout.id)}
                  className="text-bone-700 hover:text-red-400 transition shrink-0"
                  aria-label="Delete session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {workout.exercises.length > 0 && (
                <ul className="mt-4 divide-y divide-white/[0.06] text-sm">
                  {workout.exercises.map((exercise) => (
                    <li key={exercise.id} className="py-2.5 flex justify-between gap-3">
                      <span className="text-bone-100">{exercise.name}</span>
                      <span className="text-bone-500 whitespace-nowrap">
                        {exercise.sets} × {exercise.reps} @ {exercise.weight}kg
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
