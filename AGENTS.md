# AGENTS.md

This document provides an overview of the project structure for developers and AI agents working on this codebase.

## Project Overview

Gym Tracker — a single app for logging workout sessions, defining reusable routines, and keeping nutrition recipes. Built with TanStack Start and deployed on Netlify.

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
│   ├── server
│   │   ├── routines.functions.ts  # Server functions: list/create/delete routines and their exercises
│   │   ├── workouts.functions.ts  # Server functions: list/create/delete workout sessions and their exercises
│   │   └── recipes.functions.ts   # Server functions: list/create/delete nutrition recipes
│   ├── routes
│   │   ├── __root.tsx    # Root layout: header nav (Overview, Workouts, Routines, Nutrition)
│   │   ├── index.tsx     # Overview page with counts and links to each section
│   │   ├── workouts.tsx  # Log and browse workout sessions (can prefill from a routine)
│   │   ├── routines.tsx  # Create and browse reusable exercise routines
│   │   └── nutrition.tsx # Create and browse nutrition recipes
│   └── styles.css
├── netlify.toml
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Data Model

- `routines` → `routine_exercises` (name, sets, reps, position) — a reusable exercise plan.
- `workouts` → `workout_exercises` (name, sets, reps, weight) — an actual logged session, optionally linked to a routine.
- `recipes` — standalone nutrition recipes with ingredients, instructions, calories, protein.

## Key Concepts

### File-Based Routing (TanStack Router)

Routes are defined by files in `src/routes/`. Each page route loads its data via a `loader` that calls server functions (never the database directly — loaders run isomorphically).

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
pnpm dev      # Start dev server
pnpm build    # Production build
```

## Conventions

- Components: PascalCase
- Routes: kebab-case files, one per top-level section
- Server function files end in `.functions.ts`; anything imported only by them stays server-only
- Tailwind utility classes for styling, no separate CSS files per component
- Zod for input validation on server functions
