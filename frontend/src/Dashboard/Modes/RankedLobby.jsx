import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft as ArrowLeftIcon,
  GameController as GameControllerIcon,
  MagnifyingGlass as MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import { motion } from "motion/react";
import toast from "react-hot-toast";

const RankedLobby = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useAuth();
  const [searching, setSearching] = useState(false);
  const [timer, setTimer] = useState(0);

  const [matchData, setMatchData] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [opponentAccepted, setOpponentAccepted] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!socket) return;

    socket.on("matchFound", (data) => {
      setSearching(false);
      setMatchData(data);
      setCountdown(10);
      setAccepted(false);
      setOpponentAccepted(false);
    });

    socket.on("matchAccepted", ({ roomId }) => {
      setMatchData(null);
      navigate("/game");
    });

    socket.on("matchCancelled", ({ reason }) => {
      toast.error(reason || "Match cancelled.");
      setMatchData(null);
      setAccepted(false);
      setOpponentAccepted(false);
    });

    socket.on("opponentAccepted", () => {
      setOpponentAccepted(true);
    });

    return () => {
      socket.off("matchFound");
      socket.off("matchAccepted");
      socket.off("matchCancelled");
      socket.off("opponentAccepted");
    };
  }, [socket, navigate]);

  useEffect(() => {
    let interval;
    if (searching) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [searching]);

  useEffect(() => {
    let interval;
    if (matchData && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (matchData && countdown === 0 && !accepted) {
      handleDecline();
    }
    return () => clearInterval(interval);
  }, [matchData, countdown, accepted]);

  const handleStartSearch = () => {
    if (!socket || !user) return;
    setSearching(true);
    socket.emit("findMatch", {
      playerName: user.name,
      elo: user.stats?.elo || 1200,
    });
  };

  const handleCancelSearch = () => {
    if (!socket) return;
    setSearching(false);
    socket.emit("cancelMatchmaking");
  };

  const handleAccept = () => {
    if (!socket || !matchData) return;
    setAccepted(true);
    socket.emit("acceptMatch", { matchId: matchData.matchId });
  };

  const handleDecline = () => {
    if (!socket || !matchData) return;
    socket.emit("declineMatch", { matchId: matchData.matchId });
    setMatchData(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra p-4 md:p-8 relative flex flex-col items-center justify-center">
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
        Dashboard
      </button>

      <div className="relative z-10 text-center max-w-md w-full">
        <div className="mx-auto w-24 h-24 bg-zinc-900 border-4 border-zinc-800 border-b-[6px] rounded-[24px] flex items-center justify-center mb-6 relative">
          <GameControllerIcon
            size={48}
            className="text-lime-500"
            weight="fill"
          />
          {/* Mechanical Spinner indicator */}
          {(searching || matchData) && (
            <div className="absolute -inset-2 border-4 border-dashed border-lime-500/50 rounded-[32px] animate-spin-slow"></div>
          )}
        </div>

        <h1 className="text-5xl md:text-6xl font-bebas tracking-wide mb-2 text-white">
          {matchData ? "Match Found!" : "Ranked PvP"}
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-8">
          {matchData
            ? `Versus ${matchData.opponentName}`
            : "Search globally and climb the leaderboard."}
        </p>

        <div className="bg-[#18181b] border-2 border-zinc-800 border-b-[6px] p-6 md:p-8 rounded-[24px] relative overflow-hidden">
          {/* Tactical shrinking timer bar */}
          {matchData && (
            <div className="absolute top-0 left-0 w-full h-2 bg-zinc-900">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 10, ease: "linear" }}
                className="h-full bg-lime-500"
              />
            </div>
          )}

          {!searching && !matchData ? (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center bg-zinc-900 p-5 rounded-2xl border-2 border-zinc-800 border-b-[4px]">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Current ELO
                </span>
                <span className="text-lime-500 font-mono font-bold text-xl">
                  {user?.stats?.elo || 1200}
                </span>
              </div>
              <button
                onClick={handleStartSearch}
                className="w-full bg-lime-500 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl border-2 border-lime-700 border-b-[4px] hover:bg-lime-400 active:border-b-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 text-xs"
              >
                <MagnifyingGlassIcon size={20} weight="bold" /> Find Match
              </button>
            </div>
          ) : searching ? (
            <div className="flex flex-col gap-6 items-center">
              <div className="flex gap-2 mb-2">
                <span
                  className="w-3 h-3 bg-lime-500 rounded-sm animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-3 h-3 bg-lime-500 rounded-sm animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-3 h-3 bg-lime-500 rounded-sm animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
              <div className="text-center">
                <p className="text-white font-black tracking-widest uppercase text-xs mb-2">
                  Searching Network...
                </p>
                <p className="text-zinc-400 font-mono text-xs bg-zinc-900 px-3 py-1.5 rounded-lg border-2 border-zinc-800 inline-block font-bold">
                  Elapsed: 00:{timer.toString().padStart(2, "0")}
                </p>
              </div>

              <button
                onClick={handleCancelSearch}
                className="w-full mt-2 bg-red-500 text-zinc-950 font-black uppercase tracking-widest py-3 rounded-xl border-2 border-red-700 border-b-[4px] hover:bg-red-400 active:border-b-[2px] active:translate-y-[2px] transition-all text-xs"
              >
                Cancel Search
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6 items-center">
              <div className="text-center mb-2">
                <div className="text-7xl font-mono font-black text-lime-500 mb-1">
                  {countdown}
                </div>
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                  Seconds Remaining
                </p>
              </div>

              <div className="w-full flex flex-col gap-3">
                {!accepted ? (
                  <>
                    <button
                      onClick={handleAccept}
                      className="w-full bg-lime-500 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl border-2 border-lime-700 border-b-[4px] hover:bg-lime-400 active:border-b-[2px] active:translate-y-[2px] transition-all text-xs"
                    >
                      Accept Match
                    </button>
                    <button
                      onClick={handleDecline}
                      className="w-full bg-zinc-900 text-zinc-400 font-black uppercase tracking-widest py-4 rounded-xl border-2 border-zinc-800 border-b-[4px] hover:text-white hover:bg-zinc-800 active:border-b-[2px] active:translate-y-[2px] transition-all text-xs"
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <div className="bg-zinc-900 border-2 border-zinc-800 border-b-[4px] p-6 rounded-2xl w-full text-center">
                    <p className="text-lime-500 font-black uppercase tracking-widest animate-pulse mb-2 text-sm">
                      Match Accepted!
                    </p>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                      {opponentAccepted
                        ? "Match starting..."
                        : `Waiting for ${matchData.opponentName}...`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RankedLobby;
