import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  GameController as GameControllerIcon,
  ArrowLeft as ArrowLeftIcon,
} from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(name, email, password);
      localStorage.removeItem("tiki_dashboard_tour_seen");
      toast.success("Account created successfully! Welcome to Tiki Topple.");
      navigate("/dashboard");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden font-chakra">
      {/* Premium Masked Grid + Noise Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none z-0"></div>
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-screen pointer-events-none z-0"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      ></div>

      {/* Tactile Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-4 md:top-8 md:left-8 flex items-center gap-2 bg-[#18181b] border-2 border-zinc-800 border-b-[3px] text-zinc-400 hover:text-white hover:bg-zinc-800 active:border-b-[1px] active:translate-y-[2px] transition-all px-4 py-2 rounded-xl uppercase font-black text-[10px] tracking-widest z-10"
      >
        <ArrowLeftIcon size={16} weight="bold" />
        Home
      </button>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center mt-6">
        {/* Logo Header */}
        <div
          className="text-center mb-8 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <h1 className="text-5xl text-white font-bebas tracking-wide flex items-center justify-center gap-3 transition-transform group-hover:scale-105 duration-200">
            <GameControllerIcon
              size={40}
              className="text-lime-500"
              weight="fill"
            />
            Tiki<span className="text-lime-500">Topple</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-2">
            Create Your Account
          </p>
        </div>

        {/* Chunky, Tactile Signup Card */}
        <div className="w-full bg-[#18181b] p-6 md:p-8 rounded-[24px] border-2 border-zinc-800 border-b-[6px] relative">
          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            {/* Input Group Name */}
            <div>
              <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 pl-2">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ProPlayer123"
                className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-lime-500 transition-colors text-sm placeholder:text-zinc-600"
                required
              />
            </div>

            {/* Input Group Email */}
            <div>
              <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 pl-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@netpractice.com"
                className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-lime-500 transition-colors text-sm placeholder:text-zinc-600"
                required
              />
            </div>

            {/* Input Group Pass */}
            <div>
              <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 pl-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-lime-500 transition-colors text-sm placeholder:text-zinc-600 tracking-widest"
                required
              />
            </div>

            {/* Tactile Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-lime-500 text-zinc-950 font-black uppercase tracking-widest px-6 py-4 rounded-2xl border-b-4 border-lime-700 hover:bg-lime-400 active:border-b-0 active:translate-y-1 transition-all text-sm disabled:opacity-50 disabled:active:border-b-4 disabled:active:translate-y-0"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-[2px] flex-1 bg-zinc-800 rounded-full"></div>
            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
              Already a player?
            </span>
            <div className="h-[2px] flex-1 bg-zinc-800 rounded-full"></div>
          </div>

          {/* Tactile Link Button */}
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-[#121214] border-2 border-zinc-800 text-zinc-400 font-black uppercase tracking-widest px-6 py-3.5 rounded-xl border-b-[4px] hover:text-white hover:bg-zinc-800 active:border-b-[2px] active:translate-y-[2px] transition-all text-xs"
          >
            Log In Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
