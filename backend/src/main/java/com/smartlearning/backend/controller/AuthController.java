package com.smartlearning.backend.controller;

import com.smartlearning.backend.dto.AuthDtos.*;
import com.smartlearning.backend.model.Role;
import com.smartlearning.backend.model.User;
import com.smartlearning.backend.repository.UserRepository;
import com.smartlearning.backend.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final MapperSupport mapper;

    public AuthController(AuthenticationManager authenticationManager, UserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService, MapperSupport mapper) {
        this.authenticationManager = authenticationManager;
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.mapper = mapper;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = users.findByUsername(request.username())
                .or(() -> users.findByEmail(request.username()))
                .orElseThrow();
        return new AuthResponse(user.id, user.username, user.email, user.fullName, user.role, jwtService.generateToken(user));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (users.existsByUsername(request.username())) {
            return ResponseEntity.badRequest().body("Username already exists.");
        }
        if (users.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().body("Email already exists.");
        }
        Role role = request.role() == Role.ADMIN ? Role.ADMIN : Role.USER;
        User user = users.save(new User(
                request.username(),
                passwordEncoder.encode(request.password()),
                request.email(),
                request.fullName(),
                role
        ));
        return ResponseEntity.ok(mapper.user(user));
    }

    @GetMapping("/me")
    public UserResponse me(Principal principal) {
        return mapper.user(currentUser(principal));
    }

    private User currentUser(Principal principal) {
        return users.findByUsername(principal.getName()).orElseThrow();
    }
}
