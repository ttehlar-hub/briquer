import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Trash2, ClipboardList } from 'lucide-react'
import {
  getRoutines,
  createRoutine,
  deleteRoutine,
} from '../server/routines.functions'

export const Route = createFileRoute('/routines')({
  loader: async () => ({ routines: await getRoutines() }),
  component: RoutinesPage,
})

type ExerciseDraft = { name: string; sets: string; reps: string }

const emptyExercise = (): ExerciseDraft => ({ name: '', sets: '3', reps: '10' })

function RoutinesPage() {
  const { routines } = Route.useLoaderData()
  const router = useRouter()

  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [exercises, setExercises] = useState<ExerciseDraft[]>([emptyExercise()])
  const [submitting, setSubmitting] = useState(false)

  const updateExercise = (index: number, field: keyof ExerciseDraft, value: string) => {
    setExercises((prev) =>
      prev.map((exercise, i) => (i === index ? { ...exercise, [field]: value } : exercise)),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await createRoutine({
        data: {
          name,
          notes,
          exercises: exercises
            .filter((exercise) => exercise.name.trim())
            .map((exercise) => ({
              name: exercise.name,
              sets: Number(exercise.sets) || 1,
              reps: Number(exercise.reps) || 1,
            })),
        },
      })
      setName('')
      setNotes('')
      setExercises([emptyExercise()])
      await router.invalidate()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    await deleteRoutine({ data: { id } })
    await router.invalidate()
  }

  return (
    <div className="page-shell">
      <div className="pt-6 sm:pt-10 pb-10">
        <p className="kicker mb-3">Reusable plans</p>
        <h1 className="display-title text-4xl sm:text-5xl">Routines</h1>
        <p className="mt-3 max-w-xl text-bone-300">
          Build reusable exercise routines you can follow session after session.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <form
          onSubmit={handleSubmit}
          className="panel p-6 space-y-5 lg:col-span-1 h-fit"
        >
          <h2 className="section-title">New routine</h2>
          <div>
            <label className="field-label" htmlFor="routine-name">Name</label>
            <input
              id="routine-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Push day"
              required
              className="field"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="routine-notes">Notes</label>
            <textarea
              id="routine-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Focus on chest and shoulders"
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
                  placeholder="Bench press"
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
                  className="field w-16 px-2 shrink-0"
                />
                <input
                  value={exercise.reps}
                  onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                  type="number"
                  min={1}
                  placeholder="Reps"
                  aria-label={`Exercise ${index + 1} reps`}
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
            {submitting ? 'Saving...' : 'Save routine'}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {routines.length === 0 && (
            <div className="panel p-8 text-center">
              <p className="display-title text-xl text-bone-500">No routines yet</p>
              <p className="text-sm text-bone-700 mt-2">Add your first routine with the form on the left.</p>
            </div>
          )}
          {routines.map((routine) => (
            <div key={routine.id} className="panel p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="bg-volt-400/10 border border-volt-400/30 text-volt-400 p-2.5 rounded-xl shrink-0">
                    <ClipboardList className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-bone-100">{routine.name}</h3>
                    {routine.notes && (
                      <p className="text-sm text-bone-500">{routine.notes}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(routine.id)}
                  className="text-bone-700 hover:text-red-400 transition shrink-0"
                  aria-label="Delete routine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {routine.exercises.length > 0 && (
                <ul className="mt-4 divide-y divide-white/[0.06] text-sm">
                  {routine.exercises.map((exercise) => (
                    <li key={exercise.id} className="py-2.5 flex justify-between gap-3">
                      <span className="text-bone-100">{exercise.name}</span>
                      <span className="text-bone-500 whitespace-nowrap">
                        {exercise.sets} × {exercise.reps}
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
