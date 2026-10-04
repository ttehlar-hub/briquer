# AGENTS.md

This document provides an overview of the project structure for developers and AI agents working on this codebase.

## Project Overview

GymTibTracker — a family app for logging workout sessions, defining reusable routines, and keeping nutrition recipes. The entry page asks who is training (Tibor or Janka), then opens their three-section plan. Built with TanStack Start and deployed on Netlify.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Icons | lucide-react |
| Database | Netlify Database (Postgres) via Drizzle ORM |
| Language | TypeScript 5.9 (strict mode) |
| Deployment | Netlify |

## Directory Structure

```
├── db
│   ├── schema.ts   # Drizzle table definitions: routines, routine_exercises, workouts, workout_exercises, recipes
│   └── index.ts    # Drizzle client using the Netlify Database adapter
├── drizzle.config.ts  # Drizzle Kit config; migrations output to netlify/database/migrations
├── netlify/database/migrations  # Generated SQL migrations, applied automatically on deploy
├── src
│   ├── components
│   │   ├── ExerciseVideoLink.tsx # Search links for exercise technique videos
│   │   ├── MemberSetupNotice.tsx # Clearly labels Janka's shared starter template
│   │   └── PlanFolder.tsx # Reusable folder-style collapsible training sections
│   ├── server
│   │   ├── routines.functions.ts  # Server functions: list/create/delete routines and their exercises
│   │   ├── workouts.functions.ts  # Server functions: list/create/delete workout sessions, confirm drafts
│   │   ├── recipes.functions.ts   # Server functions: list/create/delete nutrition recipes
│   │   └── member-input.ts # Server-only Zod validator using the family registry
│   ├── lib
│   │   ├── members.ts # Lightweight shared family registry and types
│   │   └── plan-sections.ts # Shared three-section navigation
│   ├── routes
│   │   ├── __root.tsx    # Profile-aware navigation, light entry/overview and dark feature pages
│   │   ├── index.tsx     # Tibor/Janka chooser; no database dependency
│   │   ├── plans.$member.tsx # Validates profile and provides member context
│   │   ├── plans.$member.index.tsx # Minimal three-section overview
│   │   ├── plans.$member.workouts.tsx # Training plan, logger and profile's workout history
│   │   ├── plans.$member.routines.tsx # Profile's reusable routines
│   │   ├── plans.$member.nutrition.tsx # Meal template and profile's recipes
│   │   └── workouts.tsx / routines.tsx / nutrition.tsx # Legacy redirects to Tibor
│   └── styles.css
├── scripts/dev.mjs # Applies local emulator migrations, then starts Vite
├── tests/family-plans.spec.ts # Browser/RPC regression tests and legacy-data migration test
├── playwright.config.ts
├── netlify.toml
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Data Model

- `routines`, `workouts` and `recipes` have an indexed `memberId` (`member_id` in Postgres), defaulting to `tibor` to preserve legacy records. All server reads/writes require a validated member ID, and mutations filter by both record ID and member ID. Workouts cannot reference another member's routine. Exercise rows inherit ownership through their parent.
- Profiles are a family chooser, **not authentication**.
- `routines` → `routine_exercises` (name, sets, reps, position) — a reusable exercise plan.
- `workouts` (`status`: draft | logged, `loggedAt`) → `workout_exercises` (name, sets, reps, weight) — an actual logged session, optionally linked to a routine. New sessions start as a draft or are confirmed straight away; confirming stamps `loggedAt`.
- `recipes` — standalone nutrition recipes with ingredients, instructions, calories, protein, carbs and fats.

## Key Concepts

### File-Based Routing (TanStack Router)

Routes are defined by files in `src/routes/`. Each data-backed page route loads its data via a `loader` that calls server functions (never the database directly — loaders run isomorphically).

### Server Functions

All database access goes through `createServerFn` wrappers in `src/server/*.functions.ts`, following the TanStack Start server-functions pattern (`.inputValidator` for input, zod schemas for validation).

### Database Changes

Any change to `db/schema.ts` requires a new migration:

```bash
npx drizzle-kit generate --name <description>
```

Without a migration, the schema change will not take effect when deployed.

## Development Commands

```bash
pnpm install
pnpm dev      # Apply local emulator migrations, then start dev server
pnpm build    # Production build (also regenerates route types)
pnpm typecheck
pnpm exec playwright install chromium  # First-time browser setup
pnpm test     # Browser/RPC/migration regressions
```

## Conventions

- Components: PascalCase
- Routes: kebab-case files, one per top-level section
- Server function files end in `.functions.ts`; anything imported only by them stays server-only
- Tailwind utility classes for styling, no separate CSS files per component
- Zod for input validation on server functions
