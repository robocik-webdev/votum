INSERT INTO questions (id, context, possible_answers, open_time, close_time) VALUES
(DEFAULT, 'Czy lubisz pizze?', 1, '2022-04-08 15:00:00.000000', '2022-04-08 15:15:00.000000'),
(DEFAULT, 'Coś zrobił z tą maszynką?!', 2, '2022-04-08 15:00:00.000000', '2022-04-08 15:15:00.000000'),
(DEFAULT, 'Czy warto robić?', 1, '2022-04-08 15:00:00.000000', '2022-04-08 15:15:00.000000'),
(DEFAULT, 'Jaki jest sens istnienia?', 3, '2022-04-08 15:00:00.000000', '2022-04-08 15:15:00.000000');
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
INSERT INTO users (name, surname, email, token, admin) VALUES
('Mikołaj', 'Kaźmierczak', '2137@doktor.pwr.edu.pl', 'WADOWICE', true),
('Kamil', 'Czop', '42069@student.pwr.edu.pl', 'W4D0W1C3', false);