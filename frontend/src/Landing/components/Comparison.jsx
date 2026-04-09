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
      tiki: "Restricted (Top 1-3)",
      highlight: false,
    },
    {
      feature: "Strategic Depth",
      traditional: "Luck-Based",
      tiki: "Multi-layered Tactical",
      highlight: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 relative">
      <div className="text-center mb-12 relative z-10 flex flex-col items-center">
        <span className="inline-block px-4 py-1.5 rounded-lg bg-zinc-900 border-2 border-zinc-800 border-b-[3px] text-zinc-400 font-black tracking-widest text-[10px] uppercase mb-4">
          The Verdict
        </span>
        <h2 className="font-bebas text-5xl md:text-6xl text-white tracking-wide">
          Unmatched <span className="text-lime-500">Depth</span>
        </h2>
      </div>

      {/* Chunky Table Container (Scaled Down) */}
      <div className="bg-[#18181b] rounded-[24px] border-2 border-zinc-800 border-b-[6px] overflow-hidden relative z-10 group">
        {/* Solid Highlight Background for Tiki Column */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-lime-500/10 pointer-events-none border-l-2 border-lime-500/20"></div>

        {/* Header */}
        <div className="grid grid-cols-12 bg-zinc-900 p-4 md:p-6 border-b-[3px] border-zinc-800 relative z-10">
          <div className="col-span-4 font-black text-zinc-500 uppercase tracking-widest text-[9px] md:text-[10px]">
            Mechanic
          </div>
          <div className="col-span-4 font-black text-zinc-500 uppercase tracking-widest text-[9px] md:text-[10px] flex items-center justify-center gap-1.5">
            <X size={14} weight="bold" className="text-red-500" />
            Standard Games
          </div>
          <div className="col-span-4 font-black text-lime-500 uppercase tracking-widest text-[9px] md:text-[10px] flex items-center justify-center gap-1.5">
            <Check size={14} weight="bold" className="text-lime-500" />
            Tiki Topple
          </div>
        </div>

        {/* Rows */}
        <div className="relative z-10 flex flex-col">
          {rows.map((row, index) => (
            <div
              key={index}
              className={`grid grid-cols-12 p-4 md:p-6 items-center transition-all duration-150 hover:bg-zinc-800/80 relative
                ${index !== rows.length - 1 ? "border-b-2 border-zinc-800" : ""}
              `}
            >
              <div className="col-span-4 font-black text-zinc-200 text-xs md:text-sm uppercase tracking-wide">
                {row.feature}
              </div>
              <div className="col-span-4 text-zinc-500 text-center font-bold text-[10px] md:text-xs px-2 uppercase tracking-widest">
                {row.traditional}
              </div>
              <div
                className={`col-span-4 text-center font-black text-[10px] md:text-xs px-2 uppercase tracking-widest transition-colors ${
                  row.highlight
                    ? "text-white bg-lime-500 rounded-lg py-1.5 border-b-[3px] border-lime-700"
                    : "text-lime-500"
                }`}
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
