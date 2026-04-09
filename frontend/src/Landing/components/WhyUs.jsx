import React from "react";
import { SkullIcon, CrownIcon, CaretRightIcon } from "@phosphor-icons/react";

const WhyUs = () => {
  return (
    <div className="relative max-w-6xl mx-auto py-32 px-6 text-center overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-zinc-800/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* The Hook */}
      <div className="relative z-10">
        <h2 className="font-bebas text-6xl md:text-8xl text-white uppercase tracking-wide mb-8 leading-[0.9] drop-shadow-lg">
          This Isn’t Just Moving.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-200">
            It’s Stacking Strategy.
          </span>
        </h2>

        {/* The Build-up */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-lg md:text-2xl text-zinc-400 font-chakra font-medium mb-20">
          <p className="flex items-center gap-2">
            Every turn counts{" "}
            <CaretRightIcon
              className="hidden md:block text-zinc-700"
              size={20}
            />
          </p>
          <p className="flex items-center gap-2">
            Every reorder matters{" "}
            <CaretRightIcon
              className="hidden md:block text-zinc-700"
              size={20}
            />
          </p>
          <p className="text-zinc-200">Every move is calculated</p>
        </div>
      </div>

      {/* The Ultimatum */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left relative z-10">
        {/* Loser Card */}
        <div className="group relative bg-gradient-to-br from-[#18181b] to-[#121214] p-10 rounded-3xl border-2 border-zinc-800/80 hover:border-red-900/50 transition-all duration-500 overflow-hidden mt-0 md:mt-8">
          <SkullIcon className="absolute -bottom-6 -right-6 w-48 h-48 text-zinc-900/50 group-hover:text-red-900/10 transition-colors duration-500 rotate-12" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 text-zinc-500 font-bold tracking-widest text-xs uppercase mb-4">
              <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
              Mindless Moving
            </span>
            <p className="text-3xl md:text-4xl font-bold text-zinc-400 leading-tight font-poppins">
              If you just push tokens forward,{" "}
              <br className="hidden md:block" />
              <span className="text-red-500/90 group-hover:text-red-500 transition-colors">
                you fall behind.
              </span>
            </p>
          </div>
        </div>

        {/* Winner Card */}
        <div className="group relative bg-gradient-to-br from-[#18181b] to-[#0a0a0a] p-10 rounded-3xl border-2 border-[#a3e635]/80 shadow-[0px_8px_0px_0px_rgba(163,230,53,0.8)] hover:shadow-[0px_12px_0px_0px_rgba(163,230,53,1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden md:-mt-8">
          {/* Ambient inner glow */}
          <div className="absolute inset-0 bg-lime-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <CrownIcon className="absolute -top-6 -right-6 w-48 h-48 text-lime-900/20 group-hover:text-lime-500/10 transition-colors duration-500 -rotate-12" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 text-[#a3e635] font-bold tracking-widest text-xs uppercase mb-4">
              <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></div>
              Tiki Master
            </span>
            <p className="text-3xl md:text-4xl font-bold text-white leading-tight font-poppins">
              If you master the stack, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-white">
                you dominate.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
