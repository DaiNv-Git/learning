import re

with open('backend/src/main/resources/data.sql', 'r') as f:
    content = f.read()

# Replace Decks
new_decks = """-- Flashcard Decks
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (1, 'Java OOP Basics', 'Object Oriented Programming in Java', CURRENT_TIMESTAMP());
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (2, 'React Hooks', 'Mastering useState, useEffect, etc.', CURRENT_TIMESTAMP());
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (3, 'Spring Boot Core', 'Kiến trúc và các annotation cốt lõi của Spring Boot', CURRENT_TIMESTAMP());
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (4, 'SQL Fundamentals', 'Cơ bản về truy vấn SQL', CURRENT_TIMESTAMP());
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (5, 'TypeScript Types', 'Tìm hiểu về hệ thống kiểu dữ liệu trong TS', CURRENT_TIMESTAMP());
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (6, 'Docker CLI Basics', 'Các lệnh cơ bản để làm việc với Docker Container', CURRENT_TIMESTAMP());
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (7, 'Color Theory & Typography', 'Lý thuyết màu sắc và chữ viết trong UI', CURRENT_TIMESTAMP());
INSERT INTO flashcard_decks (course_id, title, description, created_at) VALUES (8, 'IT Vocabulary', 'Từ vựng tiếng Anh giao tiếp IT', CURRENT_TIMESTAMP());
"""

content = re.sub(r"-- Flashcard Decks.*?-- Flashcards", new_decks + "\n-- Flashcards", content, flags=re.DOTALL)

# Replace Flashcards
new_flashcards = """-- Flashcards
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
"""

content = re.sub(r"-- Flashcards.*?-- Quizzes", new_flashcards + "\n-- Quizzes", content, flags=re.DOTALL)


with open('backend/src/main/resources/data.sql', 'w') as f:
    f.write(content)

