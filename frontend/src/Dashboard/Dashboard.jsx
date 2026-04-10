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
  SpeakerHigh as SpeakerHighIcon,
  SpeakerSlash as SpeakerSlashIcon,
} from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";
import { useAudio } from "../context/AudioContext";
import toast from "react-hot-toast";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isMuted, toggleMute, playSFX } = useAudio();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
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

  // First-time user tour using driver.js
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("tiki_dashboard_tour_seen");
    if (!hasSeenTour) {
      const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        popoverClass: "tiki-tour-theme",
        steps: [
          {
            popover: {
              title: "Welcome to Tiki Topple!",
              description:
                "Let's take a quick tour of your dashboard to help you get started.",
            },
          },
          {
            element: "#tour-modes",
            popover: {
              title: "Choose Your Arena",
              description:
                "Select how you want to play. You can play against our AI Bot, share a screen locally, or create a custom online room for your friends.",
              side: "top",
              align: "start",
            },
          },
          {
            element: "#tour-profile",
            popover: {
              title: "Your Account",
              description:
                "Access your profile, adjust settings, read the game rules, or log out from here.",
              side: "bottom",
              align: "end",
            },
          },
          {
            element: "#tour-audio",
            popover: {
              title: "Audio Controls",
              description:
                "Mute or unmute game sounds at any time using this global toggle.",
              side: "left",
              align: "end",
            },
          },
        ],
        onDestroyStarted: () => {
          localStorage.setItem("tiki_dashboard_tour_seen", "true");
          driverObj.destroy();
        },
      });

      // Delay slightly so the page can fully render
      const timer = setTimeout(() => {
        driverObj.drive();
      }, 600);
      return () => clearTimeout(timer);
    }
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

  // Scaled down icons to size={28}
  const modes = [
    {
      id: "ranked",
      title: "Ranked PvP",
      description:
        "Matchmake globally. Compete for ELO and climb the leaderboard.",
      icon: (
        <GameControllerIcon
          size={28}
          weight="fill"
          className="text-zinc-500 group-hover:text-lime-400 transition-colors duration-150"
        />
      ),
      tag: "COMPETITIVE",
      tagClasses:
        "bg-zinc-800 text-zinc-400 group-hover:bg-lime-400 group-hover:text-zinc-950",
      iconClasses:
        "bg-zinc-900 border-2 border-zinc-800 border-b-4 group-hover:border-lime-600 group-hover:border-b-lime-700",
      cardHoverClass:
        "hover:border-lime-500 hover:border-b-lime-600 hover:bg-[#1a1a1d]",
    },
    {
      id: "bot",
      title: "Play Vs AI",
      description:
        "Practice your strategy against our intelligent stacking bot.",
      icon: (
        <RobotIcon
          size={28}
          weight="fill"
          className="text-zinc-500 group-hover:text-blue-400 transition-colors duration-150"
        />
      ),
      tag: "PRACTICE",
      tagClasses:
        "bg-zinc-800 text-zinc-400 group-hover:bg-blue-400 group-hover:text-zinc-950",
      iconClasses:
        "bg-zinc-900 border-2 border-zinc-800 border-b-4 group-hover:border-blue-600 group-hover:border-b-blue-700",
      cardHoverClass:
        "hover:border-blue-500 hover:border-b-blue-600 hover:bg-[#1a1a1d]",
    },
    {
      id: "local",
      title: "Local Co-op",
      description:
        "Pass and play on the exact same device. Perfect for judge demonstrations.",
      icon: (
        <UsersIcon
          size={28}
          weight="fill"
          className="text-zinc-500 group-hover:text-orange-400 transition-colors duration-150"
        />
      ),
      tag: "OFFLINE",
      tagClasses:
        "bg-zinc-800 text-zinc-400 group-hover:bg-orange-400 group-hover:text-zinc-950",
      iconClasses:
        "bg-zinc-900 border-2 border-zinc-800 border-b-4 group-hover:border-orange-600 group-hover:border-b-orange-700",
      cardHoverClass:
        "hover:border-orange-500 hover:border-b-orange-600 hover:bg-[#1a1a1d]",
    },
    {
      id: "custom",
      title: "Custom Room",
      description:
        "Create a private lobby and invite your friends via a secure room code.",
      icon: (
        <UsersThreeIcon
          size={28}
          weight="fill"
          className="text-zinc-500 group-hover:text-purple-400 transition-colors duration-150"
        />
      ),
      tag: "WITH FRIENDS",
      tagClasses:
        "bg-zinc-800 text-zinc-400 group-hover:bg-purple-400 group-hover:text-zinc-950",
      iconClasses:
        "bg-zinc-900 border-2 border-zinc-800 border-b-4 group-hover:border-purple-600 group-hover:border-b-purple-700",
      cardHoverClass:
        "hover:border-purple-500 hover:border-b-purple-600 hover:bg-[#1a1a1d]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra relative flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_top,black_50%,transparent_100%)] pointer-events-none z-0"></div>
      <div
        className="fixed inset-0 opacity-[0.04] mix-blend-screen pointer-events-none z-0"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      ></div>

      {/* Navbar Minimal & Tactile */}
      <header className="border-b-2 border-zinc-800 bg-[#0a0a0a] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <h1
            className="text-2xl font-bebas tracking-wider cursor-pointer"
            onClick={() => navigate("/")}
          >
            Tiki<span className="text-lime-400">Topple</span>
          </h1>

          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            {/* Interactive Profile Trigger (Scaled Down) */}
            <button
              id="tour-profile"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-[#18181b] hover:bg-zinc-800 transition-colors border-2 border-zinc-700 border-b-[3px] pl-1.5 pr-3 py-1 rounded-[14px] cursor-pointer active:border-b-[1px] active:translate-y-[2px]"
            >
              <div className="w-6 h-6 rounded-lg overflow-hidden bg-zinc-900 border-2 border-zinc-600 flex items-center justify-center shrink-0">
                <img
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.avatarSeed || user?._id || "default"}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white text-[10px] font-black tracking-widest uppercase">
                {user?.name || "Player"}
              </span>
              <CaretDownIcon
                size={12}
                weight="bold"
                className={`text-zinc-400 transition-transform duration-150 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Solid Block Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#18181b] border-2 border-zinc-800 border-b-4 rounded-xl p-1.5 z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    user?.isGuest
                      ? setShowGuestModal(true)
                      : navigate("/profile");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <UserIcon size={16} weight="bold" /> My Profile
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    user?.isGuest
                      ? setShowGuestModal(true)
                      : navigate("/settings");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <GearIcon size={16} weight="bold" /> Settings
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/rules");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <BookOpenIcon size={16} weight="bold" /> Game Rules
                </button>

                <div className="h-[2px] bg-zinc-800 my-1 mx-2 rounded-full"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <SignOutIcon size={16} weight="bold" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 md:py-12 relative z-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border-2 border-zinc-800 border-b-[3px] px-3 py-1 rounded-lg mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse"></div>
            <span className="text-zinc-400 font-black tracking-widest text-[9px] uppercase">
              Dashboard Active
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bebas tracking-wide mb-3 text-white">
            Choose Your Arena
          </h2>
          <p className="text-zinc-400 font-medium max-w-lg text-xs md:text-sm leading-relaxed">
            Select a game mode to continue. Master the stack against our AI, or
            challenge others to dominate the board.
          </p>
        </div>

        {/* Tactile Game Modes Grid (Scaled Down) */}
        <div
          id="tour-modes"
          className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 pb-12"
        >
          {modes.map((mode) => (
            <div
              key={mode.id}
              onClick={() => {
                playSFX("/audio/sfx/click.mp3");
                if (
                  user?.isGuest &&
                  (mode.id === "ranked" || mode.id === "custom")
                ) {
                  setShowGuestModal(true);
                  return;
                }
                navigate(`/dashboard/${mode.id}`);
              }}
              className={`bg-[#18181b] p-6 md:p-8 rounded-[24px] border-2 border-zinc-800 border-b-[6px] transition-all duration-150 cursor-pointer group relative active:border-b-[2px] active:translate-y-[4px] ${mode.cardHoverClass}`}
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-150 ${mode.iconClasses}`}
                  >
                    {mode.icon}
                  </div>
                  <span
                    className={`px-2 py-1 rounded-md text-[9px] font-black tracking-widest transition-colors duration-150 ${mode.tagClasses}`}
                  >
                    {mode.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-black mb-2 text-white">
                  {mode.title}
                </h3>

                <p className="text-zinc-400 leading-relaxed text-xs md:text-sm font-medium mb-6 flex-1">
                  {mode.description}
                </p>

                <div className="flex items-center gap-2 text-zinc-500 font-black uppercase text-[10px] tracking-widest group-hover:text-white transition-colors duration-150 mt-auto">
                  Play Mode
                  <div className="bg-zinc-800 p-1 rounded-md border-b-[2px] border-zinc-900 group-hover:bg-white group-hover:text-black group-hover:border-b-zinc-300 transition-colors duration-150">
                    <ArrowRightIcon size={12} weight="bold" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Tactile Guest Restriction Modal (Scaled Down) */}
      {showGuestModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#18181b] border-2 border-zinc-800 border-b-[6px] rounded-[24px] p-6 md:p-8 max-w-sm w-full relative animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-xl flex items-center justify-center mx-auto mb-5 border-2 border-zinc-800 border-b-[3px]">
              <UserIcon size={32} weight="fill" className="text-lime-400" />
            </div>

            <h2 className="text-2xl font-bebas tracking-wider text-white mb-2">
              Account Required
            </h2>
            <p className="text-zinc-400 text-xs mb-6 font-medium leading-relaxed">
              Oops! This feature is restricted to registered players. Create an
              account to track your ELO and play online.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowGuestModal(false);
                  logout();
                }}
                className="w-full bg-lime-500 text-zinc-950 font-black uppercase tracking-widest py-3 px-5 rounded-xl border-b-[3px] border-lime-700 hover:bg-lime-400 active:border-b-0 active:translate-y-[3px] transition-all text-[11px]"
              >
                Create Account
              </button>
              <button
                onClick={() => setShowGuestModal(false)}
                className="w-full bg-zinc-900 border-2 border-zinc-800 text-zinc-400 font-black uppercase tracking-widest py-3 px-5 rounded-xl border-b-[3px] hover:bg-zinc-800 hover:text-white active:border-b-0 active:translate-y-[3px] transition-all text-[11px]"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Audio Controls (Scaled down) */}
      <button
        id="tour-audio"
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#18181b] border-2 border-zinc-700 border-b-[3px] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all rounded-xl active:border-b-0 active:translate-y-[3px] group"
        title={isMuted ? "Unmute Audio" : "Mute Audio"}
      >
        {isMuted ? (
          <SpeakerSlashIcon size={20} weight="bold" />
        ) : (
          <SpeakerHighIcon size={20} weight="bold" className="text-lime-400" />
        )}
      </button>
    </div>
  );
};

export default Dashboard;
