import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, BookOpenTextIcon } from "@phosphor-icons/react";

const Rules = () => {
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
          <div className="w-16 h-16 bg-lime-950/30 border border-lime-900/50 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.1)]">
            <BookOpenTextIcon
              size={32}
              className="text-lime-400"
              weight="duotone"
            />
          </div>
          <div>
            <span className="text-lime-400 font-bold uppercase tracking-widest text-[10px]">
              Official Guide
            </span>
            <h1 className="text-5xl md:text-6xl font-bebas tracking-wide text-zinc-100 drop-shadow-md">
              Tiki Topple Rules
            </h1>
          </div>
        </div>

        <div className="bg-[#0f0f11] border border-zinc-800/80 border-t-4 border-t-lime-500 p-8 md:p-12 rounded-2xl relative shadow-2xl font-poppins text-zinc-300 leading-relaxed text-sm md:text-base space-y-10">
          <section className="relative pl-6 border-l-2 border-lime-500/20 hover:border-lime-500/50 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-3 font-chakra flex items-center gap-2">
              <span className="text-lime-500 font-mono text-lg">01.</span>{" "}
              Objective
            </h2>
            <p className="text-zinc-400">
              The goal in Tiki Topple is to manipulate the stack of Tiki tokens
              so that your secret target tokens end up in the highest possible
              position by the end of the round.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-lime-500/20 hover:border-lime-500/50 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-3 font-chakra flex items-center gap-2">
              <span className="text-lime-500 font-mono text-lg">02.</span> Game
              Mechanics
            </h2>
            <p className="text-zinc-400 mb-4">
              <strong className="text-zinc-200">The Stack:</strong> All tokens
              are placed in a vertical stack. Players can only perform actions
              that interact with tokens near the top of the stack.
            </p>
            <ul className="list-none space-y-3">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400 mt-2 flex-shrink-0"></div>
                <p className="text-zinc-400">
                  <strong className="text-zinc-200">Move Forward:</strong> You
                  may move the top 1, 2, or 3 tokens forward exactly 1 step on
                  the game path. The order of these tokens cannot change when
                  moving.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400 mt-2 flex-shrink-0"></div>
                <p className="text-zinc-400">
                  <strong className="text-zinc-200">Reorder Stack:</strong> You
                  can rearrange the internal order of the topmost tokens without
                  advancing them forward on the path. This allows you to bury
                  opponent tokens or elevate your own.
                </p>
              </li>
            </ul>
          </section>

          <section className="relative pl-6 border-l-2 border-lime-500/20 hover:border-lime-500/50 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-3 font-chakra flex items-center gap-2">
              <span className="text-lime-500 font-mono text-lg">03.</span>{" "}
              Scoring
            </h2>
            <p className="text-zinc-400">
              Points are awarded based on the final, absolute position of tokens
              at the end of the round. The higher the token in the stack, the
              more points you earn.
            </p>
          </section>

          <section className="relative pl-6 border-l-2 border-lime-500/20 hover:border-lime-500/50 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-3 font-chakra flex items-center gap-2">
              <span className="text-lime-500 font-mono text-lg">04.</span> How
              to Win
            </h2>
            <p className="text-zinc-400">
              Out-smart your opponents round by round. The player with the
              highest cumulative score at the end of the tournament claims the
              title of Tiki Master.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Rules;
