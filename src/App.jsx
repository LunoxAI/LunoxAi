import { useEffect, useState } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Portal from "./pages/Portal";
import SelectCharacter from "./pages/SelectCharacter";
import ChatRoom from "./pages/ChatRoom";
import GlobalAudioProvider from "./components/GlobalAudioProvider"; // ✅

const App = () => {
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <GlobalAudioProvider> {/* ✅ Wrap the routes, not separate */}
            <Router>
              <Routes>
                <Route path="/" element={<Portal />} />
                <Route path="/select" element={<SelectCharacter />} />
                <Route path="/chat/:characterName" element={<ChatRoom />} />
              </Routes>
            </Router>
          </GlobalAudioProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;