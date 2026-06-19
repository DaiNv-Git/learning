package com.smartlearning.backend.controller;

import com.smartlearning.backend.dto.AuthDtos.UserResponse;
import com.smartlearning.backend.dto.LearningDtos.*;
import com.smartlearning.backend.model.*;
import com.smartlearning.backend.repository.*;
import org.springframework.stereotype.Component;

@Component
class MapperSupport {
    private final FlashcardDeckRepository decks;
    private final FlashcardRepository flashcards;
    private final QuizRepository quizzes;
    private final QuestionRepository questions;

    MapperSupport(FlashcardDeckRepository decks, FlashcardRepository flashcards, QuizRepository quizzes, QuestionRepository questions) {
        this.decks = decks;
        this.flashcards = flashcards;
        this.quizzes = quizzes;
        this.questions = questions;
    }

    UserResponse user(User user) {
        return new UserResponse(user.id, user.username, user.email, user.fullName, user.role, user.createdAt.toString());
    }

    CourseResponse course(Course course) {
        var courseDecks = decks.findByCourseId(course.id);
        int quizCount = quizzes.findByCourseId(course.id).size();
        long flashcardCount = courseDecks.stream().mapToLong(deck -> flashcards.findByDeckId(deck.id).size()).sum();
        return new CourseResponse(
                course.id,
                course.title,
                course.description,
                courseDecks.size(),
                flashcardCount,
                quizCount,
                course.createdBy == null ? "System" : course.createdBy.fullName,
                course.createdAt
        );
    }

    DeckResponse deck(FlashcardDeck deck) {
        return new DeckResponse(deck.id, deck.course.id, deck.title, deck.description, flashcards.findByDeckId(deck.id).size());
    }

    FlashcardResponse flashcard(Flashcard card, UserFlashcardProgress progress) {
        return new FlashcardResponse(
                card.id,
                card.deck.id,
                card.frontText,
                card.backText,
                card.difficultyLevel,
                progress == null ? ProgressStatus.NEW : progress.status,
                progress == null ? null : progress.lastEvaluation
        );
    }

    QuizResponse quiz(Quiz quiz) {
        return new QuizResponse(quiz.id, quiz.course.id, quiz.title, quiz.timeLimitMinutes, questions.findByQuizId(quiz.id).size());
    }

    QuestionResponse question(Question question) {
        return new QuestionResponse(question.id, question.questionText, question.optiona, question.optionb, question.optionc, question.optiond, question.explanation);
    }

    QuizAttemptResponse attempt(QuizAttempt attempt) {
        return new QuizAttemptResponse(attempt.id, quiz(attempt.quiz), attempt.score, attempt.totalQuestions, attempt.correctAnswers, attempt.completedAt);
    }
}
