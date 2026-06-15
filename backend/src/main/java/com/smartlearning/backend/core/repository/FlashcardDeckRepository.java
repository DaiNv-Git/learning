package com.smartlearning.backend.core.repository;
import com.smartlearning.backend.core.entity.FlashcardDeck;
import org.springframework.data.jpa.repository.JpaRepository;
public interface FlashcardDeckRepository extends JpaRepository<FlashcardDeck, Long> {}
