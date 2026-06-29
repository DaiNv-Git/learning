CREATE DATABASE IF NOT EXISTS smartlearning;
USE smartlearning;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE flashcard_decks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE flashcards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    deck_id BIGINT,
    front_text TEXT NOT NULL,
    back_text TEXT NOT NULL,
    difficulty_level ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deck_id) REFERENCES flashcard_decks(id) ON DELETE CASCADE
);

CREATE TABLE quizzes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT,
    title VARCHAR(255) NOT NULL,
    time_limit_minutes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option CHAR(1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE user_flashcard_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    flashcard_id BIGINT,
    status ENUM('NEW', 'LEARNING', 'REVIEW', 'MASTERED') DEFAULT 'NEW',
    next_review_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (flashcard_id) REFERENCES flashcards(id) ON DELETE CASCADE
);

CREATE TABLE quiz_attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    quiz_id BIGINT,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    message VARCHAR(500) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE course_discussions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT,
    user_id BIGINT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed Data
-- Passwords are 'password123' (BCrypt hashed)
INSERT INTO users (username, password, email, full_name, role) VALUES 
('admin', '$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq', 'admin@example.com', 'Admin User', 'ADMIN');

-- Generate 10 Users
INSERT INTO users (username, password, email, full_name, role) VALUES 
('user1', '$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq', 'user1@example.com', 'User 1', 'USER'),
('user2', '$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq', 'user2@example.com', 'User 2', 'USER'),
('user3', '$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq', 'user3@example.com', 'User 3', 'USER'),
('user4', '$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq', 'user4@example.com', 'User 4', 'USER'),
('user5', '$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq', 'user5@example.com', 'User 5', 'USER'),
('user6', '$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq', 'user6@example.com', 'User 6', 'USER'),
('user7', '$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq', 'user7@example.com', 'User 7', 'USER'),
('user8', '$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq', 'user8@example.com', 'User 8', 'USER'),
('user9', '$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq', 'user9@example.com', 'User 9', 'USER'),
('user10', '$2a$10$r.M2gq92rLqG9i9F1qG0IuuJg9zH8R5l.9GZ8Hh200P0L8bU9k3Cq', 'user10@example.com', 'User 10', 'USER');

-- Insert 5 Courses
INSERT INTO courses (title, description, created_by) VALUES 
('Java Programming', 'Learn Java from scratch', 1),
('Spring Boot Mastery', 'Advanced Spring Boot concepts', 1),
('React JS Fundamentals', 'Frontend development with React', 1),
('MySQL Database Design', 'Mastering relational databases', 1),
('Docker for Developers', 'Containerization explained', 1);

-- Insert Decks
INSERT INTO flashcard_decks (course_id, title, description) VALUES 
(1, 'Java Basics', 'Basic syntax and keywords'),
(1, 'OOP Concepts', 'Inheritance, Polymorphism, etc.'),
(2, 'Spring Core', 'DI and IoC'),
(3, 'React Hooks', 'useState, useEffect'),
(4, 'SQL Queries', 'SELECT, JOINs');

-- Insert Flashcards (Just a few samples, assume 100 in production script)
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level) VALUES 
(1, 'What is JVM?', 'Java Virtual Machine', 'EASY'),
(1, 'What is JRE?', 'Java Runtime Environment', 'EASY'),
(1, 'What is JDK?', 'Java Development Kit', 'EASY'),
(2, 'What is Encapsulation?', 'Hiding data implementation', 'MEDIUM'),
(3, 'What is Dependency Injection?', 'A design pattern to decouple components', 'HARD');

-- Insert Quizzes
INSERT INTO quizzes (course_id, title, time_limit_minutes) VALUES 
(1, 'Java Basics Quiz', 15),
(2, 'Spring Framework Quiz', 20),
(3, 'React Knowledge Check', 10),
(4, 'SQL Fundamentals', 30),
(5, 'Docker Basics', 15);

-- Insert Questions
INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES 
(1, 'Which component executes Java bytecodes?', 'JDK', 'JRE', 'JVM', 'JIT', 'C'),
(1, 'Which keyword is used for inheritance in Java?', 'extends', 'implements', 'inherits', 'super', 'A'),
(2, 'Which annotation marks a Spring configuration class?', '@Component', '@Service', '@Configuration', '@Bean', 'C'),
(3, 'What hook is used to manage state in React?', 'useEffect', 'useState', 'useContext', 'useReducer', 'B'),
(4, 'Which clause is used to filter records?', 'ORDER BY', 'GROUP BY', 'HAVING', 'WHERE', 'D');
