# GymTibTracker

A family space for workout sessions, reusable routines, and nutrition recipes. Choose **Tibor** or **Janka** on entry, then open a minimal three-section overview for that person.

## Features

- **Family plans** — choose Tibor or Janka at `/`. Each has their own overview at `/plans/tibor` or `/plans/janka`, with Workouts, Routines and Nutrition. The header profile button returns to the chooser.
- **Separate logs** — saved sessions, routines and recipes are scoped to a family member. Existing entries remain Tibor’s. Janka starts with the same training/nutrition template, clearly labelled until her plan is personalised in a later update.
- **Minimal overview** — three simple section cards, no count-heavy dashboard, and a brighter bundled outdoor-training background (AI-generated).
- **Workout sessions** — log a session's date, optional routine, and the exercises actually performed (sets, reps, weight). After every workout you choose to **save it as a draft** or **confirm it** ("I did this training") so it gets logged; drafts can be confirmed later from the session list.
- **Routines** — define reusable exercise plans that can be applied to a new session with one click.
- **Exercise video guides** — open a Shorts-focused YouTube search for each movement in the training plan, routines, workout logs and Olympic lifting session.
- **Nutrition recipes** — keep the recipes you cook to support training, with ingredients, instructions, calories and protein.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React) for routing, server functions and SSR
- Tailwind CSS for styling
- [Netlify Database](https://docs.netlify.com/database/overview/) (managed Postgres) via Drizzle ORM for persistence

## Running locally

```bash
pnpm install
pnpm dev
```

The app starts on `http://localhost:3000`. The dev script applies migrations to the local Netlify Database emulator in `.netlify/db` before starting Vite. Production data uses the Netlify Database attached to the deployed site.

## Checks

```bash
pnpm typecheck
pnpm build
pnpm exec playwright install chromium  # One-time browser setup
pnpm test
```

Browser tests cover profile selection, both three-section overviews, mobile navigation, legacy links, separate logs and mutations, and preservation of existing records by the migration. Tests start the app automatically if it is not already running, and clean up only the entries they create.

## Database

The schema lives in `db/schema.ts`. Any schema change requires a new migration:

```bash
npx drizzle-kit generate --name <description>
```

Migrations are applied automatically by Netlify on deploy.

## Family profiles

The family-member registry lives in `src/lib/members.ts`; the chooser and server-side input validation use the same registry. All member routes inherit the validated member context from `src/routes/plans.$member.tsx`. Old `/workouts`, `/routines`, `/nutrition` and Olympic lifting URLs redirect to Tibor’s corresponding pages.

Profile selection is not authentication: both plans are accessible to anyone using this app.
