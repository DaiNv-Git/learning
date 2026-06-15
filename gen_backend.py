import os

base_dir = "/Users/os_dainv/Desktop/project/TT-HO/Hoatt/smart-learning-platform/backend/src/main/java/com/smartlearning/backend"
package_base = "com.smartlearning.backend"

files = {
    # == CONFIG ==
    "infrastructure/config/OpenAPIConfig.java": f"""package {package_base}.infrastructure.config;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {{
    @Bean
    public OpenAPI customOpenAPI() {{
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
            .info(new Info().title("Smart Learning Platform API").version("1.0"))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .components(new io.swagger.v3.oas.models.Components()
                .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                    .name(securitySchemeName)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
    }}
}}
""",
    # == ENTITIES ==
    "core/entity/Course.java": f"""package {package_base}.core.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Course {{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @ManyToOne @JoinColumn(name = "created_by")
    private User createdBy;
}}
""",
    "core/entity/FlashcardDeck.java": f"""package {package_base}.core.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "flashcard_decks")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class FlashcardDeck {{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "course_id")
    private Course course;
    private String title;
    private String description;
}}
""",
    "core/entity/Flashcard.java": f"""package {package_base}.core.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "flashcards")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Flashcard {{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "deck_id")
    private FlashcardDeck deck;
    private String frontText;
    private String backText;
    private String difficultyLevel;
}}
""",
    # == REPOSITORIES ==
    "core/repository/CourseRepository.java": f"""package {package_base}.core.repository;
import {package_base}.core.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CourseRepository extends JpaRepository<Course, Long> {{}}
""",
    "core/repository/FlashcardDeckRepository.java": f"""package {package_base}.core.repository;
import {package_base}.core.entity.FlashcardDeck;
import org.springframework.data.jpa.repository.JpaRepository;
public interface FlashcardDeckRepository extends JpaRepository<FlashcardDeck, Long> {{}}
""",
    "core/repository/FlashcardRepository.java": f"""package {package_base}.core.repository;
import {package_base}.core.entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {{
    List<Flashcard> findByDeckId(Long deckId);
}}
""",
    # == SECURITY ==
    "infrastructure/security/JwtUtils.java": f"""package {package_base}.infrastructure.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {{
    @Value("${{jwt.secret}}")
    private String jwtSecret;
    @Value("${{jwt.expirationMs}}")
    private int jwtExpirationMs;

    private Key key() {{
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }}

    public String generateJwtToken(Authentication authentication) {{
        String username = authentication.getName();
        return Jwts.builder()
                .setSubject((username))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS512)
                .compact();
    }}

    public String getUserNameFromJwtToken(String token) {{
        return Jwts.parserBuilder().setSigningKey(key()).build()
                   .parseClaimsJws(token).getBody().getSubject();
    }}

    public boolean validateJwtToken(String authToken) {{
        try {{
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        }} catch (JwtException | IllegalArgumentException e) {{
            return false;
        }}
    }}
}}
""",
    # Security Config
    "infrastructure/security/WebSecurityConfig.java": f"""package {package_base}.infrastructure.security;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {{
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {{
        return authConfig.getAuthenticationManager();
    }}

    @Bean
    public PasswordEncoder passwordEncoder() {{
        return new BCryptPasswordEncoder();
    }}

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {{
        http.cors(cors -> cors.disable())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> 
                auth.requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                    .anyRequest().permitAll() // Allow all for demo purposes to speed up testing
            );
        return http.build();
    }}
}}
""",
    # == DTO & CONTROLLER ==
    "application/dto/AuthRequest.java": f"""package {package_base}.application.dto;
import lombok.Data;
@Data public class AuthRequest {{ private String username; private String password; }}
""",
    "application/dto/AuthResponse.java": f"""package {package_base}.application.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
@Data @AllArgsConstructor public class AuthResponse {{ private String token; private String username; }}
""",
    "presentation/controller/AuthController.java": f"""package {package_base}.presentation.controller;
import {package_base}.application.dto.*;
import {package_base}.core.repository.UserRepository;
import {package_base}.infrastructure.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {{
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder encoder;
    @Autowired private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest loginRequest) {{
        // Simple demo authentication
        var userOpt = userRepository.findByUsername(loginRequest.getUsername());
        if (userOpt.isPresent() && encoder.matches(loginRequest.getPassword(), userOpt.get().getPassword())) {{
            // Generate token, bypassing AuthenticationManager for speed
            String token = jwtUtils.generateJwtToken(new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(loginRequest.getUsername(), null));
            return ResponseEntity.ok(new AuthResponse(token, userOpt.get().getUsername()));
        }}
        return ResponseEntity.status(401).body("Invalid credentials!");
    }}
}}
""",
    "presentation/controller/CourseController.java": f"""package {package_base}.presentation.controller;
import {package_base}.core.entity.Course;
import {package_base}.core.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {{
    @Autowired private CourseRepository courseRepository;

    @GetMapping
    public List<Course> getAllCourses() {{
        return courseRepository.findAll();
    }}
    @PostMapping
    public Course createCourse(@RequestBody Course course) {{
        return courseRepository.save(course);
    }}
}}
"""
}

for rel_path, content in files.items():
    full_path = os.path.join(base_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(content)

print("Backend files generated successfully.")
