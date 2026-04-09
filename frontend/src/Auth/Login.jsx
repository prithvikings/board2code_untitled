import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  GameControllerIcon,
  GithubLogoIcon,
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
      if (error.response && error.response.data && error.response.data.message) {
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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 relative overflow-hidden font-chakra">
      {/* Premium Agency Trick: Radial masked grid background so it fades out smoothly */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)] pointer-events-none"></div>

      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase font-bold text-[10px] tracking-widest z-10 group"
      >
        <ArrowLeftIcon
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Home
      </button>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo Header - Matched to Navbar */}
        <div
          className="text-center mb-10 group cursor-pointer"
          onClick={() => navigate("/")}
        >
          <h1 className="text-4xl text-zinc-100 font-nunito font-bold tracking-tight inline-flex items-center gap-3 transition-transform group-hover:scale-105 duration-300">
            <GameControllerIcon size={32} className="text-lime-400" />
            Tiki<span className="text-lime-400">Topple</span>
          </h1>
          <p className="text-zinc-600 font-chakra mt-3 uppercase tracking-widest text-[10px] font-bold">
            Board2Code 2026 • Secure Gateway
          </p>
        </div>

        {/* Minimal, Premium Login Card */}
        <div className="w-full bg-[#0f0f11] p-8 md:p-10 rounded-2xl border border-zinc-800/80 shadow-2xl relative">
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {/* Input Group */}
            <div className="space-y-2">
              <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                Username or Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@netpractice.com"
                className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/30 transition-all font-mono text-sm"
                required
              />
            </div>

            {/* Input Group */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                  Password
                </label>
                <a
                  href="#"
                  className="text-[10px] text-zinc-500 hover:text-lime-400 font-bold uppercase tracking-widest transition-colors"
                >
                  Reset?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/30 transition-all font-mono text-sm tracking-widest"
                required
              />
            </div>

            {/* Neo-brutalist Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#18181b] text-white font-chakra font-bold uppercase tracking-widest px-5 py-3.5 rounded-xl border-2 border-[#a3e635] shadow-[0px_4px_0px_0px_#a3e635] hover:bg-[#27272a] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#a3e635] active:shadow-[0px_0px_0px_0px_#a3e635] active:translate-y-1 transition-all cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-[1px] flex-1 bg-zinc-800"></div>
            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
              Or Continue With
            </span>
            <div className="h-[1px] flex-1 bg-zinc-800"></div>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleSocialClick}
              className="flex items-center justify-center gap-3 bg-[#18181b] border border-zinc-800 rounded-xl py-3 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all group"
            >
              <GithubLogoIcon
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-xs font-bold uppercase tracking-wider">
                GitHub
              </span>
            </button>
            <button 
              onClick={handleSocialClick}
              className="flex items-center justify-center gap-3 bg-[#18181b] border border-zinc-800 rounded-xl py-3 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all group"
            >
              {/* Clean Google SVG inline */}
              <svg
                viewBox="0 0 24 24"
                className="w-[18px] h-[18px] group-hover:scale-110 transition-transform"
                fill="currentColor"
              >
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
              <span className="text-xs font-bold uppercase tracking-wider">
                Google
              </span>
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-zinc-500 text-xs font-chakra font-bold tracking-widest">
              Don't have an account?{" "}
              <Link to="/signup" className="text-lime-500 hover:text-lime-400 transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Guest Play */}
        <div className="mt-8">
          <button
            onClick={handleGuestPlay}
            className="group flex items-center justify-center gap-2 text-zinc-500 hover:text-white font-chakra text-[11px] font-bold uppercase tracking-widest transition-colors"
          >
            Play as Guest
            <span className="text-lime-500 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </div>
      </div>

      {/* Social Auth Construction Modal */}
      {showSocialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white mb-3">Under Construction 🚧</h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              We are still building it, you can access it by email and password.
            </p>
            <button 
              onClick={() => setShowSocialModal(false)}
              className="w-full bg-lime-500 text-zinc-900 font-bold uppercase tracking-widest px-4 py-3 rounded-xl hover:bg-lime-400 active:scale-95 transition-all text-xs"
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
