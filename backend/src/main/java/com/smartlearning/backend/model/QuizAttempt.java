package com.smartlearning.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    public User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    public Quiz quiz;

    public int score;

    public int totalQuestions;

    public int correctAnswers;

    @Column(nullable = false)
    public LocalDateTime completedAt = LocalDateTime.now();

    public QuizAttempt() {
    }

    public QuizAttempt(User user, Quiz quiz, int score, int totalQuestions, int correctAnswers) {
        this.user = user;
        this.quiz = quiz;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
    }
}
