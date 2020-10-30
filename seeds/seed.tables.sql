BEGIN;

TRUNCATE
  "goals",
  "rewards",
  "user";

INSERT INTO "user" ("username", "name", "password")
VALUES
  (
    'admin',
    'Goat Admin',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );-- password = "pass"

INSERT INTO "goals" ("user_id", "title", "description", "points", "end_date", "complete", "archive")
VALUES
  (
    1,
    'make my bed', 
    'I will make my bed every morning before leaving for work', 
    3,
    null,
    null,
    null
  );

COMMIT;
