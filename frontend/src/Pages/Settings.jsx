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
import { useAuth } from "../context/AuthContext";
import { useAudio } from "../context/AudioContext";
import toast from "react-hot-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateProfile, updatePassword } = useAuth();
  const { musicVolume, setMusicVolume } = useAudio();
  const [activeTab, setActiveTab] = useState("account");

  // Preferences State
  const [sfxVolume, setSfxVolume] = useState(80);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Profile State
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarSeed, setAvatarSeed] = useState(
    user?.avatarSeed || user?._id || "default",
  );

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      setDisplayName(user.name);
      setEmail(user.email);
      setAvatarSeed(user.avatarSeed || user._id || "default");
    }
  }, [user]);

  const generateNewAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    setAvatarSeed(randomSeed);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    let successCount = 0;

    // Check Profile Changes
    if (
      displayName !== user?.name ||
      email !== user?.email ||
      avatarSeed !== (user?.avatarSeed || user?._id || "default")
    ) {
      try {
        await updateProfile(displayName, email, avatarSeed);
        toast.success("Profile updated successfully");
        successCount++;
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to update profile",
        );
      }
    }

    // Check Password Changes
    if (currentPassword || newPassword) {
      try {
        await updatePassword(currentPassword, newPassword);
        toast.success("Password updated securely");
        setCurrentPassword("");
        setNewPassword("");
        successCount++;
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Password update failed. Verify current password.",
        );
      }
    }

    if (
      successCount === 0 &&
      displayName === user?.name &&
      email === user?.email &&
      avatarSeed === (user?.avatarSeed || user?._id || "default") &&
      !currentPassword &&
      !newPassword
    ) {
      toast("No changes to save.", { icon: "ℹ️" });
    }

    setIsSaving(false);
  };

  const tabs = [
    {
      id: "account",
      label: "Profile & Account",
      icon: <UserCircleIcon size={20} weight="bold" />,
    },
    {
      id: "preferences",
      label: "Game Preferences",
      icon: <GearSixIcon size={20} weight="bold" />,
    },
    {
      id: "danger",
      label: "Danger Zone",
      icon: <WarningIcon size={20} weight="bold" />,
    },
  ];

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

      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 left-4 md:top-8 md:left-8 flex items-center gap-2 bg-[#18181b] border-2 border-zinc-800 border-b-[3px] text-zinc-400 hover:text-white hover:bg-zinc-800 active:border-b-[1px] active:translate-y-[2px] transition-all px-4 py-2 rounded-xl uppercase font-black text-[10px] tracking-widest z-10"
      >
        <ArrowLeftIcon size={16} weight="bold" />
        Back
      </button>

      <div className="relative z-10 max-w-5xl w-full mt-16 md:mt-12 mb-12 flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Settings Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bebas tracking-wide text-white mb-1">
              Settings
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
              Manage your identity
            </p>
          </div>

          <div className="flex flex-row md:flex-col gap-3 overflow-x-auto pb-4 md:pb-0 hide-scrollbar pr-4 md:pr-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-4 rounded-[20px] font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap border-2 ${
                  activeTab === tab.id
                    ? tab.id === "danger"
                      ? "bg-red-500/10 text-red-500 border-red-500 border-b-[3px]"
                      : "bg-[#18181b] text-lime-400 border-lime-500 border-b-[3px]"
                    : "bg-[#121214] text-zinc-500 border-zinc-800 border-b-[3px] hover:bg-zinc-800 hover:text-zinc-300 active:border-b-[1px] active:translate-y-[2px]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tactile Settings Content Area */}
        <div className="flex-1 bg-[#18181b] border-2 border-zinc-800 border-b-[6px] rounded-[24px] p-6 md:p-8 relative min-h-[400px]">
          {/* --- TAB: ACCOUNT --- */}
          {activeTab === "account" && (
            <div className="animate-in fade-in duration-200">
              <h2 className="text-xl font-black text-white mb-6 border-b-2 border-zinc-800 pb-3 uppercase tracking-wide">
                Profile Information
              </h2>

              <div className="flex flex-col xl:flex-row gap-8 mb-10">
                {/* Avatar Edit (Chunky) */}
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <div
                    onClick={generateNewAvatar}
                    className="w-24 h-24 md:w-28 md:h-28 bg-zinc-900 border-4 border-zinc-700 border-b-[6px] rounded-2xl flex items-center justify-center relative group cursor-pointer overflow-hidden p-1.5 active:border-b-[3px] active:translate-y-[3px] transition-all"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatarSeed}`}
                      alt="Pixel Avatar"
                      className="w-full h-full rounded-xl object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <CameraIcon
                        size={24}
                        weight="fill"
                        className="text-white"
                      />
                    </div>
                  </div>
                  <button
                    className="bg-zinc-900 text-zinc-400 border-2 border-zinc-700 border-b-[3px] px-3 py-1.5 rounded-lg text-[9px] uppercase font-black tracking-widest hover:text-white hover:bg-zinc-800 active:border-b-[1px] active:translate-y-[2px] transition-all"
                    onClick={generateNewAvatar}
                  >
                    Roll New DiceBear
                  </button>
                </div>

                {/* Basic Info Forms */}
                <div className="flex-1 space-y-5">
                  <div>
                    <label className="block text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 pl-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-lime-500 transition-colors text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 pl-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-lime-500 transition-colors text-xs"
                    />
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-black text-white mb-6 border-b-2 border-zinc-800 pb-3 flex items-center gap-2 uppercase tracking-wide">
                <LockKeyIcon
                  size={24}
                  weight="fill"
                  className="text-zinc-500"
                />{" "}
                Security
              </h2>
              <div className="space-y-5 max-w-xl mb-10">
                <div>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current Password"
                    className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-lime-500 transition-colors text-xs placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-lime-500 transition-colors text-xs placeholder:text-zinc-600"
                  />
                </div>
              </div>

              {/* Big Tactile Save Button */}
              <div className="flex justify-end pt-6 border-t-2 border-zinc-800/80 mt-auto">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-lime-500 text-zinc-950 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs border-b-[3px] border-lime-700 hover:bg-lime-400 active:border-b-0 active:translate-y-[3px] transition-all disabled:opacity-50 disabled:active:border-b-[3px] disabled:active:translate-y-0"
                >
                  <FloppyDiskIcon size={20} weight="bold" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* --- TAB: PREFERENCES --- */}
          {activeTab === "preferences" && (
            <div className="animate-in fade-in duration-200 space-y-10">
              <section>
                <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2 border-b-2 border-zinc-800 pb-3 uppercase tracking-wide">
                  <SpeakerHighIcon
                    size={24}
                    weight="fill"
                    className="text-blue-400"
                  />{" "}
                  Audio
                </h2>
                <div className="space-y-6 max-w-xl">
                  <div className="bg-zinc-900 border-2 border-zinc-800 p-5 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Master Volume SFX
                      </label>
                      <span className="text-blue-400 font-mono font-bold text-xs bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md">
                        {sfxVolume}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sfxVolume}
                      onChange={(e) => setSfxVolume(e.target.value)}
                      className="w-full h-3 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div className="bg-zinc-900 border-2 border-zinc-800 p-5 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Background Music
                      </label>
                      <span className="text-blue-400 font-mono font-bold text-xs bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md">
                        {musicVolume}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={musicVolume}
                      onChange={(e) => setMusicVolume(e.target.value)}
                      className="w-full h-3 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2 border-b-2 border-zinc-800 pb-3 uppercase tracking-wide">
                  <MonitorIcon
                    size={24}
                    weight="fill"
                    className="text-lime-400"
                  />{" "}
                  Display
                </h2>

                {/* Tactile Toggle Block */}
                <div
                  className="flex items-center justify-between p-5 bg-zinc-900 border-2 border-zinc-800 border-b-[3px] rounded-2xl hover:bg-zinc-800 active:border-b-[1px] active:translate-y-[2px] transition-all cursor-pointer max-w-xl"
                  onClick={() => setAnimationsEnabled(!animationsEnabled)}
                >
                  <div>
                    <h3 className="text-white text-sm font-black uppercase tracking-wide mb-1">
                      UI Animations
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-medium">
                      Enable rich motion rendering.
                    </p>
                  </div>
                  {/* Physical Toggle Switch (Scaled Down) */}
                  <button
                    className={`w-12 h-6 rounded-full relative transition-colors border-2 ${
                      animationsEnabled
                        ? "bg-lime-500 border-lime-600"
                        : "bg-zinc-700 border-zinc-800"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${
                        animationsEnabled ? "translate-x-5" : ""
                      }`}
                    ></div>
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* --- TAB: DANGER ZONE --- */}
          {activeTab === "danger" && (
            <div className="animate-in fade-in duration-200">
              <h2 className="text-xl font-black text-red-500 mb-5 border-b-2 border-zinc-800 pb-3 flex items-center gap-2 uppercase tracking-wide">
                <WarningIcon size={24} weight="fill" /> Danger Zone
              </h2>
              <p className="text-zinc-400 text-xs font-medium mb-8 max-w-lg leading-relaxed">
                These actions are permanent and cannot be undone. Please be
                absolutely certain before proceeding with data deletion.
              </p>

              <div className="bg-zinc-900 border-2 border-red-900/50 border-b-[3px] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-2xl">
                <div>
                  <h3 className="text-white text-sm font-black uppercase tracking-wide mb-1.5">
                    Delete Account Data
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-medium">
                    Removes all your match history, ELO ranking, and profile.
                  </p>
                </div>
                <button className="shrink-0 w-full md:w-auto bg-red-500 text-white font-black uppercase tracking-widest px-6 py-3 rounded-xl border-b-[3px] border-red-700 hover:bg-red-400 active:border-b-0 active:translate-y-[3px] transition-all text-[10px]">
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
