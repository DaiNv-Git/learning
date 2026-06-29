import re

with open('backend/src/main/java/com/smartlearning/backend/controller/LearningController.java', 'r') as f:
    content = f.read()

# 1. Add imports
imports = """import com.smartlearning.backend.model.Notification;
import com.smartlearning.backend.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
"""
content = re.sub(r'(import com.smartlearning.backend.repository.\*;)', r'\1\n' + imports, content)

# 2. Add fields
fields = """    private final AnnouncementRepository announcements;
    private final NotificationRepository notifications;
    private final SimpMessagingTemplate messagingTemplate;"""
content = re.sub(r'    private final AnnouncementRepository announcements;', fields, content)

# 3. Update constructor
constructor_sig = """                              CourseResourceRepository resources, AnnouncementRepository announcements, MapperSupport mapper,
                              NotificationRepository notifications, SimpMessagingTemplate messagingTemplate) {"""
content = re.sub(r'                              CourseResourceRepository resources, AnnouncementRepository announcements, MapperSupport mapper\) {', constructor_sig, content)

constructor_body = """        this.announcements = announcements;
        this.notifications = notifications;
        this.messagingTemplate = messagingTemplate;"""
content = re.sub(r'        this.announcements = announcements;', constructor_body, content)

# 4. Update createCourse method
create_course = """    @PostMapping("/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public CourseResponse createCourse(@Valid @RequestBody CourseRequest request, Principal principal) {
        Course course = courses.save(new Course(request.title(), request.description(), currentUser(principal)));
        FlashcardDeck deck = decks.save(new FlashcardDeck(course, request.title() + " Deck", "Bộ thẻ mặc định cho " + request.title()));
        flashcards.save(new Flashcard(deck, "Ví dụ khái niệm đầu tiên", "Nội dung giải thích mẫu. Admin có thể chỉnh sửa thẻ này.", DifficultyLevel.EASY));
        
        // Notify all users
        List<User> allUsers = users.findAll();
        for (User u : allUsers) {
            Notification notification = Notification.builder()
                    .user(u)
                    .message("Khóa học mới đã được thêm: " + course.title)
                    .isRead(false)
                    .build();
            notification = notifications.save(notification);
            messagingTemplate.convertAndSendToUser(
                    u.username,
                    "/queue/notifications",
                    java.util.Map.of("id", notification.getId(), "message", notification.getMessage(), "isRead", false)
            );
        }
        
        return mapper.course(course);
    }"""

content = re.sub(r'    @PostMapping\("/courses"\).*?return mapper\.course\(course\);\n    \}', create_course, content, flags=re.DOTALL)

with open('backend/src/main/java/com/smartlearning/backend/controller/LearningController.java', 'w') as f:
    f.write(content)
