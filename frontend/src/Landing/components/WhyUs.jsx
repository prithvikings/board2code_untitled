import React from "react";
import {
  Skull as SkullIcon,
  Crown as CrownIcon,
  CaretRight as CaretRightIcon,
} from "@phosphor-icons/react";

const WhyUs = () => {
  return (
    <div className="relative max-w-5xl mx-auto py-20 px-6 text-center overflow-hidden">
      {/* The Hook */}
      <div className="relative z-10">
        <h2 className="font-bebas text-5xl md:text-6xl text-white uppercase tracking-wide mb-6 leading-[0.9]">
          This Isn’t Just Moving.
          <br />
          <span className="text-lime-500">It’s Stacking Strategy.</span>
        </h2>

        {/* The Build-up (Scaled down Badges) */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 text-[10px] md:text-xs font-black uppercase tracking-widest mb-16">
          <span className="bg-zinc-900 border-2 border-zinc-800 border-b-[3px] text-zinc-400 px-3 py-1.5 rounded-lg">
            Every turn counts
          </span>
          <CaretRightIcon
            className="hidden md:block text-zinc-600"
            size={16}
            weight="bold"
          />
          <span className="bg-zinc-900 border-2 border-zinc-800 border-b-[3px] text-zinc-400 px-3 py-1.5 rounded-lg">
            Every reorder matters
          </span>
          <CaretRightIcon
            className="hidden md:block text-zinc-600"
            size={16}
            weight="bold"
          />
          <span className="bg-zinc-800 border-2 border-zinc-700 border-b-[3px] text-white px-3 py-1.5 rounded-lg">
            Every move is calculated
          </span>
        </div>
      </div>

      {/* The Ultimatum */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left relative z-10">
        {/* Loser Card (Solid Dark/Red) */}
        <div className="group relative bg-[#121214] p-6 md:p-8 rounded-[24px] border-2 border-zinc-800 border-b-[6px] hover:border-red-900/50 hover:border-b-red-900 transition-all duration-200 overflow-hidden mt-0 md:mt-6 hover:-translate-y-1">
          <SkullIcon
            className="absolute -bottom-4 -right-4 w-36 h-36 text-zinc-900 group-hover:text-red-950 transition-colors duration-200 rotate-12"
            weight="fill"
          />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 text-zinc-500 font-black tracking-widest text-[10px] uppercase mb-3 bg-zinc-900 px-2 py-1 rounded-md border-2 border-zinc-800">
              Mindless Moving
            </span>
            <p className="text-2xl md:text-3xl font-black text-zinc-400 leading-tight">
              If you just push tokens forward,{" "}
              <br className="hidden md:block" />
              <span className="text-red-500">you fall behind.</span>
            </p>
          </div>
        </div>

        {/* Winner Card (Solid Bright Lime) */}
        <div className="group relative bg-lime-500 p-6 md:p-8 rounded-[24px] border-2 border-lime-700 border-b-[6px] transition-all duration-200 overflow-hidden md:-mt-6 hover:-translate-y-1 hover:bg-lime-400 hover:border-lime-600">
          <CrownIcon
            className="absolute -top-4 -right-4 w-36 h-36 text-lime-600/30 group-hover:text-lime-500/50 transition-colors duration-200 -rotate-12"
            weight="fill"
          />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 text-lime-950 font-black tracking-widest text-[10px] uppercase mb-3 bg-lime-400 px-2 py-1 rounded-md border-2 border-lime-600">
              Tiki Master
            </span>
            <p className="text-2xl md:text-3xl font-black text-zinc-950 leading-tight">
              If you master the stack, <br className="hidden md:block" />
              <span className="text-white bg-zinc-950 px-2 py-0.5 rounded-lg inline-block mt-1 border-b-[3px] border-zinc-800">
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
