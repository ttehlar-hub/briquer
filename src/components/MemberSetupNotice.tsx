import { Info } from 'lucide-react'
import type { FamilyMember } from '../lib/members'

export function MemberSetupNotice({ member }: { member: FamilyMember }) {
  if (member.id === 'tibor') return null

  return (
    <p className="mt-5 flex items-start gap-2 rounded-xl border border-volt-400/20 bg-ink-900/85 px-4 py-3 text-sm text-bone-300">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-volt-400" aria-hidden="true" />
      <span>
        {member.name}’s starter setup now includes a separate 3-day full-body workout plan with
        YouTube form searches. Nutrition still uses Tibor’s starter template for now; saved entries
        stay separate.
      </span>
    </p>
  )
}
