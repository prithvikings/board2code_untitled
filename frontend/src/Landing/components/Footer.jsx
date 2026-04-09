import React from "react";
import { useNavigate } from "react-router-dom";
import {
  GithubLogo as GithubLogoIcon,
  ArrowRight as ArrowRightIcon,
  Code as CodeIcon,
} from "@phosphor-icons/react";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t-4 border-zinc-800 bg-[#0a0a0a] pt-20 pb-12 font-chakra relative">
      <div className="max-w-7xl mx-auto px-6 text-zinc-100 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left flex-1">
            <h2 className="text-5xl text-white font-bebas tracking-wide">
              Tiki<span className="text-lime-500">Topple</span>
            </h2>
            <p className="text-zinc-500 text-sm mt-4 max-w-sm leading-relaxed mx-auto md:mx-0 font-medium">
              Built exclusively for the NPC Board2Code Hackathon 2026. A
              strategic stacking game developed from scratch in 24 hours.
            </p>

            {/* Hackathon Tech Stack Tag */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border-2 border-zinc-800 border-b-4">
              <CodeIcon size={20} weight="bold" className="text-zinc-400" />
              <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                Built with React & Tailwind
              </span>
            </div>
          </div>

          {/* Links Grid */}
          <div className="flex gap-16 md:gap-24 text-left">
            <div className="flex flex-col gap-4">
              <span className="text-zinc-500 font-black tracking-widest text-xs uppercase mb-2">
                Hackathon
              </span>
              <button
                onClick={() => navigate("/rules")}
                className="group flex items-center gap-2 text-zinc-300 text-sm font-bold hover:text-lime-500 transition-colors uppercase tracking-wide"
              >
                <ArrowRightIcon
                  size={16}
                  weight="bold"
                  className="text-zinc-600 group-hover:text-lime-500"
                />
                Game Rules
              </button>
              <a
                href="#"
                className="group flex items-center gap-2 text-zinc-300 text-sm font-bold hover:text-lime-500 transition-colors uppercase tracking-wide"
              >
                <ArrowRightIcon
                  size={16}
                  weight="bold"
                  className="text-zinc-600 group-hover:text-lime-500"
                />
                Documentation
              </a>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-zinc-500 font-black tracking-widest text-xs uppercase mb-2">
                Legal & Source
              </span>
              <a
                href="#"
                className="group flex items-center gap-2 text-zinc-300 text-sm font-bold hover:text-white transition-colors uppercase tracking-wide"
              >
                <GithubLogoIcon
                  size={18}
                  weight="fill"
                  className="text-zinc-600 group-hover:text-white"
                />
                Source Code
              </a>
              <button
                onClick={() => navigate("/privacy")}
                className="group flex items-center gap-2 text-zinc-300 text-sm font-bold hover:text-white transition-colors uppercase tracking-wide"
              >
                <ArrowRightIcon
                  size={16}
                  weight="bold"
                  className="text-zinc-600 group-hover:text-white"
                />
                Privacy Policy
              </button>
              <button
                onClick={() => navigate("/terms")}
                className="group flex items-center gap-2 text-zinc-300 text-sm font-bold hover:text-white transition-colors uppercase tracking-wide"
              >
                <ArrowRightIcon
                  size={16}
                  weight="bold"
                  className="text-zinc-600 group-hover:text-white"
                />
                Terms of Service
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-1 bg-zinc-900 rounded-full my-12"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
          <p>© 2026 NetPractice Campus Hosted at LPU.</p>
          <div className="flex gap-6">
            <span className="hover:text-zinc-400 cursor-help transition-colors bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
              Untitled
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
