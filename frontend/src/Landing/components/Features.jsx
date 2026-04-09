import React from "react";
import {
  TrophyIcon,
  ArrowRightIcon,
  ShuffleIcon,
  StackIcon,
  ShuffleSimpleIcon,
  Trophy,
} from "@phosphor-icons/react";

const Features = () => {
  const features = [
    {
      title: "Stack-Based Gameplay",
      description:
        "Tokens exist in a single vertical stack. Only the highest ones can be interacted with, defining your possible strategies.",
      icon: <StackIcon className="text-lime-400 mb-4" size={32} />,
      visual: (
        <div className="flex flex-col items-center justify-end h-32 mb-6 group-hover:-translate-y-2 transition-transform duration-500">
          <div className="w-16 h-5 rounded-md bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] mb-1 border border-red-300/30 transform transition-transform group-hover:scale-110"></div>
          <div className="w-16 h-5 rounded-md bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)] mb-1 border border-blue-300/30"></div>
          <div className="w-16 h-5 rounded-md bg-gradient-to-r from-green-600 to-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)] border border-green-300/30"></div>
        </div>
      ),
      tags: ["Vertical Stack", "Restricted Access"],
    },
    {
      title: "Strategic Movement",
      description:
        "Move the top 1, 2, or 3 tokens forward by precisely 1 step, but their order must remain strictly unchanged.",
      icon: <ArrowRightIcon className="text-lime-400 mb-4" size={32} />,
      visual: (
        <div className="w-full h-32 flex items-center justify-center mb-6 relative overflow-hidden rounded-lg bg-zinc-900/50">
          {/* Track */}
          <div className="absolute w-full h-1 bg-zinc-800 top-1/2 -translate-y-1/2"></div>
          {/* Token moving */}
          <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-lime-600 to-lime-300 shadow-[0_0_20px_#a3e635] absolute left-[20%] top-1/2 -translate-y-1/2 border border-lime-200/50 group-hover:left-[60%] transition-all duration-700 ease-in-out z-10 flex items-center justify-center">
            <div className="w-3 h-1 bg-black/30 rounded-full"></div>
          </div>
          {/* Target marker */}
          <div className="w-8 h-8 rounded-md border-2 border-dashed border-zinc-600 absolute left-[60%] top-1/2 -translate-y-1/2"></div>
        </div>
      ),
      tags: ["Preserve Order", "Forward Only"],
    },
    {
      title: "Reorder Tactics",
      description:
        "Select the top 2-3 tokens, completely rearrange their order to your advantage, and place them back.",
      icon: <ShuffleSimpleIcon className="text-lime-400 mb-4" size={32} />,
      visual: (
        <div className="w-full h-32 flex items-center justify-center gap-6 mb-6">
          <div className="flex flex-col gap-1 group-hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-4 rounded bg-blue-500 border border-blue-400"></div>
            <div className="w-12 h-4 rounded bg-red-500 border border-red-400"></div>
          </div>
          <div className="text-zinc-600 font-bold text-2xl group-hover:rotate-180 transition-transform duration-500">
            <ShuffleSimpleIcon size={24} />
          </div>
          <div className="flex flex-col gap-1 group-hover:translate-y-2 transition-transform duration-300">
            <div className="w-12 h-4 rounded bg-red-500 border border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]"></div>
            <div className="w-12 h-4 rounded bg-blue-500 border border-blue-400"></div>
          </div>
        </div>
      ),
      tags: ["Rearrange", "Top Tokens Only"],
    },
    {
      title: "Positional Scoring",
      description:
        "It's a race to position N. Tokens are ranked based on their final positions, and your total points dictate victory.",
      icon: <Trophy className="text-lime-400 mb-4" size={32} />,
      visual: (
        <div className="w-full h-32 flex items-end justify-center gap-2 mb-6 border-b-2 border-zinc-800 pb-2">
          {/* 2nd Place */}
          <div className="w-12 h-12 bg-zinc-800 rounded-t-md flex items-start justify-center pt-2 border-t-2 border-zinc-400 group-hover:h-16 transition-all duration-300 relative">
            <div className="absolute -top-6 w-6 h-4 bg-zinc-500 rounded-sm"></div>
            <span className="text-zinc-500 font-bold text-xs">2ND</span>
          </div>
          {/* 1st Place */}
          <div className="w-12 h-20 bg-zinc-800 rounded-t-md flex items-start justify-center pt-2 border-t-2 border-yellow-400 shadow-[0_-5px_15px_rgba(250,204,21,0.1)] group-hover:h-24 transition-all duration-300 relative">
            <div className="absolute -top-6 w-6 h-4 bg-yellow-500 rounded-sm shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
            <span className="text-yellow-500 font-bold text-xs">1ST</span>
          </div>
          {/* 3rd Place */}
          <div className="w-12 h-8 bg-zinc-800 rounded-t-md flex items-start justify-center pt-2 border-t-2 border-amber-700 group-hover:h-10 transition-all duration-300 relative">
            <div className="absolute -top-6 w-6 h-4 bg-amber-700 rounded-sm"></div>
            <span className="text-amber-700 font-bold text-xs">3RD</span>
          </div>
        </div>
      ),
      tags: ["Rank Based", "Final Points"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-24 px-6 text-zinc-100">
      <div className="text-center mb-20">
        <span className="inline-block px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/20 text-[#a3e635] font-bold tracking-widest text-xs uppercase mb-4">
          Core Mechanics
        </span>
        <h2 className="font-bebas text-5xl md:text-7xl tracking-wide drop-shadow-md">
          Built For The Hackathon
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-[#18181b] to-[#0f0f11] p-8 md:p-10 rounded-2xl border-2 border-zinc-800 hover:border-zinc-700 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
          >
            {/* Header Icon */}
            {feature.icon}

            {/* Interactive Visual Representation */}
            <div className="mt-2 flex-grow">{feature.visual}</div>

            <h3 className="text-2xl font-bold text-white mb-3 font-chakra">
              {feature.title}
            </h3>

            <p className="text-zinc-400 leading-relaxed mb-8 flex-grow">
              {feature.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {feature.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="text-[10px] font-bold uppercase tracking-widest bg-zinc-900/50 text-zinc-400 px-3 py-1.5 rounded-md border border-zinc-800 group-hover:border-zinc-600 group-hover:text-zinc-300 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
