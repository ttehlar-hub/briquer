import { ChevronDown, Folder } from 'lucide-react'
import type { ReactNode } from 'react'

type PlanFolderProps = {
  title: string
  description?: string
  badge?: string
  tone?: 'default' | 'warning' | 'danger'
  children: ReactNode
}

const toneStyles = {
  default: {
    folder: 'border-white/10 bg-white/[0.025]',
    icon: 'border-volt-400/30 bg-volt-400/10 text-volt-400',
    badge: 'border-volt-400/25 bg-volt-400/10 text-volt-300',
  },
  warning: {
    folder: 'border-amber-400/25 bg-amber-950/20',
    icon: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    badge: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  },
  danger: {
    folder: 'border-red-400/25 bg-red-950/20',
    icon: 'border-red-400/30 bg-red-400/10 text-red-300',
    badge: 'border-red-400/30 bg-red-400/10 text-red-200',
  },
} satisfies Record<NonNullable<PlanFolderProps['tone']>, { folder: string; icon: string; badge: string }>

export function PlanFolder({
  title,
  description,
  badge,
  tone = 'default',
  children,
}: PlanFolderProps) {
  const styles = toneStyles[tone]

  return (
    <details className={`plan-folder group overflow-hidden rounded-xl border ${styles.folder}`}>
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 transition hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-volt-400/70">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${styles.icon}`}>
          <Folder className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-bold uppercase tracking-wide text-sm text-bone-100">{title}</span>
            {badge && (
              <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${styles.badge}`}>
                {badge}
              </span>
            )}
          </span>
          {description && <span className="mt-1 block text-xs leading-relaxed text-bone-500">{description}</span>}
        </span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-bone-500 transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="border-t border-white/[0.08] px-4 py-4 sm:px-5">{children}</div>
    </details>
  )
}
