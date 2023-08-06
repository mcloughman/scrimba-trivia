import { useState, useEffect } from "react"

import he from "he"

const Question = (props) => {
  const {
    questions,
    wrongAnswers,
    correctAnswer,
    question,
    name,
    questionNumber,
    handleAnswerSelection,
    selectedAnswer,
    quizGraded,
    startQuiz,
  } = props

  const [shuffledAnswers, setShuffledAnswers] = useState([])

  const decodedQuestion = he.decode(question)
  const decodedCorrectAnswer = he.decode(correctAnswer)
  const decodedWrongAnswers = wrongAnswers.map((wrongAnswer) =>
    he.decode(wrongAnswer)
  )
  const allAnswers = [...decodedWrongAnswers, decodedCorrectAnswer]

  useEffect(() => {
    console.log("shuffle")
    const finalAnswers = allAnswers.sort((a, b) => 0.5 - Math.random())
    setShuffledAnswers(finalAnswers)
  }, [questions])

  return (
    <div className="question-div">
      <h2>
        {questionNumber}. {decodedQuestion}
      </h2>
      <div className="answer-container">
        {shuffledAnswers.map((answer, i) => {
          const isSelectedAnswerCorrect =
            selectedAnswer === decodedCorrectAnswer

          const highlightClass =
            quizGraded && answer === decodedCorrectAnswer
              ? "correct-answer"
              : quizGraded &&
                !isSelectedAnswerCorrect &&
                selectedAnswer === answer
              ? "wrong-answer"
              : ""

          return (
            <div className="answer-div" key={i}>
              <input
                type="radio"
                name={name}
                id={`${name}-${i}`}
                value={answer}
                checked={selectedAnswer === answer}
                onChange={handleAnswerSelection}
              />
              <label
                htmlFor={`${name}-${i}`}
                className={`${highlightClass} radio-button`}
              >
                {answer}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Question
