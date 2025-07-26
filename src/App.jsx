import React, { useState, useRef, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { URL } from './constant'
import Answer from './Components/Answer'

export default function App() {
  const [question, setQuestion] = useState("")
  const [chatHistory, setChatHistory] = useState([{ type: 'ai', content: "Ask Anything!" }])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const scrollRef = useRef(null)

  const askQuestion = async () => {
    if (!question.trim()) return
    setChatHistory(prev => [...prev, { type: 'user', content: question }])
    const payload = { contents: [{ parts: [{ text: question }] }] }

    try {
      let response = await fetch(URL, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      response = await response.json()
      let dataString = response.candidates[0].content.parts[0].text
      let items = dataString.split(/\d+\.\s+/).filter(item => item.trim() !== "").map(item => item.trim())
      setChatHistory(prev => [...prev, ...items.map(ans => ({ type: 'ai', content: ans }))])
      setQuestion("")
    } catch (err) {
      console.error("Error fetching AI:", err)
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  return (
    <div className={`w-full h-screen flex ${darkMode ? 'text-white bg-black' : 'text-black bg-white'}`}>
      
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-transform duration-300
        w-64 md:relative absolute top-0 left-0 h-full z-20
        flex flex-col border-r
        ${darkMode ? 'bg-zinc-800' : 'bg-zinc-200'}
      `}>
        {/* Header */}
        <div className="text-center text-xl font-semibold py-4 border-b sticky top-0 bg-inherit z-10">
          Rudra's AI
        </div>

        {/* Scrollable Chat Titles */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-3">
          {chatHistory.filter(msg => msg.type === 'user').map((msg, idx) => (
            <div key={idx} className='text-sm p-2 rounded-lg break-words bg-opacity-70'>
              {msg.content}
            </div>
          ))}
        </div>

        {/* Theme Button */}
        <div className='sticky bottom-0 z-10 bg-inherit pt-3 pb-4 border-t text-center'>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className='px-4 py-1 rounded-full border'
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className='absolute top-3 left-3 md:hidden z-30 p-2 rounded-full bg-zinc-800 text-white'
        >
          <Menu size={24} />
        </button>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-xl ${msg.type === 'user' ? 'bg-blue-600 text-white' : darkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'}`}>
                {msg.type === 'ai' ? <Answer ans={msg.content} /> : <span>{msg.content}</span>}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <div className={`sticky bottom-0 left-0 w-full z-10 p-3 flex gap-2 border-t ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-100 border-zinc-300'}`}>
          <input
            type="text"
            className={`flex-1 p-3 rounded-xl outline-none ${darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-black'}`}
            placeholder="Write your message..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askQuestion()}
          />
          <button className='bg-blue-600 px-4 rounded-xl text-white' onClick={askQuestion}>ASK</button>
        </div>
      </div>
    </div>
  )
}
