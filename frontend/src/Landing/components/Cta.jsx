import React from "react";
import { useNavigate } from "react-router-dom";
import {
  GameController as GameControllerIcon,
  Sword as SwordIcon,
  Sparkle as SparkleIcon,
} from "@phosphor-icons/react";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      {/* Giant Solid Block (Proportions reduced) */}
      <div className="bg-lime-500 rounded-[32px] p-8 md:p-12 text-center border-4 border-lime-700 border-b-[10px] transition-transform duration-200 hover:-translate-y-1.5 relative overflow-hidden group">
        {/* Simple geometric pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#18181b15_3px,transparent_3px)] bg-[size:24px_24px] pointer-events-none"></div>

        {/* Solid Floating Decorative Icons (Scaled Down) */}
        <SwordIcon
          className="absolute top-8 left-8 w-12 h-12 text-lime-700/50 group-hover:rotate-12 transition-transform duration-200 hidden md:block"
          weight="fill"
        />
        <SparkleIcon
          className="absolute bottom-8 right-8 w-12 h-12 text-lime-700/50 hidden md:block"
          weight="fill"
        />

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="font-bebas text-5xl md:text-7xl text-zinc-950 tracking-wide leading-[0.9] mb-4">
            Topple The
            <br />
            Competition.
          </h2>

          <p className="text-lime-950 text-sm md:text-base font-bold max-w-lg mx-auto mb-8 leading-relaxed">
            Built in 24 hours for NPC Board2Code 2026. A fully playable,
            turn-based strategic experience. Are you ready to claim the title of
            Tiki Master?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xs">
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-center gap-2 bg-zinc-950 text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl border-2 border-zinc-800 border-b-[6px] hover:bg-zinc-800 active:border-b-[2px] active:translate-y-[4px] transition-all cursor-pointer text-lg"
            >
              <GameControllerIcon
                className="text-lime-500"
                size={24}
                weight="fill"
              />
              Play Now
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8 bg-lime-600/20 border-2 border-lime-600/30 px-4 py-2 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-zinc-950 animate-pulse border-2 border-lime-500"></div>
            <p className="text-zinc-950 text-[10px] font-black uppercase tracking-widest">
              Multiplayer Enabled • Auto-Scoring • Instant Play
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
