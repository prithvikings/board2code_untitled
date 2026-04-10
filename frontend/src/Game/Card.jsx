import React from "react";
import { 
  ArrowUp as ArrowUpIcon, 
  ArrowsLeftRight as ArrowsLeftRightIcon, 
  ArrowLineDown as ArrowLineDownIcon,
  Crosshair as CrosshairIcon
} from "@phosphor-icons/react";

const Card = ({ card, isSelected, selectionIndex, onClick, className }) => {
  // Use className from props if available to control size from parent, 
  // otherwise default to a robust full-width sizing constrained by parent CSS Grid.
  const sizeClasses = className || "w-full aspect-[4/5] sm:aspect-[4/5]";

  const baseClasses = `
    relative ${sizeClasses}
    rounded-2xl p-2 md:p-3 cursor-pointer select-none
    flex flex-col justify-between items-center
    transition-all duration-150 ease-out transform
  `;

  // Modern Dark Tactical UI Styling
  const unselectedClasses = `
    bg-[#18181b] border-2 border-zinc-800 text-zinc-300
    shadow-[0_6px_0_0_#09090b]
    hover:-translate-y-1 hover:shadow-[0_8px_0_0_#09090b] hover:bg-zinc-800
    active:translate-y-1 active:shadow-[0_2px_0_0_#09090b]
  `;

  const selectedClasses = `
    bg-zinc-900 border-2 border-yellow-500 text-yellow-400
    shadow-[0_4px_0_0_#854d0e] -translate-y-1
    active:-translate-y-0 active:shadow-[0_2px_0_0_#854d0e]
  `;

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      {/* Top Section: Card Type Badge */}
      <div
        className={`
        w-full text-center py-1 rounded-md text-[10px] md:text-xs font-black uppercase tracking-wider border
        ${isSelected ? "bg-yellow-500 text-yellow-950 border-yellow-400" : "bg-zinc-900 border-zinc-700 text-zinc-400"}
      `}
      >
        {card.type} {card.value || ""}
      </div>

      {/* Middle Section: Icon / Description */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-1 overflow-hidden w-full">
        <div className={`mb-1.5 md:mb-2 flex items-center justify-center ${isSelected ? "text-yellow-400" : "text-zinc-500"}`}>
          {card.type === "move" ? (
            <div className={`p-1.5 md:p-2 rounded-xl border-2 shadow-inner ${isSelected ? "bg-yellow-500/10 border-yellow-500/30" : "bg-zinc-900 border-zinc-800"}`}>
               <ArrowUpIcon size={24} weight="bold" />
            </div>
          ) : card.type === "swap" ? (
             <div className={`p-1.5 md:p-2 rounded-xl border-2 shadow-inner ${isSelected ? "bg-yellow-500/10 border-yellow-500/30" : "bg-zinc-900 border-zinc-800"}`}>
               <ArrowsLeftRightIcon size={24} weight="bold" />
             </div>
          ) : (
             <div className={`p-1.5 md:p-2 rounded-xl border-2 shadow-inner ${isSelected ? "bg-yellow-500/10 border-yellow-500/30" : "bg-zinc-900 border-zinc-800"}`}>
               <ArrowLineDownIcon size={24} weight="bold" />
             </div>
          )}
        </div>
        <p
          className={`text-[9px] md:text-[10px] leading-tight font-medium w-full mt-1 ${isSelected ? "text-yellow-200" : "text-zinc-500"}`}
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {card.description}
        </p>
      </div>

      {/* Bottom Section: Requirements Label */}
      {(card.type === "move" || card.type === "swap") && (
        <div
          className={`
          w-full text-[9px] font-bold text-center py-1 rounded-md mt-1 flex items-center justify-center gap-1 border
          ${isSelected ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-zinc-900 border-zinc-800 text-zinc-500"}
        `}
        >
          <CrosshairIcon size={12} weight="bold" /> Target
        </div>
      )}

      {/* Selection Badge */}
      {isSelected && (
        <div
          className="
          absolute -top-2 -right-2 w-7 h-7 md:w-8 md:h-8 rounded-full 
          bg-yellow-500 text-yellow-950 font-black text-xs md:text-sm
          flex items-center justify-center 
          border-[3px] border-zinc-900 shadow-lg
          animate-bounce
        "
        >
          {selectionIndex}
        </div>
      )}
    </div>
  );
};

export default Card;
