package com.smartlearning.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "flashcard_decks")
public class FlashcardDeck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    public Course course;

    @Column(nullable = false)
    public String title;

    @Column(columnDefinition = "TEXT")
    public String description;

    @Column(nullable = false)
    public LocalDateTime createdAt = LocalDateTime.now();

    public FlashcardDeck() {
    }

    public FlashcardDeck(Course course, String title, String description) {
        this.course = course;
        this.title = title;
        this.description = description;
    }
}
