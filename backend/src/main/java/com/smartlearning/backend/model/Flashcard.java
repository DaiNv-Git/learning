package com.smartlearning.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "flashcards")
public class Flashcard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deck_id", nullable = false)
    public FlashcardDeck deck;

    @Column(nullable = false, columnDefinition = "TEXT")
    public String frontText;

    @Column(nullable = false, columnDefinition = "TEXT")
    public String backText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    public DifficultyLevel difficultyLevel = DifficultyLevel.MEDIUM;

    @Column(nullable = false)
    public LocalDateTime createdAt = LocalDateTime.now();

    public Flashcard() {
    }

    public Flashcard(FlashcardDeck deck, String frontText, String backText, DifficultyLevel difficultyLevel) {
        this.deck = deck;
        this.frontText = frontText;
        this.backText = backText;
        this.difficultyLevel = difficultyLevel;
    }
}
