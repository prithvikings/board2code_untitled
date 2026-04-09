import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft as ArrowLeftIcon,
  BookOpenText as BookOpenTextIcon,
} from "@phosphor-icons/react";

const Rules = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra p-4 md:p-8 relative flex flex-col items-center">
      {/* Premium Masked Grid + Noise Background */}
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
        {/* Header Block (Scaled Down) */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-10 bg-[#18181b] border-2 border-zinc-800 border-b-[6px] rounded-[24px] p-6 md:p-8">
          <div className="w-16 h-16 bg-zinc-900 border-2 border-zinc-700 border-b-[3px] rounded-2xl flex items-center justify-center shrink-0">
            <BookOpenTextIcon
              size={32}
              weight="fill"
              className="text-lime-400"
            />
          </div>
          <div>
            <span className="bg-lime-500/10 text-lime-400 border border-lime-500/20 px-2 py-1 rounded-md font-black uppercase tracking-widest text-[9px] mb-2 inline-block">
              Official Guide
            </span>
            <h1 className="text-4xl md:text-5xl font-bebas tracking-wide text-white leading-none">
              Tiki Topple Rules
            </h1>
          </div>
        </div>

        {/* Modular Content Blocks (Scaled Down) */}
        <div className="space-y-5 font-poppins">
          <section className="bg-zinc-900 border-2 border-zinc-800 border-b-[3px] rounded-[20px] p-5 md:p-6">
            <h2 className="text-xl font-black text-white mb-3 font-chakra uppercase tracking-wide flex items-center gap-3">
              <span className="bg-lime-500 text-zinc-950 px-2 py-0.5 rounded-lg font-black text-base border-b-[3px] border-lime-700">
                01
              </span>
              Objective
            </h2>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
              The goal in Tiki Topple is to manipulate the stack of Tiki tokens
              so that your secret target tokens end up in the highest possible
              position by the end of the round.
            </p>
          </section>

          <section className="bg-zinc-900 border-2 border-zinc-800 border-b-[3px] rounded-[20px] p-5 md:p-6">
            <h2 className="text-xl font-black text-white mb-4 font-chakra uppercase tracking-wide flex items-center gap-3">
              <span className="bg-lime-500 text-zinc-950 px-2 py-0.5 rounded-lg font-black text-base border-b-[3px] border-lime-700">
                02
              </span>
              Game Mechanics
            </h2>
            <div className="bg-[#121214] border-2 border-zinc-800 rounded-xl p-4 mb-4">
              <p className="text-zinc-300 text-sm font-medium">
                <strong className="text-white font-black uppercase tracking-widest text-[10px] mr-2">
                  The Stack:
                </strong>
                All tokens are placed in a vertical stack. Players can only
                perform actions that interact with tokens near the top of the
                stack.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#18181b] border-2 border-zinc-800 rounded-xl p-4">
                <div className="w-8 h-8 bg-lime-500/10 text-lime-400 rounded-lg flex items-center justify-center font-black mb-2 text-sm">
                  1
                </div>
                <h3 className="text-white text-sm font-black uppercase tracking-wider mb-1">
                  Move Forward
                </h3>
                <p className="text-zinc-400 text-xs font-medium">
                  You may move the top 1, 2, or 3 tokens forward exactly 1 step
                  on the game path. The order of these tokens cannot change when
                  moving.
                </p>
              </div>
              <div className="bg-[#18181b] border-2 border-zinc-800 rounded-xl p-4">
                <div className="w-8 h-8 bg-lime-500/10 text-lime-400 rounded-lg flex items-center justify-center font-black mb-2 text-sm">
                  2
                </div>
                <h3 className="text-white text-sm font-black uppercase tracking-wider mb-1">
                  Reorder Stack
                </h3>
                <p className="text-zinc-400 text-xs font-medium">
                  You can rearrange the internal order of the topmost tokens
                  without advancing them forward. Bury opponent tokens or
                  elevate your own.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-zinc-900 border-2 border-zinc-800 border-b-[3px] rounded-[20px] p-5 md:p-6">
            <h2 className="text-xl font-black text-white mb-3 font-chakra uppercase tracking-wide flex items-center gap-3">
              <span className="bg-lime-500 text-zinc-950 px-2 py-0.5 rounded-lg font-black text-base border-b-[3px] border-lime-700">
                03
              </span>
              Scoring & Winning
            </h2>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-4">
              Points are awarded based on the final, absolute position of tokens
              at the end of the round. The higher the token in the stack, the
              more points you earn.
            </p>
            <div className="bg-lime-500/10 border-2 border-lime-500/20 text-lime-400 rounded-xl p-4 font-black uppercase tracking-widest text-[10px] text-center">
              Out-smart your opponents to claim the title of Tiki Master!
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Rules;
