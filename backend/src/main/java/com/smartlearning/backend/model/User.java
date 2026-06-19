package com.smartlearning.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true, length = 50)
    public String username;

    @Column(nullable = false)
    public String password;

    @Column(nullable = false, unique = true, length = 120)
    public String email;

    @Column(nullable = false, length = 120)
    public String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    public Role role = Role.USER;

    @Column(nullable = false)
    public LocalDateTime createdAt = LocalDateTime.now();

    public User() {
    }

    public User(String username, String password, String email, String fullName, Role role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }
}
