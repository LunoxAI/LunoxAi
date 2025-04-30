import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Image imports
import lunaImg from "../assets/characters/luna.png";
import nyxImg from "../assets/characters/nyx.png";
import orionImg from "../assets/characters/orion.png";
import bgImage from "../assets/backgrounds/charselect-bg.jpg"; // ✅ Your new background image

const characters = [
  {
    name: "Nyx",
    image: nyxImg,
    bio: "A chaotic tsundere with sharp wit and fiery attitude. She teases you relentlessly. 😏🔥",
  },
  {
    name: "Luna",
    image: lunaImg,
    bio: "A shy sweetheart who speaks softly and cares deeply. Always hopeful. 💖🥺",
  },
  {
    name: "Orion",
    image: orionImg,
    bio: "An elegant poetic soul who sees the universe through metaphors. 🌌✨",
  },
];

const SelectCharacter = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelect = (characterName) => {
    navigate(`/chat/${characterName}`);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-center px-6"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-4xl font-bold neonText mb-10 z-10">Select Your Character</h1>

      <div className="flex flex-wrap justify-center gap-8 max-w-5xl z-10">
        {characters.map((char, index) => (
          <div
            key={char.name}
            className={`relative w-64 h-[400px] bg-[#111827] border-2 border-pink-500 rounded-xl p-4 shadow-lg transition-all duration-300 transform hover:scale-105 overflow-hidden group
            ${mounted ? `opacity-0 translate-y-5 animate-fade-in-up delay-${index * 100}` : ""}`}
            onClick={() => handleSelect(char.name)}
          >
            <img
              src={char.image}
              alt={char.name}
              className="w-full h-[320px] object-contain"
            />
            <h2 className="mt-3 text-center text-white font-semibold text-lg">
              {char.name}
            </h2>

            <div className="absolute inset-0 bg-black bg-opacity-80 text-white opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-sm p-4 text-center">
              {char.bio}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectCharacter;
