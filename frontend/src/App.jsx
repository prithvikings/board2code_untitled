import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { AudioProvider } from "./context/AudioContext";
import { SocketProvider } from "./context/SocketContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Hero from "./Landing/Hero";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Dashboard from "./Dashboard/Dashboard";
import RankedLobby from "./Dashboard/Modes/RankedLobby";
import BotLobby from "./Dashboard/Modes/BotLobby";
import LocalLobby from "./Dashboard/Modes/LocalLobby";
import CustomLobby from "./Dashboard/Modes/CustomLobby";
import Rules from "./Pages/Rules";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import Terms from "./Pages/Terms";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";
import Game from "./Game/Game";
import LocalGame from "./Game/LocalGame";
import BotGame from "./Game/BotGame";

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <AudioProvider>
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-lime-400 selection:text-zinc-900 font-chakra antialiased scroll-smooth">
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "#18181b",
                color: "#fff",
                border: "1px solid #27272a",
                fontFamily: "Chakra Petch",
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/ranked" element={<RankedLobby />} />
              <Route path="/dashboard/bot" element={<BotLobby />} />
              <Route path="/dashboard/local" element={<LocalLobby />} />
              <Route path="/dashboard/custom" element={<CustomLobby />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/game" element={<Game />} />
              <Route path="/local-game" element={<LocalGame />} />
              <Route path="/bot-game" element={<BotGame />} />
            </Route>
          </Routes>
        </div>
        </AudioProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
