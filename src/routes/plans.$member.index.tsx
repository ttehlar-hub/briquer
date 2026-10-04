import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { planSections } from '../lib/plan-sections'

export const Route = createFileRoute('/plans/$member/')({
  component: PlanOverview,
})

function PlanOverview() {
  const { member } = Route.useRouteContext()

  return (
    <div className="welcome-shell plan-overview">
      <section aria-labelledby="plan-title">
        <p className="welcome-kicker">Your everyday essentials</p>
        <h1 id="plan-title" className="welcome-title plan-title">
          Your plan, <span className="text-[#52725b]">{member.name}.</span>
        </h1>
        <p className="welcome-description">A little structure. More room for progress.</p>
      </section>

      <nav className="plan-section-grid" aria-label={`${member.name}’s three plan sections`}>
        {planSections.map((section) => (
          <Link
            key={section.to}
            to={section.to}
            params={{ member: member.id }}
            className="plan-section-card group"
          >
            <div className="flex items-center justify-between">
              <span className="plan-section-icon" aria-hidden="true">
                <section.icon className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <span className="text-xs font-medium tracking-wider text-[#8b9684]" aria-hidden="true">{section.number}</span>
            </div>
            <h2 className="mt-8 text-2xl font-semibold tracking-tight">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6b796a]">{section.description}</p>
            <div className="mt-9 flex items-center justify-between text-sm font-semibold text-[#52725b]">
              <span>{section.action}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </nav>

      <p className="plan-footnote">
        {member.id === 'janka'
          ? 'Your own log, with the same starting setup. We’ll make it yours as you go.'
          : 'Small steps. Stronger days. All at your own pace.'}
      </p>
    </div>
  )
}
