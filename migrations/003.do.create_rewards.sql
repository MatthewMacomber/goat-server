CREATE TABLE "rewards" (
  "id" SERIAL PRIMARY KEY,
  "reward" TEXT NOT NULL,
  "description" TEXT,
  "point_value" SMALLINT DEFAULT 1,
  "goal_id" INTEGER REFERENCES "goals"(id)
    ON DELETE CASCADE NOT NULL,
);

ALTER TABLE "goals"
  ADD COLUMN "id" INTEGER REFERENCES "rewards"(goal_id)
    ON DELETE SET NULL;