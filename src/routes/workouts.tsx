import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  Trash2,
  Dumbbell,
  Calendar,
  TrendingUp,
  Target,
  CheckCircle2,
  CircleDashed,
  ClipboardCheck,
  Play,
  X,
} from 'lucide-react'
import { ExerciseVideoLink } from '../components/ExerciseVideoLink'
import { PlanFolder } from '../components/PlanFolder'
import {
  getWorkouts,
  createWorkout,
  confirmWorkout,
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

/** Pull "4 × 5" out of a plan day's sets×reps label so a day can prefill the logger. */
const parseSetsReps = (setsReps: string): { sets: string; reps: string } => {
  const match = /^(\d+)\s*×\s*(\d+)/.exec(setsReps.trim())
  if (match) return { sets: match[1], reps: match[2] }
  return { sets: '3', reps: '10' }
}

/** Snapshot of the session shown in the "confirm training" review step. */
type SessionSnapshot = {
  date: string
  routineName: string | null
  notes: string
  exercises: { name: string; sets: number; reps: number; weight: number }[]
}

type TrainingExercise = {
  name: string
  setsReps: string
  rest: string
  videoNames?: string[]
}

type TrainingDay = {
  day: string
  focus: string
  exercises: TrainingExercise[]
  href?: '/workouts/olympic-lifting'
}

const trainingPlan: TrainingDay[] = [
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
      {
        name: 'Superset: Cable Crunches + Hanging Leg Raises',
        setsReps: '3 × 15 each',
        rest: '60s',
        videoNames: ['Cable Crunches', 'Hanging Leg Raises'],
      },
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
      {
        name: 'Superset: Planks (60s) + Ab Wheel Rollouts',
        setsReps: '3 rounds',
        rest: '60s',
        videoNames: ['Planks', 'Ab Wheel Rollouts'],
      },
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
  const [saving, setSaving] = useState<'draft' | 'logged' | null>(null)
  const [review, setReview] = useState<SessionSnapshot | null>(null)
  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  useEffect(() => {
    if (!flash) return
    const timer = setTimeout(() => setFlash(null), 5000)
    return () => clearTimeout(timer)
  }, [flash])

  useEffect(() => {
    if (!review) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setReview(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [review])

  const namedExercises = exercises.filter((exercise) => exercise.name.trim())
  const hasExercises = namedExercises.length > 0
  const draftCount = workouts.filter((workout) => workout.status === 'draft').length

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

  /** Prefill the logger with a training-plan day, then jump to it. */
  const startFromPlanDay = (day: TrainingDay) => {
    setRoutineId('')
    setExercises(
      day.exercises.map((exercise) => {
        const { sets, reps } = parseSetsReps(exercise.setsReps)
        return { name: exercise.name, sets, reps, weight: '0' }
      }),
    )
    document
      .getElementById('session-logger')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const buildPayloadExercises = () =>
    namedExercises.map((exercise) => ({
      name: exercise.name,
      sets: Number(exercise.sets) || 1,
      reps: Number(exercise.reps) || 1,
      weight: Number(exercise.weight) || 0,
      notes: '',
    }))

  const resetForm = () => {
    setRoutineId('')
    setNotes('')
    setExercises([emptyExercise()])
  }

  /** Step 1 of confirming: show a review of what will be logged. */
  const openReview = () => {
    if (!hasExercises) return
    setReview({
      date,
      routineName: routines.find((r) => r.id === Number(routineId))?.name ?? null,
      notes,
      exercises: buildPayloadExercises(),
    })
  }

  const discardSession = () => {
    setReview(null)
    resetForm()
    setFlash('Session discarded — nothing was logged.')
  }

  /** Step 2: write the session to the log (status 'logged') or keep it as a draft. */
  const saveSession = async (status: 'draft' | 'logged') => {
    setSaving(status)
    try {
      await createWorkout({
        data: {
          routineId: routineId ? Number(routineId) : null,
          date,
          notes,
          status,
          exercises: buildPayloadExercises(),
        },
      })
      setReview(null)
      resetForm()
      setFlash(
        status === 'logged'
          ? 'Session logged — nice work!'
          : 'Draft saved. Confirm it after the workout to log it.',
      )
      await router.invalidate()
    } finally {
      setSaving(null)
    }
  }

  const handleConfirm = async (id: number) => {
    setConfirmingId(id)
    try {
      await confirmWorkout({ data: { id } })
      setFlash('Session logged — nice work!')
      await router.invalidate()
    } finally {
      setConfirmingId(null)
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

        <section className="mt-8" aria-labelledby="weekly-training-modules">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <h3 id="weekly-training-modules" className="section-title text-base">Weekly training modules</h3>
              <p className="text-sm text-bone-500 mt-1">
                Open a day folder to see its session details and exercises.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-bone-500">
              6 training sessions · 1 recovery day
            </span>
          </div>

          <div className="space-y-2.5">
            {trainingPlan.map((day) => {
              const isRestDay = day.focus === 'REST'
              const title = isRestDay ? `${day.day} · Recovery` : `${day.day} · ${day.focus}`
              const description = isRestDay
                ? 'Rest, light movement, and recovery guidance'
                : day.href
                  ? 'Olympic lifting · full-body technique session'
                  : `${day.exercises.length} planned exercises · open to view`
              const badge = isRestDay
                ? 'Recovery'
                : day.href
                  ? 'Technique'
                  : `${day.exercises.length} exercises`

              return (
                <PlanFolder
                  key={day.day}
                  title={title}
                  description={description}
                  badge={badge}
                >
                  {isRestDay ? (
                    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-volt-400" />
                      <div>
                        <p className="text-sm font-semibold text-bone-100">Recovery focus</p>
                        <p className="mt-1 text-sm text-bone-300">{day.exercises[0]?.name}</p>
                      </div>
                    </div>
                  ) : day.href ? (
                    <div className="flex flex-col gap-4 rounded-xl border border-volt-400/20 bg-volt-400/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-bone-100">Technique-first Olympic lifting</p>
                        <p className="mt-1 max-w-xl text-sm text-bone-500">
                          Mobility warm-up, snatch and clean progressions, strength accessories, and core work.
                        </p>
                      </div>
                      <Link to={day.href} className="btn-volt shrink-0 px-4 py-2 text-xs">
                        <Dumbbell className="h-4 w-4" />
                        Open Day 6 session
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs text-bone-500">Planned exercises · sets, reps, and rest intervals</p>
                        <button
                          type="button"
                          onClick={() => startFromPlanDay(day)}
                          className="btn-ghost shrink-0 px-3 py-1.5 text-[11px]"
                        >
                          <Play className="h-3.5 w-3.5" />
                          Log this session
                        </button>
                      </div>
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
                                <td className="text-bone-100">
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span>{exercise.name}</span>
                                    {(exercise.videoNames ?? [exercise.name]).map((videoName) => (
                                      <ExerciseVideoLink key={videoName} exerciseName={videoName} />
                                    ))}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap">{exercise.setsReps}</td>
                                <td className="whitespace-nowrap">{exercise.rest}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </PlanFolder>
              )
            })}
          </div>
        </section>

        <section className="mt-8" aria-labelledby="program-reference-modules">
          <div className="mb-4">
            <h3 id="program-reference-modules" className="section-title text-base">Program notes &amp; references</h3>
            <p className="mt-1 text-sm text-bone-500">
              Guidance and targets are tucked into their own folders.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <PlanFolder
              title="Plan overview"
              description="Your current goal and why the push/pull/legs split works"
              badge="Goal & rationale"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="tile">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Target className="h-4 w-4 text-volt-400" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-bone-500">Current stats</span>
                  </div>
                  <p className="text-sm text-bone-100">99kg | Goal: muscular with visible abs</p>
                </div>
                <div className="tile">
                  <div className="mb-1.5 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-volt-400" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-bone-500">Why PPL?</span>
                  </div>
                  <p className="text-sm text-bone-100">
                    Research shows training each muscle 2x per week builds more muscle than a bro split.
                  </p>
                </div>
              </div>
            </PlanFolder>

            <PlanFolder
              title="Progression rules"
              description="When to add weight and how to keep each rep controlled"
              badge="3 rules"
            >
              <ul className="list-disc list-inside space-y-1.5 text-sm text-bone-300">
                <li>
                  <span className="font-semibold text-bone-100">Heavy (5-rep):</span> add 2.5kg when all sets hit 5 reps with good form; otherwise stay.
                </li>
                <li>
                  <span className="font-semibold text-bone-100">Hypertrophy (12-15 rep):</span> increase weight when you hit the top of the rep range on all sets.
                </li>
                <li>Focus on controlled tempo: 3 seconds down, 1 second up.</li>
              </ul>
            </PlanFolder>

            <PlanFolder
              title="Weekly non-negotiables"
              description="Daily habits that support training and recovery"
              badge={`${weeklyRules.length} targets`}
            >
              <ul className="list-disc list-inside space-y-1.5 text-sm text-bone-300">
                {weeklyRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </PlanFolder>

            <PlanFolder
              title="Realistic timeline"
              description="Milestones to expect as the training block progresses"
              badge="12–20 weeks"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {timeline.map((phase) => (
                  <div key={phase.weeks} className="tile">
                    <p className="text-xs font-bold uppercase tracking-wider text-volt-400">{phase.weeks}</p>
                    <p className="mt-1.5 text-sm text-bone-300">{phase.expectation}</p>
                  </div>
                ))}
              </div>
            </PlanFolder>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="panel p-6 space-y-5 lg:col-span-1 h-fit"
        >
          <div id="session-logger" className="scroll-mt-24">
            <h2 className="section-title">Session logger</h2>
            <p className="text-sm text-bone-500 mt-1">
              After your workout, save it as a draft or confirm it to log the training.
            </p>
          </div>

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
                <ExerciseVideoLink exerciseName={exercise.name} iconOnly />
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
            type="button"
            onClick={openReview}
            disabled={!hasExercises || saving !== null}
            className="btn-volt w-full"
          >
            <ClipboardCheck className="w-4 h-4" />
            Finish workout — confirm &amp; log
          </button>
          <button
            type="button"
            onClick={() => saveSession('draft')}
            disabled={!hasExercises || saving !== null}
            className="btn-ghost w-full justify-center"
          >
            <CircleDashed className="w-4 h-4" />
            {saving === 'draft' ? 'Saving...' : 'Save as draft (not logged yet)'}
          </button>
          <p className="text-[11px] text-bone-700 text-center -mt-2">
            Confirming marks this session as completed training in your log.
          </p>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {flash && (
            <div className="panel px-4 py-3 flex items-center gap-3 border-volt-400/30 bg-volt-400/10">
              <CheckCircle2 className="w-5 h-5 text-volt-400 shrink-0" />
              <p className="text-sm font-semibold text-bone-100">{flash}</p>
            </div>
          )}
          {draftCount > 0 && (
            <p className="text-sm text-bone-500 flex items-center gap-2 px-1">
              <CircleDashed className="w-4 h-4 text-amber-300 shrink-0" />
              You have {draftCount} draft session{draftCount === 1 ? '' : 's'} — confirm{' '}
              {draftCount === 1 ? 'it' : 'them'} below once the training is done.
            </p>
          )}
          {workouts.length === 0 && (
            <div className="panel p-8 text-center">
              <p className="display-title text-xl text-bone-500">No sessions logged yet</p>
              <p className="text-sm text-bone-700 mt-2">Log your first session with the form on the left.</p>
            </div>
          )}
          {workouts.map((workout) => {
            const isDraft = workout.status === 'draft'
            return (
            <div key={workout.id} className={`panel p-6 ${isDraft ? 'border-amber-400/25' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`p-2.5 rounded-xl shrink-0 border ${isDraft ? 'bg-amber-400/10 border-amber-400/30 text-amber-300' : 'bg-volt-400/10 border-volt-400/30 text-volt-400'}`}>
                    {isDraft ? <CircleDashed className="w-5 h-5" /> : <Dumbbell className="w-5 h-5" />}
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
                    <div className="mt-1.5">
                      {isDraft ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                          <CircleDashed className="w-3 h-3" /> Draft — not logged yet
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-volt-400/30 bg-volt-400/10 text-volt-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                          <CheckCircle2 className="w-3 h-3" /> Logged
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isDraft && (
                    <button
                      onClick={() => handleConfirm(workout.id)}
                      disabled={confirmingId !== null}
                      className="btn-volt px-3 py-1.5 text-[11px]"
                      aria-label="Confirm session as logged"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      {confirmingId === workout.id ? 'Logging...' : 'Confirm'}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(workout.id)}
                    className="text-bone-700 hover:text-red-400 transition shrink-0"
                    aria-label="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {workout.exercises.length > 0 && (
                <ul className="mt-4 divide-y divide-white/[0.06] text-sm">
                  {workout.exercises.map((exercise) => (
                    <li key={exercise.id} className="py-2.5 flex justify-between gap-3">
                      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-bone-100">{exercise.name}</span>
                        <ExerciseVideoLink exerciseName={exercise.name} />
                      </div>
                      <span className="text-bone-500 whitespace-nowrap">
                        {exercise.sets} × {exercise.reps} @ {exercise.weight}kg
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            )
          })}
        </div>
      </div>

      {review && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm training session"
        >
          <div className="panel w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="kicker mb-1">Confirm training</p>
                <h3 className="section-title">Did you complete this session?</h3>
              </div>
              <button
                type="button"
                onClick={() => setReview(null)}
                className="text-bone-700 hover:text-white transition shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="tile mb-3">
              <p className="text-sm font-semibold text-bone-100">
                {review.date}
                {review.routineName && <span className="text-bone-500 font-normal"> · {review.routineName}</span>}
              </p>
              {review.notes && <p className="text-sm text-bone-500 mt-1">{review.notes}</p>}
            </div>

            <ul className="text-sm divide-y divide-white/[0.06] rounded-xl border border-white/10 overflow-hidden mb-5">
              {review.exercises.map((exercise, index) => (
                <li key={index} className="px-3 py-2.5 flex justify-between gap-3 bg-white/[0.02]">
                  <span className="text-bone-100">{exercise.name}</span>
                  <span className="text-bone-500 whitespace-nowrap">
                    {exercise.sets} × {exercise.reps} @ {exercise.weight}kg
                  </span>
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => saveSession('logged')}
                disabled={saving !== null}
                className="btn-volt w-full"
              >
                <CheckCircle2 className="w-4 h-4" />
                {saving === 'logged' ? 'Logging...' : 'Confirm — I did this training'}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReview(null)}
                  disabled={saving !== null}
                  className="btn-ghost flex-1 justify-center"
                >
                  Keep editing
                </button>
                <button
                  type="button"
                  onClick={discardSession}
                  disabled={saving !== null}
                  className="btn-ghost flex-1 justify-center text-red-400 hover:text-red-300"
                >
                  Discard session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
