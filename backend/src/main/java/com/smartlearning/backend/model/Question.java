package com.smartlearning.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    public Quiz quiz;

    @Column(nullable = false, columnDefinition = "TEXT")
    public String questionText;

    @Column(nullable = false)
    public String optiona;

    @Column(nullable = false)
    public String optionb;

    @Column(nullable = false)
    public String optionc;

    @Column(nullable = false)
    public String optiond;

    @Column(nullable = false, length = 1)
    public String correctOption;

    @Column(columnDefinition = "TEXT")
    public String explanation;

    public Question() {
    }

    public Question(Quiz quiz, String questionText, String optiona, String optionb, String optionc, String optiond, String correctOption, String explanation) {
        this.quiz = quiz;
        this.questionText = questionText;
        this.optiona = optiona;
        this.optionb = optionb;
        this.optionc = optionc;
        this.optiond = optiond;
        this.correctOption = correctOption;
        this.explanation = explanation;
    }
}
