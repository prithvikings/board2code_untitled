import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GithubLogo as GithubLogoIcon,
  SignOut as SignOutIcon,
} from "@phosphor-icons/react";
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-150 ${
        isScrolled
          ? "bg-[#0a0a0a] border-b-4 border-zinc-800 py-3"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl w-full mx-auto px-6 font-chakra flex justify-between items-center">
        <div className="logo cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-4xl text-white font-bebas tracking-wider hover:scale-105 transition-transform active:scale-95">
            Tiki<span className="text-lime-500">Topple</span>
          </h1>
        </div>

        <div className="flex items-center gap-6 text-zinc-300 font-medium">
          <button
            onClick={() => navigate("/rules")}
            className="hidden md:block hover:text-white transition-colors uppercase font-black text-xs tracking-widest"
          >
            Rules
          </button>

          <a
            href="https://github.com/prithvikings/board2code_untitled"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-2 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest"
          >
            <GithubLogoIcon size={24} weight="fill" />
            <span>Repo</span>
          </a>

          {user ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-zinc-900 text-white font-black uppercase tracking-widest pl-2 pr-5 py-2 rounded-2xl border-2 border-zinc-700 border-b-4 hover:bg-zinc-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer flex items-center gap-3 text-xs"
              >
                <div className="w-8 h-8 bg-zinc-950 rounded-xl overflow-hidden border-2 border-zinc-600 shrink-0">
                  <img
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.avatarSeed || user?._id || "default"}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>Dashboard</span>
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:flex w-12 h-12 bg-zinc-900 border-2 border-zinc-700 border-b-4 text-red-400 hover:text-white hover:bg-red-500 active:border-b-0 active:translate-y-1 transition-all items-center justify-center rounded-2xl cursor-pointer"
                title="Logout"
              >
                <SignOutIcon size={20} weight="bold" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-lime-500 text-zinc-950 font-black uppercase tracking-widest px-6 py-3 rounded-2xl border-b-4 border-lime-700 hover:bg-lime-400 active:border-b-0 active:translate-y-1 transition-all cursor-pointer text-xs"
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
