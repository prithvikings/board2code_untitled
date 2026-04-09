import React from "react";
import {
  Trophy as TrophyIcon,
  ArrowRight as ArrowRightIcon,
  Stack as StackIcon,
  ShuffleSimple as ShuffleSimpleIcon,
} from "@phosphor-icons/react";

const Features = () => {
  const features = [
    {
      title: "Stack-Based Gameplay",
      description:
        "Tokens exist in a single vertical stack. Only the highest ones can be interacted with, defining your possible strategies.",
      icon: (
        <StackIcon className="text-lime-500 mb-4" size={32} weight="fill" />
      ),
      visual: (
        <div className="flex flex-col items-center justify-end h-24 mb-5 group-hover:-translate-y-2 transition-transform duration-200">
          <div className="w-16 h-6 rounded-lg bg-red-500 border-2 border-red-700 border-b-4 mb-2 transform transition-transform group-hover:scale-110"></div>
          <div className="w-16 h-6 rounded-lg bg-blue-500 border-2 border-blue-700 border-b-4 mb-2"></div>
          <div className="w-16 h-6 rounded-lg bg-green-500 border-2 border-green-700 border-b-4"></div>
        </div>
      ),
      tags: ["Vertical Stack", "Restricted Access"],
    },
    {
      title: "Strategic Movement",
      description:
        "Move the top 1, 2, or 3 tokens forward by precisely 1 step, but their order must remain strictly unchanged.",
      icon: (
        <ArrowRightIcon
          className="text-lime-500 mb-4"
          size={32}
          weight="bold"
        />
      ),
      visual: (
        <div className="w-full h-24 flex items-center justify-center mb-5 relative rounded-xl bg-zinc-900 border-2 border-zinc-800 border-b-4 overflow-hidden">
          {/* Solid Track */}
          <div className="absolute w-[80%] h-3 bg-zinc-950 rounded-full top-1/2 -translate-y-1/2 border-t-2 border-zinc-800"></div>
          {/* Moving Token (Solid) */}
          <div className="w-10 h-10 rounded-lg bg-lime-500 border-2 border-lime-700 border-b-4 absolute left-[20%] top-1/2 -translate-y-1/2 group-hover:left-[65%] transition-all duration-500 ease-in-out z-10 flex items-center justify-center">
            <div className="w-3 h-1 bg-lime-800 rounded-full"></div>
          </div>
          {/* Target Marker */}
          <div className="w-10 h-10 rounded-lg border-2 border-dashed border-zinc-600 absolute left-[65%] top-1/2 -translate-y-1/2"></div>
        </div>
      ),
      tags: ["Preserve Order", "Forward Only"],
    },
    {
      title: "Reorder Tactics",
      description:
        "Select the top 2-3 tokens, completely rearrange their order to your advantage, and place them back.",
      icon: (
        <ShuffleSimpleIcon
          className="text-lime-500 mb-4"
          size={32}
          weight="bold"
        />
      ),
      visual: (
        <div className="w-full h-24 flex items-center justify-center gap-4 mb-5">
          <div className="flex flex-col gap-2 group-hover:-translate-y-2 transition-transform duration-200">
            <div className="w-12 h-5 rounded-md bg-blue-500 border-2 border-blue-700 border-b-4"></div>
            <div className="w-12 h-5 rounded-md bg-red-500 border-2 border-red-700 border-b-4"></div>
          </div>
          <div className="text-zinc-500 font-bold group-hover:rotate-180 group-hover:text-white transition-all duration-300">
            <ShuffleSimpleIcon size={24} weight="bold" />
          </div>
          <div className="flex flex-col gap-2 group-hover:translate-y-2 transition-transform duration-200">
            <div className="w-12 h-5 rounded-md bg-red-500 border-2 border-red-700 border-b-4"></div>
            <div className="w-12 h-5 rounded-md bg-blue-500 border-2 border-blue-700 border-b-4"></div>
          </div>
        </div>
      ),
      tags: ["Rearrange", "Top Tokens Only"],
    },
    {
      title: "Positional Scoring",
      description:
        "It's a race to position N. Tokens are ranked based on their final positions, and your total points dictate victory.",
      icon: (
        <TrophyIcon className="text-lime-500 mb-4" size={32} weight="fill" />
      ),
      visual: (
        <div className="w-full h-24 flex items-end justify-center gap-2 mb-5 border-b-4 border-zinc-800 pb-2">
          {/* 2nd Place (Silver/Zinc) */}
          <div className="w-12 h-10 bg-zinc-400 rounded-t-lg flex flex-col items-center pt-2 border-2 border-zinc-600 group-hover:h-14 transition-all duration-200 relative">
            <span className="text-zinc-800 font-black text-[10px]">2ND</span>
          </div>
          {/* 1st Place (Gold) */}
          <div className="w-14 h-16 bg-yellow-500 rounded-t-lg flex flex-col items-center pt-2 border-2 border-yellow-700 group-hover:h-20 transition-all duration-200 relative z-10">
            <span className="text-yellow-950 font-black text-xs">1ST</span>
          </div>
          {/* 3rd Place (Bronze) */}
          <div className="w-12 h-6 bg-orange-700 rounded-t-lg flex flex-col items-center pt-1 border-2 border-orange-900 group-hover:h-10 transition-all duration-200 relative">
            <span className="text-orange-950 font-black text-[9px]">3RD</span>
          </div>
        </div>
      ),
      tags: ["Rank Based", "Final Points"],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-20 px-6 text-zinc-100">
      <div className="text-center mb-16 flex flex-col items-center">
        <span className="inline-block px-4 py-1.5 rounded-lg bg-lime-500 text-zinc-950 border-b-4 border-lime-700 font-black tracking-widest text-[10px] uppercase mb-4">
          Core Mechanics
        </span>
        <h2 className="font-bebas text-5xl md:text-6xl tracking-wider text-white">
          Built For The Hackathon
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[#18181b] p-6 md:p-8 rounded-[24px] border-2 border-zinc-800 border-b-[6px] hover:border-zinc-700 transition-all duration-200 group flex flex-col h-full hover:-translate-y-1"
          >
            {feature.icon}

            {/* Interactive Visual Representation */}
            <div className="mt-1 grow">{feature.visual}</div>

            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">
              {feature.title}
            </h3>

            <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-6 grow">
              {feature.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {feature.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="text-[9px] font-black uppercase tracking-widest bg-zinc-900 text-zinc-400 px-3 py-1.5 rounded-lg border-2 border-zinc-800 border-b-[3px] group-hover:border-zinc-700 group-hover:text-white transition-colors"
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
