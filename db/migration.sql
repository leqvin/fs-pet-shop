DROP TABLE IF EXISTS pets;




CREATE TABLE pets (
  id SERIAL PRIMARY KEY,
  name TEXT,
  kind TEXT,
  age INTEGER
);
