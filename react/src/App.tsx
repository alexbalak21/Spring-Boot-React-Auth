import {useState} from "react"
import axios from "axios"
import "./App.css"

export default function App() {
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")

  async function getMessage() {
    try {
      const res = await axios.get("/api/message")
      // if backend returns plain text, use res.data directly
      setResponse(res.data)
    } catch (error) {
      console.error("Error fetching message:", error)
    }
  }

  async function postMessage() {
    try {
      const res = await axios.post("/api/message", {message})
      // if backend echoes the message as plain text, res.data will be that string
      setResponse(res.data)
    } catch (error) {
      console.error("Error posting message:", error)
    }
  }

  return (
    <div className="App">
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
  )
}
