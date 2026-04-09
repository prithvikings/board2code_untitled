import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  GameController as GameControllerIcon,
  GithubLogo as GithubLogoIcon,
  ArrowLeft as ArrowLeftIcon,
} from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, loginAsGuest } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);

  const handleSocialClick = (e) => {
    e.preventDefault();
    setShowSocialModal(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to login. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestPlay = () => {
    loginAsGuest();
    toast.success("Joined as Guest");
    navigate("/dashboard");
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

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
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
            Secure Gateway
          </p>
        </div>

        {/* Chunky, Tactile Login Card */}
        <div className="w-full bg-[#18181b] p-6 md:p-8 rounded-[24px] border-2 border-zinc-800 border-b-[6px] relative">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Input Group */}
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

            {/* Input Group */}
            <div>
              <div className="flex items-center justify-between mb-2 pl-2 pr-1">
                <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                  Password
                </label>
                <a
                  href="#"
                  className="text-[10px] text-zinc-400 hover:text-lime-400 font-bold uppercase tracking-widest transition-colors"
                >
                  Reset?
                </a>
              </div>
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
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-[2px] flex-1 bg-zinc-800 rounded-full"></div>
            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
              Or Continue With
            </span>
            <div className="h-[2px] flex-1 bg-zinc-800 rounded-full"></div>
          </div>

          {/* Social Auth (Chunky Buttons) */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleSocialClick}
              className="flex items-center justify-center gap-2 bg-zinc-900 border-2 border-zinc-800 border-b-4 rounded-2xl py-3 text-zinc-400 hover:text-white hover:bg-zinc-800 active:border-b-[2px] active:translate-y-[2px] transition-all"
            >
              <GithubLogoIcon size={20} weight="fill" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                GitHub
              </span>
            </button>
            <button
              onClick={handleSocialClick}
              className="flex items-center justify-center gap-2 bg-zinc-900 border-2 border-zinc-800 border-b-4 rounded-2xl py-3 text-zinc-400 hover:text-white hover:bg-zinc-800 active:border-b-[2px] active:translate-y-[2px] transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest">
                Google
              </span>
            </button>
          </div>

          <div className="mt-8 text-center flex flex-col gap-3">
            <Link
              to="/signup"
              className="text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-lime-500 transition-colors"
            >
              Don't have an account? Sign Up
            </Link>
            <button
              onClick={handleGuestPlay}
              className="w-full bg-[#121214] border-2 border-zinc-800 text-zinc-400 font-black uppercase tracking-widest px-6 py-3 rounded-xl border-b-[3px] hover:text-white hover:bg-zinc-800 active:border-b-[1px] active:translate-y-[2px] transition-all text-xs"
            >
              Play as Guest
            </button>
          </div>
        </div>
      </div>

      {/* Social Auth Construction Modal (Tactile) */}
      {showSocialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#18181b] border-2 border-zinc-800 border-b-[6px] rounded-[24px] p-8 max-w-sm w-full relative animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-yellow-500/20 border-b-4">
              <span className="text-2xl">🚧</span>
            </div>
            <h2 className="text-2xl font-bebas tracking-wider text-white mb-2">
              Under Construction
            </h2>
            <p className="text-zinc-400 text-sm font-medium mb-6 leading-relaxed">
              We are still building it. You can access the app using an email
              and password for now.
            </p>
            <button
              onClick={() => setShowSocialModal(false)}
              className="w-full bg-yellow-500 text-zinc-950 font-black uppercase tracking-widest px-4 py-3.5 rounded-xl border-b-4 border-yellow-700 hover:bg-yellow-400 active:border-b-0 active:translate-y-1 transition-all text-xs"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
