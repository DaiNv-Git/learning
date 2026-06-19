package com.smartlearning.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quizzes")
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    public Course course;

    @Column(nullable = false)
    public String title;

    public int timeLimitMinutes = 15;

    @Column(nullable = false)
    public LocalDateTime createdAt = LocalDateTime.now();

    public Quiz() {
    }

    public Quiz(Course course, String title, int timeLimitMinutes) {
        this.course = course;
        this.title = title;
        this.timeLimitMinutes = timeLimitMinutes;
    }
}
