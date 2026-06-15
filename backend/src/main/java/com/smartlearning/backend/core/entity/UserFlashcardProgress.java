package com.smartlearning.backend.core.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name = "user_flashcard_progress")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UserFlashcardProgress {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne @JoinColumn(name = "flashcard_id")
    private Flashcard flashcard;
    private String status; // NEW, LEARNING, REVIEW, MASTERED
    private LocalDateTime nextReviewDate;
}
