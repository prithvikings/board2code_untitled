import React from "react";
import { useNavigate } from "react-router-dom";
import {
  GameControllerIcon,
  SwordIcon,
  SparkleIcon,
} from "@phosphor-icons/react";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto py-32 px-6">
      <div className="bg-[#a3e635] rounded-3xl p-10 md:p-16 text-center border-4 border-[#18181b] shadow-[12px_12px_0px_0px_#27272a] hover:shadow-[16px_16px_0px_0px_#27272a] transition-shadow duration-500 relative overflow-hidden group">
        {/* Abstract Board Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b15_1px,transparent_1px),linear-gradient(to_bottom,#18181b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        {/* Ambient background glows */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Floating Decorative Icons */}
        <SwordIcon className="absolute top-10 left-10 w-12 h-12 text-zinc-900/20 group-hover:rotate-12 transition-transform duration-500 hidden md:block" />
        <SparkleIcon className="absolute bottom-10 right-10 w-10 h-10 text-zinc-900/20 group-hover:animate-pulse hidden md:block" />

        <div className="relative z-10">
          <h2 className="font-bebas text-6xl md:text-8xl text-[#18181b] tracking-wide leading-[0.9] mb-6 drop-shadow-sm">
            Topple The
            <br />
            <span className="relative inline-block">
              Competition.
              <svg
                className="absolute w-full h-4 -bottom-1 left-0 text-[#18181b] opacity-80"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 8 Q 50 2 100 8"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                />
              </svg>
            </span>
          </h2>

          <p className="text-zinc-800 text-lg md:text-xl font-bold max-w-xl mx-auto mb-10 font-poppins">
            Built in 24 hours for NPC Board2Code 2026. A fully playable,
            turn-based strategic experience. Are you ready to claim the title of
            Tiki Master?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#18181b] text-white font-black uppercase tracking-widest px-10 py-5 rounded-xl border-2 border-[#18181b] shadow-[0px_6px_0px_0px_#27272a] hover:bg-[#27272a] hover:shadow-[0px_4px_0px_0px_#27272a] hover:translate-y-[2px] active:shadow-[0px_0px_0px_0px_#27272a] active:translate-y-[6px] transition-all cursor-pointer text-xl"
            >
              <GameControllerIcon className="text-lime-400" size={28} />
              Play Tiki Topple
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-10">
            <div className="w-2 h-2 rounded-full bg-green-700 animate-pulse"></div>
            <p className="text-zinc-800 text-xs font-black uppercase tracking-widest font-chakra">
              Multiplayer Enabled • Auto-Scoring • Instant Play
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
