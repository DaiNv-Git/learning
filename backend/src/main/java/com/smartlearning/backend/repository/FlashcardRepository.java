package com.smartlearning.backend.repository;

import com.smartlearning.backend.model.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findByDeckId(Long deckId);

    long countByDeckCourseId(Long courseId);
}
