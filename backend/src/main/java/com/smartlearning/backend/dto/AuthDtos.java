package com.smartlearning.backend.dto;

import com.smartlearning.backend.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {
    public record LoginRequest(@NotBlank String username, @NotBlank String password) {
    }

    public record RegisterRequest(
            @NotBlank @Size(min = 3, max = 50) String username,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 6, max = 100) String password,
            @NotBlank String fullName,
            Role role
    ) {
    }

    public record AuthResponse(Long id, String username, String email, String fullName, Role role, String token) {
    }

    public record UserResponse(Long id, String username, String email, String fullName, Role role, String createdAt) {
    }
}
