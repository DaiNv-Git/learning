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
INSERT INTO courses (title, description, created_by, created_at) VALUES ('TypeScript Cơ Bản', 'Hiểu rõ về Types, Interfaces và Generics trong TS', 1, CURRENT_TIMESTAMP());
INSERT INTO courses (title, description, created_by, created_at) VALUES ('Docker & Kubernetes', 'Triển khai ứng dụng với Container và K8s', 1, CURRENT_TIMESTAMP());
INSERT INTO courses (title, description, created_by, created_at) VALUES ('UI/UX Design for Devs', 'Nắm bắt các quy tắc thiết kế giao diện hiện đại', 1, CURRENT_TIMESTAMP());
INSERT INTO courses (title, description, created_by, created_at) VALUES ('English for IT', 'Từ vựng và kỹ năng giao tiếp tiếng Anh chuyên ngành CNTT', 1, CURRENT_TIMESTAMP());

-- Flashcard Decks
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (1, 'Java OOP Basics', 'Object Oriented Programming in Java', CURRENT_TIMESTAMP());
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (2, 'React Hooks', 'Mastering useState, useEffect, etc.', CURRENT_TIMESTAMP());
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (3, 'Spring Boot Core', 'Kiến trúc và các annotation cốt lõi của Spring Boot', CURRENT_TIMESTAMP());
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (4, 'SQL Fundamentals', 'Cơ bản về truy vấn SQL', CURRENT_TIMESTAMP());
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (5, 'TypeScript Types', 'Tìm hiểu về hệ thống kiểu dữ liệu trong TS', CURRENT_TIMESTAMP());
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (6, 'Docker CLI Basics', 'Các lệnh cơ bản để làm việc với Docker Container', CURRENT_TIMESTAMP());
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (7, 'Color Theory & Typography', 'Lý thuyết màu sắc và chữ viết trong UI', CURRENT_TIMESTAMP());
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (8, 'IT Vocabulary', 'Từ vựng tiếng Anh giao tiếp IT', CURRENT_TIMESTAMP());

-- Flashcards
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (1, 'What is Encapsulation?', 'Hiding data implementation by restricting access to public methods.', 'MEDIUM', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (1, 'What is Inheritance?', 'A mechanism where one class acquires the properties of another.', 'EASY', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (1, 'What is Polymorphism?', 'The ability of a variable, function or object to take on multiple forms.', 'HARD', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (1, 'What is a Constructor?', 'A special method used to initialize objects.', 'EASY', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (1, 'What is an Interface?', 'An abstract type used to specify a behavior that classes must implement.', 'MEDIUM', CURRENT_TIMESTAMP());

INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (2, 'What does useState do?', 'Declares a state variable that you can update directly.', 'EASY', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (2, 'What is useEffect for?', 'Performing side effects in function components.', 'MEDIUM', CURRENT_TIMESTAMP());

INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (3, '@RestController là gì?', 'Kết hợp của @Controller và @ResponseBody, dùng để xây dựng REST APIs.', 'MEDIUM', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (3, 'Dependency Injection là gì?', 'Một kỹ thuật thiết kế phần mềm giúp loại bỏ sự phụ thuộc cứng giữa các class.', 'HARD', CURRENT_TIMESTAMP());

INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (4, 'Lệnh SELECT dùng để làm gì?', 'Truy xuất dữ liệu từ một hoặc nhiều bảng trong cơ sở dữ liệu.', 'EASY', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (4, 'Sự khác biệt giữa INNER JOIN và LEFT JOIN?', 'INNER JOIN chỉ lấy dòng có điểm chung. LEFT JOIN lấy toàn bộ dòng bảng bên trái, cộng thêm phần chung với bên phải.', 'MEDIUM', CURRENT_TIMESTAMP());

INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (5, 'TypeScript là gì?', 'Là một superset của JavaScript, bổ sung thêm hệ thống kiểu dữ liệu tĩnh.', 'EASY', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (5, 'Interface vs Type trong TS?', 'Interface dùng để định nghĩa object shape và có thể declaration merging. Type linh hoạt hơn, có thể dùng cho Union, Intersection, Primitives.', 'HARD', CURRENT_TIMESTAMP());

INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (6, 'Lệnh docker ps làm gì?', 'Liệt kê các container đang chạy trên hệ thống.', 'EASY', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (6, 'Docker Image là gì?', 'Là một template read-only chứa các instructions để tạo Docker container.', 'MEDIUM', CURRENT_TIMESTAMP());

INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (7, 'Quy tắc 60-30-10 trong màu sắc là gì?', '60% màu chủ đạo, 30% màu phụ, 10% màu nhấn (accent color).', 'MEDIUM', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (7, 'White space (Khoảng trắng) có tác dụng gì?', 'Tạo sự thoáng đãng, giúp nhóm hoặc tách biệt nội dung, điều hướng sự chú ý.', 'EASY', CURRENT_TIMESTAMP());

INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (8, 'Deploy nghĩa là gì?', 'Triển khai mã nguồn từ môi trường phát triển (dev) lên môi trường thực tế (production).', 'EASY', CURRENT_TIMESTAMP());
INSERT INTO flashcards (deck_id, front_text, back_text, difficulty_level, created_at) VALUES (8, 'Bug và Debug?', 'Bug là lỗi phần mềm. Debug là quá trình tìm và sửa lỗi đó.', 'EASY', CURRENT_TIMESTAMP());

-- Quizzes
INSERT INTO quizzes (course_id, title, time_limit_minutes, created_at) VALUES (1, 'Java Quick Test', 15, CURRENT_TIMESTAMP());

-- Questions (No created_at in model)
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (1, 'Which keyword is used for inheritance in Java?', 'extends', 'implements', 'inherit', 'super', 'A');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (1, 'What is the size of an int in Java?', '16 bit', '32 bit', '64 bit', 'depends on OS', 'B');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (1, 'Which component executes Java bytecodes?', 'JDK', 'JRE', 'JVM', 'JIT', 'C');

INSERT INTO quizzes (course_id, title, time_limit_minutes, created_at) VALUES (2, 'React Hooks Test', 10, CURRENT_TIMESTAMP());
INSERT INTO quizzes (course_id, title, time_limit_minutes, created_at) VALUES (3, 'Spring Boot Basics', 20, CURRENT_TIMESTAMP());
INSERT INTO quizzes (course_id, title, time_limit_minutes, created_at) VALUES (4, 'SQL Queries Mastery', 15, CURRENT_TIMESTAMP());
INSERT INTO quizzes (course_id, title, time_limit_minutes, created_at) VALUES (5, 'TypeScript Knowledge', 10, CURRENT_TIMESTAMP());
INSERT INTO quizzes (course_id, title, time_limit_minutes, created_at) VALUES (6, 'Docker CLI Quiz', 15, CURRENT_TIMESTAMP());
INSERT INTO quizzes (course_id, title, time_limit_minutes, created_at) VALUES (7, 'UI/UX Fundamentals', 20, CURRENT_TIMESTAMP());
INSERT INTO quizzes (course_id, title, time_limit_minutes, created_at) VALUES (8, 'IT Vocabulary Quiz', 10, CURRENT_TIMESTAMP());

-- Course 2: React Hooks Test (quiz_id = 2)
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (2, 'Which hook is used for side effects?', 'useState', 'useEffect', 'useMemo', 'useRef', 'B');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (2, 'What does useState return?', 'An object', 'A boolean', 'An array with two elements', 'A function', 'C');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (2, 'Can you use hooks inside a class component?', 'Yes', 'No', 'Sometimes', 'With a wrapper', 'B');

-- Course 3: Spring Boot Basics (quiz_id = 3)
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (3, 'What is the default port of Spring Boot?', '80', '8080', '443', '3000', 'B');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (3, 'Which annotation marks a Spring Boot application?', '@SpringBootApp', '@Application', '@SpringBootApplication', '@EnableSpring', 'C');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (3, 'What is used for dependency injection?', '@Inject', '@Autowired', '@Resource', 'All of the above', 'D');

-- Course 4: SQL Queries Mastery (quiz_id = 4)
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (4, 'Which clause is used to filter records?', 'ORDER BY', 'GROUP BY', 'WHERE', 'HAVING', 'C');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (4, 'How to sort results descending?', 'DESC', 'ASC', 'DOWN', 'SORT_DESC', 'A');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (4, 'Which function returns the total number of rows?', 'SUM()', 'AVG()', 'COUNT()', 'MAX()', 'C');

-- Course 5: TypeScript Knowledge (quiz_id = 5)
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (5, 'Which extension is used for React with TypeScript?', '.ts', '.jsx', '.tsx', '.tx', 'C');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (5, 'How to declare an optional property in an interface?', 'prop: type?', 'prop?: type', 'prop?: type?', 'optional prop: type', 'B');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (5, 'What is the "any" type?', 'A specific type', 'Disables type checking', 'A boolean type', 'An error type', 'B');

-- Course 6: Docker CLI Quiz (quiz_id = 6)
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (6, 'How to run a docker container?', 'docker start', 'docker run', 'docker build', 'docker init', 'B');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (6, 'Which command lists all running containers?', 'docker ls', 'docker ps', 'docker status', 'docker list', 'B');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (6, 'How to stop a container?', 'docker kill', 'docker remove', 'docker halt', 'docker stop', 'D');

-- Course 7: UI/UX Fundamentals (quiz_id = 7)
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (7, 'What does UX stand for?', 'User Excellence', 'User Experience', 'User Extension', 'User Execution', 'B');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (7, 'Which tool is commonly used for UI design?', 'Photoshop', 'Figma', 'Word', 'Excel', 'B');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (7, 'What is a wireframe?', 'A colorful mockup', 'A working prototype', 'A low-fidelity structural sketch', 'A database schema', 'C');

-- Course 8: IT Vocabulary Quiz (quiz_id = 8)
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (8, 'What does API stand for?', 'Application Programming Interface', 'Apple Programming Interface', 'Application Program Internet', 'Advanced Program Integration', 'A');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (8, 'What is a "Bug"?', 'A feature', 'An insect', 'An error in a program', 'A type of code', 'C');
INSERT INTO questions (quiz_id, question_text, optiona, optionb, optionc, optiond, correct_option) VALUES (8, 'What does "Deploy" mean?', 'To write code', 'To test code', 'To release code to production', 'To delete code', 'C');
