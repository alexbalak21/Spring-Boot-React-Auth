import {useState} from "react"
import "./App.css"

export default function App() {
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")

  function getMessage() {
    fetch("/api/message")
      .then((response) => response.text())
      .then((msg) => setResponse(msg))
      .catch((error) => console.error("Error fetching message:", error))
  }

  function postMessage() {
    fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({message}), // send { "message": "..." }
    })
      .then((response) => response.text())
      .then((msg) => setResponse(msg))
      .catch((error) => console.error("Error posting message:", error))
  }

  return (
    <div className="App">
      <div>
        <h1>React App</h1>

        <p>{response}</p>

        <div>
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter a message" />
          <button onClick={postMessage}>Send Message</button>
        </div>

        <div>
          <button onClick={getMessage}>Get the Message</button>
        </div>
      </div>
    </div>
  )
}
