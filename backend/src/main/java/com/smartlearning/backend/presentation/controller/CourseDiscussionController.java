package com.smartlearning.backend.presentation.controller;

import com.smartlearning.backend.core.entity.Course;
import com.smartlearning.backend.core.entity.CourseDiscussion;
import com.smartlearning.backend.core.entity.User;
import com.smartlearning.backend.core.repository.CourseDiscussionRepository;
import com.smartlearning.backend.core.repository.CourseRepository;
import com.smartlearning.backend.core.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseDiscussionController {

    @Autowired
    private CourseDiscussionRepository discussionRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{courseId}/discussions")
    public ResponseEntity<?> getCourseDiscussions(@PathVariable Long courseId) {
        List<CourseDiscussion> discussions = discussionRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
        List<Map<String, Object>> response = discussions.stream().map(d -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", d.getId());
            map.put("courseId", d.getCourse().getId());
            
            Map<String, Object> userMap = new java.util.HashMap<>();
            userMap.put("id", d.getUser().getId());
            userMap.put("fullName", d.getUser().getFullName());
            userMap.put("username", d.getUser().getUsername());
            
            map.put("user", userMap);
            map.put("content", d.getContent());
            map.put("createdAt", d.getCreatedAt());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{courseId}/discussions")
    public ResponseEntity<?> postDiscussion(@PathVariable Long courseId, @RequestBody Map<String, String> payload, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        Course course = courseRepository.findById(courseId).orElse(null);

        if (user == null || course == null) return ResponseEntity.badRequest().build();

        String content = payload.get("content");
        if (content == null || content.trim().isEmpty()) return ResponseEntity.badRequest().body("Content cannot be empty");

        CourseDiscussion discussion = CourseDiscussion.builder()
                .course(course)
                .user(user)
                .content(content)
                .build();
        discussion = discussionRepository.save(discussion);

        Map<String, Object> responseMap = new java.util.HashMap<>();
        responseMap.put("id", discussion.getId());
        responseMap.put("courseId", discussion.getCourse().getId());
        
        Map<String, Object> userMap = new java.util.HashMap<>();
        userMap.put("id", discussion.getUser().getId());
        userMap.put("fullName", discussion.getUser().getFullName());
        userMap.put("username", discussion.getUser().getUsername());
        
        responseMap.put("user", userMap);
        responseMap.put("content", discussion.getContent());
        responseMap.put("createdAt", discussion.getCreatedAt());
        
        return ResponseEntity.ok(responseMap);
    }

    // Admin endpoints
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/discussions/{discussionId}")
    public ResponseEntity<?> deleteDiscussion(@PathVariable Long discussionId) {
        if (!discussionRepository.existsById(discussionId)) {
            return ResponseEntity.notFound().build();
        }
        discussionRepository.deleteById(discussionId);
        return ResponseEntity.ok().build();
    }
}
