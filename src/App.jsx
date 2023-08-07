import { useState, useEffect } from "react"
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
  useEffect(() => {
    if (quizState === "inProgress") {
      const fetchQuestions = async () => {
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
    return rightAnswers / questions.length
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
      />
    )
  })

  return (
    <>
      {quizState === "notStarted" && <Home startQuiz={startQuiz} />}
      {quizState !== "notStarted" && quizQuestions}
      {quizState === "inProgress" && (
        <button onClick={gradeQuiz}>Submit Answers</button>
      )}
    </>
  )
}

export default App
