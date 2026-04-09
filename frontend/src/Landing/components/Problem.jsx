import React from "react";
import {
  WarningCircle as WarningCircleIcon,
  Target as TargetIcon,
} from "@phosphor-icons/react";

const Problem = () => {
  return (
    <div
      id="rules"
      className="text-zinc-100 max-w-5xl mx-auto py-20 px-6 relative"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 relative z-10">
        {/* Left Side Typography */}
        <div className="flex-1">
          <h2 className="font-bebas text-5xl md:text-7xl leading-[0.9] tracking-wide text-white">
            Master
            <span className="text-zinc-500"> The</span> <br />
            <span className="text-lime-500 relative inline-block">
              Stack Easily.
              {/* Thick solid underline (Scaled Down) */}
              <div className="absolute w-full h-3 -bottom-1 left-0 bg-lime-500 rounded-full border-b-[3px] border-lime-700 -z-10"></div>
            </span>
          </h2>
        </div>

        {/* Right Side Solid Card */}
        <div className="flex-1 w-full group pl-2 pt-4 md:pl-6 md:pt-6 relative">
          {/* Thick Solid Badge (Scaled Down) */}
          <div className="absolute -top-4 -left-2 md:-left-4 bg-lime-500 text-zinc-950 font-black uppercase tracking-widest px-4 py-1.5 rounded-xl transform -rotate-3 border-2 border-lime-700 border-b-4 flex items-center gap-1.5 z-20 group-hover:rotate-0 group-hover:-translate-y-1 transition-all duration-200 text-[10px] md:text-xs">
            <WarningCircleIcon size={16} weight="bold" />
            The Challenge
          </div>

          {/* Chunky Card (Scaled Down) */}
          <div className="bg-[#18181b] p-6 md:p-8 rounded-[24px] border-2 border-zinc-800 border-b-[6px] transition-all duration-200 relative overflow-hidden">
            <TargetIcon
              className="text-zinc-800 absolute right-6 top-6 w-20 h-20 opacity-30 group-hover:rotate-12 transition-transform duration-300 z-10"
              weight="fill"
            />

            <p className="text-xl md:text-2xl text-white font-black leading-snug mt-5 relative z-10">
              It's not just about moving pieces. It's about manipulating the{" "}
              <span className="text-lime-500 bg-lime-500/10 px-2 py-0.5 rounded-lg border-b-[3px] border-lime-500/20 inline-block mt-1">
                entire stack order
              </span>
              .
            </p>

            <div className="w-full h-1.5 bg-zinc-800 rounded-full my-6 relative z-10"></div>

            <p className="text-sm text-zinc-400 font-medium leading-relaxed relative z-10">
              Tiki Topple is a turn-based strategic game where controlling the
              sequence is the only way to maximize your final score. Plan ahead,
              adapt to your opponents, or fall behind.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;
