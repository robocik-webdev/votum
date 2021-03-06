DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

SET timezone TO 'Europe/Warsaw';

CREATE TABLE users(
    id SERIAL PRIMARY KEY ,
    username VARCHAR(200) NOT NULL UNIQUE,
    token VARCHAR(200) NOT NULL UNIQUE
);

CREATE TABLE questions(
    id SERIAL PRIMARY KEY ,
    context VARCHAR(200) NOT NULL,
    possible_answers INTEGER NOT NULL,
    open_time TIMESTAMP NOT NULL,
    close_time TIMESTAMP NOT NULL
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
