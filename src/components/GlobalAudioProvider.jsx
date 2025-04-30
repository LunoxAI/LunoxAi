import { useEffect, useRef, useState } from "react";
import bgMusic from "../assets/audio/charselect-bgm.mp3";

const GlobalAudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(() => {
    // Load from localStorage if available
    return localStorage.getItem("LunoxMuted") === "true";
  });

  useEffect(() => {
    const audio = new Audio(bgMusic);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    audio.muted = muted; // Apply mute on creation

    const unlockAudio = () => {
      audio.play().catch(() => {});
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMute = !audioRef.current.muted;
    audioRef.current.muted = newMute;
    setMuted(newMute);
    localStorage.setItem("LunoxMuted", newMute);
  };

  return (
    <>
      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 bg-black/60 text-white px-3 py-1 rounded-full text-sm hover:bg-pink-600 transition"
      >
        {muted ? "🔇 Mute" : "🔊 Sound"}
      </button>
      {children}
    </>
  );
};

export default GlobalAudioProvider;
