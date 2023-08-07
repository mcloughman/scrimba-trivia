import { useState, useEffect } from "react"
import he from "he"
import { nanoid } from "nanoid"

import Home from "./components/Home"
import Question from "./components/Question"
const App = () => {
  const [questions, setQuestions] = useState([])
  const [shuffledAnswers, setShuffledAnswers] = useState([])
  // all my George Costanza instincts tell me to create a selectedAnswer state in the Question Component. But what about Bob Ziroll and those boxes.
  const [selectedAnswers, setSelectedAnswers] = useState({})
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
        const processedQuestions = data.results.map((questionObject) => {
          const decodedQuestion = he.decode(questionObject.question)
          const decodedCorrectAnswer = he.decode(questionObject.correct_answer)
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
  }, [])

  const handleSelectedAnswers = (prop, val) => {
    console.log(prop, val)
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [prop]: val,
    }))
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
      <Home />
      {quizQuestions}
      <button onClick={gradeQuiz}>Submit Answers</button>
    </>
  )
}

export default App
