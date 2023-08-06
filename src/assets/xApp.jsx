import { useState, useEffect, useRef } from "react"
import he from "he"
import { nanoid } from "nanoid"

import Question from "./components/Question"
import "./App.css"

function App() {
  // setting some default values for our quizOptions
  const [quizOptions, setQuizOptions] = useState({
    category: "9", // Default to General Knowledge
    difficulty: "easy", // Default to Easy
    numQuestions: "5", // Default to 5
  })
  const [questions, setQuestions] = useState([])
  // we're going to use this state to make sure that our shuffleAnswers in the Question component only runs after new Questions have been fetched
  const [questionsFetched, setQuestionsFetched] = useState(false)

  // setting the quizState as a string allows more flexibility than if using a boolean
  const [quizState, setQuizState] = useState("notStarted")

  const [selectedAnswers, setSelectedAnswers] = useState({})
  // isLoading will facilitate the process of the useEffect hook inside Question component running after the questions have been fetched in the useEffect within the App component

  // this is beyond my knowledge from AI. What it will do is ensure that when user submits answers that they will NOT have to scroll to see their score. we use the variable as the value to a ref attribute in a div within the condional rendering
  const scoreRef = useRef(null)
  const startQuiz = () => {
    setSelectedAnswers({})
    setQuizState("inProgress")
  }

  useEffect(() => {
    console.log("App useEffect", quizState)
    const fetchQuestions = async () => {
      if (quizState === "inProgress") {
        console.log("In Progress")

        const apiUrl = `https://opentdb.com/api.php?amount=${quizOptions.numQuestions}&difficulty=${quizOptions.difficulty}&category=${quizOptions.category}`
        const response = await fetch(apiUrl)
        const data = await response.json()

        setQuestions(data.results)
      }
    }

    fetchQuestions()
  }, [quizState, quizOptions])

  // Rest of the code...

  function handleQuizOptionChange(optionName, value) {
    setQuizOptions((prevOptions) => ({
      ...prevOptions,
      [optionName]: value,
    }))
  }

  // This console log will run immediately when questions is an empty array/ Then the useEffect hook runs and the questions array is set with the api data, this change in state causes the component to rerender. And this time the console.log shows the questions

  const handleAnswerSelection = (prop, val) => {
    console.log(prop, val)
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [prop]: val,
    }))
  }

  const quizQuestions = questions.map((questionObject, i) => {
    const key = nanoid()
    console.log(key)
    return (
      <Question
        key={key}
        question={questionObject.question}
        wrongAnswers={questionObject.incorrect_answers}
        correctAnswer={questionObject.correct_answer}
        // setting name which we will use as name attribute for our radio buttons
        name={`questionObject-${i}`}
        questionNumber={i + 1}
        handleAnswerSelection={(e) => handleAnswerSelection(i, e.target.value)}
        selectedAnswer={selectedAnswers[i] || ""}
        quizGraded={quizState === "graded"}
        quizState={quizState}
      />
    )
  })

  const gradeQuiz = () => {
    let rightAnswers = 0
    for (let i = 0; i < questions.length; i++) {
      // Had to use he because at this point in our code the selctedAnswers have been decoded but correct answer has not been decoded
      const decodedCorrectAnswer = he.decode(questions[i].correct_answer)

      if (selectedAnswers[i] === decodedCorrectAnswer) {
        rightAnswers++
      }
    }
    console.log(`${rightAnswers}/${questions.length}`)
    setQuizState("graded")
    setScore(`${rightAnswers}/${questions.length}`)
  }

  // AI said this will make it so user doesn't have to scroll to see score when quizGraded. we also have to create a div in our return statement with the ref attribute. This is outide of my knowledge base
  useEffect(() => {
    if (quizState === "graded") {
      scoreRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [quizState])

  return (
    <>
      {quizState === "notStarted" && (
        <Home
          startQuiz={startQuiz}
          quizOptions={quizOptions}
          onQuizOptionsChange={handleQuizOptionChange}
        />
      )}
      {/* {quizState === "inProgress" && isLoading && <h2>Loading...</h2>} */}
      {quizState === "inProgress" && quizQuestions}
      {quizState === "inProgress" && (
        <button onClick={gradeQuiz} className="submit-btn bottom">
          Submit Answers
        </button>
      )}
      <div ref={scoreRef}>
        {quizState === "graded" && (
          <div className="graded-div">
            <h2 className="score">
              Your score: <span className="score-span">{score}</span>
            </h2>
            <div className="next-action-div">
              <button
                onClick={startQuiz}
                className="next-action-btn"
                id="start-quiz-btn"
              >
                Start New Quiz
              </button>
              <button
                onClick={() => setQuizState("notStarted")}
                className="next-action-btn"
              >
                Change Quiz
              </button>
            </div>
          </div>
        )}
        {quizState === "graded" && quizQuestions}
      </div>
    </>
  )
}

export default App
