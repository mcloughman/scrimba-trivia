import { useState, useEffect, useRef } from "react"
import he from "he"
import { nanoid } from "nanoid"

import Home from "./components/Home"
import Question from "./components/Question"
import "./App.css"

const App = () => {
  const [questions, setQuestions] = useState([])
  const [shuffledAnswers, setShuffledAnswers] = useState([])
  const [quizState, setQuizState] = useState("notStarted")
  // all my George Costanza instincts tell me to create a selectedAnswer state in the Question Component. But what about Bob Ziroll and those boxes.
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [score, setScore] = useState("")
  const [isLoading, setIsLoading] = useState("false")
  // We need this in our gradeQuiz func so user won't have to scroll to see their score
  const scoreRef = useRef(null)

  useEffect(() => {
    if (quizState === "inProgress") {
      const fetchQuestions = async () => {
        setIsLoading(true)
        try {
          const response = await fetch("https://opentdb.com/api.php?amount=5")

          if (!response.ok) {
            throw new Error("Failed to fetch")
          }
          const data = await response.json()
          console.log(data.results)
          // Process the fetched data to create an array of questions with shuffled answers
          const processedQuestions = data.results.map((questionObject) => {
            const decodedQuestion = he.decode(questionObject.question)
            const decodedCorrectAnswer = he.decode(
              questionObject.correct_answer
            )
            const decodedWrongAnswers = questionObject.incorrect_answers.map(
              (answer) => he.decode(answer)
            )

            const allAnswers = [...decodedWrongAnswers, decodedCorrectAnswer]
            const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5)
            return {
              question: decodedQuestion,
              shuffledAnswers,
              correctAnswer: decodedCorrectAnswer,
              id: "",
            }
          })
          setQuestions(processedQuestions)
        } catch (e) {
          console.log("Error", e.message)
          return
        }
        setIsLoading(false)
      }
      fetchQuestions()
    }
  }, [quizState])

  const handleSelectedAnswers = (prop, val) => {
    console.log(prop, val)
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [prop]: val,
    }))
  }

  const startQuiz = () => {
    setQuizState("inProgress")
    console.log("Quiz Started")
  }

  const gradeQuiz = () => {
    let rightAnswers = 0
    questions.forEach((question, index) => {
      console.log(question.correctAnswer, selectedAnswers[index])
      question.correctAnswer === selectedAnswers[index]
        ? (rightAnswers += 1)
        : 0
    })
    setQuizState("graded")
    setScore(`${rightAnswers}/${questions.length}`)
    scoreRef.current.scrollIntoView({ behavior: "smooth" })
  }

  const quizQuestions = questions.map((questionObject, index) => {
    questionObject.id = index
    return (
      <Question
        key={index}
        questionObject={questionObject}
        selectedAnswer={selectedAnswers[index] || ""}
        handleSelectedAnswers={(e) =>
          handleSelectedAnswers(questionObject.id, e.target.value)
        }
        quizGraded={quizState === "graded"}
      />
    )
  })

  return (
    <>
      {quizState === "notStarted" && <Home startQuiz={startQuiz} />}
      {isLoading && quizState !== "notStarted" && <h2>Loading...</h2>}
      <div ref={scoreRef}>
        {quizState === "graded" && (
          <h2 className="score">
            Your score: <span className="score-span">{score}</span>
          </h2>
        )}
      </div>

      {quizState !== "notStarted" && !isLoading && quizQuestions}
      {quizState === "inProgress" && !isLoading && (
        <button onClick={gradeQuiz} className="submit-btn">
          Submit Answers
        </button>
      )}
    </>
  )
}

export default App
