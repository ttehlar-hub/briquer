import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { familyMembers } from '../lib/members'
import { planSections } from '../lib/plan-sections'

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'Choose your plan | GymTibTracker' }] }),
  component: Home,
})

function Home() {
  return (
    <div className="welcome-shell">
      <section className="welcome-intro" aria-labelledby="welcome-title">
        <p className="welcome-kicker">A little progress, every day</p>
        <h1 id="welcome-title" className="welcome-title">
          Stronger,<br />
          <span className="text-[#52725b]">together.</span>
        </h1>
        <p className="welcome-description">
          Your workouts, your routines, your nutrition.<br className="hidden sm:block" />
          One space. A plan for each of you.
        </p>

        <div className="profile-chooser">
          <h2 className="text-sm font-semibold text-[#34483b]">Who’s training today?</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {familyMembers.map((member) => (
              <Link
                key={member.id}
                to="/plans/$member"
                params={{ member: member.id }}
                className="profile-card group"
                aria-label={`Open ${member.name}’s plan`}
              >
                <span className={`member-avatar member-avatar-${member.tone}`} aria-hidden="true">
                  {member.initial}
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-semibold leading-tight">{member.name}</span>
                  <span className="mt-1 block text-xs text-[#6a796a]">My plan</span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#667c66] transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#73806e]">Your own plan. Your own progress.</p>
        </div>
      </section>

      <section className="essentials-strip" aria-label="Three essentials in every plan">
        {planSections.map((section) => (
          <div key={section.title} className="flex items-start gap-3 sm:gap-4">
            <span className="essential-icon" aria-hidden="true">
              <section.icon className="h-5 w-5" strokeWidth={1.7} />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-semibold">{section.title}</h2>
              <p className="mt-1 hidden sm:block text-sm text-[#6b796a]">{section.description}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
