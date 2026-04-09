import React from "react";
import { X, Check } from "@phosphor-icons/react";

const Comparison = () => {
  const rows = [
    {
      feature: "Gameplay Environment",
      traditional: "Linear Track",
      tiki: "Vertical Stack",
      highlight: false,
    },
    {
      feature: "Core Action",
      traditional: "Move Any Piece",
      tiki: "Reorder & Move Top",
      highlight: false,
    },
    {
      feature: "Token Accessibility",
      traditional: "All Tokens Available",
      tiki: "Restricted (Top 1-3 Only)",
      highlight: false,
    },
    {
      feature: "Strategic Depth",
      traditional: "Basic / Luck-Based",
      tiki: "Multi-layered & Tactical",
      highlight: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-24 px-6 relative">
      {/* Decorative background element */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-64 bg-lime-500/5 blur-[80px] pointer-events-none rounded-full"></div>

      <div className="text-center mb-16 relative z-10">
        <span className="inline-block px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 font-bold tracking-widest text-xs uppercase mb-4 border border-zinc-700">
          The Verdict
        </span>
        <h2 className="font-bebas text-6xl md:text-8xl text-white tracking-wide drop-shadow-md">
          Unmatched <span className="text-lime-400">Depth</span>
        </h2>
      </div>

      <div className="bg-[#18181b] rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl relative z-10 group">
        {/* Tiki Topple Column Highlight Background - Added transition */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-b from-lime-500/5 to-transparent pointer-events-none border-l border-lime-500/10 group-hover:bg-lime-500/10 transition-colors duration-500"></div>

        {/* Header */}
        <div className="grid grid-cols-12 bg-zinc-900/80 p-6 md:p-8 border-b border-zinc-800 relative z-10 backdrop-blur-sm">
          <div className="col-span-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px] md:text-xs">
            Mechanic
          </div>
          <div className="col-span-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-2">
            <X size={14} className="text-red-500" />
            Standard Games
          </div>
          <div className="col-span-4 font-bold text-lime-400 uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-2">
            <Check size={14} className="text-lime-400" />
            Tiki Topple
          </div>
        </div>

        {/* Rows */}
        <div className="relative z-10 flex flex-col">
          {rows.map((row, index) => (
            <div
              key={index}
              className={`grid grid-cols-12 p-6 md:p-8 items-center transition-all duration-300 hover:bg-zinc-800/40 relative
                ${index !== rows.length - 1 ? "border-b border-zinc-800/50" : ""}
              `}
            >
              {/* Row Highlight on Hover */}
              <div
                className="absolute inset-y-0 left-0 w-1 bg-lime-400 opacity-0 transition-opacity group-hover:opacity-100"
                style={{ transitionDelay: `${index * 50}ms` }}
              ></div>

              <div className="col-span-4 font-semibold text-zinc-200 text-sm md:text-lg font-chakra">
                {row.feature}
              </div>
              <div className="col-span-4 text-zinc-500 text-center font-medium text-xs md:text-sm px-2">
                {row.traditional}
              </div>
              <div
                className={`col-span-4 text-center font-bold text-sm md:text-base px-2 transition-colors ${row.highlight ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-lime-400"}`}
              >
                {row.tiki}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comparison;
