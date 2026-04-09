import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GithubLogoIcon } from "@phosphor-icons/react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-[#0a0a0a]/70 backdrop-blur-md border-white/10 py-3"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl w-full mx-auto px-6 font-chakra flex justify-between items-center">
        <div className="logo group cursor-pointer" onClick={() => navigate('/')}>
          <h1 className="text-3xl text-zinc-100 font-nunito font-bold tracking-tight transition-transform group-hover:scale-105">
            Tiki
            <span className="text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]">
              Topple
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-6 text-zinc-300 font-medium">
          <a
            href="#rules"
            className="hidden md:block hover:text-lime-400 transition-colors"
          >
            Rules
          </a>

          <a
            href="https://github.com/your-repo"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-2 hover:text-white transition-colors"
          >
            <GithubLogoIcon size={20} />
            <span>Repo</span>
          </a>

          <button 
            onClick={() => navigate('/login')}
            className="bg-[#18181b] text-white font-chakra font-bold uppercase tracking-wide px-5 py-2 rounded-xl border-2 border-[#a3e635] shadow-[0px_4px_0px_0px_#a3e635] hover:bg-[#27272a] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#a3e635] active:shadow-[0px_0px_0px_0px_#a3e635] active:translate-y-1 transition-all cursor-pointer"
          >
            Play Now
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
