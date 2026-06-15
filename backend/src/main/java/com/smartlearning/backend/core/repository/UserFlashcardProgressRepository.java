package com.smartlearning.backend.core.repository;
import com.smartlearning.backend.core.entity.UserFlashcardProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
public interface UserFlashcardProgressRepository extends JpaRepository<UserFlashcardProgress, Long> {
    List<UserFlashcardProgress> findByUserIdAndNextReviewDateBefore(Long userId, LocalDateTime date);
}
