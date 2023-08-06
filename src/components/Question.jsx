import { useState, useEffect } from "react"
import he from "he"
import { nanoid } from "nanoid"

const Question = (props) => {
  const { question, shuffledAnswers, correctAnswer, id } = props.questionObject
  // Sort the shuffledAnswers array to ensure boolean radio buttons render "True" followed by "False"
  const sortedAnswers = [...shuffledAnswers].sort((a, b) => {
    if (a === "True" && b === "False") {
      return -1
    } else if (a === "False" && b === "True") {
      return 1
    } else {
      return 0
    }
  })
  console.log(correctAnswer)
  return (
    <div className="question-div">
      <h2>
        Question {id + 1}. {question}
      </h2>
      {sortedAnswers.map((answer) => {
        const answerId = nanoid()
        return (
          <div className="answer-div" key={nanoid()}>
            <input type="radio" id={answerId} name={`question-${id + 1}`} />
            <label htmlFor={answerId}>{answer}</label>
          </div>
        )
      })}
    </div>
  )
}

export default Question
