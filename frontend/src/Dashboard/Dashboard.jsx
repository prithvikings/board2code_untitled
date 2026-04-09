import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GameController as GameControllerIcon,
  Robot as RobotIcon,
  Users as UsersIcon,
  UsersThree as UsersThreeIcon,
  SignOut as SignOutIcon,
  ArrowRight as ArrowRightIcon,
  User as UserIcon,
  Gear as GearIcon,
  BookOpen as BookOpenIcon,
  CaretDown as CaretDownIcon,
} from "@phosphor-icons/react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const modes = [
    {
      id: "ranked",
      title: "Ranked PvP",
      description:
        "Matchmake globally. Compete for ELO and climb the leaderboard.",
      icon: (
        <GameControllerIcon
          size={32}
          className="text-lime-400 group-hover:scale-110 transition-transform duration-300"
        />
      ),
      tag: "COMPETITIVE",
      tagStyle: "text-lime-400 bg-lime-400/10 border-lime-400/20",
      hoverStyle:
        "hover:border-lime-400 hover:shadow-[8px_8px_0px_0px_#a3e635] hover:-translate-y-1 hover:-translate-x-1",
      iconBg: "bg-lime-950/30 border-lime-900/50",
    },
    {
      id: "bot",
      title: "Play Vs AI",
      description:
        "Practice your strategy against our intelligent stacking bot.",
      icon: (
        <RobotIcon
          size={32}
          className="text-blue-400 group-hover:scale-110 transition-transform duration-300"
        />
      ),
      tag: "PRACTICE",
      tagStyle: "text-blue-400 bg-blue-400/10 border-blue-400/20",
      hoverStyle:
        "hover:border-blue-400 hover:shadow-[8px_8px_0px_0px_#60a5fa] hover:-translate-y-1 hover:-translate-x-1",
      iconBg: "bg-blue-950/30 border-blue-900/50",
    },
    {
      id: "local",
      title: "Local Co-op",
      description:
        "Pass and play on the exact same device. Perfect for judge demonstrations.",
      icon: (
        <UsersIcon
          size={32}
          className="text-orange-400 group-hover:scale-110 transition-transform duration-300"
        />
      ),
      tag: "OFFLINE",
      tagStyle: "text-orange-400 bg-orange-400/10 border-orange-400/20",
      hoverStyle:
        "hover:border-orange-400 hover:shadow-[8px_8px_0px_0px_#fb923c] hover:-translate-y-1 hover:-translate-x-1",
      iconBg: "bg-orange-950/30 border-orange-900/50",
    },
    {
      id: "custom",
      title: "Custom Room",
      description:
        "Create a private lobby and invite your friends via a secure room code.",
      icon: (
        <UsersThreeIcon
          size={32}
          className="text-purple-400 group-hover:scale-110 transition-transform duration-300"
        />
      ),
      tag: "WITH FRIENDS",
      tagStyle: "text-purple-400 bg-purple-400/10 border-purple-400/20",
      hoverStyle:
        "hover:border-purple-400 hover:shadow-[8px_8px_0px_0px_#c084fc] hover:-translate-y-1 hover:-translate-x-1",
      iconBg: "bg-purple-950/30 border-purple-900/50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra relative flex flex-col">
      {/* Background Masked Grid for Depth */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_80%)] pointer-events-none z-0"></div>

      {/* Navbar Minimal */}
      <header className="border-b border-zinc-800/80 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            className="text-2xl font-nunito font-bold tracking-tight cursor-pointer"
            onClick={() => navigate("/")}
          >
            Tiki<span className="text-lime-400">Topple</span>
          </h1>

          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            {/* Interactive Profile Trigger */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-800 transition-colors border border-zinc-800 px-3 py-1.5 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-500/50"
            >
              <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></div>
              <span className="text-zinc-300 text-xs font-bold tracking-wider uppercase">
                Player One
              </span>
              <CaretDownIcon
                size={14}
                className={`text-zinc-500 transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Subtle Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#121214] border border-zinc-800/80 rounded-xl shadow-2xl py-2 z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
                >
                  <UserIcon size={16} />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
                >
                  <GearIcon size={16} />
                  Settings
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/rules");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
                >
                  <BookOpenIcon size={16} />
                  Game Rules
                </button>

                <div className="h-px bg-zinc-800/80 my-1 mx-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <SignOutIcon size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 relative z-10">
        <div className="mb-12 md:mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/20 text-[#a3e635] font-bold tracking-widest text-[10px] uppercase mb-4">
            Dashboard
          </span>
          <h2 className="text-5xl md:text-7xl font-bebas tracking-wide mb-3 drop-shadow-md">
            Select Game Mode
          </h2>
          <p className="text-zinc-400 font-poppins max-w-xl text-sm md:text-base leading-relaxed">
            Choose how you want to play. Master the stack against our AI, or
            challenge other players to dominate the board.
          </p>
        </div>

        {/* Game Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {modes.map((mode) => (
            <div
              key={mode.id}
              onClick={() => navigate(`/dashboard/${mode.id}`)}
              className={`bg-[#121214] p-8 md:p-10 rounded-2xl border-2 border-zinc-800 transition-all duration-300 cursor-pointer group relative overflow-hidden ${mode.hoverStyle}`}
            >
              {/* Subtle Inner Glow on Hover based on card color */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${mode.tagStyle.split(" ")[1]}`}
              ></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div
                    className={`p-4 rounded-xl border backdrop-blur-sm ${mode.iconBg}`}
                  >
                    {mode.icon}
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-widest border ${mode.tagStyle}`}
                  >
                    {mode.tag}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-3 font-poppins text-zinc-100 group-hover:text-white transition-colors">
                  {mode.title}
                </h3>

                <p className="text-zinc-500 leading-relaxed text-sm md:text-base mb-6 group-hover:text-zinc-300 transition-colors">
                  {mode.description}
                </p>

                <div className="flex items-center gap-2 text-zinc-600 font-bold uppercase text-[11px] tracking-widest group-hover:text-white transition-colors">
                  Select Mode
                  <ArrowRightIcon
                    size={14}
                    className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
