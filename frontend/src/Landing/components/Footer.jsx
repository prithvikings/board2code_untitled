import React from "react";
import {
  GithubLogoIcon,
  ArrowUpRightIcon,
  CodeIcon,
} from "@phosphor-icons/react";

const Footer = () => {
  return (
    <footer className="border-t border-zinc-800/50 bg-gradient-to-b from-[#0a0a0a] to-[#050505] pt-20 pb-8 font-chakra relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-lime-500/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 text-zinc-100 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left flex-1">
            <h2 className="text-4xl text-zinc-100 font-nunito font-bold tracking-tight">
              Tiki
              <span className="text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.3)]">
                Topple
              </span>
            </h2>
            <p className="text-zinc-500 text-sm mt-4 max-w-sm leading-relaxed mx-auto md:mx-0">
              Built exclusively for the NPC Board2Code Hackathon 2026. A
              strategic stacking game developed from scratch in 24 hours.
            </p>

            {/* Hackathon Tech Stack Tag */}
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <CodeIcon size={16} className="text-zinc-400" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Built with React & Tailwind
              </span>
            </div>
          </div>

          {/* Links Grid */}
          <div className="flex gap-16 md:gap-24 text-left">
            <div className="flex flex-col gap-4">
              <span className="text-white font-bold tracking-widest text-sm uppercase mb-2">
                Hackathon
              </span>
              <a
                href="#rules"
                className="group flex items-center gap-1 text-zinc-400 text-sm font-semibold hover:text-[#a3e635] transition-colors"
              >
                Game Rules
                <ArrowUpRightIcon
                  size={14}
                  className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300"
                />
              </a>
              <a
                href="#"
                className="group flex items-center gap-1 text-zinc-400 text-sm font-semibold hover:text-[#a3e635] transition-colors"
              >
                Documentation
                <ArrowUpRightIcon
                  size={14}
                  className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300"
                />
              </a>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-white font-bold tracking-widest text-sm uppercase mb-2">
                Project
              </span>
              <a
                href="#"
                className="group flex items-center gap-2 text-zinc-400 text-sm font-semibold hover:text-white transition-colors"
              >
                <GithubLogoIcon size={16} />
                Source Code
              </a>
              <a
                href="#"
                className="group flex items-center gap-1 text-lime-400 text-sm font-semibold hover:text-lime-300 transition-colors"
              >
                Play Demo
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse ml-1"></div>
              </a>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-10"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-zinc-600 uppercase tracking-widest">
          <p>© 2026 NetPractice Campus Hosted at LPU. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-zinc-400 cursor-help transition-colors">
              Team Name Here
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
