// app/quiz/Quiz.tsx

"use client";

import React, { useState, useEffect } from "react";
import "./quiz.css";
import questionsData from "./questions.json";  // Import questions directly

interface Question {
  question: string;
  choices: string[];
  answer: string;
}

const Quiz: React.FC = () => {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);

  const startQuiz = () => {
    const randomQuestions = [...questionsData]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
    setSelectedQuestions(randomQuestions);
    setQuizStarted(true);
  };

  useEffect(() => {
    if (quizStarted && selectedQuestions.length === 0) {
      startQuiz();
    }
  }, [quizStarted, selectedQuestions]);

  const selectAnswer = (selected: string) => {
    if (!isAnswerSelected) {
      setSelectedAnswer(selected);
      setIsAnswerSelected(true);
      if (selected === selectedQuestions[currentQuestionIndex].answer) {
        setScore(score + 1);
      }
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerSelected(false);
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizEnded(true);
    }
  };

  const displayResults = () => (
    <div className="score-section">
      <h2>Quiz Completed!</h2>
      <p>Your score: {score} out of {selectedQuestions.length}</p>
      <button onClick={() => {
        setQuizStarted(false);
        setQuizEnded(false);
        setScore(0);
        setCurrentQuestionIndex(0);
        setSelectedQuestions([]);
      }}>Restart Quiz</button>
    </div>
  );

  const displayQuestion = () => {
    if (selectedQuestions.length === 0) {
      return <p>Loading questions...</p>;
    }

    const currentQuestion = selectedQuestions[currentQuestionIndex];
    return (
      <div className="question-section">
        <p className="question-text">{currentQuestion.question}</p>
        <div className="option-section">
          {currentQuestion.choices.map((choice, index) => (
            <button
              key={index}
              className={`answer-button ${
                isAnswerSelected
                  ? choice === currentQuestion.answer
                    ? "correct"
                    : choice === selectedAnswer
                    ? "incorrect"
                    : ""
                  : ""
              }`}
              onClick={() => selectAnswer(choice)}
              disabled={isAnswerSelected}
              aria-pressed={selectedAnswer === choice}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!quizStarted) {
    return (
      <div id="quiz-container">
        <h1>Exoplanet Quiz</h1>
        <button onClick={startQuiz}>Start Quiz</button>
      </div>
    );
  }

  return (
    <div id="quiz-container">
      <h1>Exoplanet Quiz</h1>
      <div id="question-container">
        {quizEnded ? displayResults() : displayQuestion()}
      </div>
      {isAnswerSelected && !quizEnded && (
        <button className="next-button" onClick={nextQuestion}>
          {currentQuestionIndex < selectedQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
        </button>
      )}
      {!quizEnded && selectedQuestions.length > 0 && (
        <p className="score-section">
          Question: {currentQuestionIndex + 1} / {selectedQuestions.length}
        </p>
      )}
    </div>
  );
};

export default Quiz;
