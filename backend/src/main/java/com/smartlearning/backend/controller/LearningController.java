package com.smartlearning.backend.controller;

import com.smartlearning.backend.dto.LearningDtos.*;
import com.smartlearning.backend.model.*;
import com.smartlearning.backend.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
public class LearningController {
    private final UserRepository users;
    private final CourseRepository courses;
    private final FlashcardDeckRepository decks;
    private final FlashcardRepository flashcards;
    private final UserFlashcardProgressRepository progress;
    private final QuizRepository quizzes;
    private final QuestionRepository questions;
    private final QuizAttemptRepository attempts;
    private final MapperSupport mapper;

    public LearningController(UserRepository users, CourseRepository courses, FlashcardDeckRepository decks,
                              FlashcardRepository flashcards, UserFlashcardProgressRepository progress,
                              QuizRepository quizzes, QuestionRepository questions, QuizAttemptRepository attempts,
                              MapperSupport mapper) {
        this.users = users;
        this.courses = courses;
        this.decks = decks;
        this.flashcards = flashcards;
        this.progress = progress;
        this.quizzes = quizzes;
        this.questions = questions;
        this.attempts = attempts;
        this.mapper = mapper;
    }

    @GetMapping("/courses")
    public List<CourseResponse> courses() {
        return courses.findAll().stream().map(mapper::course).toList();
    }

    @GetMapping("/courses/{id}")
    public CourseResponse course(@PathVariable Long id) {
        return mapper.course(courseEntity(id));
    }

    @PostMapping("/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public CourseResponse createCourse(@Valid @RequestBody CourseRequest request, Principal principal) {
        Course course = courses.save(new Course(request.title(), request.description(), currentUser(principal)));
        FlashcardDeck deck = decks.save(new FlashcardDeck(course, request.title() + " Deck", "Bộ thẻ mặc định cho " + request.title()));
        flashcards.save(new Flashcard(deck, "Ví dụ khái niệm đầu tiên", "Nội dung giải thích mẫu. Admin có thể chỉnh sửa thẻ này.", DifficultyLevel.EASY));
        return mapper.course(course);
    }

    @PutMapping("/courses/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CourseResponse updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        Course course = courseEntity(id);
        course.title = request.title();
        course.description = request.description();
        return mapper.course(courses.save(course));
    }

    @DeleteMapping("/courses/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courses.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/courses/{courseId}/decks")
    public List<DeckResponse> decks(@PathVariable Long courseId) {
        return decks.findByCourseId(courseId).stream().map(mapper::deck).toList();
    }

    @PostMapping("/decks")
    @PreAuthorize("hasRole('ADMIN')")
    public DeckResponse createDeck(@Valid @RequestBody DeckRequest request) {
        FlashcardDeck deck = decks.save(new FlashcardDeck(courseEntity(request.courseId()), request.title(), request.description()));
        return mapper.deck(deck);
    }

    @GetMapping("/flashcards/deck/{deckId}")
    public List<FlashcardResponse> flashcardsByDeck(@PathVariable Long deckId, Principal principal) {
        User user = currentUser(principal);
        return flashcards.findByDeckId(deckId).stream()
                .map(card -> mapper.flashcard(card, progress.findByUserIdAndFlashcardId(user.id, card.id).orElse(null)))
                .toList();
    }

    @PostMapping("/flashcards")
    @PreAuthorize("hasRole('ADMIN')")
    public FlashcardResponse createFlashcard(@Valid @RequestBody FlashcardRequest request) {
        FlashcardDeck deck = decks.findById(request.deckId()).orElseThrow();
        Flashcard card = flashcards.save(new Flashcard(
                deck,
                request.frontText(),
                request.backText(),
                request.difficultyLevel() == null ? DifficultyLevel.MEDIUM : request.difficultyLevel()
        ));
        return mapper.flashcard(card, null);
    }

    @PutMapping("/flashcards/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public FlashcardResponse updateFlashcard(@PathVariable Long id, @Valid @RequestBody FlashcardRequest request) {
        Flashcard card = flashcards.findById(id).orElseThrow();
        card.frontText = request.frontText();
        card.backText = request.backText();
        card.difficultyLevel = request.difficultyLevel() == null ? DifficultyLevel.MEDIUM : request.difficultyLevel();
        return mapper.flashcard(flashcards.save(card), null);
    }

    @DeleteMapping("/flashcards/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFlashcard(@PathVariable Long id) {
        flashcards.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/flashcards/progress")
    public FlashcardResponse saveProgress(@RequestParam(required = false) Long userId,
                                          @RequestParam Long flashcardId,
                                          @RequestParam String evaluation,
                                          Principal principal) {
        User user = currentUser(principal);
        Flashcard card = flashcards.findById(flashcardId).orElseThrow();
        UserFlashcardProgress item = progress.findByUserIdAndFlashcardId(user.id, flashcardId)
                .orElseGet(() -> new UserFlashcardProgress(user, card));
        item.lastEvaluation = evaluation;
        item.reviewCount += 1;
        item.lastReviewedAt = LocalDateTime.now();
        item.status = switch (evaluation.toUpperCase(Locale.ROOT)) {
            case "EASY" -> ProgressStatus.MASTERED;
            case "GOOD" -> ProgressStatus.REVIEW;
            default -> ProgressStatus.LEARNING;
        };
        item.nextReviewDate = LocalDateTime.now().plusDays(item.status == ProgressStatus.MASTERED ? 7 : item.status == ProgressStatus.REVIEW ? 2 : 1);
        return mapper.flashcard(card, progress.save(item));
    }

    @GetMapping("/quizzes")
    public List<QuizResponse> quizList(@RequestParam(required = false) Long courseId) {
        List<Quiz> result = courseId == null ? quizzes.findAll() : quizzes.findByCourseId(courseId);
        return result.stream().map(mapper::quiz).toList();
    }

    @GetMapping("/quizzes/{quizId}/questions")
    public List<QuestionResponse> quizQuestions(@PathVariable Long quizId) {
        return questions.findByQuizId(quizId).stream().map(mapper::question).toList();
    }

    @PostMapping("/quizzes")
    @PreAuthorize("hasRole('ADMIN')")
    public QuizResponse createQuiz(@Valid @RequestBody QuizRequest request) {
        Quiz quiz = quizzes.save(new Quiz(courseEntity(request.courseId()), request.title(), request.timeLimitMinutes()));
        if (request.questions() != null) {
            for (QuestionRequest q : request.questions()) {
                questions.save(new Question(quiz, q.questionText(), q.optiona(), q.optionb(), q.optionc(), q.optiond(), q.correctOption(), q.explanation()));
            }
        }
        return mapper.quiz(quiz);
    }

    @PostMapping("/quizzes/submit")
    public QuizAttemptResponse submitQuiz(@RequestBody QuizSubmitRequest request, Principal principal) {
        User user = currentUser(principal);
        Quiz quiz = quizzes.findById(request.quizId()).orElseThrow();
        List<Question> quizQuestions = questions.findByQuizId(quiz.id);
        int correct = 0;
        Map<Long, String> answers = request.answers() == null ? Map.of() : request.answers();
        for (Question q : quizQuestions) {
            String selected = answers.get(q.id);
            if (selected != null && selected.equalsIgnoreCase(q.correctOption)) {
                correct++;
            }
        }
        QuizAttempt attempt = attempts.save(new QuizAttempt(user, quiz, correct, quizQuestions.size(), correct));
        return mapper.attempt(attempt);
    }

    @GetMapping("/quizzes/attempts/{userId}")
    public List<QuizAttemptResponse> userAttempts(@PathVariable Long userId, Principal principal) {
        User current = currentUser(principal);
        Long target = current.role == Role.ADMIN ? userId : current.id;
        return attempts.findByUserIdOrderByCompletedAtDesc(target).stream().map(mapper::attempt).toList();
    }

    @GetMapping("/statistics")
    public DashboardStats dashboardStats(Principal principal) {
        User user = currentUser(principal);
        List<QuizAttempt> userAttempts = attempts.findByUserIdOrderByCompletedAtDesc(user.id);
        double avg = userAttempts.stream().mapToInt(a -> a.totalQuestions == 0 ? 0 : (a.score * 100 / a.totalQuestions)).average().orElse(0);
        return new DashboardStats(
                courses.count(),
                decks.count(),
                flashcards.count(),
                progress.countByUserId(user.id),
                progress.countByUserIdAndStatus(user.id, ProgressStatus.MASTERED),
                attempts.countByUserId(user.id),
                Math.round(avg * 10.0) / 10.0,
                attempts.findTop8ByUserIdOrderByCompletedAtDesc(user.id).stream().map(mapper::attempt).toList()
        );
    }

    private User currentUser(Principal principal) {
        return users.findByUsername(principal.getName()).orElseThrow();
    }

    private Course courseEntity(Long id) {
        return courses.findById(id).orElseThrow();
    }
}
