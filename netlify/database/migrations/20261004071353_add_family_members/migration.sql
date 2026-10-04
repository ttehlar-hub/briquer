ALTER TABLE "recipes" ADD COLUMN "member_id" text DEFAULT 'tibor' NOT NULL;--> statement-breakpoint
ALTER TABLE "routines" ADD COLUMN "member_id" text DEFAULT 'tibor' NOT NULL;--> statement-breakpoint
ALTER TABLE "workouts" ADD COLUMN "member_id" text DEFAULT 'tibor' NOT NULL;--> statement-breakpoint
CREATE INDEX "recipes_member_id_idx" ON "recipes" ("member_id");--> statement-breakpoint
CREATE INDEX "routines_member_id_idx" ON "routines" ("member_id");--> statement-breakpoint
CREATE INDEX "workouts_member_id_idx" ON "workouts" ("member_id");