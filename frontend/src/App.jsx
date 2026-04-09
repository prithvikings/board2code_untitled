import React from "react";
import { Routes, Route } from "react-router-dom";
import Hero from "./Landing/Hero";
import Login from "./Auth/Login";
import Dashboard from "./Dashboard/Dashboard";
import RankedLobby from "./Dashboard/Modes/RankedLobby";
import BotLobby from "./Dashboard/Modes/BotLobby";
import LocalLobby from "./Dashboard/Modes/LocalLobby";
import CustomLobby from "./Dashboard/Modes/CustomLobby";

const App = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-lime-400 selection:text-zinc-900 font-chakra antialiased scroll-smooth">
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/ranked" element={<RankedLobby />} />
        <Route path="/dashboard/bot" element={<BotLobby />} />
        <Route path="/dashboard/local" element={<LocalLobby />} />
        <Route path="/dashboard/custom" element={<CustomLobby />} />
      </Routes>
    </div>
  );
};

export default App;
