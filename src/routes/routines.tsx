import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Trash2, ClipboardList } from 'lucide-react'
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Routines</h1>
      <p className="text-gray-500 mb-8">
        Build reusable exercise routines you can follow session after session.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6 space-y-4 lg:col-span-1 h-fit"
        >
          <h2 className="text-lg font-semibold text-gray-900">New routine</h2>
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Push day"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Focus on chest and shoulders"
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
                  placeholder="Bench press"
                  className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  value={exercise.sets}
                  onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                  type="number"
                  min={1}
                  placeholder="Sets"
                  className="w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  value={exercise.reps}
                  onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                  type="number"
                  min={1}
                  placeholder="Reps"
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
            {submitting ? 'Saving...' : 'Save routine'}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {routines.length === 0 && (
            <p className="text-gray-500 text-sm">No routines yet — add your first one.</p>
          )}
          {routines.map((routine) => (
            <div key={routine.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{routine.name}</h3>
                    {routine.notes && (
                      <p className="text-sm text-gray-500">{routine.notes}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(routine.id)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label="Delete routine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {routine.exercises.length > 0 && (
                <ul className="mt-4 divide-y divide-gray-100 text-sm">
                  {routine.exercises.map((exercise) => (
                    <li key={exercise.id} className="py-2 flex justify-between">
                      <span className="text-gray-800">{exercise.name}</span>
                      <span className="text-gray-500">
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
