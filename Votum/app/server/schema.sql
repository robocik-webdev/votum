DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE users(
    id SERIAL PRIMARY KEY ,
    username VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL
);

CREATE TABLE questions(
    id SERIAL PRIMARY KEY ,
    context VARCHAR(200) NOT NULL,
    possible_answers INTEGER NOT NULL
);

CREATE TABLE answers(
    id SERIAL PRIMARY KEY ,
    context VARCHAR(200) NOT NULL,
    questions_id INTEGER REFERENCES questions(id)
);

CREATE TABLE users_has_questions(
    id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(id),
    questions_id INTEGER REFERENCES questions(id)
);

CREATE TABLE answered_questions(
    id SERIAL PRIMARY KEY,
    questions_id INTEGER REFERENCES questions(id),
    answers_id INTEGER REFERENCES answers(id)
);
