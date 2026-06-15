import os

base_dir = "/Users/os_dainv/Desktop/project/TT-HO/Hoatt/smart-learning-platform/backend/src/main/java/com/smartlearning/backend"

files = {
    "core/entity/Quiz.java": """package com.smartlearning.backend.core.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "quizzes")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Quiz {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "course_id")
    private Course course;
    private String title;
    private Integer timeLimitMinutes;
}
""",
    "core/entity/Question.java": """package com.smartlearning.backend.core.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "questions")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Question {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "quiz_id")
    private Quiz quiz;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctOption;
}
""",
    "core/entity/QuizAttempt.java": """package com.smartlearning.backend.core.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name = "quiz_attempts")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class QuizAttempt {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne @JoinColumn(name = "quiz_id")
    private Quiz quiz;
    private Integer score;
    private Integer totalQuestions;
    private LocalDateTime completedAt;
}
""",
    "core/entity/UserFlashcardProgress.java": """package com.smartlearning.backend.core.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name = "user_flashcard_progress")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UserFlashcardProgress {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne @JoinColumn(name = "flashcard_id")
    private Flashcard flashcard;
    private String status; // NEW, LEARNING, REVIEW, MASTERED
    private LocalDateTime nextReviewDate;
}
""",
    "core/repository/QuizRepository.java": """package com.smartlearning.backend.core.repository;
import com.smartlearning.backend.core.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
public interface QuizRepository extends JpaRepository<Quiz, Long> {}
""",
    "core/repository/QuestionRepository.java": """package com.smartlearning.backend.core.repository;
import com.smartlearning.backend.core.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByQuizId(Long quizId);
}
""",
    "core/repository/QuizAttemptRepository.java": """package com.smartlearning.backend.core.repository;
import com.smartlearning.backend.core.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserId(Long userId);
}
""",
    "core/repository/UserFlashcardProgressRepository.java": """package com.smartlearning.backend.core.repository;
import com.smartlearning.backend.core.entity.UserFlashcardProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
public interface UserFlashcardProgressRepository extends JpaRepository<UserFlashcardProgress, Long> {
    List<UserFlashcardProgress> findByUserIdAndNextReviewDateBefore(Long userId, LocalDateTime date);
}
""",
    "application/dto/QuizSubmitRequest.java": """package com.smartlearning.backend.application.dto;
import lombok.Data;
import java.util.Map;
@Data public class QuizSubmitRequest { 
    private Long quizId; 
    private Long userId; 
    private Map<Long, String> answers; // questionId -> chosenOption 
}
""",
    "presentation/controller/QuizController.java": """package com.smartlearning.backend.presentation.controller;
import com.smartlearning.backend.application.dto.QuizSubmitRequest;
import com.smartlearning.backend.core.entity.*;
import com.smartlearning.backend.core.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "*")
public class QuizController {
    @Autowired private QuizRepository quizRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private QuizAttemptRepository attemptRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping
    public List<Quiz> getAllQuizzes() { return quizRepository.findAll(); }

    @GetMapping("/{id}/questions")
    public List<Question> getQuestions(@PathVariable Long id) {
        return questionRepository.findByQuizId(id);
    }

    @PostMapping("/submit")
    public QuizAttempt submitQuiz(@RequestBody QuizSubmitRequest req) {
        List<Question> questions = questionRepository.findByQuizId(req.getQuizId());
        int score = 0;
        for (Question q : questions) {
            String answer = req.getAnswers().get(q.getId());
            if (answer != null && answer.equalsIgnoreCase(q.getCorrectOption())) {
                score++;
            }
        }
        QuizAttempt attempt = QuizAttempt.builder()
            .quiz(quizRepository.findById(req.getQuizId()).orElseThrow())
            .user(userRepository.findById(req.getUserId()).orElseThrow())
            .score(score)
            .totalQuestions(questions.size())
            .completedAt(LocalDateTime.now())
            .build();
        return attemptRepository.save(attempt);
    }
}
"""
}

for rel_path, content in files.items():
    full_path = os.path.join(base_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(content)

print("Full backend entities and controllers generated.")
