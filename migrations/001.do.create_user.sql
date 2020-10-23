CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "points" SMALLINT DEFAULT 0,
  "point_goal" SMALLINT DEFAULT 100
);