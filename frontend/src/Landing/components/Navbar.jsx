import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GithubLogoIcon, SignOutIcon } from "@phosphor-icons/react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

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
          <button
            onClick={() => navigate('/rules')}
            className="hidden md:block hover:text-lime-400 transition-colors uppercase font-bold text-xs tracking-widest"
          >
            Rules
          </button>

          <a
            href="https://github.com/your-repo"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-2 hover:text-white transition-colors"
          >
            <GithubLogoIcon size={20} />
            <span>Repo</span>
          </a>

          {user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-[#18181b] text-white font-chakra font-bold uppercase tracking-wide pl-2 pr-5 py-1.5 rounded-xl border-2 border-[#a3e635] shadow-[0px_4px_0px_0px_#a3e635] hover:bg-[#27272a] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#a3e635] active:shadow-[0px_0px_0px_0px_#a3e635] active:translate-y-1 transition-all cursor-pointer flex items-center gap-2"
              >
                <div className="w-7 h-7 bg-zinc-800 rounded-lg overflow-hidden border border-[#a3e635]/50 shrink-0">
                  <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.avatarSeed || user?._id || "default"}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <span>Dashboard</span>
              </button>
              <button 
                onClick={handleLogout}
                className="hidden sm:flex text-zinc-400 hover:text-red-400 transition-colors px-2"
                title="Logout"
              >
                <SignOutIcon size={24} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#18181b] text-white font-chakra font-bold uppercase tracking-wide px-5 py-2 rounded-xl border-2 border-[#a3e635] shadow-[0px_4px_0px_0px_#a3e635] hover:bg-[#27272a] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#a3e635] active:shadow-[0px_0px_0px_0px_#a3e635] active:translate-y-1 transition-all cursor-pointer"
            >
              Play Now
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
