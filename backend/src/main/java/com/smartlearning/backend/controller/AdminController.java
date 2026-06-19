package com.smartlearning.backend.controller;

import com.smartlearning.backend.dto.AuthDtos.UserResponse;
import com.smartlearning.backend.dto.LearningDtos.AdminSummary;
import com.smartlearning.backend.dto.LearningDtos.AnnouncementResponse;
import com.smartlearning.backend.model.Role;
import com.smartlearning.backend.repository.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserRepository users;
    private final CourseRepository courses;
    private final FlashcardDeckRepository decks;
    private final FlashcardRepository flashcards;
    private final QuizRepository quizzes;
    private final QuizAttemptRepository attempts;
    private final CourseResourceRepository resources;
    private final AnnouncementRepository announcements;
    private final MapperSupport mapper;

    public AdminController(UserRepository users, CourseRepository courses, FlashcardDeckRepository decks,
                           FlashcardRepository flashcards, QuizRepository quizzes, QuizAttemptRepository attempts,
                           CourseResourceRepository resources, AnnouncementRepository announcements,
                           MapperSupport mapper) {
        this.users = users;
        this.courses = courses;
        this.decks = decks;
        this.flashcards = flashcards;
        this.quizzes = quizzes;
        this.attempts = attempts;
        this.resources = resources;
        this.announcements = announcements;
        this.mapper = mapper;
    }

    @GetMapping("/summary")
    public AdminSummary summary() {
        return new AdminSummary(
                users.count(),
                users.countByRole(Role.ADMIN),
                courses.count(),
                decks.count(),
                flashcards.count(),
                quizzes.count(),
                attempts.count(),
                resources.count(),
                announcements.count()
        );
    }

    @GetMapping("/users")
    public List<UserResponse> users() {
        return users.findAll().stream().map(mapper::user).toList();
    }

    @GetMapping("/announcements")
    public List<AnnouncementResponse> announcements() {
        return announcements.findAllByOrderByCreatedAtDesc().stream().map(mapper::announcement).toList();
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        users.deleteById(id);
    }
}
