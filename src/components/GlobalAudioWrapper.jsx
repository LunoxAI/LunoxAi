import { useEffect, useRef } from "react";
import bgMusic from "./assets/audio/charselect-bgm.mp3";

const GlobalAudioWrapper = ({ children }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(bgMusic);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // Autoplay handling
    const playAudio = () => {
      audio.play().catch(() => {});
      document.removeEventListener("click", playAudio);
    };

    document.addEventListener("click", playAudio);

    return () => {
      audio.pause();
    };
  }, []);

  return <>{children}</>;
};

export default GlobalAudioWrapper;
