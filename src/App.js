import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [examData, setExamData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => {
        setExamData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
        setLoading(false);
      });
  }, []);

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading">시험지를 불러오는 중...</div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="App">
        <div className="error">시험 데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const currentQuestion = examData.questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestion.id];

  return (
    <div className="App">
      <header className="exam-header">
        <h1>{examData.examInfo.title}</h1>
        <div className="exam-info">
          <span>자격종목: {examData.examInfo.subject}</span>
          <span>종목코드: {examData.examInfo.code}</span>
          <span>시험시간: {examData.examInfo.time}</span>
          <span>문제지형별: {examData.examInfo.type}</span>
        </div>
      </header>

      <div className="exam-container">
        <div className="question-navigation">
          <div className="question-grid">
            {examData.questions.map((question, index) => (
              <button
                key={question.id}
                className={`question-number ${
                  index === currentQuestionIndex ? "current" : ""
                } ${selectedAnswers[question.id] ? "answered" : ""}`}
                onClick={() => goToQuestion(index)}
              >
                {question.id}
              </button>
            ))}
          </div>
        </div>

        <div className="question-container">
          <div className="question-header">
            <h2>문제 {currentQuestion.id}</h2>
            <span className="progress">
              {currentQuestionIndex + 1} / {examData.questions.length}
            </span>
          </div>

          <div className="question-content">
            <p className="question-text">{currentQuestion.question}</p>

            <div className="options">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <div
                  key={key}
                  className={`option ${
                    selectedAnswer === key ? "selected" : ""
                  }`}
                  onClick={() => handleAnswerSelect(currentQuestion.id, key)}
                >
                  <span className="option-label">{key}.</span>
                  <span className="option-text">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="navigation-buttons">
            <button
              className="nav-button prev"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              이전 문제
            </button>
            <button
              className="nav-button next"
              onClick={goToNextQuestion}
              disabled={currentQuestionIndex === examData.questions.length - 1}
            >
              다음 문제
            </button>
          </div>
        </div>
      </div>

      <footer className="exam-footer">
        <p>※ 시험문제지는 답안카드와 같이 반드시 제출하여야 합니다.</p>
      </footer>
    </div>
  );
}

export default App;
