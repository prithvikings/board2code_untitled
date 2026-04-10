import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import {
  ArrowLeft as ArrowLeftIcon,
  UsersThree as UsersThreeIcon,
  Link as LinkIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
} from "@phosphor-icons/react";

const CustomLobby = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [targetScore, setTargetScore] = useState(50);
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = () => {
    if (!socket) return alert("Not connected to server");
    setLoading(true);
    socket.emit("createGame", { playerName: playerName || "Host", targetScore }, (res) => {
      setLoading(false);
      if (res.success) {
        navigate("/game");
      } else {
        alert(res.message);
      }
    });
  };

  const handleJoinRoom = () => {
    if (!socket || !roomCode) return alert("Please enter a room code");
    setLoading(true);
    socket.emit(
      "joinGame",
      { roomId: roomCode, playerName: playerName || "Player" },
      (res) => {
        setLoading(false);
        if (res.success) {
          navigate("/game");
        } else {
          alert(res.message);
        }
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra p-4 md:p-8 relative flex flex-col items-center justify-center">
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
          <UsersThreeIcon size={48} className="text-purple-500" weight="fill" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bebas tracking-wide mb-2 text-white">
          Custom Party
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-8">
          Create a private room or join an existing one.
        </p>

        <div className="bg-[#18181b] border-2 border-zinc-800 border-b-[6px] p-6 md:p-8 rounded-[24px] relative text-left">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 pl-1">
                Your Details
              </h3>
              <input
                type="text"
                placeholder="Player Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-all font-mono text-sm tracking-widest uppercase"
              />
            </div>

            <div className="h-[2px] w-full bg-zinc-800 rounded-full"></div>

            <div>
              <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 pl-1">
                Join a Room
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="E.G. TK-A1B2"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-zinc-900 border-2 border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-all font-mono text-sm tracking-widest uppercase"
                />
                <button
                  onClick={handleJoinRoom}
                  disabled={loading || !roomCode}
                  className="bg-purple-500 text-zinc-950 font-black uppercase tracking-widest px-6 rounded-xl border-b-4 border-purple-700 hover:bg-purple-400 active:border-b-0 active:translate-y-1 transition-all text-xs disabled:opacity-50 disabled:active:border-b-4 disabled:active:translate-y-0"
                >
                  Join
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 my-2">
              <div className="h-[2px] flex-1 bg-zinc-800 rounded-full"></div>
              <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                OR
              </span>
              <div className="h-[2px] flex-1 bg-zinc-800 rounded-full"></div>
            </div>

            {/* Target Score Selector */}
            <div className="flex items-center justify-between bg-zinc-900 border-2 border-zinc-800 border-b-[4px] rounded-2xl p-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Target Score (New Room)
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTargetScore((p) => Math.max(10, p - 10))}
                  disabled={targetScore <= 10}
                  className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 border-b-2 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 active:border-b-0 active:translate-y-[2px] disabled:opacity-30 disabled:active:border-b-2 disabled:active:translate-y-0 transition-all"
                >
                  <MinusIcon size={14} weight="bold" />
                </button>
                <span className="text-2xl font-mono font-bold text-purple-500 w-10 text-center">
                  {targetScore}
                </span>
                <button
                  onClick={() => setTargetScore((p) => Math.min(200, p + 10))}
                  disabled={targetScore >= 200}
                  className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 border-b-2 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 active:border-b-0 active:translate-y-[2px] disabled:opacity-30 disabled:active:border-b-2 disabled:active:translate-y-0 transition-all"
                >
                  <PlusIcon size={14} weight="bold" />
                </button>
              </div>
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full bg-purple-500 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl border-2 border-purple-700 border-b-[4px] hover:bg-purple-400 active:border-b-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              <LinkIcon size={20} weight="bold" /> Create New Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomLobby;
