package com.smartlearning.backend.presentation.controller;
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

    @GetMapping("/attempts/{userId}")
    public List<QuizAttempt> getUserAttempts(@PathVariable Long userId) {
        return attemptRepository.findByUserId(userId);
    }
}
