BEGIN;

TRUNCATE
  "goals",
  "rewards",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Goat Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "goals" ("id", "user_id", "title", "description", "points", "end_date", "complete", "archive")
VALUES
  (
    1, 
    1,
    'make my bed', 
    'I will make my bed every morning before leaving for work', 
    3,
    null,
    null,
    null
  );

COMMIT;
