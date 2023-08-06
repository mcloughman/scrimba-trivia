import { useState, useEffect } from "react"

const App = () => {
  const [questions, setQuestions] = useState([])
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=5")

        if (!response.ok) {
          throw new Error("Failed to fetch")
        }
        const data = await response.json()
        console.log(data.results)
        setQuestions(data.results)
      } catch (e) {
        console.log("Error", e.message)
        return
      }
    }
    fetchQuestions()
  }, [])
}

export default App
