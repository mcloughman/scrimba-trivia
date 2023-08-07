import { FaCcMastercard } from "react-icons/fa6"

const Home = (props) => {
  return (
    <div className="home">
      <h1>
        Quizzical <FaCcMastercard />
      </h1>
      <h4>Test Your Trivia Knowledge</h4>
      <button className="start-btn" onClick={() => props.startQuiz()}>
        Start Quiz
      </button>
    </div>
  )
}

export default Home
