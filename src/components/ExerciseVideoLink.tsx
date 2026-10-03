import { Youtube } from 'lucide-react'

type ExerciseVideoLinkProps = {
  exerciseName: string
  iconOnly?: boolean
}

export function ExerciseVideoLink({ exerciseName, iconOnly = false }: ExerciseVideoLinkProps) {
  const name = exerciseName.trim()

  if (!name) return null

  const query = encodeURIComponent(`${name} exercise form shorts`)
  const href = `https://www.youtube.com/results?search_query=${query}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Find a short YouTube video for ${name}`}
      title={`Search YouTube for a short form video: ${name}`}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-red-400/25 bg-red-400/[0.08] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-bone-300 transition hover:border-red-400/45 hover:bg-red-400/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 ${iconOnly ? 'h-9 w-9 p-0' : ''}`}
    >
      <Youtube className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
      <span className={iconOnly ? 'sr-only' : ''}>Short video</span>
    </a>
  )
}
