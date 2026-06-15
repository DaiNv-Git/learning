package com.smartlearning.backend.core.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "questions")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Question {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "quiz_id")
    private Quiz quiz;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctOption;
}
