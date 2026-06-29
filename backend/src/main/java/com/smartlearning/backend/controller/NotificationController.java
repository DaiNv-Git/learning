package com.smartlearning.backend.controller;

import com.smartlearning.backend.model.Notification;
import com.smartlearning.backend.model.User;
import com.smartlearning.backend.repository.NotificationRepository;
import com.smartlearning.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping
    public ResponseEntity<?> getUserNotifications(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.id);
        List<Map<String, Object>> response = notifications.stream().map(n -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", n.getId());
            map.put("message", n.getMessage());
            map.put("isRead", n.isRead());
            map.put("createdAt", n.getCreatedAt());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null && notification.getUser().id.equals(user.id)) {
            notification.setRead(true);
            notificationRepository.save(notification);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Admin endpoint to push notification to a specific user
    @PostMapping("/admin/push/{userId}")
    public ResponseEntity<?> pushNotification(@PathVariable Long userId, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        String message = payload.get("message");
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .isRead(false)
                .build();
        notification = notificationRepository.save(notification);

        // Send real-time
        messagingTemplate.convertAndSendToUser(
                user.username,
                "/queue/notifications",
                Map.of("id", notification.getId(), "message", notification.getMessage(), "isRead", false)
        );

        return ResponseEntity.ok().build();
    }

    // Admin endpoint to push broadcast notification to ALL users
    @PostMapping("/admin/push/all")
    public ResponseEntity<?> pushBroadcastNotification(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message cannot be empty");
        }

        new Thread(() -> {
            List<User> allUsers = userRepository.findAll();
            List<Notification> notifications = new java.util.ArrayList<>();
            for (User user : allUsers) {
                notifications.add(Notification.builder()
                        .user(user)
                        .message(message)
                        .isRead(false)
                        .build());
            }
            notifications = notificationRepository.saveAll(notifications);

            // Send real-time to each user
            for (Notification notification : notifications) {
                messagingTemplate.convertAndSendToUser(
                        notification.getUser().username,
                        "/queue/notifications",
                        Map.of("id", notification.getId(), "message", notification.getMessage(), "isRead", false)
                );
            }
        }).start();

        return ResponseEntity.ok().build();
    }
}
