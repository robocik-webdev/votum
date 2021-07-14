INSERT INTO questions (id, context, possible_answers) VALUES (DEFAULT, 'Czy lubisz pizze?', 1);
INSERT INTO questions (id, context, possible_answers) VALUES (DEFAULT, 'Coś zrobił z tą maszynką?!', 2);
INSERT INTO questions (id, context, possible_answers) VALUES (DEFAULT, 'Czy warto robić?', 1);
INSERT INTO questions (id, context, possible_answers) VALUES (DEFAULT, 'Jaki jest sens istnienia?', 3);
INSERT INTO answers (id, context, questions_id)
VALUES  (1, 'Tak', 1),
        (2, 'Nie', 1),
        (3, 'Nie mam zdania', 1),
        (4, 'Ja niiiic!', 2),
        (5, 'Sam zepsułeś!', 2),
        (6, 'Nie mam zdania', 2),
        (7, 'Tak', 3),
        (8, 'Nie', 3),
        (9, 'Nie wiem', 3),
        (10, 'Brak', 4),
        (11, 'Jakiś jest', 4),
        (12, 'Jest', 4),
        (13, 'Nie mam zdania', 4);
