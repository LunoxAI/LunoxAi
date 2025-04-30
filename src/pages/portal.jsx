import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useNavigate } from "react-router-dom";

const Portal = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/select");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Video */}
     <video
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 w-full h-full object-cover z-0"
>
  <source src="/videos/portal-bg.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>



      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

      {/* Foreground UI */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold neonText drop-shadow-lg">
          Welcome to LunoxAI
        </h1>

        <WalletMultiButton className="!bg-gray-800 !text-white hover:!bg-pink-600 transition" />

        <button
          onClick={handleEnter}
          className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition"
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default Portal;
