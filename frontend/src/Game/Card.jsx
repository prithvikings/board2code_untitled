import React from "react";

const Card = ({ card, isSelected, selectionIndex, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative w-28 h-40 md:w-36 md:h-52 rounded-xl border-2 p-2 cursor-pointer
        flex flex-col justify-between select-none
        transition-all duration-300 transform
        ${isSelected ? "border-lime-400 bg-[#1e293b] shadow-[0_0_20px_rgba(163,230,53,0.3)] -translate-y-4" : "border-zinc-700 bg-[#0f172a] hover:-translate-y-2 hover:border-zinc-500"}
      `}
    >
      <div className="text-xs font-bold uppercase tracking-widest text-zinc-300 border-b border-zinc-700 pb-1">
        {card.type} {card.value || ""}
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <p className="text-[10px] md:text-xs text-zinc-400 leading-tight">
          {card.description}
        </p>
      </div>

      {/* Target Requirements info */}
      {(card.type === "move" || card.type === "swap") && (
        <div className="text-[10px] text-yellow-500 font-bold text-center border-t border-zinc-800 pt-1 mt-1">
          Requires Target(s)
        </div>
      )}

      {isSelected && (
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-lime-500 text-black flex items-center justify-center font-bold border-2 border-black font-mono">
          {selectionIndex}
        </div>
      )}
    </div>
  );
};

export default Card;
