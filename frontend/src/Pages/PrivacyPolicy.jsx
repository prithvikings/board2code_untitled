import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ShieldCheckIcon } from "@phosphor-icons/react";

const PrivacyPolicy = () => {
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
          <div className="w-16 h-16 bg-blue-950/30 border border-blue-900/50 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(96,165,250,0.1)]">
            <ShieldCheckIcon
              size={32}
              className="text-blue-400"
              weight="duotone"
            />
          </div>
          <div>
            <span className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">
              Legal
            </span>
            <h1 className="text-5xl md:text-6xl font-bebas tracking-wide text-zinc-100 drop-shadow-md">
              Privacy Policy
            </h1>
          </div>
        </div>

        <div className="bg-[#0f0f11] border border-zinc-800/80 border-t-4 border-t-blue-500 p-8 md:p-12 rounded-2xl relative shadow-2xl font-poppins text-zinc-300 leading-relaxed text-sm md:text-base space-y-10">
          <p className="text-blue-400/80 text-xs font-mono font-bold tracking-widest uppercase border-b border-zinc-800/80 pb-4 inline-block">
            Last updated: April 9, 2026
          </p>

          <section className="relative pl-6 border-l-2 border-blue-500/20 hover:border-blue-500/50 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-3 font-chakra flex items-center gap-2">
              <span className="text-blue-500 font-mono text-lg">01.</span>{" "}
              Information Collection
            </h2>
            <p className="text-zinc-400">
              Tiki Topple collects minimal data required for matchmaking and
              basic game functionality. This includes player usernames, match
              statistics, and authentication tokens (if logged in).
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-blue-500/20 hover:border-blue-500/50 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-3 font-chakra flex items-center gap-2">
              <span className="text-blue-500 font-mono text-lg">02.</span> Use
              of Information
            </h2>
            <p className="text-zinc-400">
              The data we collect is solely used to facilitate gameplay,
              maintain the global leaderboard securely, and improve the
              application continuously. We do not sell player data to third
              parties.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-blue-500/20 hover:border-blue-500/50 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-3 font-chakra flex items-center gap-2">
              <span className="text-blue-500 font-mono text-lg">03.</span> Data
              Security
            </h2>
            <p className="text-zinc-400">
              All communications between your device and our servers are
              encrypted. We implement modern web security standards. Since this
              is an MVP for the 2026 hackathon, data may be routinely wiped.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
