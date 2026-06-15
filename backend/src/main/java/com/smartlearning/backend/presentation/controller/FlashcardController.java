package com.smartlearning.backend.presentation.controller;
import com.smartlearning.backend.core.entity.*;
import com.smartlearning.backend.core.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin(origins = "*")
public class FlashcardController {
    @Autowired private FlashcardRepository flashcardRepository;
    @Autowired private UserFlashcardProgressRepository progressRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping("/deck/{deckId}")
    public List<Flashcard> getFlashcardsByDeck(@PathVariable Long deckId) {
        return flashcardRepository.findByDeckId(deckId);
    }

    @PostMapping("/progress")
    public UserFlashcardProgress saveProgress(@RequestParam Long userId, @RequestParam Long flashcardId, @RequestParam String evaluation) {
        // Simple spaced repetition logic demo
        User user = userRepository.findById(userId).orElseThrow();
        Flashcard card = flashcardRepository.findById(flashcardId).orElseThrow();
        
        UserFlashcardProgress progress = new UserFlashcardProgress();
        progress.setUser(user);
        progress.setFlashcard(card);
        
        int daysToAdd = 1;
        if ("EASY".equalsIgnoreCase(evaluation)) {
            progress.setStatus("REVIEW");
            daysToAdd = 3;
        } else if ("HARD".equalsIgnoreCase(evaluation)) {
            progress.setStatus("LEARNING");
            daysToAdd = 0;
        } else {
            progress.setStatus("REVIEW");
            daysToAdd = 1;
        }
        
        progress.setNextReviewDate(LocalDateTime.now().plusDays(daysToAdd));
        return progressRepository.save(progress);
    }
}
