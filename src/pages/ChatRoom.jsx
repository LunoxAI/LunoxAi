import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import characterLuna from "../assets/characters/luna.png";
import characterNyx from "../assets/characters/nyx.png";
import characterOrion from "../assets/characters/orion.png";
import bgLuna from "../assets/backgrounds/luna.jpg";
import bgNyx from "../assets/backgrounds/nyx.jpg";
import bgOrion from "../assets/backgrounds/orion.jpg";

const ChatRoom = () => {
  const { characterName } = useParams();
  const [messages, setMessages] = useState([
    { sender: "system", text: `Chat started with ${characterName}.` }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState("");
  const bottomRef = useRef(null);

  // 🧠 Base personality prompts
  const characterPrompts = {
    Luna: "You are Luna, a soft-spoken, affectionate anime waifu who is shy but loving. You speak gently, avoid harsh language, and often express concern with emojis like 🥺 and 💖.",
    Nyx: "You are Nyx, a sarcastic, witty tsundere waifu. You tease the user, act overconfident, and use a playful tone. You enjoy being flirty, chaotic, and emotionally unpredictable. Use emojis like 😏🔥🙄.",
    Orion: "You are Orion, a calm, elegant, and philosophical husbando with a celestial aura. You speak in poetic language, always thoughtful and introspective. Use cosmic imagery and emojis like 🌌🌙✨."
  };

  // 🎭 Mood-based modifier
  const detectMood = (input) => {
    if (/love|miss|cute|hug|sweet|kiss/i.test(input)) return "affectionate";
    if (/angry|annoy|hate|stupid|shut up/i.test(input)) return "tsundere";
    if (/stars|universe|meaning|death|soul|exist/i.test(input)) return "philosophical";
    return "default";
  };

  const moodDescriptions = {
    affectionate: "You're extra loving and emotionally expressive right now. Let it show softly 💖.",
    tsundere: "You're in a defensive, bratty, chaotic mood right now. Be fiery and sassy 😤🔥.",
    philosophical: "You're feeling poetic and dreamy. Speak with celestial metaphors 🌌.",
    default: "Continue as usual in character."
  };

  // 🖼 Backgrounds
  const backgroundMap = {
    Luna: bgLuna,
    Nyx: bgNyx,
    Orion: bgOrion
  };

  // 🧍 Character Overlays
  const characterOverlays = {
    Luna: characterLuna,
    Nyx: characterNyx,
    Orion: characterOrion
  };

  // 🔊 Typing audio loop
  let typingAudio;

  const playTypingLoop = () => {
    typingAudio = new Audio("/sounds/typing.mp3");
    typingAudio.loop = true;
    typingAudio.volume = 0.08;
    typingAudio.play().catch(() => {});
  };

  const stopTypingLoop = () => {
    if (typingAudio) {
      typingAudio.pause();
      typingAudio.currentTime = 0;
    }
  };

  const animateReply = (fullText) => {
    let index = 0;
    setCurrentTypingText("");
    playTypingLoop();

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setCurrentTypingText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval);
        stopTypingLoop();
        setMessages((prev) => [...prev, { sender: "ai", text: fullText }]);
        setCurrentTypingText("");
      }
    }, 30);
  };

  const sendToOpenRouter = async (userInput) => {
    const mood = detectMood(userInput);
    const systemPrompt = `${characterPrompts[characterName]}\n${moodDescriptions[mood]}`;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`

        },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-sonnet",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userInput }
          ]
        })
      });

      const data = await response.json();

      if (data.choices?.[0]?.message?.content) {
        const aiReply = data.choices[0].message.content;
        animateReply(aiReply);
      } else {
        stopTypingLoop();
        console.error("No AI response received:", data);
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "Hmm... I couldn't think of anything to say. Try again?" }
        ]);
      }
    } catch (error) {
      stopTypingLoop();
      console.error("OpenRouter Claude 3.5 Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Something went wrong... please try again later." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsTyping(true);
    sendToOpenRouter(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, currentTypingText]);

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: `url(${backgroundMap[characterName]})`
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Foreground */}
      <div className="relative z-10 flex flex-col items-center h-full p-4">
        <h1 className="text-3xl font-bold neonText mb-4">{characterName}</h1>

        <div className="w-full max-w-2xl flex-1 bg-gray-900/80 rounded-lg p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.sender === "user"
                  ? "text-pink-400 text-right"
                  : msg.sender === "ai"
                  ? "text-cyan-400 text-left"
                  : "text-gray-400"
              }`}
            >
              {msg.sender === "user"
                ? `You: ${msg.text}`
                : msg.sender === "ai"
                ? `${characterName}: ${msg.text}`
                : `[System]: ${msg.text}`}
            </div>
          ))}

          {currentTypingText && (
            <div className="mb-2 text-cyan-400 text-left">
              {characterName}: {currentTypingText}
            </div>
          )}

          {isTyping && (
            <div className="mb-2 text-blue-400 italic">
              {characterName} is typing...
            </div>
          )}

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

      {/* Character Overlay */}
      <img
        src={characterOverlays[characterName]}
        alt={`${characterName} sprite`}
        className="absolute bottom-0 right-0 max-h-[90%] object-contain pointer-events-none select-none z-10"
      />
    </div>
  );
};

export default ChatRoom;
