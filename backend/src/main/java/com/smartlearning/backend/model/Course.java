package com.smartlearning.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String title;

    @Column(columnDefinition = "TEXT")
    public String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    public User createdBy;

    @Column(nullable = false)
    public LocalDateTime createdAt = LocalDateTime.now();

    public Course() {
    }

    public Course(String title, String description, User createdBy) {
        this.title = title;
        this.description = description;
        this.createdBy = createdBy;
    }
}
