package com.smartlearning.backend.core.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name = "quiz_attempts")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class QuizAttempt {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne @JoinColumn(name = "quiz_id")
    private Quiz quiz;
    private Integer score;
    private Integer totalQuestions;
    private LocalDateTime completedAt;
}
