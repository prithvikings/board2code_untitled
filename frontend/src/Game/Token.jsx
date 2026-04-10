import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Token = ({ color, onClick, isSelected, isTargeted }) => {
  const getGradient = (col) => {
    switch (col.toLowerCase()) {
      case "red":
        return "from-red-500 to-red-700 border-red-400";
      case "blue":
        return "from-blue-500 to-blue-700 border-blue-400";
      case "green":
        return "from-green-500 to-green-700 border-green-400";
      case "yellow":
        return "from-yellow-400 to-yellow-600 border-yellow-300";
      case "purple":
        return "from-purple-500 to-purple-700 border-purple-400";
      case "orange":
        return "from-orange-500 to-orange-700 border-orange-400";
      case "pink":
        return "from-pink-500 to-pink-700 border-pink-400";
      case "teal":
        return "from-teal-500 to-teal-700 border-teal-400";
      default:
        return "from-zinc-500 to-zinc-700 border-zinc-400";
    }
  };

  const gradient = getGradient(color);

  // AnimatePresence will trigger `initial` when component mounts (or gets a new ID from topple)
  // and `exit` when it unmounts (because ID changed from topple processing)
  return (
    <motion.div
      layout
      layoutId={color}
      initial={{ opacity: 0, y: -30, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: isSelected || isTargeted ? 1.15 : 1,
        y: isSelected || isTargeted ? -10 : 0,
        boxShadow: isSelected
          ? "0 0 30px rgba(250, 204, 21, 0.8)"
          : isTargeted
            ? "0 0 40px rgba(255, 255, 255, 0.9)"
            : "4px 4px 10px rgba(0,0,0,0.5)",
        outline: isSelected
          ? "4px solid #facc15"
          : isTargeted
            ? "4px solid white"
            : "0px solid transparent",
      }}
      exit={{ opacity: 0, y: 50, scale: 0.5, transition: { duration: 0.4 } }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 1,
      }}
      onClick={onClick}
      className={`
        relative w-16 md:w-20 aspect-square rounded-2xl flex items-center justify-center 
        bg-linear-to-br ${gradient} border-t-2 border-l-2 shadow-[4px_4px_10px_rgba(0,0,0,0.5)]
        cursor-pointer transition-all shrink-0
        ${isSelected ? "z-30" : "hover:-translate-y-1 hover:shadow-[4px_8px_15px_rgba(0,0,0,0.5)]"}
        ${isTargeted ? "z-40" : ""}
      `}
    >
      <AnimatePresence>
        {(isSelected || isTargeted) && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-lg z-50 border-2 border-zinc-900"
          >
            <div className="w-4 h-4 rounded-full bg-lime-500 animate-pulse"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/20 flex items-center justify-center border-b-2 border-black/40">
        <span className="font-bebas text-lg md:text-xl text-white/90 uppercase tracking-widest drop-shadow-md">
          {color.substring(0, 3)}
        </span>
      </div>
    </motion.div>
  );
};

export default Token;
