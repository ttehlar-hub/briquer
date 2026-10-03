CREATE TYPE "workout_status" AS ENUM('draft', 'logged');--> statement-breakpoint
ALTER TABLE "workouts" ADD COLUMN "status" "workout_status" DEFAULT 'logged'::"workout_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "workouts" ADD COLUMN "logged_at" timestamp;