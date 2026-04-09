import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft as ArrowLeftIcon,
  Users as UsersIcon,
  Play as PlayIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
} from "@phosphor-icons/react";

const LocalLobby = () => {
  const navigate = useNavigate();
  const [numPlayers, setNumPlayers] = useState(2);
  const [targetScore, setTargetScore] = useState(50);
  const [names, setNames] = useState([
    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4",
  ]);

  const updateName = (idx, val) => {
    setNames((prev) => {
      const updated = [...prev];
      updated[idx] = val;
      return updated;
    });
  };

  const handleStart = () => {
    const state = { targetScore };
    for (let i = 0; i < numPlayers; i++) {
      state[`player${i + 1}`] = names[i] || `Player ${i + 1}`;
    }
    navigate("/local-game", { state });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra p-4 md:p-8 relative flex flex-col items-center justify-center">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none z-0"></div>
      <div
        className="fixed inset-0 opacity-[0.04] mix-blend-screen pointer-events-none z-0"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      ></div>

      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 left-4 md:top-8 md:left-8 flex items-center gap-2 bg-[#18181b] border-2 border-zinc-800 border-b-[3px] text-zinc-400 hover:text-white hover:bg-zinc-800 active:border-b-[1px] active:translate-y-[2px] transition-all px-4 py-2 rounded-xl uppercase font-black text-[10px] tracking-widest z-10"
      >
        <ArrowLeftIcon size={16} weight="bold" />
        Dashboard
      </button>

      <div className="relative z-10 text-center max-w-md w-full mt-10 md:mt-0">
        <div className="mx-auto w-24 h-24 bg-zinc-900 border-4 border-zinc-800 border-b-[6px] rounded-[24px] flex items-center justify-center mb-6 relative">
          <UsersIcon size={48} className="text-orange-500" weight="fill" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bebas tracking-wide mb-2 text-white">
          Local Co-op
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-8">
          Pass and play on the same device.
        </p>

        <div className="bg-[#18181b] border-2 border-zinc-800 border-b-[6px] p-6 md:p-8 rounded-[24px] relative text-left">
          {/* Player Count Selector */}
          <div className="flex items-center justify-between mb-4 bg-zinc-900 border-2 border-zinc-800 border-b-[4px] rounded-2xl p-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Number of Players
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setNumPlayers((p) => Math.max(2, p - 1))}
                disabled={numPlayers <= 2}
                className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 border-b-2 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 active:border-b-0 active:translate-y-[2px] disabled:opacity-30 disabled:active:border-b-2 disabled:active:translate-y-0 transition-all"
              >
                <MinusIcon size={14} weight="bold" />
              </button>
              <span className="text-2xl font-mono font-bold text-orange-500 w-6 text-center">
                {numPlayers}
              </span>
              <button
                onClick={() => setNumPlayers((p) => Math.min(4, p + 1))}
                disabled={numPlayers >= 4}
                className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 border-b-2 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 active:border-b-0 active:translate-y-[2px] disabled:opacity-30 disabled:active:border-b-2 disabled:active:translate-y-0 transition-all"
              >
                <PlusIcon size={14} weight="bold" />
              </button>
            </div>
          </div>

          {/* Target Score Selector */}
          <div className="flex items-center justify-between mb-6 bg-zinc-900 border-2 border-zinc-800 border-b-[4px] rounded-2xl p-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Target Score to Win
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTargetScore((p) => Math.max(10, p - 10))}
                disabled={targetScore <= 10}
                className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 border-b-2 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 active:border-b-0 active:translate-y-[2px] disabled:opacity-30 disabled:active:border-b-2 disabled:active:translate-y-0 transition-all"
              >
                <MinusIcon size={14} weight="bold" />
              </button>
              <span className="text-2xl font-mono font-bold text-orange-500 w-10 text-center">
                {targetScore}
              </span>
              <button
                onClick={() => setTargetScore((p) => Math.min(200, p + 10))}
                disabled={targetScore >= 200}
                className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 border-b-2 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 active:border-b-0 active:translate-y-[2px] disabled:opacity-30 disabled:active:border-b-2 disabled:active:translate-y-0 transition-all"
              >
                <PlusIcon size={14} weight="bold" />
              </button>
            </div>
          </div>

          {/* Player Name Inputs */}
          <div className="flex flex-col gap-4 mb-6">
            {Array.from({ length: numPlayers }).map((_, i) => (
              <div key={i}>
                <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1 pl-1">
                  Player {i + 1} Name{" "}
                  {i === 0 && (
                    <span className="text-orange-500/80">(Starts First)</span>
                  )}
                </label>
                <input
                  type="text"
                  value={names[i]}
                  onChange={(e) => updateName(i, e.target.value)}
                  className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-all font-mono text-sm"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-orange-500 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl border-2 border-orange-700 border-b-[4px] hover:bg-orange-400 active:border-b-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 text-xs"
          >
            <PlayIcon size={20} weight="fill" /> Start Local Match
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalLobby;
