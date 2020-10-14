CREATE TABLE "goals" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "points" SMALLINT DEFAULT 0,
  "end_date" DATE,
  "complete" BOOLEAN,
  "archive" BOOLEAN,
  "user_id" INTEGER REFERENCES "user"(id)
    ON DELETE CASCADE NOT NULL
);