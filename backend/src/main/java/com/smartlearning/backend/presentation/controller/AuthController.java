package com.smartlearning.backend.presentation.controller;
import com.smartlearning.backend.application.dto.*;
import com.smartlearning.backend.core.repository.UserRepository;
import com.smartlearning.backend.infrastructure.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder encoder;
    @Autowired private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest loginRequest) {
        var userOpt = userRepository.findByUsername(loginRequest.getUsername());
        if (userOpt.isPresent() && encoder.matches(loginRequest.getPassword(), userOpt.get().getPassword())) {
            String token = jwtUtils.generateJwtToken(new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(loginRequest.getUsername(), null));
            return ResponseEntity.ok(new AuthResponse(token, userOpt.get().getUsername()));
        }
        return ResponseEntity.status(401).body("Invalid credentials!");
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        com.smartlearning.backend.core.entity.User user = new com.smartlearning.backend.core.entity.User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setFullName(signUpRequest.getFullName());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        
        if ("ADMIN".equalsIgnoreCase(signUpRequest.getRole())) {
            user.setRole(com.smartlearning.backend.core.entity.Role.ADMIN);
        } else {
            user.setRole(com.smartlearning.backend.core.entity.Role.USER);
        }

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }
}
