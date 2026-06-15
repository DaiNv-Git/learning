package com.smartlearning.backend.core.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "quizzes")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Quiz {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "course_id")
    private Course course;
    private String title;
    private Integer timeLimitMinutes;
}
