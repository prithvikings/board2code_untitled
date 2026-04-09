import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar"; // Adjusted import path
import { PlayIcon, SparkleIcon } from "@phosphor-icons/react";
import Problem from "./components/Problem";
import Features from "./components/Features";
import WhyUs from "./components/WhyUs";
import Comparison from "./components/Comparison";
import CTA from "./components/Cta";
import Footer from "./components/Footer";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full flex flex-col">
      <div className="relative min-h-[90vh] w-full bg-[#0a0a0a] flex flex-col justify-center overflow-hidden">
        <Navbar />

        {/* 1. Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* 3. Bottom Fade out to seamlessly blend into the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-10"></div>

        <div className="relative z-20 max-w-5xl mx-auto px-6 text-zinc-100 flex flex-col items-center pt-24 pb-16">
          {/* Hackathon Badge */}
          <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lime-500/30 bg-lime-500/10 text-lime-400 text-sm font-semibold tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(163,230,53,0.1)]">
            <SparkleIcon size={16} />
            <span>NPC Board2Code 2026 Submission</span>
          </div>

          {/* Typography Hierarchy Fixes */}
          <h1 className="text-center text-6xl md:text-8xl font-bold font-bebas tracking-wide drop-shadow-2xl leading-[0.9]">
            Stack, Move, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
              Dominate.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto text-center mt-8 leading-relaxed font-chakra">
            The ultimate turn-based strategic stacking game. Manipulate the
            order, plan ahead, and claim the title of Tiki Master.
          </p>

          {/* Enhanced CTA Area */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-12 w-full">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-[#18181b] text-white font-bold uppercase tracking-widest px-8 py-3.5 rounded-xl border-2 border-[#a3e635] shadow-[0px_4px_0px_0px_#a3e635] hover:bg-[#27272a] hover:-translate-y-1 hover:shadow-[0px_6px_0px_0px_#a3e635] active:shadow-[0px_0px_0px_0px_#a3e635] active:translate-y-1 transition-all cursor-pointer"
            >
              <PlayIcon
                size={20}
                className="fill-lime-400 text-lime-400 group-hover:scale-110 transition-transform"
              />
              Play Now
            </button>

            <button className="w-full sm:w-auto bg-transparent text-zinc-300 font-bold uppercase tracking-widest px-8 py-3.5 rounded-xl border-2 border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900 hover:text-white transition-all cursor-pointer bg-black/50 backdrop-blur-sm">
              Watch Gameplay
            </button>
          </div>

          <p className="text-zinc-600 text-xs md:text-sm font-semibold text-center mt-10 uppercase tracking-[0.2em]">
            No downloads • Instant play • Multiplayer Ready
          </p>
        </div>
      </div>

      {/* Keep the rest of your page flow intact */}
      <div className="relative z-20 bg-[#0a0a0a]">
        <Problem />
        <Features />
        <WhyUs />
        <Comparison />
        <CTA />
        <Footer />
      </div>
    </div>
  );
};

export default Hero;
