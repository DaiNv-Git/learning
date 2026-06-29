-- Users (password is 'password' hashed)
INSERT INTO users (username, password, email, full_name, role, created_at) VALUES ('admin', '$2y$05$Y7iAOlmHU.HPYqJSLe/5IuXtjw/QNCDMRJUNvcyPMlSfvsRZmnSge', 'admin@test.com', 'Admin User', 'ADMIN', CURRENT_TIMESTAMP());
INSERT INTO users (username, password, email, full_name, role, created_at) VALUES ('user1', '$2y$05$Y7iAOlmHU.HPYqJSLe/5IuXtjw/QNCDMRJUNvcyPMlSfvsRZmnSge', 'user1@test.com', 'Test User', 'USER', CURRENT_TIMESTAMP());
INSERT INTO users (username, password, email, full_name, role, created_at) VALUES ('myadmin', '$2y$05$Y7iAOlmHU.HPYqJSLe/5IuXtjw/QNCDMRJUNvcyPMlSfvsRZmnSge', 'myadmin@test.com', 'My Admin', 'ADMIN', CURRENT_TIMESTAMP());
INSERT INTO users (username, password, email, full_name, role, created_at) VALUES ('myuser', '$2y$05$Y7iAOlmHU.HPYqJSLe/5IuXtjw/QNCDMRJUNvcyPMlSfvsRZmnSge', 'myuser@test.com', 'My User', 'USER', CURRENT_TIMESTAMP());

-- Courses
INSERT INTO courses (title, description, created_by, created_at) VALUES ('Java Fundamentals', 'Learn basic Java concepts', 1, CURRENT_TIMESTAMP());
INSERT INTO courses (title, description, created_by, created_at) VALUES ('ReactJS Mastery', 'Build modern web applications with React', 1, CURRENT_TIMESTAMP());
INSERT INTO courses (title, description, created_by, created_at) VALUES ('Spring Boot Microservices', 'Advanced backend architecture', 1, CURRENT_TIMESTAMP());
INSERT INTO courses (title, description, created_by, created_at) VALUES ('Database Design', 'Master SQL and NoSQL database modeling', 1, CURRENT_TIMESTAMP());

-- Flashcard Decks
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (1, 'Java OOP Basics', 'Object Oriented Programming in Java', CURRENT_TIMESTAMP());
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (2, 'React Hooks', 'Mastering useState, useEffect, etc.', CURRENT_TIMESTAMP());

-- Flashcards
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (1, 'What is Encapsulation?', 'Hiding data implementation by restricting access to public methods.', 'MEDIUM', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (1, 'What is Inheritance?', 'A mechanism where one class acquires the properties of another.', 'EASY', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (1, 'What is Polymorphism?', 'The ability of a variable, function or object to take on multiple forms.', 'HARD', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (1, 'What is a Constructor?', 'A special method used to initialize objects.', 'EASY', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (1, 'What is an Interface?', 'An abstract type used to specify a behavior that classes must implement.', 'MEDIUM', CURRENT_TIMESTAMP());

INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (2, 'What does useState do?', 'Declares a state variable that you can update directly.', 'EASY', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (2, 'What is useEffect for?', 'Performing side effects in function components.', 'MEDIUM', CURRENT_TIMESTAMP());

-- Quizzes
INSERT INTO quizzes (course_id, title, time_limit_minutes, created_at) VALUES (1, 'Java Quick Test', 15, CURRENT_TIMESTAMP());

-- Questions (No created_at in model)
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (1, 'Which keyword is used for inheritance in Java?', 'extends', 'implements', 'inherit', 'super', 'A');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (1, 'What is the size of an int in Java?', '16 bit', '32 bit', '64 bit', 'depends on OS', 'B');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (1, 'Which component executes Java bytecodes?', 'JDK', 'JRE', 'JVM', 'JIT', 'C');
