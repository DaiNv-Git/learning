package com.smartlearning.backend.dto;

import com.smartlearning.backend.model.DifficultyLevel;
import com.smartlearning.backend.model.ProgressStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class LearningDtos {
    public record CourseRequest(@NotBlank String title, String description) {
    }

    public record CourseResponse(Long id, String title, String description, int decks, long flashcards, int quizzes, String createdBy, LocalDateTime createdAt) {
    }

    public record DeckRequest(@NotNull Long courseId, @NotBlank String title, String description) {
    }

    public record DeckResponse(Long id, Long courseId, String title, String description, int flashcardCount) {
    }

    public record CourseResourceRequest(@NotNull Long courseId, @NotBlank String title, @NotBlank String url, String type, String description) {
    }

    public record CourseResourceResponse(Long id, Long courseId, String courseTitle, String title, String url, String type, String description, LocalDateTime createdAt) {
    }

    public record FlashcardRequest(@NotNull Long deckId, @NotBlank String frontText, @NotBlank String backText, DifficultyLevel difficultyLevel) {
    }

    public record FlashcardResponse(Long id, Long deckId, String frontText, String backText, DifficultyLevel difficultyLevel, ProgressStatus status, String lastEvaluation) {
    }

    public record QuizRequest(@NotNull Long courseId, @NotBlank String title, int timeLimitMinutes, List<QuestionRequest> questions) {
    }

    public record QuestionRequest(String questionText, String optiona, String optionb, String optionc, String optiond, String correctOption, String explanation) {
    }

    public record QuizResponse(Long id, Long courseId, String title, int timeLimitMinutes, int questionCount) {
    }

    public record QuestionResponse(Long id, String questionText, String optiona, String optionb, String optionc, String optiond, String explanation) {
    }

    public record QuizSubmitRequest(Long quizId, Long userId, Map<Long, String> answers) {
    }

    public record QuizAttemptResponse(Long id, QuizResponse quiz, int score, int totalQuestions, int correctAnswers, LocalDateTime completedAt) {
    }

    public record DashboardStats(long totalCourses, long totalDecks, long totalFlashcards, long studiedCards, long masteredCards, long quizAttempts, double averageScore, List<QuizAttemptResponse> recentAttempts) {
    }

    public record AnnouncementRequest(@NotBlank String title, @NotBlank String content, String audience, boolean active) {
    }

    public record AnnouncementResponse(Long id, String title, String content, String audience, boolean active, String createdBy, LocalDateTime createdAt) {
    }

    public record AdminSummary(long users, long admins, long courses, long decks, long flashcards, long quizzes, long attempts, long resources, long announcements) {
    }
}
