import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, FileTextIcon } from "@phosphor-icons/react";

const Terms = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra p-6 md:p-12 relative flex flex-col items-center">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_80%)] pointer-events-none z-0"></div>

      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors uppercase font-bold text-[10px] tracking-widest z-10 group"
      >
        <ArrowLeftIcon
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Home
      </button>

      <div className="relative z-10 max-w-3xl w-full mt-16 md:mt-20 mb-12">
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-purple-950/30 border border-purple-900/50 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(192,132,252,0.1)]">
            <FileTextIcon
              size={32}
              className="text-purple-400"
              weight="duotone"
            />
          </div>
          <div>
            <span className="text-purple-400 font-bold uppercase tracking-widest text-[10px]">
              Legal
            </span>
            <h1 className="text-5xl md:text-6xl font-bebas tracking-wide text-zinc-100 drop-shadow-md">
              Terms of Service
            </h1>
          </div>
        </div>

        <div className="bg-[#0f0f11] border border-zinc-800/80 border-t-4 border-t-purple-500 p-8 md:p-12 rounded-2xl relative shadow-2xl font-poppins text-zinc-300 leading-relaxed text-sm md:text-base space-y-10">
          <p className="text-purple-400/80 text-xs font-mono font-bold tracking-widest uppercase border-b border-zinc-800/80 pb-4 inline-block">
            Last updated: April 9, 2026
          </p>

          <section className="relative pl-6 border-l-2 border-purple-500/20 hover:border-purple-500/50 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-3 font-chakra flex items-center gap-2">
              <span className="text-purple-500 font-mono text-lg">01.</span>{" "}
              Acceptance of Terms
            </h2>
            <p className="text-zinc-400">
              By accessing and playing Tiki Topple, you accept these terms of
              service. Since this application is developed as part of the NPC
              Board2Code Hackathon, the service is provided "as is" without
              warranty.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-purple-500/20 hover:border-purple-500/50 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-3 font-chakra flex items-center gap-2">
              <span className="text-purple-500 font-mono text-lg">02.</span>{" "}
              Fair Play
            </h2>
            <p className="text-zinc-400">
              Players agree not to use third-party tools, scripts, or bots to
              gain an unfair advantage in ranked multiplayer matches. Violating
              these terms may result in immediate banishment from the
              leaderboard.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-purple-500/20 hover:border-purple-500/50 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-3 font-chakra flex items-center gap-2">
              <span className="text-purple-500 font-mono text-lg">03.</span>{" "}
              Intellectual Property
            </h2>
            <p className="text-zinc-400">
              Tiki Topple game adaptations, UI, and custom assets created during
              the 24-hour hackathon belong to the submitting team, acknowledging
              any open-source libraries used.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
