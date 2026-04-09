import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, RobotIcon, PlayIcon } from "@phosphor-icons/react";

const BotLobby = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("medium");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra p-6 md:p-12 relative flex flex-col items-center justify-center">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_80%)] pointer-events-none z-0"></div>

      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors uppercase font-bold text-[10px] tracking-widest z-10 group"
      >
        <ArrowLeftIcon
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Dashboard
      </button>

      <div className="relative z-10 text-center max-w-lg w-full">
        <div className="mx-auto w-20 h-20 bg-blue-950/30 border border-blue-900/50 rounded-2xl flex items-center justify-center mb-8 relative">
          <RobotIcon size={40} className="text-blue-400" weight="duotone" />
        </div>

        <h1 className="text-5xl font-bebas tracking-wide mb-2 text-zinc-100">
          Play vs AI
        </h1>
        <p className="text-zinc-400 font-poppins mb-12 text-sm">
          Hone your stacking strategies against our Tiki Bot.
        </p>

        <div className="bg-[#0f0f11] border border-zinc-800/80 p-8 md:p-10 rounded-2xl relative text-left shadow-2xl">
          <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4">
            Select AI Difficulty
          </h3>

          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
            <button
              onClick={() => setDifficulty("easy")}
              className={`py-3.5 rounded-xl border-2 font-bold uppercase tracking-widest text-[10px] transition-all flex flex-col items-center gap-1 ${difficulty === "easy" ? "bg-[#18181b] border-green-500 text-green-400 shadow-[0px_4px_0px_0px_#22c55e] -translate-y-0.5" : "bg-[#18181b] border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"}`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficulty("medium")}
              className={`py-3.5 rounded-xl border-2 font-bold uppercase tracking-widest text-[10px] transition-all flex flex-col items-center gap-1 ${difficulty === "medium" ? "bg-[#18181b] border-blue-500 text-blue-400 shadow-[0px_4px_0px_0px_#3b82f6] -translate-y-0.5" : "bg-[#18181b] border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"}`}
            >
              Medium
            </button>
            <button
              onClick={() => setDifficulty("hard")}
              className={`py-3.5 rounded-xl border-2 font-bold uppercase tracking-widest text-[10px] transition-all flex flex-col items-center gap-1 ${difficulty === "hard" ? "bg-[#18181b] border-red-500 text-red-500 shadow-[0px_4px_0px_0px_#ef4444] -translate-y-0.5" : "bg-[#18181b] border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"}`}
            >
              Hard
            </button>
          </div>

          <button className="w-full bg-[#18181b] text-white font-bold uppercase tracking-widest py-3.5 rounded-xl border-2 border-[#60a5fa] shadow-[0px_4px_0px_0px_#60a5fa] hover:bg-[#27272a] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#60a5fa] active:shadow-[0px_0px_0px_0px_#60a5fa] active:translate-y-1 transition-all flex items-center justify-center gap-2">
            <PlayIcon size={20} weight="fill" /> Start Bot Match
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotLobby;
