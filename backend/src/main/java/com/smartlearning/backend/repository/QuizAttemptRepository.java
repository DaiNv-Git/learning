package com.smartlearning.backend.repository;

import com.smartlearning.backend.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserIdOrderByCompletedAtDesc(Long userId);

    List<QuizAttempt> findTop8ByUserIdOrderByCompletedAtDesc(Long userId);

    long countByUserId(Long userId);
}
