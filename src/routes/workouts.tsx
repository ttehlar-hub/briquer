import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Trash2, Dumbbell, Calendar, TrendingUp, Target } from 'lucide-react'
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
    focus: 'Legs (Hypertrophy)',
    exercises: [
      { name: 'Front Squat OR Goblet Squat', setsReps: '4 × 12', rest: '90s' },
      { name: 'Bulgarian Split Squat', setsReps: '3 × 12/leg', rest: '90s' },
      { name: 'Leg Extension', setsReps: '4 × 15', rest: '60s' },
      { name: 'Leg Curl', setsReps: '4 × 15', rest: '60s' },
      { name: 'Hip Thrust', setsReps: '4 × 12', rest: '90s' },
      { name: 'Seated Calf Raise', setsReps: '4 × 20', rest: '45s' },
      { name: 'Superset: Woodchoppers + Bicycle Crunches', setsReps: '3 × 15 each', rest: '60s' },
    ],
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Workout sessions</h1>
      <p className="text-gray-500 mb-8">
        Log every session with the sets, reps and weight you actually did.
      </p>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Custom Training Plan</h2>
            <p className="text-sm text-gray-500">
              Push/Pull/Legs 6-day rotation — heavy compounds + hypertrophy work
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-gray-700">Current Stats</span>
            </div>
            <p className="text-sm text-gray-800">99kg | Goal: muscular with visible abs</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-gray-700">Why PPL?</span>
            </div>
            <p className="text-sm text-gray-800">
              Research shows training each muscle 2x per week builds more muscle than a bro split.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-2 rounded-l-lg">Day</th>
                <th className="px-4 py-2">Focus</th>
              </tr>
            </thead>
            <tbody>
              {trainingPlan.map((day) => (
                <tr key={day.day} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{day.day}</td>
                  <td className="px-4 py-3 text-gray-700">{day.focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 space-y-6">
          {trainingPlan.map((day) =>
            day.focus === 'REST' ? null : (
              <div key={day.day}>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  {day.day} — {day.focus}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 rounded-l-lg">Exercise</th>
                        <th className="px-3 py-2">Sets × Reps</th>
                        <th className="px-3 py-2 rounded-r-lg">Rest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.exercises.map((exercise) => (
                        <tr key={exercise.name} className="border-b border-gray-100 last:border-0">
                          <td className="px-3 py-2 text-gray-800">{exercise.name}</td>
                          <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{exercise.setsReps}</td>
                          <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{exercise.rest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ),
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Progression Rules</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>
                <span className="font-medium">Heavy (5-rep):</span> add 2.5kg when all sets hit 5 reps with good form; otherwise stay.
              </li>
              <li>
                <span className="font-medium">Hypertrophy (12-15 rep):</span> increase weight when you hit the top of the rep range on all sets.
              </li>
              <li>Focus on controlled tempo: 3 seconds down, 1 second up.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Weekly Non-Negotiables</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {weeklyRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Realistic Timeline</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {timeline.map((phase) => (
              <div key={phase.weeks} className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-emerald-600">{phase.weeks}</p>
                <p className="text-sm text-gray-700 mt-1">{phase.expectation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6 space-y-4 lg:col-span-1 h-fit"
        >
          <h2 className="text-lg font-semibold text-gray-900">Log a session</h2>

          <div>
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Routine (optional)</label>
            <select
              value={routineId}
              onChange={(e) => applyRoutine(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Felt strong today"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Exercises</label>
            {exercises.map((exercise, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={exercise.name}
                  onChange={(e) => updateExercise(index, 'name', e.target.value)}
                  placeholder="Squat"
                  className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  value={exercise.sets}
                  onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                  type="number"
                  min={1}
                  placeholder="Sets"
                  className="w-14 rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  value={exercise.reps}
                  onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                  type="number"
                  min={1}
                  placeholder="Reps"
                  className="w-14 rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  value={exercise.weight}
                  onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                  type="number"
                  min={0}
                  step="0.5"
                  placeholder="kg"
                  className="w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setExercises((prev) => [...prev, emptyExercise()])}
              className="flex items-center gap-1 text-sm text-emerald-600 font-medium hover:text-emerald-700"
            >
              <Plus className="w-4 h-4" /> Add exercise
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg py-2 text-sm disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save session'}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {workouts.length === 0 && (
            <p className="text-gray-500 text-sm">No sessions logged yet.</p>
          )}
          {workouts.map((workout) => (
            <div key={workout.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 p-2 rounded-lg">
                    <Dumbbell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {toDateInputValue(workout.date)}
                      {workout.routineName && (
                        <span className="text-gray-500 font-normal"> · {workout.routineName}</span>
                      )}
                    </h3>
                    {workout.notes && (
                      <p className="text-sm text-gray-500">{workout.notes}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(workout.id)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label="Delete session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {workout.exercises.length > 0 && (
                <ul className="mt-4 divide-y divide-gray-100 text-sm">
                  {workout.exercises.map((exercise) => (
                    <li key={exercise.id} className="py-2 flex justify-between">
                      <span className="text-gray-800">{exercise.name}</span>
                      <span className="text-gray-500">
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
