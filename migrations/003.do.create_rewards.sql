CREATE TABLE "rewards" (
  "id" SERIAL PRIMARY KEY,
  "reward" TEXT NOT NULL,
  "description" TEXT,
  "point_value" SMALLINT DEFAULT 1,
  "user_id" INTEGER REFERENCES "user"(id)
    ON DELETE CASCADE NOT NULL
);
