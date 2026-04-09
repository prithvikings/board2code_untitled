import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, UsersIcon, PlayIcon } from "@phosphor-icons/react";

const LocalLobby = () => {
  const navigate = useNavigate();
  const [player1, setPlayer1] = useState("Player 1");
  const [player2, setPlayer2] = useState("Player 2");

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
        <div className="mx-auto w-20 h-20 bg-orange-950/30 border border-orange-900/50 rounded-2xl flex items-center justify-center mb-8 relative">
          <UsersIcon size={40} className="text-orange-400" weight="duotone" />
        </div>

        <h1 className="text-5xl font-bebas tracking-wide mb-2 text-zinc-100">
          Local Co-op
        </h1>
        <p className="text-zinc-400 font-poppins mb-12 text-sm">
          Pass and play on the same device. Settle the score in person.
        </p>

        <div className="bg-[#0f0f11] border border-zinc-800/80 p-8 md:p-10 rounded-2xl relative text-left shadow-2xl">
          <div className="flex flex-col gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                Player 1 Name{" "}
                <span className="text-orange-400/80">(Starts First)</span>
              </label>
              <input
                type="text"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                Player 2 Name
              </label>
              <input
                type="text"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all font-mono text-sm"
              />
            </div>
          </div>

          <button 
            onClick={() => navigate("/game", { state: { player1, player2 } })}
            className="w-full bg-[#18181b] text-white font-bold uppercase tracking-widest py-3.5 rounded-xl border-2 border-[#fb923c] shadow-[0px_4px_0px_0px_#fb923c] hover:bg-[#27272a] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#fb923c] active:shadow-[0px_0px_0px_0px_#fb923c] active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <PlayIcon size={20} weight="fill" /> Start Local Match
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalLobby;
