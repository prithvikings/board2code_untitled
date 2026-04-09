import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  UsersThreeIcon,
  LinkIcon,
  CopyIcon,
} from "@phosphor-icons/react";

const CustomLobby = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [createdRoom, setCreatedRoom] = useState(false);

  const handleCreateRoom = () => {
    setRoomCode(
      "TK-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
    );
    setCreatedRoom(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra p-6 md:p-12 relative flex flex-col items-center justify-center">
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

      <div className="relative z-10 text-center max-w-lg w-full">
        <div className="mx-auto w-20 h-20 bg-purple-950/30 border border-purple-900/50 rounded-2xl flex items-center justify-center mb-8 relative">
          <UsersThreeIcon
            size={40}
            className="text-purple-400"
            weight="duotone"
          />
        </div>

        <h1 className="text-5xl font-bebas tracking-wide mb-2 text-zinc-100">
          Custom Party
        </h1>
        <p className="text-zinc-400 font-poppins mb-12 text-sm">
          Create a private room to invite friends, or join an existing one.
        </p>

        <div className="bg-[#0f0f11] border border-zinc-800/80 p-8 md:p-10 rounded-2xl relative text-left shadow-2xl">
          {!createdRoom ? (
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3">
                  Join a Room
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="E.G. TK-A1B2"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all font-mono text-sm tracking-widest uppercase"
                  />
                  <button className="bg-[#18181b] border-2 border-purple-500/50 text-purple-400 font-bold uppercase tracking-widest px-6 rounded-xl hover:border-purple-400 hover:bg-[#27272a] transition-all text-xs">
                    Join
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-zinc-800/50"></div>
                <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                  OR
                </span>
                <div className="h-[1px] flex-1 bg-zinc-800/50"></div>
              </div>

              <button
                onClick={handleCreateRoom}
                className="w-full bg-[#18181b] text-white font-bold uppercase tracking-widest py-3.5 rounded-xl border-2 border-[#c084fc] shadow-[0px_4px_0px_0px_#c084fc] hover:bg-[#27272a] hover:-translate-y-0.5 hover:shadow-[0px_6px_0px_0px_#c084fc] active:shadow-[0px_0px_0px_0px_#c084fc] active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <LinkIcon size={20} weight="bold" /> Create New Room
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 text-center">
              <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                Share this code with friends
              </h3>

              <div className="bg-[#18181b] border-2 border-zinc-800 hover:border-purple-500/50 px-8 py-5 rounded-xl flex items-center justify-between w-full group cursor-pointer transition-colors shadow-inner">
                <span className="text-3xl font-mono font-bold tracking-[0.2em] text-white mx-auto pl-6">
                  {roomCode}
                </span>
                <CopyIcon
                  size={20}
                  className="text-zinc-500 group-hover:text-purple-400 transition-colors"
                  weight="bold"
                />
              </div>

              <div className="w-full">
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-3">
                  Waiting for players... (1/2)
                </p>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/50">
                  <div className="h-full bg-purple-500 w-1/2 animate-pulse rounded-full"></div>
                </div>
              </div>

              <button
                className="w-full mt-4 bg-transparent border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 font-bold uppercase tracking-widest py-3 rounded-xl transition-all text-xs"
                onClick={() => setCreatedRoom(false)}
              >
                Leave Lobby
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomLobby;
