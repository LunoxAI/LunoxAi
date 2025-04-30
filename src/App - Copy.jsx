import { useEffect, useState } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Portal from "./pages/Portal";
import SelectCharacter from "./pages/SelectCharacter";
import ChatRoom from "./pages/ChatRoom";

const App = () => {
  const wallets = [new PhantomWalletAdapter()];
  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Portal />} />
              <Route path="/select" element={<SelectCharacter />} />
              <Route path="/chat" element={<ChatRoom />} />
            </Routes>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
