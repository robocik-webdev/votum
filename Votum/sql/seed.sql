DELETE FROM answered_questions;
DELETE FROM users_has_questions;
DELETE FROM users;
DELETE FROM answers;
DELETE FROM questions;

INSERT INTO questions (id, title, possible_answers, open_time, close_time, show_answers) VALUES
(1, 'Czy lubisz pizze?', 1, NOW() + '1 minute'::interval, NOW() + '10 minute'::interval, TRUE),
(2, 'Coś zrobił z tą maszynką?!', 2, NOW() + '5 hour'::interval, NOW() + '10 hour'::interval, FALSE),
(3, 'Czy warto robić?', 1, '2022-04-08 15:00:00.000000', '2022-04-08 15:15:00.000000', TRUE),
(4, 'Jaki jest sens istnienia?', 3, '2022-04-08 15:00:00.000000', '2022-04-08 15:15:00.000000', FALSE),
(5, 'Czy jesteś zmotywowany?', 1, NOW() + '1 minute'::interval, NOW() + '10 minute'::interval, TRUE);
SELECT setval('questions_id_seq', 5);

INSERT INTO answers (id, title, questions_id)
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
        (13, 'Nie mam zdania', 4),
        (14, 'Tak', 1),
        (15, 'Nie', 1),
        (16, 'Nie mam zdania', 1);
SELECT setval('answers_id_seq', 13);

INSERT INTO users (id, name, surname, email, token, right_to_vote, admin) VALUES
(1, 'Mikołaj', 'Kaźmierczak', '2137@doktor.pwr.edu.pl', 'admin1', true, true),
(2, 'Kamil', 'Czop', '42069@student.pwr.edu.pl', 'user1', true, false),
(3, 'Jakub', 'Borowiec', '1235@student.pwr.edu.pl', 'user2', true, false),
(4, 'Piotr', 'Przybyla', '11528@cos.pl', 'user3', true, false),
(5, 'Student', 'Piwo', '12345@cos.pl', 'user4', false, false);
SELECT setval('users_id_seq', 5);