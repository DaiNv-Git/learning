package com.smartlearning.backend.repository;

import com.smartlearning.backend.model.FlashcardDeck;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FlashcardDeckRepository extends JpaRepository<FlashcardDeck, Long> {
    List<FlashcardDeck> findByCourseId(Long courseId);
}
