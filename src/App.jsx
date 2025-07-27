import React, { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import { URL } from "./constant";
import Answer from "./Components/Answer";

export default function App() {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { type: "ai", content: "Hey! I am Rudra's AI 😊" },
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const scrollRef = useRef(null);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setChatHistory((prev) => [...prev, { type: "user", content: question }]);
    const payload = { contents: [{ parts: [{ text: question }] }] };

    try {
      let response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      response = await response.json();
      let dataString = response.candidates[0].content.parts[0].text;
      let items = dataString
        .split(/\d+\.\s+/)
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim());
      setChatHistory((prev) => [
        ...prev,
        ...items.map((ans) => ({ type: "ai", content: ans })),
      ]);
      setQuestion("");
    } catch (err) {
      console.error("Error fetching AI:", err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div
      className={`w-full h-screen flex ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0 transition-transform duration-300
  w-64 md:relative absolute top-0 left-0 h-full z-20
  flex flex-col border-r
  ${darkMode ? "bg-zinc-800 text-white" : "bg-zinc-200 text-black"}
`}
      >
        {/* Header with AI Icon */}
        <a
  href="https://github.com/outgoingrudra"
  target="_blank"
  rel="noopener noreferrer"
  className="text-center text-xl font-semibold py-4 border-b sticky top-0 bg-inherit z-10 flex items-center justify-center gap-2 hover:underline cursor-pointer"
>
  <img
    src="https://img.icons8.com/fluency/48/robot-2.png"
    alt="AI Icon"
    className="w-6 h-6"
  />
  Rudra's AI
</a>


        {/* Scrollable Chat Titles */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-3">
          {chatHistory
            .filter((msg) => msg.type === "user")
            .map((msg, idx) => (
              <div
                key={idx}
                className="text-sm p-2 rounded-lg break-words bg-opacity-70 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
              >
                {msg.content}
              </div>
            ))}
        </div>

        {/* Theme Toggle Button */}
        <div className="pt-2 pb-3 px-4 border-t">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full py-1 rounded-full border text-sm hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
          >
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* User Menu Button */}
        <div className="relative border-t px-4 py-3 bg-inherit">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              R
            </div>
            <span className="text-sm font-medium">Rudra</span>
          </button>

          {/* Dropdown Menu */}
          {userMenuOpen && (
            <div
              className={`absolute bottom-14 left-4 w-48 border rounded-md shadow-lg py-1 z-50 
        ${darkMode ? "bg-zinc-800 text-white" : "bg-white text-black"}`}
            >
              <button className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm transition">
                👤 Profile
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm transition">
                ⚙️ Settings
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm transition">
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-3 left-3 md:hidden z-30 p-2 rounded-full bg-zinc-800 text-white"
        >
          <Menu size={24} />
        </button>

        {/* Message Display */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-xl ${
                  msg.type === "user"
                    ? "bg-blue-600 text-white"
                    : darkMode
                    ? "bg-zinc-800 text-white"
                    : "bg-zinc-100 text-black"
                }`}
              >
                {msg.type === "ai" ? (
                  <Answer ans={msg.content} />
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <div
          className={`sticky bottom-0 left-0 w-full z-10 p-3 flex gap-2 border-t ${
            darkMode
              ? "bg-zinc-900 border-zinc-700"
              : "bg-zinc-100 border-zinc-300"
          }`}
        >
          <input
            type="text"
            className={`flex-1 p-3 rounded-xl outline-none ${
              darkMode ? "bg-zinc-800 text-white" : "bg-white text-black"
            }`}
            placeholder="Write your message..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askQuestion()}
          />
          <button
            className="bg-blue-600 px-4 rounded-xl text-white"
            onClick={askQuestion}
          >
            ASK
          </button>
        </div>
      </div>
    </div>
  );
}
