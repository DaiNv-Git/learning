package com.smartlearning.backend.core.repository;
import com.smartlearning.backend.core.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
public interface QuizRepository extends JpaRepository<Quiz, Long> {}
