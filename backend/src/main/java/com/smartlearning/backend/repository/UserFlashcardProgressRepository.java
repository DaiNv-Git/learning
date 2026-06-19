package com.smartlearning.backend.repository;

import com.smartlearning.backend.model.ProgressStatus;
import com.smartlearning.backend.model.UserFlashcardProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserFlashcardProgressRepository extends JpaRepository<UserFlashcardProgress, Long> {
    Optional<UserFlashcardProgress> findByUserIdAndFlashcardId(Long userId, Long flashcardId);

    List<UserFlashcardProgress> findByUserId(Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, ProgressStatus status);
}
