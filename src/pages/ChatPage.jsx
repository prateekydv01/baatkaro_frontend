import React,{useState,useEffect} from 'react'
import {io} from 'socket.io-client'

const socket = io('http://localhost:4000')

function ChatPage() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  const sendMsg = () => {

    socket.emit("message", message)
    setMessage("")
  }

  useEffect(() => {

    socket.on("receive-message", (msg) => {

      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.off("receive-message")
    }

  }, [])


  return (
    <div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Enter message'/>
      <button 
        onClick={sendMsg}
      >Send</button>

      <div>
        {
          messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))
        }
      </div>
    </div>
    
  )
}

export default ChatPage