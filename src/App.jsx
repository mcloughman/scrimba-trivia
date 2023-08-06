import { useState, useEffect } from "react"
import he from "he"
import { nanoid } from "nanoid"

import Home from "./components/Home"
import Question from "./components/Question"
const App = () => {
  const [questions, setQuestions] = useState([])
  const [shuffledAnswers, setShuffledAnswers] = useState([])
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=5")

        if (!response.ok) {
          throw new Error("Failed to fetch")
        }
        const data = await response.json()
        console.log(data.results)
        // Process the fetched data to create an array of questions with shuffled answers
        const processedQuestions = data.results.map((question) => {
          const decodedQuestion = question.question
          const decodedCorrectAnswer = he.decode(question.correct_answer)
          const decodedWrongAnswers = question.incorrect_answers.map((answer) =>
            he.decode(answer)
          )

          const allAnswers = [...decodedWrongAnswers, decodedCorrectAnswer]
          const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5)
          return {
            question: decodedQuestion,
            shuffledAnswers,
            correctAnswer: decodedCorrectAnswer,
          }
        })
        setQuestions(processedQuestions)
      } catch (e) {
        console.log("Error", e.message)
        return
      }
    }
    fetchQuestions()
  }, [])

  const quizQuestions = questions.map((question, index) => (
    <Question key={index} question={question} />
  ))

  return (
    <>
      <Home />
      {quizQuestions}
    </>
  )
}

export default App
