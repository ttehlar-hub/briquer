# Gym Tracker

A single place to track everything about the gym: workout sessions, reusable routines, and nutrition recipes.

## Features

- **Workout sessions** — log a session's date, optional routine, and the exercises actually performed (sets, reps, weight).
- **Routines** — define reusable exercise plans that can be applied to a new session with one click.
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

The app starts on `http://localhost:3000`. Data is stored in the Netlify Database attached to this site; it is provisioned automatically on first connection.

## Database

The schema lives in `db/schema.ts`. Any schema change requires a new migration:

```bash
npx drizzle-kit generate --name <description>
```

Migrations are applied automatically by Netlify on deploy.
