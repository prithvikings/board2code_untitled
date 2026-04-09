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

  // Safe defaults if user lacks stats
  const stats = user?.stats || {
    elo: 1200,
    matchesPlayed: 0,
    wins: 0,
    tikisToppled: 0,
    highestStreak: 0,
  };

  const winRate =
    stats.matchesPlayed > 0
      ? ((stats.wins / stats.matchesPlayed) * 100).toFixed(1)
      : "0.0";

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

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

      {/* Tactile Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 left-4 md:top-8 md:left-8 flex items-center gap-2 bg-[#18181b] border-2 border-zinc-800 border-b-[3px] text-zinc-400 hover:text-white hover:bg-zinc-800 active:border-b-[1px] active:translate-y-[2px] transition-all px-4 py-2 rounded-xl uppercase font-black text-[10px] tracking-widest z-10"
      >
        <ArrowLeftIcon size={16} weight="bold" />
        Back
      </button>

      <div className="relative z-10 max-w-5xl w-full mt-16 md:mt-12 mb-12">
        {/* 1. HERO BANNER (Chunky & Solid) */}
        <div className="bg-[#18181b] border-2 border-zinc-800 border-b-[6px] rounded-[24px] p-6 md:p-8 relative mb-6 flex flex-col md:flex-row items-center md:items-stretch gap-6 text-center md:text-left">
          {/* Avatar & Level */}
          <div className="relative shrink-0 flex flex-col items-center mt-2 md:mt-0">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-zinc-900 border-4 border-zinc-700 border-b-[6px] rounded-2xl flex items-center justify-center overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.avatarSeed || user?._id || "default"}`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 bg-lime-500 text-zinc-950 font-black px-4 py-1 rounded-lg border-2 border-lime-700 border-b-[3px] text-[10px] uppercase tracking-widest z-10">
              LVL 42
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col justify-center">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
              <h1 className="text-4xl md:text-5xl font-bebas tracking-wider text-white">
                {user?.name || "Player"}
              </h1>
              <CrownIcon size={28} className="text-yellow-400" weight="fill" />
            </div>
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mb-5">
              Joined {joinDate} • Tiki Master Tier
            </p>

            {/* Tactile EXP Bar */}
            <div className="w-full max-w-sm bg-zinc-900 rounded-full h-4 mb-1.5 border-2 border-zinc-800 p-0.5">
              <div className="bg-lime-500 h-full rounded-full w-[78%] relative border-b-2 border-lime-600"></div>
            </div>
            <div className="flex justify-between w-full max-w-sm text-[9px] font-black text-zinc-500 uppercase tracking-widest px-2">
              <span>7,840 XP</span>
              <span>10,000 XP (Next Rank)</span>
            </div>
          </div>

          {/* Top Tier Badge (Physical Block) */}
          <div className="hidden lg:flex flex-col items-center justify-center p-5 bg-zinc-900 border-2 border-zinc-800 border-b-[6px] rounded-2xl min-w-[140px]">
            <TrophyIcon
              size={32}
              className="text-yellow-400 mb-1.5"
              weight="fill"
            />
            <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-black mb-1">
              Ranked ELO
            </p>
            <p className="font-bebas text-3xl text-white">{stats.elo}</p>
          </div>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Playstyle & Career */}
          <div className="flex flex-col gap-6">
            {/* Playstyle Analysis */}
            <div className="bg-[#18181b] border-2 border-zinc-800 border-b-[6px] rounded-[24px] p-6">
              <h2 className="text-base font-black text-white mb-5 uppercase tracking-widest flex items-center gap-2">
                <TargetIcon
                  size={20}
                  weight="fill"
                  className="text-purple-400"
                />
                Playstyle
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1.5">
                    <span>Aggressive</span>
                    <span className="text-white">85%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2.5 border border-zinc-800 p-0.5">
                    <div className="bg-purple-500 h-full rounded-full w-[85%] border-b border-purple-600"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1.5">
                    <span>Strategic</span>
                    <span className="text-white">60%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2.5 border border-zinc-800 p-0.5">
                    <div className="bg-blue-500 h-full rounded-full w-[60%] border-b border-blue-600"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1.5">
                    <span>Defensive</span>
                    <span className="text-white">40%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2.5 border border-zinc-800 p-0.5">
                    <div className="bg-zinc-500 h-full rounded-full w-[40%] border-b border-zinc-600"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Stats */}
            <div className="bg-[#18181b] border-2 border-zinc-800 border-b-[6px] rounded-[24px] p-6 flex-1">
              <h2 className="text-base font-black text-white mb-5 uppercase tracking-widest flex items-center gap-2">
                <FireIcon size={20} weight="fill" className="text-orange-400" />
                Career
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900 border-2 border-zinc-800 border-b-[3px] p-3 rounded-xl flex flex-col items-center text-center">
                  <p className="text-[9px] uppercase font-black text-zinc-500 mb-0.5">
                    Win Rate
                  </p>
                  <p className="font-bebas text-2xl text-white">{winRate}%</p>
                </div>
                <div className="bg-zinc-900 border-2 border-zinc-800 border-b-[3px] p-3 rounded-xl flex flex-col items-center text-center">
                  <p className="text-[9px] uppercase font-black text-zinc-500 mb-0.5">
                    Matches
                  </p>
                  <p className="font-bebas text-2xl text-white">
                    {stats.matchesPlayed}
                  </p>
                </div>
                <div className="bg-zinc-900 border-2 border-zinc-800 border-b-[3px] p-3 rounded-xl flex flex-col items-center text-center">
                  <p className="text-[9px] uppercase font-black text-zinc-500 mb-0.5">
                    Toppled
                  </p>
                  <p className="font-bebas text-2xl text-white">
                    {stats.tikisToppled}
                  </p>
                </div>
                <div className="bg-zinc-900 border-2 border-zinc-800 border-b-[3px] p-3 rounded-xl flex flex-col items-center text-center">
                  <p className="text-[9px] uppercase font-black text-zinc-500 mb-0.5">
                    Streak
                  </p>
                  <p className="font-bebas text-2xl text-lime-400">
                    {stats.highestStreak} W
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 & 3: Match History & Achievements */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Match History */}
            <div className="bg-[#18181b] border-2 border-zinc-800 border-b-[6px] rounded-[24px] p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <ChartLineUpIcon
                    size={20}
                    weight="fill"
                    className="text-blue-400"
                  />
                  Recent Matches
                </h2>
                <button className="bg-zinc-900 text-zinc-400 border-2 border-zinc-700 border-b-[3px] px-3 py-1.5 rounded-lg text-[9px] uppercase font-black tracking-widest hover:text-white hover:bg-zinc-800 active:border-b-[1px] active:translate-y-[2px] transition-all">
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
                    bg: "bg-lime-500/10",
                    border: "border-lime-500/30",
                  },
                  {
                    result: "Defeat",
                    score: "-12 ELO",
                    opponent: "StackBot Alpha",
                    turns: 30,
                    time: "1h ago",
                    color: "text-red-400",
                    bg: "bg-red-500/10",
                    border: "border-red-500/30",
                  },
                  {
                    result: "Victory",
                    score: "+18 ELO",
                    opponent: "Guest_4021",
                    turns: 18,
                    time: "3h ago",
                    color: "text-lime-400",
                    bg: "bg-lime-500/10",
                    border: "border-lime-500/30",
                  },
                ].map((match, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center bg-zinc-900 border-2 border-zinc-800 border-b-[3px] p-3 rounded-xl hover:bg-zinc-800 active:border-b-[1px] active:translate-y-[2px] transition-all cursor-pointer`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 border-b-[3px] ${match.bg} ${match.border}`}
                      >
                        {match.result === "Victory" ? (
                          <SwordIcon
                            size={20}
                            weight="fill"
                            className={match.color}
                          />
                        ) : (
                          <SkullIcon
                            size={20}
                            weight="fill"
                            className={match.color}
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`font-black text-xs uppercase tracking-wider ${match.color}`}
                          >
                            {match.result}
                          </span>
                          <span className="text-[9px] font-bold text-zinc-500 bg-[#121214] px-1.5 py-0.5 rounded-md border border-zinc-800">
                            {match.time}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          vs{" "}
                          <span className="text-zinc-200">
                            {match.opponent}
                          </span>{" "}
                          • {match.turns} turns
                        </p>
                      </div>
                    </div>
                    <span className="font-bebas text-xl text-zinc-300 tracking-wide">
                      {match.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Matrix */}
            <div className="bg-[#18181b] border-2 border-zinc-800 border-b-[6px] rounded-[24px] p-6 flex-1">
              <h2 className="text-base font-black text-white mb-5 uppercase tracking-widest flex items-center gap-2">
                <MedalIcon
                  size={20}
                  weight="fill"
                  className="text-yellow-400"
                />
                Achievements
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    title: "First Blood",
                    desc: "Win your first ranked match",
                    unlocked: true,
                    icon: <SwordIcon size={18} weight="fill" />,
                  },
                  {
                    title: "Stack Master",
                    desc: "Score 50+ pts in one game",
                    unlocked: true,
                    icon: <LightningIcon size={18} weight="fill" />,
                  },
                  {
                    title: "Untouchable",
                    desc: "Win without token moving back",
                    unlocked: false,
                    icon: <TargetIcon size={18} weight="fill" />,
                  },
                  {
                    title: "Tiki God",
                    desc: "Reach 1500 ELO rating",
                    unlocked: false,
                    icon: <CrownIcon size={18} weight="fill" />,
                  },
                ].map((ach, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 border-b-[3px] transition-all ${
                      ach.unlocked
                        ? "bg-zinc-900 border-yellow-500/30 border-b-yellow-500/50"
                        : "bg-zinc-900/50 border-zinc-800 border-b-zinc-800 opacity-60 grayscale"
                    }`}
                  >
                    <div
                      className={`shrink-0 w-10 h-10 rounded-lg border-2 border-b-[3px] flex items-center justify-center ${
                        ach.unlocked
                          ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                          : "bg-zinc-800 border-zinc-700 text-zinc-500"
                      }`}
                    >
                      {ach.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-[11px] text-white uppercase tracking-widest mb-0.5">
                        {ach.title}
                      </h3>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">
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
