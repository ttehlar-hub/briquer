import { createFileRoute, Link } from '@tanstack/react-router'
import { Flame, ShieldAlert, Calendar, Activity, ClipboardList, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/workouts_/olympic-lifting')({
  component: OlympicLiftingPage,
})

const weeklySchedule = [
  { day: 'Day 1', session: 'Push (Heavy)' },
  { day: 'Day 2', session: 'Pull (Heavy)' },
  { day: 'Day 3', session: 'Legs (Heavy)' },
  { day: 'Day 4', session: 'Push (Hypertrophy)' },
  { day: 'Day 5', session: 'Pull (Hypertrophy)' },
  { day: 'Day 6', session: 'Olympic Lifting — Full Body' },
  { day: 'Day 7', session: 'REST' },
]

const beginnerRules = [
  {
    title: 'No heavy loading',
    detail: 'Technique first, weight comes months later',
  },
  {
    title: 'Sets of 3 reps',
    detail: 'You said no 1-2 reps — 3 is perfect and is actually the gold standard for Oly training',
  },
  {
    title: 'Starting weights',
    detail: 'Use 40-60% of your back squat as a reference for cleans, and 30-45% for snatch',
  },
  {
    title: 'Ugly bar path = too heavy',
    detail: 'Drop it. No ego',
  },
  {
    title: 'Every rep controlled',
    detail: 'Not like a fight for your life',
  },
]

const blocks = [
  {
    id: 'block-0',
    title: 'Block 0 — Mobility Warm-up',
    duration: '15 min, DO NOT SKIP',
    durationTone: 'red' as const,
    note: 'Non-negotiable for Olympic lifting. Shoulders, thoracic spine, hips, and ankles need to be ready or you will get hurt.',
    columns: ['Exercise', 'Duration'],
    rows: [
      ['Foam roll: upper back, lats, quads, TFL', '3 min'],
      ['PVC Pipe Pass-Throughs (wide → narrow grip)', '2 × 15'],
      ['PVC Overhead Squat (slow, pause at bottom)', '2 × 10'],
      ['Spiderman Lunge + Thoracic Rotation', '2 × 8/side'],
      ['Deep Squat Hold (hold onto rack, chest up)', '2 × 30 sec'],
      ['Wrist Circles + Prayer Stretch', '1 min'],
      ['Ankle Dorsiflexion Stretch (knee-to-wall)', '2 × 10/side'],
      ['Empty Barbell: Good Mornings', '1 × 10'],
      ['Empty Barbell: Romanian Deadlift', '1 × 10'],
    ],
  },
  {
    id: 'block-1',
    title: 'Block 1 — Snatch Progression',
    duration: '20 min',
    durationTone: 'emerald' as const,
    note: 'Start with empty barbell (20kg). Yes, really. Add weight only when every rep looks clean.',
    columns: ['Exercise', 'Sets × Reps', 'Notes'],
    rows: [
      ['Snatch Grip Deadlift (slow, pause at knee)', '3 × 5', 'Learn the first pull. Chest up, back flat'],
      ['Snatch High Pull from Hang (above knee)', '4 × 3', 'Explosive shrug. Bar to chest height. No catch'],
      ['Muscle Snatch (no squat, press it overhead)', '4 × 3', 'Teaches turnover. Stay tall, elbows high'],
      ['Power Snatch from Hang (catch in ¼ squat)', '4 × 3', 'First real snatch variation. Light weight!'],
      ['Overhead Squat (snatch grip, pause 2s at bottom)', '3 × 5', 'Stability work. This will humble you'],
    ],
  },
  {
    id: 'block-2',
    title: 'Block 2 — Clean & Jerk Progression',
    duration: '20 min',
    durationTone: 'emerald' as const,
    note: null,
    columns: ['Exercise', 'Sets × Reps', 'Notes'],
    rows: [
      ['Clean Grip Deadlift (pause at knee)', '3 × 5', 'Same concept as snatch pull but narrower grip'],
      ['Clean High Pull from Hang', '4 × 3', 'Explosive. Bar to chin height'],
      ['Muscle Clean (no squat, rack on shoulders)', '4 × 3', 'Teaches the turnover and rack position'],
      ['Power Clean from Hang (catch in ¼ squat)', '4 × 3', 'First real clean. Focus on fast elbows'],
      ['Push Press (from front rack)', '4 × 3', 'Dip-drive-press. Learn the jerk timing'],
      ['Split Jerk from Rack (light!)', '4 × 3', 'Focus on footwork: front foot forward, back foot back'],
    ],
  },
  {
    id: 'block-3',
    title: 'Block 3 — Full Movement Combinations',
    duration: '10 min',
    durationTone: 'emerald' as const,
    note: "Only attempt this block once you're comfortable with Block 1 & 2 individually (probably Week 4+).",
    columns: ['Exercise', 'Sets × Reps', 'Notes'],
    rows: [
      ['Hang Power Snatch + Overhead Squat', '3 × 3', 'Snatch it, then squat it. Full chain'],
      ['Hang Power Clean + Push Press', '3 × 3', 'Clean it, then jerk it. Full chain'],
    ],
  },
  {
    id: 'block-4',
    title: 'Block 4 — Strength Accessory',
    duration: '10 min',
    durationTone: 'emerald' as const,
    note: 'Uses your preferred 5-rep range and builds the strength foundation for heavier Oly lifts later.',
    columns: ['Exercise', 'Sets × Reps', 'Notes'],
    rows: [
      ['Front Squat', '4 × 5', 'This is THE squat for Olympic lifting. Elbows high'],
      ['Back Rack Lunge (barbell on back)', '3 × 8/leg', 'Stability + leg strength'],
    ],
  },
  {
    id: 'block-5',
    title: 'Block 5 — Core',
    duration: '5 min',
    durationTone: 'emerald' as const,
    note: null,
    columns: ['Exercise', 'Sets × Reps'],
    rows: [
      ['Pallof Press (cable)', '3 × 12/side'],
      ['Dead Bugs', '3 × 10/side'],
    ],
  },
]

const phases = [
  {
    title: 'Phase 1: Foundation (Weeks 1-4)',
    points: [
      'All lifts from the HANG position (above the knee)',
      'Empty bar to 40kg max for snatch, 50-60kg max for clean',
      'Focus: positions, bar path, receiving the bar',
      'Do NOT go to full squat catches yet — power position only',
      'Overhead squat is your #1 priority for mobility',
    ],
  },
  {
    title: 'Phase 2: Floor Intro (Weeks 5-8)',
    points: [
      'Introduce lifts from the floor for the first pull',
      'Alternate: one set from hang, one set from floor',
      'Snatch: up to ~50-55kg | Clean: up to ~70-80kg',
      'Start attempting full squat catches (power position → full squat)',
      'Add tall snatch and tall clean drills (start from standing, drop under bar)',
    ],
  },
  {
    title: 'Phase 3: Full Movements (Weeks 9-12)',
    points: [
      'Full snatch from floor + full squat catch',
      'Full clean & jerk from floor + split jerk',
      'Snatch: up to ~60-70kg | Clean & Jerk: up to ~80-90kg',
      'Introduce complexes: e.g., Clean Pull + Hang Clean + Front Squat (1+2+2)',
      'Start recording your lifts on video to check form',
    ],
  },
  {
    title: 'Phase 4+: Beyond (Month 4+)',
    points: [
      "This is where you'd start periodizing the Oly day with heavier loads",
      "You'd benefit enormously from a few sessions with an Olympic lifting coach at this point — even 3-4 sessions will fix issues you can't see yourself",
    ],
  },
]

const safetyRules = [
  {
    title: 'NEVER max out',
    detail: 'You said no 1-2 reps — perfect. Sets of 3 at moderate weight will build your technique 10x faster than grinding ugly singles.',
  },
  {
    title: 'Bail safely',
    detail: 'Learn to dump the bar forward (snatch) and backward (clean). Practice this with an empty bar first.',
  },
  {
    title: 'Use bumper plates',
    detail: "If your gym has them. They're designed to be dropped.",
  },
  {
    title: 'Use a hook grip',
    detail: "Thumb under fingers for snatch and clean. It feels weird for 2 weeks, then you'll never go back. Use tape on your thumbs if needed.",
  },
  {
    title: 'Watch your lower back',
    detail: 'If it rounds during pulls → STOP. The weight is too heavy or your setup is wrong.',
  },
  {
    title: 'Wrist pain in the front rack?',
    detail: 'Work on lat and tricep mobility daily. Don\'t force it.',
  },
  {
    title: 'No Oly lifts when fatigued',
    detail: "This is why it's Day 6 — your CNS has had lighter days. If you feel wrecked, just do the mobility + overhead squats and call it a day.",
  },
]

function OlympicLiftingPage() {
  return (
    <div className="page-shell">
      <div className="pt-6 sm:pt-10 pb-10">
        <Link
          to="/workouts"
          className="btn-ghost mb-5 px-3.5 py-1.5 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to workouts
        </Link>
        <p className="kicker mb-3">Day 6 · Technique session</p>
        <h1 className="display-title text-4xl sm:text-5xl">
          Olympic Lifting Day
          <span className="block sm:inline text-xl sm:text-2xl text-bone-500 font-sans font-semibold normal-case tracking-normal mt-1 sm:mt-0 sm:ml-3">
            — Full Body Technique Session
          </span>
        </h1>
        <p className="mt-3 text-bone-300">~75 min · technique-first · replaces Day 6</p>
      </div>

      <div className="panel p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="bg-volt-400/10 border border-volt-400/30 text-volt-400 p-2.5 rounded-xl">
            <Calendar className="w-5 h-5" />
          </span>
          <div>
            <h2 className="section-title">Where it fits in your week</h2>
            <p className="text-sm text-bone-500">We replace Day 6 (Legs Hypertrophy) with this Oly day</p>
          </div>
        </div>

        <ul className="list-disc list-inside text-sm text-bone-300 space-y-1.5 mb-6">
          <li>Olympic lifts are extremely leg-dominant (deep squats, explosive pulls, receiving positions)</li>
          <li>Your legs already got destroyed on Day 3 (Heavy Legs)</li>
          <li>The Oly day gives your legs a different stimulus — speed, power, mobility — instead of more grinding reps</li>
          <li>This keeps your recovery intact so you don't burn out</li>
        </ul>

        <h3 className="section-title text-base mb-3">Updated Weekly Schedule</h3>
        <div className="overflow-x-auto rounded-xl">
          <table className="data-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Session</th>
              </tr>
            </thead>
            <tbody>
              {weeklySchedule.map((row) => (
                <tr
                  key={row.day}
                  className={row.day === 'Day 6' ? 'bg-volt-400/10' : ''}
                >
                  <td className="font-semibold text-bone-100 whitespace-nowrap">{row.day}</td>
                  <td className={`whitespace-nowrap ${row.day === 'Day 6' ? 'font-bold text-volt-400' : ''}`}>
                    {row.session}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel border-amber-400/30 bg-amber-950/30 p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="bg-amber-400/10 border border-amber-400/30 text-amber-300 p-2.5 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </span>
          <div>
            <h2 className="section-title text-amber-200">Critical: you are a beginner at Oly lifts</h2>
            <p className="text-sm text-amber-300/80">This changes everything about how we program this day.</p>
          </div>
        </div>
        <ul className="space-y-2">
          {beginnerRules.map((rule) => (
            <li key={rule.title} className="text-sm text-amber-100/90">
              <span className="font-bold">{rule.title}.</span> {rule.detail}
            </li>
          ))}
        </ul>
      </div>

      <div className="panel p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-volt-400/10 border border-volt-400/30 text-volt-400 p-2.5 rounded-xl">
            <ClipboardList className="w-5 h-5" />
          </span>
          <div>
            <h2 className="section-title">The Oly Day Workout</h2>
            <p className="text-sm text-bone-500">~75 minutes, blocks 0 through 5</p>
          </div>
        </div>

        <div className="space-y-8">
          {blocks.map((block) => (
            <div key={block.id}>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="section-title text-base">{block.title}</h3>
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 ${
                    block.durationTone === 'red'
                      ? 'bg-red-400/15 text-red-300 border border-red-400/30'
                      : 'bg-volt-400/15 text-volt-300 border border-volt-400/30'
                  }`}
                >
                  {block.duration}
                </span>
              </div>
              {block.note && <p className="text-sm text-bone-500 mb-3">{block.note}</p>}
              <div className="overflow-x-auto rounded-xl">
                <table className="data-table">
                  <thead>
                    <tr>
                      {block.columns.map((column) => (
                        <th key={column}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, index) => (
                          <td
                            key={index}
                            className={index === 0 ? 'text-bone-100' : 'whitespace-nowrap'}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-volt-400/10 border border-volt-400/30 text-volt-400 p-2.5 rounded-xl">
            <Activity className="w-5 h-5" />
          </span>
          <div>
            <h2 className="section-title">12-Week Beginner Progression Plan</h2>
            <p className="text-sm text-bone-500">How you advance safely over 3 months</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phases.map((phase) => (
            <div key={phase.title} className="tile">
              <h3 className="text-xs font-bold uppercase tracking-wider text-volt-400 mb-2.5">{phase.title}</h3>
              <ul className="list-disc list-inside text-sm text-bone-300 space-y-1.5">
                {phase.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="panel border-red-400/30 bg-red-950/30 p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="bg-red-400/10 border border-red-400/30 text-red-300 p-2.5 rounded-xl">
            <Flame className="w-5 h-5" />
          </span>
          <h2 className="section-title text-red-200">Safety Rules — read these</h2>
        </div>
        <ul className="space-y-3">
          {safetyRules.map((rule) => (
            <li key={rule.title} className="text-sm text-red-100/90">
              <span className="font-bold">{rule.title}.</span> {rule.detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
