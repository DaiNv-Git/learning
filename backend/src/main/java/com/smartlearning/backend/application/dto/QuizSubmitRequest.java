package com.smartlearning.backend.application.dto;
import lombok.Data;
import java.util.Map;
@Data public class QuizSubmitRequest { 
    private Long quizId; 
    private Long userId; 
    private Map<Long, String> answers; // questionId -> chosenOption 
}
