import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft as ArrowLeftIcon,
  GearSix as GearSixIcon,
  SpeakerHigh as SpeakerHighIcon,
  Monitor as MonitorIcon,
  UserCircle as UserCircleIcon,
  LockKey as LockKeyIcon,
  Warning as WarningIcon,
  Camera as CameraIcon,
  FloppyDisk as FloppyDiskIcon,
} from "@phosphor-icons/react";

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");

  // Preferences State
  const [sfxVolume, setSfxVolume] = useState(80);
  const [musicVolume, setMusicVolume] = useState(60);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Profile State
  const [displayName, setDisplayName] = useState("Player One");
  const [email, setEmail] = useState("player@example.com");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tabs = [
    {
      id: "account",
      label: "Profile & Account",
      icon: <UserCircleIcon size={20} />,
    },
    {
      id: "preferences",
      label: "Game Preferences",
      icon: <GearSixIcon size={20} />,
    },
    { id: "danger", label: "Danger Zone", icon: <WarningIcon size={20} /> },
  ];

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

      <div className="relative z-10 max-w-5xl w-full mt-16 md:mt-16 mb-12 flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Settings Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bebas tracking-wide text-zinc-100 drop-shadow-md mb-2">
              Settings
            </h1>
            <p className="text-zinc-500 text-sm font-poppins">
              Manage your identity and game experience.
            </p>
          </div>

          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? tab.id === "danger"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-[#151518] text-lime-400 border border-lime-500/20 shadow-[4px_4px_0px_0px_rgba(163,230,53,0.1)]"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 border border-transparent"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-[#0f0f11] border border-zinc-800/80 rounded-3xl p-6 md:p-10 relative shadow-2xl min-h-[500px]">
          {/* --- TAB: ACCOUNT --- */}
          {activeTab === "account" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-white mb-8 border-b border-zinc-800 pb-4">
                Profile Information
              </h2>

              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Avatar Edit */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 bg-zinc-900 border-2 border-zinc-700 rounded-full flex items-center justify-center relative group cursor-pointer overflow-hidden">
                    <UserCircleIcon
                      size={48}
                      className="text-zinc-500 group-hover:opacity-0 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <CameraIcon size={24} className="text-white" />
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                    Change Avatar
                  </span>
                </div>

                {/* Basic Info Forms */}
                <div className="flex-1 space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-[#151518] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/50 transition-all font-poppins text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#151518] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/50 transition-all font-poppins text-sm"
                    />
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-4 flex items-center gap-2">
                <LockKeyIcon size={20} className="text-zinc-400" /> Security
              </h2>
              <div className="space-y-5 max-w-md mb-8">
                <div>
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full bg-[#151518] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500/50 transition-all font-poppins text-sm placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full bg-[#151518] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500/50 transition-all font-poppins text-sm placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-800/50">
                <button className="flex items-center gap-2 bg-lime-500 text-zinc-900 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-lime-400 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#4d7c0f] transition-all">
                  <FloppyDiskIcon size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* --- TAB: PREFERENCES --- */}
          {activeTab === "preferences" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
              <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 border-b border-zinc-800 pb-4">
                  <SpeakerHighIcon size={24} className="text-blue-400" /> Audio
                </h2>
                <div className="space-y-6 max-w-md">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        Master Volume SFX
                      </label>
                      <span className="text-blue-400 font-mono text-sm bg-blue-500/10 px-2 py-0.5 rounded">
                        {sfxVolume}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sfxVolume}
                      onChange={(e) => setSfxVolume(e.target.value)}
                      className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        Background Music
                      </label>
                      <span className="text-blue-400 font-mono text-sm bg-blue-500/10 px-2 py-0.5 rounded">
                        {musicVolume}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={musicVolume}
                      onChange={(e) => setMusicVolume(e.target.value)}
                      className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 border-b border-zinc-800 pb-4">
                  <MonitorIcon size={24} className="text-lime-400" /> Display
                </h2>
                <div
                  className="flex items-center justify-between p-4 bg-[#151518] border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition-colors cursor-pointer"
                  onClick={() => setAnimationsEnabled(!animationsEnabled)}
                >
                  <div>
                    <h3 className="text-white font-bold text-sm">
                      UI Animations
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Enable complex rendering and interactive glows.
                    </p>
                  </div>
                  <button
                    className={`w-12 h-6 rounded-full relative transition-colors ${animationsEnabled ? "bg-lime-500" : "bg-zinc-700"}`}
                  >
                    <div
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${animationsEnabled ? "translate-x-6" : ""}`}
                    ></div>
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* --- TAB: DANGER ZONE --- */}
          {activeTab === "danger" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-red-400 mb-6 border-b border-zinc-800 pb-4 flex items-center gap-2">
                <WarningIcon size={24} /> Danger Zone
              </h2>
              <p className="text-zinc-400 text-sm mb-8 max-w-lg">
                These actions are permanent and cannot be undone. Please be
                certain before proceeding with data deletion.
              </p>

              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">
                    Delete Account Data
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Removes all your match history, ELO ranking, and profile
                    settings.
                  </p>
                </div>
                <button className="shrink-0 bg-transparent border-2 border-red-500/50 text-red-500 font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs">
                  Delete Everything
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
