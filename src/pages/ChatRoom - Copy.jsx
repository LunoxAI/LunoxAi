import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

const ChatRoom = () => {
  const { characterName } = useParams();
  const [messages, setMessages] = useState([
    { sender: "system", text: `Chat started with ${characterName}.` }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold neonText mb-6">{characterName}</h1>

      <div className="w-full max-w-2xl flex-1 bg-gray-900 rounded-lg p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "user" ? "text-pink-400 text-right" : "text-gray-400"
            }`}
          >
            {msg.sender === "user" ? `You: ${msg.text}` : `[System]: ${msg.text}`}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="w-full max-w-2xl mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-l-lg bg-gray-800 text-white outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-pink-600 hover:bg-pink-700 p-3 rounded-r-lg font-bold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
