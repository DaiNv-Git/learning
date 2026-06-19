package com.smartlearning.backend.config;

import com.smartlearning.backend.model.*;
import com.smartlearning.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository users;
    private final CourseRepository courses;
    private final FlashcardDeckRepository decks;
    private final FlashcardRepository flashcards;
    private final QuizRepository quizzes;
    private final QuestionRepository questions;
    private final PasswordEncoder encoder;

    public DataSeeder(UserRepository users, CourseRepository courses, FlashcardDeckRepository decks,
                      FlashcardRepository flashcards, QuizRepository quizzes, QuestionRepository questions,
                      PasswordEncoder encoder) {
        this.users = users;
        this.courses = courses;
        this.decks = decks;
        this.flashcards = flashcards;
        this.quizzes = quizzes;
        this.questions = questions;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (users.count() > 0) {
            return;
        }

        User admin = users.save(new User("admin", encoder.encode("password123"), "admin@example.com", "Admin Base.vn", Role.ADMIN));
        users.save(new User("hoa", encoder.encode("password123"), "hoa@example.com", "Tăng Thị Hoa", Role.USER));
        users.save(new User("student", encoder.encode("password123"), "student@example.com", "Sinh viên Demo", Role.USER));

        Course java = courses.save(new Course("Java Spring Boot", "REST API, Spring Security, JWT và kiến trúc backend theo lớp.", admin));
        Course react = courses.save(new Course("ReactJS TypeScript", "Component, hook, routing, form và gọi API bằng Axios.", admin));
        Course db = courses.save(new Course("MySQL Database", "Thiết kế ERD, quan hệ bảng, truy vấn và tối ưu dữ liệu.", admin));
        Course fullstack = courses.save(new Course("Full-stack Project", "Kết nối front-end, back-end, kiểm thử và triển khai sản phẩm.", admin));

        FlashcardDeck javaDeck = decks.save(new FlashcardDeck(java, "Spring Boot & Security", "Các khái niệm cần nhớ khi xây API bảo mật."));
        FlashcardDeck reactDeck = decks.save(new FlashcardDeck(react, "React Hooks", "Ôn nhanh useState, useEffect, React Router và form."));
        FlashcardDeck dbDeck = decks.save(new FlashcardDeck(db, "Database Design", "Khóa chính, khóa ngoại, chuẩn hóa và truy vấn."));
        FlashcardDeck projectDeck = decks.save(new FlashcardDeck(fullstack, "Project Workflow", "Luồng làm việc trong một dự án full-stack."));

        addCard(javaDeck, "JWT dùng để làm gì?", "JWT giúp xác thực stateless: client gửi token trong header Authorization.", DifficultyLevel.EASY);
        addCard(javaDeck, "BCrypt là gì?", "BCrypt là thuật toán băm mật khẩu có salt, phù hợp để lưu mật khẩu an toàn.", DifficultyLevel.MEDIUM);
        addCard(javaDeck, "Controller trong Spring Boot làm gì?", "Controller nhận HTTP request, validate dữ liệu và gọi service xử lý nghiệp vụ.", DifficultyLevel.EASY);
        addCard(javaDeck, "Repository có vai trò gì?", "Repository thao tác dữ liệu thông qua Spring Data JPA.", DifficultyLevel.EASY);
        addCard(javaDeck, "DTO giúp ích gì?", "DTO tách dữ liệu API khỏi Entity, tránh lộ trường không cần thiết.", DifficultyLevel.MEDIUM);

        addCard(reactDeck, "useState dùng để làm gì?", "useState quản lý state trong functional component.", DifficultyLevel.EASY);
        addCard(reactDeck, "useEffect thường dùng khi nào?", "Dùng cho side effect như gọi API, đồng bộ dữ liệu hoặc lắng nghe thay đổi.", DifficultyLevel.MEDIUM);
        addCard(reactDeck, "React Router giúp gì?", "React Router quản lý điều hướng trang trong SPA.", DifficultyLevel.EASY);
        addCard(reactDeck, "Axios dùng để làm gì?", "Axios gửi HTTP request tới REST API và xử lý response/error.", DifficultyLevel.EASY);

        addCard(dbDeck, "Khóa ngoại là gì?", "Khóa ngoại liên kết bản ghi của bảng này với khóa chính của bảng khác.", DifficultyLevel.EASY);
        addCard(dbDeck, "ERD mô tả điều gì?", "ERD mô tả thực thể, thuộc tính và quan hệ dữ liệu trong hệ thống.", DifficultyLevel.MEDIUM);
        addCard(projectDeck, "Tại sao cần Postman?", "Postman giúp kiểm thử API độc lập trước khi tích hợp với giao diện.", DifficultyLevel.EASY);

        Quiz javaQuiz = quizzes.save(new Quiz(java, "Java Spring Boot Quick Test", 15));
        addQuestion(javaQuiz, "Annotation nào dùng để khai báo REST controller?", "@Service", "@Repository", "@RestController", "@Entity", "C", "@RestController đánh dấu lớp xử lý REST API.");
        addQuestion(javaQuiz, "JWT thường được gửi qua header nào?", "Content-Type", "Authorization", "Accept", "Cache-Control", "B", "Token thường có dạng Authorization: Bearer <token>.");
        addQuestion(javaQuiz, "BCrypt dùng trong chức năng nào?", "Mã hóa mật khẩu", "Vẽ biểu đồ", "Định tuyến React", "Tạo CSS", "A", "BCrypt được dùng để băm mật khẩu trước khi lưu.");
        addQuestion(javaQuiz, "Spring Data JPA hỗ trợ lớp nào?", "Controller", "Repository", "Component CSS", "Route Guard", "B", "Repository là lớp truy xuất dữ liệu.");

        Quiz reactQuiz = quizzes.save(new Quiz(react, "ReactJS Knowledge Check", 12));
        addQuestion(reactQuiz, "Hook nào dùng để quản lý state?", "useEffect", "useState", "useMemo", "useRef", "B", "useState khai báo và cập nhật state.");
        addQuestion(reactQuiz, "Thư viện nào dùng để điều hướng SPA?", "Axios", "React Router", "Hibernate", "BCrypt", "B", "React Router quản lý route trong React.");
        addQuestion(reactQuiz, "Axios chủ yếu dùng để làm gì?", "Gọi API", "Tạo database", "Mã hóa password", "Build Docker image", "A", "Axios là HTTP client.");
    }

    private void addCard(FlashcardDeck deck, String front, String back, DifficultyLevel difficulty) {
        flashcards.save(new Flashcard(deck, front, back, difficulty));
    }

    private void addQuestion(Quiz quiz, String text, String a, String b, String c, String d, String correct, String explanation) {
        questions.save(new Question(quiz, text, a, b, c, d, correct, explanation));
    }
}
