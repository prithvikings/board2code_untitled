import React from "react";
import { WarningCircleIcon, TargetIcon } from "@phosphor-icons/react";

const Problem = () => {
  return (
    <div
      id="rules"
      className="text-zinc-100 max-w-5xl mx-auto py-24 px-6 relative"
    >
      {/* Ambient glow for the section */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-lime-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
        <div className="flex-1">
          <h2 className="font-bebas text-6xl md:text-8xl leading-[0.9] tracking-wide drop-shadow-md">
            Master <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-400">
              The
            </span>{" "}
            <br />
            <span className="text-[#a3e635] relative inline-block">
              Stack.
              {/* Decorative underline */}
              <svg
                className="absolute w-full h-3 -bottom-2 left-0 text-[#a3e635] opacity-70"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                />
              </svg>
            </span>
          </h2>
        </div>

        <div className="flex-1 w-full group perspective-1000">
          {/* Neo-brutalist Card with Hover Lift & Inner Grid */}
          <div className="bg-[#18181b] p-8 md:p-10 rounded-2xl border-2 border-zinc-800 shadow-[8px_8px_0px_0px_#27272a] group-hover:shadow-[12px_12px_0px_0px_#a3e635] group-hover:-translate-y-2 group-hover:-translate-x-2 transition-all duration-300 relative overflow-hidden">
            {/* Subtle inner grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

            {/* Badge */}
            <div className="absolute -top-4 -left-4 bg-[#a3e635] text-zinc-900 font-chakra font-bold px-4 py-1.5 rounded-md transform -rotate-3 border-2 border-[#18181b] tracking-wider text-sm flex items-center gap-2 shadow-lg z-10">
              <WarningCircleIcon size={16} strokeWidth={3} />
              THE CHALLENGE
            </div>

            <TargetIcon className="text-zinc-800 absolute right-4 top-4 w-24 h-24 opacity-20 group-hover:rotate-12 transition-transform duration-500" />

            <p className="text-2xl text-zinc-100 font-poppins leading-snug mt-4 relative z-10 font-semibold">
              It's not just about moving pieces. It's about manipulating the{" "}
              <span className="text-lime-400">entire stack order</span>.
            </p>

            <div className="w-full h-[2px] bg-gradient-to-r from-zinc-800 via-zinc-700 to-transparent my-6 relative z-10"></div>

            <p className="text-base text-zinc-400 font-chakra leading-relaxed relative z-10">
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
