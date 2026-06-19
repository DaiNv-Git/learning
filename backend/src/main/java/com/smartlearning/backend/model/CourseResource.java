package com.smartlearning.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_resources")
public class CourseResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    public Course course;

    @Column(nullable = false)
    public String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    public String url;

    @Column(nullable = false)
    public String type = "LINK";

    @Column(columnDefinition = "TEXT")
    public String description;

    @Column(nullable = false)
    public LocalDateTime createdAt = LocalDateTime.now();

    public CourseResource() {
    }

    public CourseResource(Course course, String title, String url, String type, String description) {
        this.course = course;
        this.title = title;
        this.url = url;
        this.type = type;
        this.description = description;
    }
}
