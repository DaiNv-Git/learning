package com.smartlearning.backend.repository;

import com.smartlearning.backend.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCourseId(Long courseId);
}
