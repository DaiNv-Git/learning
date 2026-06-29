-- Users (password is 'password' hashed)
INSERT INTO users (username, password, email, full_name, role) VALUES ('admin', '$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq', 'admin@test.com', 'Admin User', 'ADMIN');
INSERT INTO users (username, password, email, full_name, role) VALUES ('user1', '$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq', 'user1@test.com', 'Test User', 'USER');
INSERT INTO users (username, password, email, full_name, role) VALUES ('myadmin', '$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq', 'myadmin@test.com', 'My Admin', 'ADMIN');
INSERT INTO users (username, password, email, full_name, role) VALUES ('myuser', '$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq', 'myuser@test.com', 'My User', 'USER');

-- Courses
INSERT INTO courses (title, description, created_by) VALUES ('Java Fundamentals', 'Learn basic Java concepts', 1);
INSERT INTO courses (title, description, created_by) VALUES ('ReactJS Mastery', 'Build modern web applications with React', 1);
INSERT INTO courses (title, description, created_by) VALUES ('Spring Boot Microservices', 'Advanced backend architecture', 1);
INSERT INTO courses (title, description, created_by) VALUES ('Database Design', 'Master SQL and NoSQL database modeling', 1);

-- Flashcard Decks
INSERT INTO flashcard_decks (course_id, title, description) VALUES (1, 'Java OOP Basics', 'Object Oriented Programming in Java');
INSERT INTO flashcard_decks (course_id, title, description) VALUES (2, 'React Hooks', 'Mastering useState, useEffect, etc.');

-- Flashcards
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level) VALUES (1, 'What is Encapsulation?', 'Hiding data implementation by restricting access to public methods.', 'MEDIUM');
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level) VALUES (1, 'What is Inheritance?', 'A mechanism where one class acquires the properties of another.', 'EASY');
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level) VALUES (1, 'What is Polymorphism?', 'The ability of a variable, function or object to take on multiple forms.', 'HARD');
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level) VALUES (1, 'What is a Constructor?', 'A special method used to initialize objects.', 'EASY');
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level) VALUES (1, 'What is an Interface?', 'An abstract type used to specify a behavior that classes must implement.', 'MEDIUM');

INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level) VALUES (2, 'What does useState do?', 'Declares a state variable that you can update directly.', 'EASY');
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level) VALUES (2, 'What is useEffect for?', 'Performing side effects in function components.', 'MEDIUM');

-- Quizzes
INSERT INTO quizzes (course_id, title, time_limit_minutes) VALUES (1, 'Java Quick Test', 15);

-- Questions
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (1, 'Which keyword is used for inheritance in Java?', 'extends', 'implements', 'inherit', 'super', 'A');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (1, 'What is the size of an int in Java?', '16 bit', '32 bit', '64 bit', 'depends on OS', 'B');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (1, 'Which component executes Java bytecodes?', 'JDK', 'JRE', 'JVM', 'JIT', 'C');
