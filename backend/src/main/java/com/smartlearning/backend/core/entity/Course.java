package com.smartlearning.backend.core.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @ManyToOne @JoinColumn(name = "created_by")
    private User createdBy;
}
