quizzes = """
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
"""

with open('backend/src/main/resources/data.sql', 'a') as f:
    f.write(quizzes)
