package com.smartlearning.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    public String content;

    @Column(nullable = false)
    public String audience = "ALL";

    public boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    public User createdBy;

    @Column(nullable = false)
    public LocalDateTime createdAt = LocalDateTime.now();

    public Announcement() {
    }

    public Announcement(String title, String content, String audience, boolean active, User createdBy) {
        this.title = title;
        this.content = content;
        this.audience = audience;
        this.active = active;
        this.createdBy = createdBy;
    }
}
