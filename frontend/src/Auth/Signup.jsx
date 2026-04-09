import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  GameControllerIcon,
  GithubLogoIcon,
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
      toast.success("Account created successfully! Welcome to Tiki Topple.");
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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

      <div className="relative z-10 w-full max-w-md flex flex-col items-center mt-6">
        {/* Logo Header - Matched to Navbar */}
        <div
          className="text-center mb-8 group cursor-pointer"
          onClick={() => navigate("/")}
        >
          <h1 className="text-4xl text-zinc-100 font-nunito font-bold tracking-tight inline-flex items-center gap-3 transition-transform group-hover:scale-105 duration-300">
            <GameControllerIcon size={32} className="text-lime-400" />
            Tiki<span className="text-lime-400">Topple</span>
          </h1>
          <p className="text-zinc-600 font-chakra mt-3 uppercase tracking-widest text-[10px] font-bold">
            Create your account
          </p>
        </div>

        {/* Minimal, Premium Login Card */}
        <div className="w-full bg-[#0f0f11] p-8 md:p-10 rounded-2xl border border-zinc-800/80 shadow-2xl relative">
          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            {/* Input Group Name */}
            <div className="space-y-2">
              <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ProPlayer123"
                className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/30 transition-all font-mono text-sm"
                required
              />
            </div>

            {/* Input Group Email */}
            <div className="space-y-2">
              <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@netpractice.com"
                className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/30 transition-all font-mono text-sm"
                required
              />
            </div>

            {/* Input Group Pass */}
            <div className="space-y-2">
              <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/30 transition-all font-mono text-sm tracking-widest"
                required
              />
            </div>

            {/* Neo-brutalist Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#18181b] text-white font-chakra font-bold uppercase tracking-widest px-5 py-3.5 rounded-xl border-2 border-[#a3e635] shadow-[0px_4px_0px_0px_#a3e635] hover:bg-[#27272a] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#a3e635] active:shadow-[0px_0px_0px_0px_#a3e635] active:translate-y-1 transition-all cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-[1px] flex-1 bg-zinc-800"></div>
            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
              Already have an account?
            </span>
            <div className="h-[1px] flex-1 bg-zinc-800"></div>
          </div>

          <Link to="/login" className="block text-center w-full text-zinc-400 hover:text-white font-chakra text-xs font-bold tracking-wider transition-colors border border-zinc-800 py-3 rounded-xl hover:border-zinc-700">
             Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
