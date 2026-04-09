import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  TrophyIcon,
  ShieldCheckIcon,
  PlayIcon,
  CheckCircleIcon,
  CopyIcon,
  ClockIcon,
} from "@phosphor-icons/react";
import toast from "react-hot-toast";
import Token from "./Token";
import Card from "./Card";
import { useSocket } from "../context/SocketContext";

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const initialPlayerName = location.state?.player1 || "Player 1";
  const [playerName, setPlayerName] = useState(initialPlayerName);

  // Game State
  const [gameState, setGameState] = useState(null);

  // Local UI State
  const [selectedCards, setSelectedCards] = useState([]); // [{ card, target1, target2 }]
  const [pendingSelection, setPendingSelection] = useState(null); // { card, needs: 1 | 2, targets: [] }
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [opponentLeftData, setOpponentLeftData] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("gameStateUpdated", (state) => {
      setGameState(state);
      // Reset local selection when round progresses
      if (state.roundPhase !== "selection") {
        setSelectedCards([]);
        setPendingSelection(null);
      }
    });

    // Check if we already have a game state on the server for this socket
    socket.emit("getGameState", (state) => {
      if (state) {
        setGameState(state);
      }
    });

    socket.on("opponentLeft", (data) => {
      setOpponentLeftData(data);
    });

    return () => {
      socket.off("gameStateUpdated");
      socket.off("opponentLeft");
    };
  }, [socket, navigate, gameState]);

  const me = gameState?.players?.find((p) => p.socketId === socket.id);
  const myIndex = gameState?.players?.findIndex((p) => p.socketId === socket.id);
  const isMyTurn = gameState?.currentTurnIndex === myIndex;
  const isHost = gameState?.players?.[0]?.socketId === socket.id;
  const activePlayerName = gameState?.players?.[gameState.currentTurnIndex]?.name;

  const handleCardClick = (card) => {
    if (gameState?.status !== "playing") return;
    if (!isMyTurn) {
      toast.error("Wait for your turn!");
      return;
    }

    if (card.type === "move") {
      setPendingSelection({ card, needs: 1, targets: [] });
    } else if (card.type === "swap") {
      setPendingSelection({ card, needs: 2, targets: [] });
    } else {
      // No targets needed (topple or toast)
      socket.emit(
        "playCard",
        {
          roomId: gameState.roomId,
          card: { ...card, target1: null, target2: null },
        },
        (r) => {
          if (!r.success) toast.error(r.message);
        },
      );
    }
  };

  const handleTikiClick = (color) => {
    if (!pendingSelection || !isMyTurn) return;

    const newTargets = [...pendingSelection.targets, color];

    if (newTargets.length === pendingSelection.needs) {
      // Completed requirement - play immediately
      const payload = {
        ...pendingSelection.card,
        target1: newTargets[0],
        target2: newTargets[1] || null,
      };

      socket.emit(
        "playCard",
        { roomId: gameState.roomId, card: payload },
        (r) => {
          if (!r.success) toast.error(r.message);
        },
      );
      setPendingSelection(null);
    } else {
      setPendingSelection({ ...pendingSelection, targets: newTargets });
    }
  };

  const handleLeaveRoom = () => {
    socket.emit("leaveGame", { roomId: gameState.roomId });
    navigate("/dashboard");
  };

  const handleCopyRoomId = () => {
    if (!gameState?.roomId) return;
    navigator.clipboard.writeText(gameState.roomId);
    toast.success("Room Code Copied!");
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center font-chakra">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lime-500 font-bold uppercase tracking-widest text-sm animate-pulse">
            Syncing Connection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra relative flex flex-col pt-24 pb-12 overflow-x-hidden">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>

      {/* Header Info */}
      <div className="absolute top-8 left-8 z-10 flex gap-4 items-center">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors uppercase font-bold text-[10px] tracking-widest group"
        >
          <ArrowLeftIcon
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Leave Room
        </button>
        <div
          onClick={handleCopyRoomId}
          className="px-3 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs font-mono flex items-center gap-2 cursor-pointer hover:border-zinc-500 transition-colors"
          title="Click to Copy"
        >
          Room: {gameState.roomId}
          <CopyIcon size={14} className="text-zinc-500" />
        </div>
      </div>

      <div className="flex-1 relative z-10 max-w-7xl w-full mx-auto px-4 flex flex-col gap-8">
        {/* Waiting State */}
        {gameState.status === "waiting" && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bebas tracking-widest text-lime-400 mb-8 blur-[0.5px]">
              Waiting for Players...
            </h1>

            <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-md p-6">
              <div className="mb-6 flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-zinc-500 mb-2">
                  Share Room Code
                </span>
                <div
                  onClick={handleCopyRoomId}
                  className="bg-[#0a0a0a] border-2 border-dashed border-zinc-800 p-4 rounded-xl flex items-center justify-between w-full cursor-pointer hover:border-lime-500 group transition-all"
                >
                  <span className="text-3xl font-mono font-bold tracking-[0.2em] text-white pl-4 uppercase">
                    {gameState.roomId}
                  </span>
                  <CopyIcon
                    size={24}
                    className="text-zinc-500 group-hover:text-lime-400"
                    weight="bold"
                  />
                </div>
              </div>

              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4 font-bold border-b border-zinc-800 pb-2">
                Players Joined
              </p>
              <ul className="flex flex-col gap-2 mb-8">
                {gameState.players.map((p, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center bg-[#0a0a0a] rounded px-4 py-2 border border-zinc-800/50"
                  >
                    <span className="font-bold">
                      {p.name} {p.socketId === socket.id ? "(You)" : ""}
                    </span>
                    {i === 0 && (
                      <span className="text-[10px] text-yellow-500 font-bold uppercase">
                        Host
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {isHost && gameState.status === "waiting" && (
                <button
                  onClick={() =>
                    socket.emit("startGame", { roomId: gameState.roomId })
                  }
                  disabled={gameState.players.length < 2}
                  className="w-full flex items-center justify-center gap-2 bg-lime-500 text-zinc-950 disabled:opacity-50 font-bold uppercase py-3 rounded-lg hover:bg-lime-400 transition-colors"
                >
                  <PlayIcon weight="bold" /> Start Game
                </button>
              )}
            </div>
          </div>
        )}

        {/* Playing/Finished State */}
        {(gameState.status === "playing" ||
          gameState.status === "finished") && (
          <div className="flex-1 flex flex-col items-center">
            {/* Status Bar */}
            <div className="w-full flex justify-between items-center bg-[#0f0f11] border border-zinc-800 p-4 rounded-xl shadow-lg mb-8 relative overflow-hidden">
              {/* Turn Indicator Glow */}
              {gameState.status === "playing" && isMyTurn && (
                <div className="absolute inset-0 bg-lime-500/5 pointer-events-none animate-pulse"></div>
              )}

              <div className="flex items-center gap-6 z-10">
                <div
                  className={`px-4 py-1.5 rounded-full border text-white font-bold tracking-widest text-xs uppercase shadow-inner transition-all ${isMyTurn ? "bg-lime-600/20 border-lime-500" : "bg-zinc-900 border-zinc-700"}`}
                >
                  {gameState.status === "finished"
                    ? "GAME OVER"
                    : isMyTurn
                      ? "Your Turn"
                      : `${activePlayerName}'s Turn`}
                </div>

                {/* Timer Display */}
                {gameState.status === "playing" && (
                  <div
                    className={`flex items-center gap-2 font-mono text-lg font-bold ${gameState.timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-lime-400"}`}
                  >
                    <ClockIcon size={20} weight="fill" />
                    {gameState.timeLeft}s
                  </div>
                )}

                {pendingSelection && (
                  <div className="text-yellow-400 text-xs font-bold bg-yellow-400/10 px-3 py-1 rounded">
                    Select Target {pendingSelection.targets.length + 1} of{" "}
                    {pendingSelection.needs} for {pendingSelection.card.type}
                  </div>
                )}
              </div>

              {me && (
                <div className="flex gap-4 items-center z-10">
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                      Your Score
                    </p>
                    <p className="text-xl font-mono text-lime-400 leading-none">
                      {me.score}
                    </p>
                  </div>
                  <div className="bg-[#151518] border border-zinc-700 rounded-lg p-2 group relative cursor-help flex items-center gap-2">
                    <ShieldCheckIcon size={20} className="text-zinc-400" />
                    <div className="flex gap-1">
                      {me.secretColors.map((c) => (
                        <div
                          key={c}
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: c }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tiki Line (shared board) */}
            <div className={`w-full bg-[#18181b] border-2 rounded-3xl p-8 mb-8 relative flex shadow-2xl justify-center items-center overflow-x-auto min-h-[160px] transition-all duration-500 ${pendingSelection ? 'border-lime-500 shadow-[0_0_30px_rgba(132,204,22,0.2)]' : 'border-zinc-800 shadow-xl'}`}>
              <span
                className="absolute left-4 font-mono font-bold text-zinc-600 tracking-[0.3em] uppercase rotate-180"
                style={{ writingMode: "vertical-rl" }}
              >
                BOTTOM
              </span>

              {pendingSelection && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-lime-500 text-zinc-950 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-bounce z-50">
                   <div className="w-2 h-2 rounded-full bg-zinc-950 animate-pulse"></div>
                   Select Target
                </div>
              )}

              <div className="flex gap-2 px-8">
                {/* We reverse to show index 0 (Top) on the right visually */}
                {[...gameState.tikiLine].reverse().map((color, idx) => {
                  return (
                    <Token
                      key={color}
                      color={color}
                      onClick={() => handleTikiClick(color)}
                      isSelected={pendingSelection?.targets?.includes(color)}
                    />
                  );
                })}
              </div>

              <span
                className="absolute right-4 font-mono font-bold text-yellow-500/50 tracking-[0.3em] uppercase rotate-180"
                style={{ writingMode: "vertical-rl" }}
              >
                TOP
              </span>
            </div>

            {/* Player Hand Area */}
            <div
              className={`w-full flex flex-col bg-[#0f0f11] border border-zinc-800 p-6 rounded-2xl transition-opacity ${!isMyTurn && gameState.status === "playing" ? "opacity-50" : "opacity-100"}`}
            >
              <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                  Your Hand
                </h3>
              </div>

              <div className="flex flex-wrap gap-4 overflow-y-auto pb-4">
                {me &&
                  me.hand.map((card) => {
                    return (
                      <Card
                        key={card.id}
                        card={card}
                        onClick={() => handleCardClick(card)}
                      />
                    );
                  })}
                {me?.hand.length === 0 && (
                  <p className="text-zinc-600 text-xs italic uppercase tracking-widest">
                    No cards left
                  </p>
                )}
              </div>
            </div>

            {/* Logs Area */}
            <div className="w-full mt-4 h-32 overflow-y-auto border border-zinc-800 rounded bg-black/50 p-2 font-mono text-[10px] text-zinc-400 flex flex-col-reverse">
              {[...gameState.logs].reverse().map((log, i) => (
                <div
                  key={i}
                  className={`py-0.5 ${log.includes("Turn") ? "text-lime-400 font-bold" : "opacity-80"}`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white mb-3 text-center uppercase tracking-widest font-bebas">
              Leaving Game?
            </h2>
            <p className="text-zinc-400 text-sm mb-8 text-center leading-relaxed">
              Are you sure you want to quit? This will end the match for you and
              notify your opponent.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLeaveRoom}
                className="w-full bg-red-500 text-white font-bold uppercase tracking-widest px-4 py-3 rounded-xl hover:bg-red-400 active:scale-95 transition-all text-xs"
              >
                Yes, Leave match
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full bg-transparent border border-zinc-700 text-zinc-400 font-bold uppercase tracking-widest px-4 py-3 rounded-xl hover:bg-zinc-800 hover:text-white active:scale-95 transition-all text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Opponent Left Modal */}
      {opponentLeftData && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[#121214] border-2 border-yellow-500/50 rounded-2xl p-8 max-w-sm w-full shadow-[0_0_50px_-12px_rgba(234,179,8,0.3)] animate-in fade-in zoom-in-95 duration-300 text-center">
            <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowLeftIcon size={32} className="text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest font-bebas">
              Match Terminated
            </h2>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              <span className="text-yellow-500 font-bold">
                {opponentLeftData.name}
              </span>{" "}
              has disconnected or left the match.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-zinc-100 text-zinc-950 font-bold uppercase tracking-widest px-4 py-3 rounded-xl hover:bg-white active:scale-95 transition-all text-xs"
            >
              Exit to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
