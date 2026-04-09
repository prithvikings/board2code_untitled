import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./components/Navbar";
import {
  PlayIcon,
  SparkleIcon,
  ArrowUpRightIcon,
  ArrowsDownUpIcon,
  CircleIcon,
  VideoIcon,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import Problem from "./components/Problem";
import Features from "./components/Features";
import WhyUs from "./components/WhyUs";
import Comparison from "./components/Comparison";
import CTA from "./components/Cta";
import Footer from "./components/Footer";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const containerRef = useRef(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Chunky, Tactile Draggable Elements (No blur/glow)
  const abstractElements = [
    {
      id: "action-card",
      initialPos: { top: "15%", left: "8%" },
      animation: { y: [0, -15, 0], rotate: [-4, -2, -4] },
      content: (
        <div className="w-36 h-48 bg-[#18181b] border-2 border-zinc-700 border-b-8 rounded-[24px] p-4 flex flex-col justify-between shadow-xl group">
          <div className="flex justify-between items-start w-full">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-900 px-2 py-1 rounded-md">
              ACT-01
            </span>
            <ArrowUpRightIcon
              size={18}
              weight="bold"
              className="text-lime-400 opacity-50 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="space-y-3 bg-zinc-900 p-3 rounded-xl border-2 border-zinc-800">
            <p className="text-xs text-white font-black uppercase tracking-widest">
              Tiki Up
            </p>
            <div className="w-full h-2 bg-lime-500 rounded-full border-b-2 border-lime-700"></div>
            <div className="w-2/3 h-2 bg-zinc-700 rounded-full"></div>
          </div>
        </div>
      ),
    },
    {
      id: "stack-wireframe",
      initialPos: { top: "50%", right: "10%" },
      animation: { y: [0, 20, 0], rotate: [2, 5, 2] },
      content: (
        <div className="w-40 bg-[#121214] border-2 border-zinc-800 border-b-8 rounded-[24px] p-4 flex flex-col gap-2 shadow-xl group">
          <div className="flex items-center gap-2 mb-2 bg-zinc-900 px-2 py-1.5 rounded-lg border border-zinc-800">
            <ArrowsDownUpIcon
              size={14}
              weight="bold"
              className="text-zinc-500"
            />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Stack.Seq
            </span>
          </div>
          <div className="w-full h-10 border-2 border-lime-600 border-b-4 bg-lime-500 rounded-xl"></div>
          <div className="w-full h-10 border-2 border-zinc-700 border-b-4 bg-zinc-800 rounded-xl"></div>
          <div className="w-full h-10 border-2 border-zinc-700 border-b-4 bg-zinc-800 rounded-xl"></div>
        </div>
      ),
    },
    {
      id: "minimal-token",
      initialPos: { top: "25%", right: "25%" },
      animation: { y: [0, 10, 0], rotate: [0, 0, 0] },
      content: (
        <div className="w-20 h-20 bg-yellow-500 border-2 border-yellow-700 border-b-8 rounded-2xl flex items-center justify-center shadow-xl">
          <div className="w-10 h-10 rounded-full bg-yellow-900/20 border-2 border-yellow-700/50 flex items-center justify-center">
            <CircleIcon size={16} weight="bold" className="text-yellow-800" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full flex flex-col">
      <div
        ref={containerRef}
        className="relative min-h-[90vh] w-full bg-[#0a0a0a] flex flex-col justify-center overflow-hidden"
      >
        <Navbar />

        {/* Premium Masked Grid + Noise Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none z-0"></div>
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-screen pointer-events-none z-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          }}
        ></div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-10"></div>

        {abstractElements.map((el) => (
          <motion.div
            key={el.id}
            drag
            dragConstraints={containerRef}
            dragElastic={0.1}
            whileHover={{ scale: 1.02 }}
            whileDrag={{
              scale: 1.05,
              cursor: "grabbing",
              rotate: el.animation.rotate[1] * 2,
            }}
            animate={el.animation}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute hidden md:block z-30 cursor-grab"
            style={el.initialPos}
          >
            {el.content}
          </motion.div>
        ))}

        {/* Hero Content (Scaled down & Tactile) */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-zinc-100 flex flex-col items-center pt-24 pb-16 pointer-events-none">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500/10 border-2 border-lime-500/30 text-lime-400 text-xs font-black uppercase tracking-widest mt-12 pointer-events-auto">
            <SparkleIcon size={16} weight="fill" />
            <span>NPC Board2Code 2026</span>
          </div>

          {/* Scaled down text-5xl md:text-7xl */}
          <h1 className="text-center text-5xl md:text-7xl font-bold font-bebas tracking-wide leading-[0.9] pointer-events-auto text-white">
            Stack, Move, <br className="hidden md:block" />
            <span className="text-zinc-500">Dominate.</span>
          </h1>

          <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto text-center mt-6 font-medium leading-relaxed pointer-events-auto">
            The ultimate turn-based strategic stacking game. Manipulate the
            order, plan ahead, and claim the title of Tiki Master.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full pointer-events-auto max-w-md mx-auto">
            {/* Solid Tactile Buttons */}
            <button
              onClick={() => navigate(user ? "/dashboard" : "/login")}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-lime-500 text-zinc-950 font-black uppercase tracking-widest px-8 py-4 rounded-2xl border-b-4 border-lime-700 hover:bg-lime-400 active:border-b-0 active:translate-y-1 transition-all"
            >
              <PlayIcon size={20} weight="fill" />
              Play Now
            </button>

            <button
              onClick={() => setShowVideoModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-zinc-900 border-2 border-zinc-800 border-b-4 text-zinc-300 font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-zinc-800 hover:text-white active:border-b-2 active:translate-y-[2px] transition-all"
            >
              <VideoIcon size={20} weight="fill" className="text-zinc-400" />
              Watch Trailer
            </button>
          </div>

          <p className="text-zinc-600 text-[10px] font-black text-center mt-8 uppercase tracking-[0.2em] pointer-events-auto">
            No downloads • Instant play • Multiplayer Ready
          </p>
        </div>
      </div>

      <div className="relative z-20 bg-[#0a0a0a]">
        <Problem />
        <Features />
        <WhyUs />
        <Comparison />
        <CTA />
        <Footer />
      </div>

      {/* Gameplay Video Modal (De-glowed, Solid Borders) */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-12"
          >
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => setShowVideoModal(false)}
            ></div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="relative w-full max-w-5xl flex flex-col items-end gap-3 z-10"
            >
              <button
                onClick={() => setShowVideoModal(false)}
                className="w-12 h-12 bg-zinc-900 hover:bg-red-500 hover:border-red-700 text-zinc-300 hover:text-white rounded-2xl flex items-center justify-center transition-all cursor-pointer border-2 border-zinc-800 border-b-4 active:border-b-2 active:translate-y-[2px]"
                title="Close Video"
              >
                <span className="font-black text-lg leading-none">✕</span>
              </button>

              <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-3xl overflow-hidden border-4 border-zinc-800 border-b-8 shadow-2xl">
                <iframe
                  className="w-full h-full relative z-10"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Gameplay Demo placeholder"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;
