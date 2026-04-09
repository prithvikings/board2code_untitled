import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  GameControllerIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";

const RankedLobby = () => {
  const navigate = useNavigate();
  const [searching, setSearching] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (searching) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [searching]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra p-6 md:p-12 relative flex flex-col items-center justify-center">
      {/* Premium Masked Grid */}
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
        <div className="mx-auto w-20 h-20 bg-lime-950/30 border border-lime-900/50 rounded-2xl flex items-center justify-center mb-8 relative">
          <GameControllerIcon
            size={40}
            className="text-lime-400"
            weight="duotone"
          />
          {searching && (
            <div className="absolute inset-0 border-2 border-dashed border-lime-400/50 rounded-2xl animate-spin-slow"></div>
          )}
        </div>

        <h1 className="text-5xl font-bebas tracking-wide mb-2 text-zinc-100">
          Ranked Matchmaking
        </h1>
        <p className="text-zinc-400 font-poppins mb-12 text-sm">
          Search for opponents globally and climb the leaderboard.
        </p>

        <div className="bg-[#0f0f11] border border-zinc-800/80 p-8 md:p-10 rounded-2xl relative shadow-2xl">
          {!searching ? (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center bg-[#18181b] p-4 rounded-xl border border-zinc-800">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Current ELO
                </span>
                <span className="text-lime-400 font-mono font-bold text-lg">
                  1254
                </span>
              </div>
              <button
                onClick={() => setSearching(true)}
                className="w-full bg-[#18181b] text-white font-bold uppercase tracking-widest py-3.5 rounded-xl border-2 border-[#a3e635] shadow-[0px_4px_0px_0px_#a3e635] hover:bg-[#27272a] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#a3e635] active:shadow-[0px_0px_0px_0px_#a3e635] active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <MagnifyingGlassIcon size={20} weight="bold" /> Find Match
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6 items-center">
              <div className="flex gap-2 mb-2">
                <span
                  className="w-2.5 h-2.5 bg-lime-400 border border-lime-200 rounded-sm animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2.5 h-2.5 bg-lime-400 border border-lime-200 rounded-sm animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2.5 h-2.5 bg-lime-400 border border-lime-200 rounded-sm animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
              <div className="text-center">
                <p className="text-zinc-300 font-bold tracking-widest uppercase text-xs mb-2">
                  Searching Network...
                </p>
                <p className="text-lime-400/80 font-mono text-sm bg-lime-500/10 px-3 py-1 rounded-md border border-lime-500/20 inline-block">
                  Elapsed: 00:{timer.toString().padStart(2, "0")}
                </p>
              </div>

              <button
                onClick={() => setSearching(false)}
                className="w-full mt-4 bg-[#18181b] border-2 border-red-500/80 text-red-400 hover:text-red-300 font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-[#27272a] transition-all text-xs"
              >
                Cancel Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RankedLobby;
