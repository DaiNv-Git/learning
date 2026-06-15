package com.smartlearning.backend.core.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "flashcards")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Flashcard {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "deck_id")
    private FlashcardDeck deck;
    private String frontText;
    private String backText;
    private String difficultyLevel;
}
