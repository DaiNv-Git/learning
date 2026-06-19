package com.smartlearning.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_flashcard_progress", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "flashcard_id"})
})
public class UserFlashcardProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    public User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flashcard_id", nullable = false)
    public Flashcard flashcard;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    public ProgressStatus status = ProgressStatus.NEW;

    public String lastEvaluation;

    public int reviewCount = 0;

    public LocalDateTime lastReviewedAt;

    public LocalDateTime nextReviewDate;

    public UserFlashcardProgress() {
    }

    public UserFlashcardProgress(User user, Flashcard flashcard) {
        this.user = user;
        this.flashcard = flashcard;
    }
}
