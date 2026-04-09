import React from "react";

const colorStyles = {
  red: "bg-red-500 border-red-300 shadow-[0_0_15px_rgba(239,68,68,0.5)] text-red-950",
  blue: "bg-blue-500 border-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] text-blue-950",
  green: "bg-green-500 border-green-300 shadow-[0_0_15px_rgba(34,197,94,0.5)] text-green-950",
  yellow: "bg-yellow-400 border-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.5)] text-yellow-950",
  purple: "bg-purple-500 border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.5)] text-purple-950",
  orange: "bg-orange-500 border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.5)] text-orange-950",
};

const Token = ({ color, isSelected, onClick, className = "" }) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      className={`
        w-16 h-8 md:w-24 md:h-10 rounded-md border-2 relative cursor-pointer
        flex items-center justify-center font-bold tracking-widest uppercase text-[10px] md:text-xs
        transition-all duration-300 transform select-none
        ${colorStyles[color] || "bg-zinc-500 border-zinc-400"}
        ${isSelected ? "ring-4 ring-white scale-110 z-10 animate-pulse" : "hover:scale-105 hover:brightness-110 z-0"}
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-sm pointer-events-none"></div>
      {color}
    </div>
  );
};

export default Token;
