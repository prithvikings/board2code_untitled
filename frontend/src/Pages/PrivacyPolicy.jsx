import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft as ArrowLeftIcon,
  ShieldCheck as ShieldCheckIcon,
} from "@phosphor-icons/react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra p-4 md:p-8 relative flex flex-col items-center">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none z-0"></div>
      <div
        className="fixed inset-0 opacity-[0.04] mix-blend-screen pointer-events-none z-0"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      ></div>

      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-4 md:top-8 md:left-8 flex items-center gap-2 bg-[#18181b] border-2 border-zinc-800 border-b-[3px] text-zinc-400 hover:text-white hover:bg-zinc-800 active:border-b-[1px] active:translate-y-[2px] transition-all px-4 py-2 rounded-xl uppercase font-black text-[10px] tracking-widest z-10"
      >
        <ArrowLeftIcon size={16} weight="bold" />
        Back
      </button>

      <div className="relative z-10 max-w-3xl w-full mt-16 md:mt-12 mb-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-10 bg-[#18181b] border-2 border-zinc-800 border-b-[6px] rounded-[24px] p-6 md:p-8">
          <div className="w-16 h-16 bg-zinc-900 border-2 border-zinc-700 border-b-[3px] rounded-2xl flex items-center justify-center shrink-0">
            <ShieldCheckIcon
              size={32}
              weight="fill"
              className="text-blue-400"
            />
          </div>
          <div>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-md font-black uppercase tracking-widest text-[9px] mb-2 inline-block">
              Data Protection
            </span>
            <h1 className="text-4xl md:text-5xl font-bebas tracking-wide text-white leading-none mb-1">
              Privacy Policy
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
              Last updated: April 9, 2026
            </p>
          </div>
        </div>

        {/* Modular Content Blocks */}
        <div className="space-y-5 font-poppins">
          <section className="bg-zinc-900 border-2 border-zinc-800 border-b-[3px] rounded-[20px] p-5 md:p-6">
            <h2 className="text-xl font-black text-white mb-3 font-chakra uppercase tracking-wide flex items-center gap-3">
              <span className="bg-blue-500 text-zinc-950 px-2 py-0.5 rounded-lg font-black text-base border-b-[3px] border-blue-700">
                01
              </span>
              Information Collection
            </h2>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
              Tiki Topple collects minimal data required for matchmaking and
              basic game functionality. This includes player usernames, match
              statistics, and authentication tokens (if logged in).
            </p>
          </section>

          <section className="bg-zinc-900 border-2 border-zinc-800 border-b-[3px] rounded-[20px] p-5 md:p-6">
            <h2 className="text-xl font-black text-white mb-3 font-chakra uppercase tracking-wide flex items-center gap-3">
              <span className="bg-blue-500 text-zinc-950 px-2 py-0.5 rounded-lg font-black text-base border-b-[3px] border-blue-700">
                02
              </span>
              Use of Information
            </h2>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
              The data we collect is solely used to facilitate gameplay,
              maintain the global leaderboard securely, and improve the
              application continuously.{" "}
              <strong className="text-white">
                We do not sell player data to third parties.
              </strong>
            </p>
          </section>

          <section className="bg-zinc-900 border-2 border-zinc-800 border-b-[3px] rounded-[20px] p-5 md:p-6">
            <h2 className="text-xl font-black text-white mb-3 font-chakra uppercase tracking-wide flex items-center gap-3">
              <span className="bg-blue-500 text-zinc-950 px-2 py-0.5 rounded-lg font-black text-base border-b-[3px] border-blue-700">
                03
              </span>
              Data Security
            </h2>
            <div className="bg-[#18181b] border-2 border-zinc-800 rounded-xl p-4">
              <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                All communications between your device and our servers are
                encrypted. We implement modern web security standards. Since
                this is an MVP for the 2026 hackathon, data may be routinely
                wiped.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
