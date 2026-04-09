import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft as ArrowLeftIcon,
  User as UserIcon,
  Trophy as TrophyIcon,
  Sword as SwordIcon,
  ChartLineUp as ChartLineUpIcon,
  Medal as MedalIcon,
  Crown as CrownIcon,
  Fire as FireIcon,
  Target as TargetIcon,
  Skull as SkullIcon,
  Lightning as LightningIcon,
} from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Safe defaults if user lacks stats (e.g., existing db entries before stats schema update)
  const stats = user?.stats || {
    elo: 1200,
    matchesPlayed: 0,
    wins: 0,
    tikisToppled: 0,
    highestStreak: 0
  };

  const winRate = stats.matchesPlayed > 0 
    ? ((stats.wins / stats.matchesPlayed) * 100).toFixed(1) 
    : "0.0";

  const joinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "Recently";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra p-6 md:p-12 relative flex flex-col items-center">
      {/* Premium Masked Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_80%)] pointer-events-none z-0"></div>

      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors uppercase font-bold text-[10px] tracking-widest z-10 group"
      >
        <ArrowLeftIcon
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Dashboard
      </button>

      <div className="relative z-10 max-w-5xl w-full mt-16 md:mt-16 mb-12">
        {/* 1. HERO BANNER */}
        <div className="bg-[#0f0f11] border border-zinc-800/80 rounded-3xl p-8 relative shadow-2xl overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative z-10">
            {/* Avatar & Level */}
            <div className="relative">
              <div className="w-32 h-32 bg-zinc-900 border-4 border-lime-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.2)] overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.avatarSeed || user?._id || "default"}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-lime-500 text-zinc-900 font-bold px-4 py-1 rounded-full text-xs border-4 border-[#0f0f11] shadow-lg whitespace-nowrap">
                LVL 42
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h1 className="text-4xl font-bebas tracking-wider text-white">
                  {user?.name || "Player"}
                </h1>
                <CrownIcon
                  size={24}
                  className="text-yellow-400"
                  weight="fill"
                />
              </div>
              <p className="text-zinc-400 font-poppins text-sm mb-6">
                Joined: {joinDate} • Tiki Master Tier
              </p>

              {/* EXP Bar Gamification */}
              <div className="w-full max-w-md bg-zinc-900 rounded-full h-2 mb-2 border border-zinc-800">
                <div className="bg-lime-500 h-2 rounded-full w-[78%] relative shadow-[0_0_10px_rgba(163,230,53,0.5)]"></div>
              </div>
              <div className="flex justify-between w-full max-w-md text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <span>7,840 XP</span>
                <span>10,000 XP (Next Rank)</span>
              </div>
            </div>

            {/* Top Tier Badge */}
            <div className="hidden md:flex flex-col items-center justify-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl min-w-[140px]">
              <TrophyIcon
                size={32}
                className="text-lime-400 mb-2"
                weight="duotone"
              />
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                Ranked ELO
              </p>
              <p className="font-mono font-bold text-2xl text-white">{stats.elo}</p>
            </div>
          </div>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Playstyle & Deep Stats */}
          <div className="flex flex-col gap-6">
            {/* Playstyle Analysis */}
            <div className="bg-[#0f0f11] border border-zinc-800/80 rounded-3xl p-6 relative shadow-xl">
              <h2 className="text-sm font-bold text-white mb-5 uppercase tracking-widest flex items-center gap-2">
                <TargetIcon size={18} className="text-purple-400" />
                Playstyle
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    <span>Aggressive</span>
                    <span className="text-white">85%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full w-[85%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    <span>Strategic Setup</span>
                    <span className="text-white">60%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full w-[60%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    <span>Defensive</span>
                    <span className="text-white">40%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5">
                    <div className="bg-zinc-500 h-1.5 rounded-full w-[40%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Stats */}
            <div className="bg-[#0f0f11] border border-zinc-800/80 rounded-3xl p-6 relative shadow-xl flex-1">
              <h2 className="text-sm font-bold text-white mb-5 uppercase tracking-widest flex items-center gap-2">
                <FireIcon size={18} className="text-orange-400" />
                Career
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                  <p className="text-[10px] uppercase text-zinc-500 mb-1">
                    Win Rate
                  </p>
                  <p className="font-mono text-lg text-white">{winRate}%</p>
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                  <p className="text-[10px] uppercase text-zinc-500 mb-1">
                    Matches
                  </p>
                  <p className="font-mono text-lg text-white">{stats.matchesPlayed}</p>
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                  <p className="text-[10px] uppercase text-zinc-500 mb-1">
                    Tikis Toppled
                  </p>
                  <p className="font-mono text-lg text-white">{stats.tikisToppled}</p>
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                  <p className="text-[10px] uppercase text-zinc-500 mb-1">
                    Highest Streak
                  </p>
                  <p className="font-mono text-lg text-lime-400">{stats.highestStreak} W</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 & 3: Match History & Achievements */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Match History */}
            <div className="bg-[#0f0f11] border border-zinc-800/80 rounded-3xl p-6 relative shadow-xl">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <ChartLineUpIcon size={18} className="text-blue-400" />
                  Recent Matches
                </h2>
                <button className="text-[10px] text-zinc-500 hover:text-white transition-colors uppercase font-bold tracking-widest border border-zinc-800 px-3 py-1 rounded-lg">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    result: "Victory",
                    score: "+24 ELO",
                    opponent: "TikiMaster99",
                    turns: 22,
                    time: "2m ago",
                    color: "text-lime-400",
                    border: "border-lime-500/20",
                  },
                  {
                    result: "Defeat",
                    score: "-12 ELO",
                    opponent: "StackBot Alpha",
                    turns: 30,
                    time: "1h ago",
                    color: "text-red-400",
                    border: "border-red-500/20",
                  },
                  {
                    result: "Victory",
                    score: "+18 ELO",
                    opponent: "Guest_4021",
                    turns: 18,
                    time: "3h ago",
                    color: "text-lime-400",
                    border: "border-lime-500/20",
                  },
                ].map((match, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center bg-[#151518] border ${match.border} p-3.5 rounded-xl hover:bg-zinc-900/80 transition-colors cursor-pointer group`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-900 border ${match.border}`}
                      >
                        {match.result === "Victory" ? (
                          <SwordIcon size={20} className={match.color} />
                        ) : (
                          <SkullIcon size={20} className={match.color} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm uppercase ${match.color}`}
                          >
                            {match.result}
                          </span>
                          <span className="text-[10px] text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded-md">
                            {match.time}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          vs{" "}
                          <span className="text-zinc-300">
                            {match.opponent}
                          </span>{" "}
                          • {match.turns} turns
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">
                      {match.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Matrix */}
            <div className="bg-[#0f0f11] border border-zinc-800/80 rounded-3xl p-6 relative shadow-xl flex-1">
              <h2 className="text-sm font-bold text-white mb-5 uppercase tracking-widest flex items-center gap-2">
                <MedalIcon size={18} className="text-yellow-400" />
                Achievements
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    title: "First Blood",
                    desc: "Win your first ranked match",
                    unlocked: true,
                    icon: <SwordIcon size={16} weight="fill" />,
                  },
                  {
                    title: "Stack Master",
                    desc: "Score 50+ pts in one game",
                    unlocked: true,
                    icon: <LightningIcon size={16} weight="fill" />,
                  },
                  {
                    title: "Untouchable",
                    desc: "Win without token moving back",
                    unlocked: false,
                    icon: <TargetIcon size={16} weight="fill" />,
                  },
                  {
                    title: "Tiki God",
                    desc: "Reach 1500 ELO rating",
                    unlocked: false,
                    icon: <CrownIcon size={16} weight="fill" />,
                  },
                ].map((ach, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${ach.unlocked ? "bg-[#151518] border-yellow-500/20 hover:border-yellow-500/40" : "bg-zinc-900/30 border-zinc-800/50 opacity-60 grayscale"}`}
                  >
                    <div
                      className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${ach.unlocked ? "bg-yellow-500/10 text-yellow-400" : "bg-zinc-800 text-zinc-600"}`}
                    >
                      {ach.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-zinc-100 uppercase tracking-wide">
                        {ach.title}
                      </h3>
                      <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                        {ach.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
