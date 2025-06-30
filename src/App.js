import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [examData, setExamData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [examSelection, setExamSelection] = useState(null); // null: 선택 안됨, 'original': 기존시험, 'test2': 시험문제2, '2004': 2004년도시험, '2012': 2012년도시험, '2014': 2014년도시험

  const loadExamData = (examType) => {
    setLoading(true);
    setExamSelection(examType);

    let fileName;
    if (examType === "2004") {
      fileName = "/data2004.json";
    } else if (examType === "2012") {
      fileName = "/data2012.json";
    } else if (examType === "2014") {
      fileName = "/data2014.json";
    } else if (examType === "test2") {
      fileName = "/data2.json";
    } else {
      fileName = "/data.json";
    }

    fetch(fileName)
      .then((response) => response.json())
      .then((data) => {
        setExamData(data);
        setLoading(false);
        // 상태 초기화
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setIsSubmitted(false);
        setScore({ correct: 0, total: 0 });
      })
      .catch((error) => {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
        setLoading(false);
      });
  };

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

  const handleSubmit = () => {
    setIsSubmitted(true);

    // 점수 계산
    let correctCount = 0;
    examData.questions.forEach((question) => {
      const correctAnswer = examData.answer[question.id - 1];
      const userAnswer = selectedAnswers[question.id];

      if (userAnswer) {
        const answerMapping = { 1: "가", 2: "나", 3: "다", 4: "라" };
        const correctAnswerKey = answerMapping[correctAnswer];

        if (userAnswer === correctAnswerKey) {
          correctCount++;
        }
      }
    });

    setScore({
      correct: correctCount,
      total: examData.questions.length,
    });
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore({ correct: 0, total: 0 });
  };

  const handleBackToSelection = () => {
    setExamSelection(null);
    setExamData(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore({ correct: 0, total: 0 });
  };

  const getQuestionStatus = (questionId) => {
    if (!isSubmitted) {
      return selectedAnswers[questionId] ? "answered" : "";
    }

    const correctAnswer = examData.answer[questionId - 1];
    const userAnswer = selectedAnswers[questionId];

    // 답을 선택하지 않은 경우
    if (!userAnswer) {
      return "wrong";
    }

    // 답안 매핑: 1=가, 2=나, 3=다, 4=라
    const answerMapping = { 1: "가", 2: "나", 3: "다", 4: "라" };
    const correctAnswerKey = answerMapping[correctAnswer];

    return userAnswer === correctAnswerKey ? "correct" : "wrong";
  };

  const getOptionStatus = (questionId, optionKey) => {
    if (!isSubmitted) {
      return selectedAnswers[questionId] === optionKey ? "selected" : "";
    }

    const correctAnswer = examData.answer[questionId - 1];
    const userAnswer = selectedAnswers[questionId];

    // 답안 매핑: 1=가, 2=나, 3=다, 4=라
    const answerMapping = { 1: "가", 2: "나", 3: "다", 4: "라" };
    const correctAnswerKey = answerMapping[correctAnswer];

    // 정답인 경우
    if (optionKey === correctAnswerKey) {
      return "correct";
    }

    // 사용자가 선택한 답이 틀린 경우
    if (userAnswer === optionKey && userAnswer !== correctAnswerKey) {
      return "wrong";
    }

    // 사용자가 선택한 답이 정답인 경우
    if (userAnswer === optionKey && userAnswer === correctAnswerKey) {
      return "selected";
    }

    return "";
  };

  // 시험 선택 화면
  if (!examSelection) {
    return (
      <div className="App">
        <div className="exam-selection">
          <h1>도자기공예산업기사 시험 선택</h1>
          <div className="blessing-message">
            <p>💖 울래써의 합격을 기원합니다 💖</p>
          </div>
          <div className="exam-options">
            <div
              className="exam-option"
              onClick={() => loadExamData("original")}
            >
              <h2>울래뚜의 도자기 공예산업기사 도전!!</h2>
              <p>기본 시험 문제</p>
              <p>60문제</p>
            </div>
            <div className="exam-option" onClick={() => loadExamData("test2")}>
              <h2>울래뚜의 도자기 공예산업기사 도전!! 시험문제 2</h2>
              <p>추가 시험 문제</p>
              <p>60문제</p>
            </div>
            <div className="exam-option" onClick={() => loadExamData("2004")}>
              <h2>2004년도 산업기사 일반검정 제3회</h2>
              <p>2004년도 실제 시험 문제</p>
              <p>60문제</p>
            </div>
            <div className="exam-option" onClick={() => loadExamData("2012")}>
              <h2>2012년 도자기공예능사 필기시험</h2>
              <p>2012년도 실제 시험 문제</p>
              <p>60문제</p>
            </div>
            <div className="exam-option" onClick={() => loadExamData("2014")}>
              <h2>2014년도 기능사 제2회 필기시험</h2>
              <p>2014년도 도자기공예기능사 실제 시험 문제</p>
              <p>60문제</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="App">
      <header className="exam-header">
        <div className="header-top">
          <button className="back-button" onClick={handleBackToSelection}>
            ← 시험 선택으로 돌아가기
          </button>
        </div>
        <h1>{examData.examInfo.title}</h1>
        <div className="exam-info">
          <span>자격종목: {examData.examInfo.subject}</span>
          <span>시험시간: {examData.examInfo.time}</span>
        </div>
        {isSubmitted && (
          <div className="score-display">
            <span className="score-text">
              정답: {score.correct} / {score.total} (
              {Math.round((score.correct / score.total) * 100)}%)
            </span>
          </div>
        )}
      </header>

      <div className="exam-container">
        <div className="question-navigation">
          <div className="question-grid">
            {examData.questions.map((question, index) => {
              const status = getQuestionStatus(question.id);
              return (
                <button
                  key={question.id}
                  className={`question-number ${
                    index === currentQuestionIndex ? "current" : ""
                  } ${status}`}
                  onClick={() => goToQuestion(index)}
                >
                  {question.id}
                </button>
              );
            })}
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

            {/* 이미지가 있는 경우 표시 */}
            {currentQuestion.img && (
              <div className="question-image">
                <img
                  src={`/img/${currentQuestion.img}`}
                  alt={`문제 ${currentQuestion.id} 이미지`}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <div className="image-error" style={{ display: "none" }}>
                  이미지를 불러올 수 없습니다.
                </div>
              </div>
            )}

            <div className="options">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <div
                  key={key}
                  className={`option ${getOptionStatus(
                    currentQuestion.id,
                    key
                  )}`}
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
            <div className="right-buttons">
              <button
                className="nav-button next"
                onClick={goToNextQuestion}
                disabled={
                  currentQuestionIndex === examData.questions.length - 1
                }
              >
                다음 문제
              </button>
              <button
                className="nav-button submit"
                onClick={handleSubmit}
                disabled={isSubmitted}
              >
                제출
              </button>
              <button className="nav-button reset" onClick={handleReset}>
                초기화
              </button>
            </div>
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
