import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  ArrowLeftIcon,
  TrophyIcon,
  PlayIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  HouseIcon,
  ArrowClockwiseIcon,
  ArrowDownIcon,
  MedalIcon,
  CopyIcon
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import Token from "./Token";
import Card from "./Card";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";

const STEP_DELAY_MS = 1500;

const Game = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();

  // Game State
  const [gameState, setGameState] = useState(null);
  
  // Resolution Animation State
  const [resolveSteps, setResolveSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [activeTargets, setActiveTargets] = useState([]);
  const [activeActionLabel, setActiveActionLabel] = useState(null);
  const [roundScoreData, setRoundScoreData] = useState(null);
  const [displayedLine, setDisplayedLine] = useState([]);

  // Local UI State
  const [selectedCards, setSelectedCards] = useState([]);
  const [pendingCard, setPendingCard] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [opponentLeftData, setOpponentLeftData] = useState(null);

  // Sync state correctly and handle animations
  useEffect(() => {
    if (!socket) return;

    socket.on("gameStateUpdated", (state) => {
      // Don't overwrite displayedLine if we are currently animating
      if (state.roundPhase !== "resolving") {
        setDisplayedLine(state.tikiLine || []);
      }
      setGameState(state);
      
      // If we entered selecting phase fresh, clear selections
      if (state.roundPhase === "selecting" && state.status === "playing") {
         const me = state.players?.find(p => p.socketId === socket.id);
         if (me && !me.hasSelected) {
             setSelectedCards([]);
             setPendingCard(null);
         }
      }
    });

    socket.on("roundResolved", async (data) => {
      const { steps, finalLine, scoreData, newStatus } = data;
      setResolveSteps(steps);
      setCurrentStepIndex(-1);
      setRoundScoreData({ finalLine, scores: scoreData });
      
      // Execute the animation loop right away
      for (let stepIdx = 0; stepIdx < steps.length; stepIdx++) {
        const step = steps[stepIdx];
        if (stepIdx > 0 && steps[stepIdx - 1].phase === "A" && step.phase === "B") {
          setActiveActionLabel("Starting Phase B...");
          await new Promise((r) => setTimeout(r, 1000));
        }

        let targets = [];
        if (step.card.type === "move" && step.card.target1) targets = [step.card.target1];
        if (step.card.type === "swap") targets = [step.card.target1, step.card.target2];
        if (step.card.type === "topple") {
          targets = displayedLine.slice(0, step.card.value || 1).map((t) => t.color);
        }

        setActiveTargets(targets);
        setActiveActionLabel(`${step.playerName}: ${step.card.type.toUpperCase()} ${step.card.value || ""}`);
        setCurrentStepIndex(stepIdx);

        await new Promise((r) => setTimeout(r, 600));

        setDisplayedLine(step.lineAfter);

        await new Promise((r) => setTimeout(r, STEP_DELAY_MS));

        setActiveTargets([]);
        setActiveActionLabel(null);
      }
      
      // We are done animating. The server will have moved to `round_scoring` by now, 
      // but if the user hasn't gotten it we just force local match.
      setDisplayedLine(finalLine);
    });

    socket.emit("getGameState", (state) => {
      if (state) {
        setGameState(state);
        if (state.roundPhase !== "resolving") {
          setDisplayedLine(state.tikiLine || []);
        }
      }
    });

    socket.on("opponentLeft", (data) => setOpponentLeftData(data));
    socket.on("matchCancelled", (data) => {
        toast.error(data.reason);
        navigate("/dashboard");
    });

    return () => {
      socket.off("gameStateUpdated");
      socket.off("roundResolved");
      socket.off("opponentLeft");
      socket.off("matchCancelled");
    };
  }, [socket, navigate, displayedLine]);

  // Confetti effect for game over
  useEffect(() => {
    if (gameState?.status === "game_over") {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [gameState?.status]);


  if (!gameState) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center font-chakra">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-lime-500 font-bold uppercase tracking-widest text-sm animate-pulse">Syncing Connection...</p>
        </div>
      </div>
    );
  }

  const me = gameState.players?.find(p => p.socketId === socket?.id);
  const isHost = gameState.players?.[0]?.socketId === socket?.id;
  const numPlayers = gameState.players?.length || 0;

  const handleCardClick = (card) => {
    if (gameState.roundPhase !== "selecting" || me?.hasSelected) return;

    const existingIdx = selectedCards.findIndex((s) => s.card.id === card.id);
    if (existingIdx !== -1) {
      setSelectedCards((prev) => prev.filter((_, i) => i !== existingIdx));
      if (pendingCard?.card?.id === card.id) setPendingCard(null);
      return;
    }

    if (selectedCards.length >= 2) return;

    if (card.type === "move") {
      setPendingCard({ card, needs: 1, targets: [] });
    } else if (card.type === "swap") {
      setPendingCard({ card, needs: 2, targets: [] });
    } else {
      setSelectedCards((prev) => [...prev, { card, target1: null, target2: null }]);
    }
  };

  const handleTikiClickForTarget = (color) => {
    if (!pendingCard) return;
    const newTargets = [...pendingCard.targets, color];
    
    if (newTargets.length === pendingCard.needs) {
      setSelectedCards((prev) => [
        ...prev,
        { card: pendingCard.card, target1: newTargets[0], target2: newTargets[1] || null },
      ]);
      setPendingCard(null);
    } else {
      setPendingCard({ ...pendingCard, targets: newTargets });
    }
  };

  const handleLockIn = () => {
    if (selectedCards.length !== 2) return;
    
    const cardsWithTargets = selectedCards.map((s) => ({
      ...s.card,
      target1: s.target1,
      target2: s.target2,
    }));

    socket.emit("lockInCards", { roomId: gameState.roomId, selectedCards: cardsWithTargets }, (r) => {
        if(!r.success) toast.error("Failed to lock in cards.");
    });
  };

  const handleNextRound = () => {
     socket.emit("readyForNextRound", { roomId: gameState.roomId });
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

  // UI Utilities
  const renderTopUtilsBar = (absolute = false) => (
    <div className={`${absolute ? 'absolute top-6 left-6 z-50' : 'w-full mb-6'} flex gap-4 items-center justify-between pointer-events-auto`}>
       <div className="flex gap-4">
         <button onClick={() => setShowExitConfirm(true)} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors uppercase font-bold text-[10px] tracking-widest group">
           <ArrowLeftIcon size={16} className="group-hover:-translate-x-1 transition-transform" />
           Leave Match
         </button>
         <div onClick={handleCopyRoomId} className="px-3 py-1 rounded bg-zinc-800/50 border border-zinc-700/50 text-xs font-mono text-zinc-400 flex items-center gap-2 cursor-pointer hover:border-zinc-500 transition-colors shadow-sm">
           Room: <span className="text-zinc-200">{gameState?.roomId}</span>
           <CopyIcon size={14} className="text-zinc-500" />
         </div>
       </div>
    </div>
  );

  // ================================================================
  // WAITING ROOM
  // ================================================================
  if (gameState.status === "waiting") {
    return (
      <div className="h-screen bg-[#0a0a0a] text-zinc-100 font-chakra pt-6 pb-4 px-4 flex flex-col items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="w-full max-w-7xl relative z-10 flex flex-col h-full">
            {renderTopUtilsBar()}
            <div className="flex-1 flex flex-col items-center justify-center">
                <h1 className="text-5xl font-bebas tracking-[0.2em] text-lime-400 mb-12 drop-shadow-[0_0_20px_rgba(132,204,22,0.2)]">WAITING FOR PLAYERS</h1>
                <div className="bg-[#121214] border-2 border-zinc-800 rounded-[32px] w-full max-w-md p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-500/50 to-transparent"></div>

                <div className="mb-10 flex flex-col items-center">
                    <span className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.4em] mb-4">INVITATION CODE</span>
                    <div onClick={handleCopyRoomId} className="bg-black/40 border-2 border-zinc-800 p-6 rounded-2xl flex items-center justify-between w-full cursor-pointer hover:border-lime-500 hover:bg-black/60 group transition-all shadow-inner">
                    <span className="text-4xl font-mono font-bold tracking-[0.3em] text-white pl-4 uppercase">{gameState.roomId}</span>
                    <CopyIcon size={24} className="text-zinc-500 group-hover:text-lime-400 transition-colors" weight="bold" />
                    </div>
                </div>

                <div className="mb-8">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-4 font-black flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse"></div>
                    ROSTER ({gameState.players.length}/4)
                    </div>
                    <div className="flex flex-col gap-3">
                    {gameState.players.map((p, i) => (
                        <div key={i} className={`flex justify-between items-center bg-zinc-900/50 rounded-xl px-5 py-3 border ${p.socketId === socket.id ? "border-lime-500/30 bg-lime-500/5" : "border-zinc-800"}`}>
                        <span className={`font-bold tracking-wide ${p.socketId === socket.id ? "text-lime-400" : "text-zinc-300"}`}>
                            {p.name} {p.socketId === socket.id ? "(You)" : ""}
                        </span>
                        {p.isHost && (
                            <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-yellow-500/20 shadow-sm">Host</span>
                        )}
                        </div>
                    ))}
                    </div>
                </div>

                {isHost && (
                    <button
                        onClick={() => socket.emit("startGame", { roomId: gameState.roomId })}
                        disabled={gameState.players.length < 2}
                        className="w-full flex items-center justify-center gap-3 bg-lime-500 text-zinc-950 disabled:opacity-30 disabled:grayscale font-black uppercase tracking-[0.2em] py-5 rounded-2xl border-b-6 border-lime-700 hover:bg-lime-400 active:border-b-0 active:translate-y-1 transition-all shadow-xl"
                    >
                    <PlayIcon size={20} weight="bold" /> DEPLOY TO BATTLE
                    </button>
                )}
                </div>
            </div>
        </div>
        {/* Modals placed optimally to not jump the screen */}
        {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-[#121214] border-2 border-zinc-800 rounded-[32px] p-10 max-w-sm w-full shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-white mb-4 text-center uppercase tracking-[0.2em]">RETREAT?</h2>
            <p className="text-zinc-500 text-sm mb-10 text-center leading-relaxed font-bold">Are you sure you want to abandon the mission? Your opponent will be notified of your retreat.</p>
            <div className="flex flex-col gap-4">
                <button onClick={handleLeaveRoom} className="w-full bg-red-500 text-white font-black uppercase tracking-[0.2em] px-4 py-4 rounded-2xl border-b-4 border-red-700 hover:bg-red-400 active:border-b-0 active:translate-y-1 transition-all text-xs">CONFIRM RETREAT</button>
                <button onClick={() => setShowExitConfirm(false)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase tracking-[0.2em] px-4 py-4 rounded-2xl hover:bg-zinc-800 hover:text-white transition-all text-xs">STAY IN BATTLE</button>
            </div>
            </div>
        </div>
        )}
      </div>
    );
  }

  // ================================================================
  // MAIN GAME PHASES
  // ================================================================
  return (
    <div className="h-screen max-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra pt-4 md:pt-6 pb-4 px-4 flex flex-col items-center relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="w-full max-w-7xl relative z-20">
         {renderTopUtilsBar(false)}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. SELECTION PHASE                                     */}
      {/* ---------------------------------------------------- */}
      {gameState.roundPhase === "selecting" && (
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6 lg:gap-8 relative z-10 items-stretch h-full mx-auto md:pt-10">
        
        {/* LEFT COMPONENT */}
        <div className="w-full md:w-3/5 lg:w-1/2 flex flex-col gap-4 h-full">
            {/* --- STATUS BAR --- */}
            <div className="flex items-center justify-between w-full shrink-0">
                <div className={`px-4 py-2 rounded-xl border-b-4 font-bold uppercase tracking-widest text-[10px] md:text-xs flex flex-row items-center gap-2 shadow-sm w-auto ${me?.hasSelected ? "bg-zinc-800 text-zinc-500 border-zinc-900" : "bg-lime-500 text-zinc-950 border-lime-700"}`}>
                    {!me?.hasSelected && <div className="w-2 h-2 rounded-full bg-zinc-950 animate-pulse"></div>}
                    {me?.hasSelected ? "WAITING FOR OTHERS" : "YOUR TURN"}
                </div>

                <div className="flex items-center bg-[#18181b] p-1 rounded-xl border-2 border-zinc-800 shadow-sm shrink-0">
                    <div className="px-3 py-0.5 flex flex-col items-end">
                        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-0.5">Target: {gameState.targetScore}</span>
                        <span className="text-lg text-yellow-400 font-black font-mono leading-none">{me?.totalScore || 0} <span className="text-[10px] text-yellow-600">PTS</span></span>
                    </div>
                </div>
            </div>

            {/* --- ROUND COLORS --- */}
            <div className="bg-[#18181b] border-2 border-zinc-800 rounded-xl p-2.5 flex items-center justify-between shrink-0 shadow-sm">
                <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-[0.15em] flex items-center gap-1.5">
                    <EyeSlashIcon size={14} className="text-zinc-500" /> Round Colors
                </span>
                <div className="flex gap-2 items-center">
                    {(me?.roundColors || []).map((color) => (
                        <div key={color} className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full border-2 border-zinc-600 shadow-inner" style={{ backgroundColor: color }}></div>
                            <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider">{color.slice(0, 3)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- ANTI-GRAVITY CONTRACTS --- */}
            <div className="flex flex-col gap-2 shrink-0">
                {me?.rules?.map((rule, ridx) => (
                    <div key={ridx} className="bg-[#18181b] border-2 border-zinc-800 rounded-2xl p-3 flex items-center justify-between relative overflow-hidden group shadow-md">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundColor: rule.color }}></div>
                        <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: rule.color }}></div>
                        <div className="pl-3 relative z-10 w-full">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-[0.2em] bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-700">Rule {ridx + 1}</span>
                            </div>
                            <p className="text-xs md:text-sm text-zinc-300 font-medium leading-snug">
                                <span className="font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border-b-2 inline-block mx-0.5 text-xs text-white" style={{ backgroundColor: `${rule.color}`, borderColor: `white` }}>
                                    {rule.color.toUpperCase()}
                                </span>{" "}
                                is{" "}
                                <span className="font-mono font-bold text-white bg-zinc-800 px-1.5 py-0.5 rounded mx-0.5 border border-zinc-700 text-xs">
                                    {rule.operator} {rule.position}
                                </span>{" "}
                                to earn{" "}
                                <span className="font-mono text-yellow-400 font-black bg-yellow-400/10 px-1.5 py-0.5 rounded mx-0.5 border border-yellow-500/20 text-xs">
                                    +{rule.points} pts
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- PLAYER HAND --- */}
            <div className={`w-full bg-[#18181b] border-2 p-4 md:p-5 rounded-[24px] relative shadow-lg flex-1 flex flex-col min-h-0 transition-opacity ${me?.hasSelected ? "opacity-30 pointer-events-none" : "border-zinc-800"}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3 border-b border-zinc-800/50 pb-3 shrink-0">
                    <div>
                        <h3 className="text-base font-black text-white uppercase tracking-wide">Your Hand</h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Select 2 cards</p>
                    </div>

                    <button
                        onClick={handleLockIn}
                        disabled={selectedCards.length !== 2}
                        className={`flex items-center gap-2 font-black uppercase tracking-widest py-2.5 px-6 rounded-xl text-xs transition-all duration-200 ${
                            selectedCards.length === 2
                                ? "bg-lime-500 text-zinc-950 border-b-4 border-lime-700 hover:bg-lime-400 active:border-b-0 active:translate-y-1 shadow-md"
                                : "bg-zinc-800 text-zinc-600 border-b-4 border-zinc-900 cursor-not-allowed"
                        }`}
                    >
                        <CheckCircleIcon size={16} weight={selectedCards.length === 2 ? "fill" : "regular"} />
                        Lock In {selectedCards.length}/2
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-3 justify-items-center sm:justify-items-start overflow-y-auto content-start flex-1 p-2 pt-5 md:p-3 md:pt-6 -mx-2 md:-mx-3 [scrollbar-width:thin] [scrollbar-color:#3f3f46_transparent]">
                    {me?.hand.map((card) => {
                        const selectedIdx = selectedCards.findIndex((s) => s.card.id === card.id);
                        return (
                            <div key={card.id} className="relative group shrink-0">
                                <Card
                                    card={card}
                                    isSelected={selectedIdx !== -1}
                                    selectionIndex={selectedIdx + 1}
                                    onClick={() => handleCardClick(card)}
                                    className=""
                                />
                                {pendingCard?.card?.id === card.id && (
                                    <div className="absolute -inset-1.5 border-2 border-dashed border-yellow-500 rounded-lg animate-spin-slow pointer-events-none drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]"></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* RIGHT COMPONENT - The Board */}
        <div className="w-full md:w-2/5 lg:w-1/2 relative flex justify-center items-center h-full mt-4 md:mt-0 pt-4">
            <div className={`w-full max-w-[280px] bg-[#0f0f11] rounded-[32px] pt-6 pb-5 md:pt-8 md:pb-6 px-4 flex flex-col items-center justify-between transition-all duration-300 relative border-t-6 border-x-2 border-b-4 ${pendingCard ? "border-yellow-500/60 shadow-[0_0_40px_rgba(234,179,8,0.15)] ring-2 ring-yellow-500/10" : "border-zinc-900 shadow-[inset_0_10px_40px_rgba(0,0,0,0.5),0_15px_30px_rgba(0,0,0,0.4)]"}`}>
                
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap">
                    {pendingCard ? (
                        <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md border-b-2 border-yellow-600 animate-bounce flex items-center gap-1.5"><ArrowDownIcon size={12} weight="bold" /> Target Tiki</div>
                    ) : (
                        <div className="bg-[#18181b] text-zinc-400 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border border-zinc-700 shadow-md backdrop-blur-md">Game Board</div>
                    )}
                </div>

                <div className="absolute top-10 bottom-8 left-1/2 w-3 bg-zinc-950 rounded-full -translate-x-1/2 border-x border-zinc-800/80 pointer-events-none shadow-inner z-0"></div>

                <div className="flex flex-col gap-2 relative z-10 w-full items-center my-1.5 flex-1 justify-center">
                    <AnimatePresence>
                        {displayedLine.map((token, idx) => (
                            <div key={token.id} className="flex items-center justify-center w-full relative">
                                <span className="absolute left-2 font-mono text-zinc-600 font-bold text-xs bg-zinc-900 border border-zinc-800 rounded-full w-6 h-6 flex items-center justify-center shadow-inner z-0">{idx + 1}</span>
                                <Token
                                    color={token.color}
                                    onClick={() => handleTikiClickForTarget(token.color)}
                                    isSelected={pendingCard?.targets?.includes(token.color)}
                                    className={`relative z-10 scale-[0.85] md:scale-95 transition-all ${pendingCard ? "cursor-pointer hover:scale-[1.25] hover:-translate-x-1 drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)]" : "drop-shadow-lg"}`}
                                />
                            </div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
      </div>
      )}


      {/* ---------------------------------------------------- */}
      {/* 2. RESOLVING PHASE                                     */}
      {/* ---------------------------------------------------- */}
      {gameState.roundPhase === "resolving" && (
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6 lg:gap-8 relative z-10 items-stretch h-full mx-auto md:pt-10">
          <div className="w-full md:w-3/5 lg:w-1/2 flex flex-col gap-4 items-center md:items-start justify-center h-full">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-2xl font-bebas tracking-wider text-white">Resolving Actions</h2>
              <div className="w-5 h-5 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"></div>
            </div>

            <div className="w-full h-3 bg-zinc-900 rounded-full mb-4 border border-zinc-800 shadow-inner overflow-hidden p-0.5">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                style={{ width: resolveSteps.length > 0 ? `${((currentStepIndex + 1) / resolveSteps.length) * 100}%` : "0%" }}
              ></div>
            </div>

            <div className="h-10 mb-2 flex items-center justify-center w-full md:justify-start">
              <AnimatePresence mode="wait">
                {activeActionLabel && (
                  <motion.div key={activeActionLabel} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -5, opacity: 0 }} className="bg-yellow-400 text-yellow-950 border-b-2 border-yellow-600 px-5 py-1.5 rounded-full font-black uppercase tracking-widest text-xs shadow-lg flex items-center gap-2">
                    <ArrowRightIcon weight="bold" size={14} /> {activeActionLabel}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-full bg-[#18181b] border-2 border-zinc-800 rounded-2xl p-4 flex-1 overflow-y-auto flex flex-col-reverse relative shadow-inner [scrollbar-width:thin] [scrollbar-color:#3f3f46_transparent]">
                {[...gameState.logs].reverse().map((log, i) => (
                    <div key={i} className={`py-0.5 text-[11px] font-mono tracking-wide flex items-start gap-2 ${log.startsWith("---") ? "text-yellow-400 font-bold mt-1" : "text-zinc-500"}`}>
                        <span className="text-zinc-700">›</span> {log}
                    </div>
                ))}
            </div>
          </div>

          <div className="w-full md:w-2/5 lg:w-1/2 relative flex justify-center items-center h-full pt-4">
            <div className="w-full max-w-[320px] bg-[#0f0f11] rounded-[32px] pt-8 pb-6 md:pt-10 md:pb-8 px-6 flex flex-col items-center justify-between transition-all duration-300 relative border-t-6 border-x-2 border-b-4 border-zinc-900 shadow-[inset_0_10px_40px_rgba(0,0,0,0.5),0_15px_30px_rgba(0,0,0,0.4)]">
              <div className="absolute top-10 bottom-8 left-1/2 w-3 bg-zinc-950 rounded-full -translate-x-1/2 border-x border-zinc-800/80 pointer-events-none shadow-inner z-0"></div>
              <div className="flex flex-col gap-3 lg:gap-4 relative z-10 w-full items-center my-4">
                <AnimatePresence mode="popLayout">
                  {displayedLine.map((token, idx) => (
                    <div key={token.id} className="flex items-center justify-center w-full relative">
                      <span className="absolute left-2 font-mono text-zinc-600 font-bold text-xs bg-zinc-900 border border-zinc-800 rounded-full w-6 h-6 flex items-center justify-center shadow-inner z-0">{idx + 1}</span>
                      <Token color={token.color} isTargeted={activeTargets.includes(token.color)} className={`relative z-10 scale-100 md:scale-110 transition-all drop-shadow-xl`} />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
      </div>
      )}


      {/* ---------------------------------------------------- */}
      {/* 3. ROUND SCORING BREAKDOWN                             */}
      {/* ---------------------------------------------------- */}
      {gameState.roundPhase === "round_scoring" && (
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center mx-auto overflow-y-auto pt-10">
          <div className="bg-zinc-900 border-2 border-zinc-800 rounded-full px-6 py-2 mb-8 inline-flex items-center gap-3">
            <MedalIcon size={20} className="text-yellow-400" weight="fill" />
            <h2 className="text-2xl font-bebas tracking-widest text-white mt-1">Round {gameState.currentRound} Results</h2>
          </div>

          <div className="bg-[#0f0f11] border-2 border-zinc-800 rounded-3xl p-4 md:p-6 mb-10 w-full flex flex-col items-center shadow-inner relative">
            <span className="absolute -top-3 bg-zinc-800 text-zinc-400 px-3 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border border-zinc-700">Final Order</span>
            <div className="flex gap-2 relative z-10 scale-90 md:scale-100 mt-2">
              {displayedLine.map((token, idx) => (
                <div key={token.id} className="relative group">
                  <Token color={token.color} className={idx < 3 ? "opacity-100 shadow-[0_0_15px_rgba(250,204,21,0.2)]" : "opacity-40 saturate-0"} />
                  {idx < 3 && <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-yellow-500">#{idx + 1}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full grid gap-6 mb-10" style={{ gridTemplateColumns: `repeat(${Math.min(numPlayers, 4)}, minmax(0, 1fr))` }}>
            {/* Sorting locally to keep host vs others clear, or just displaying existing. Local Game sorts by totalScore. */}
            {[...gameState.players].sort((a,b) => b.totalScore - a.totalScore).map((p, i) => {
                // To get breakdown correctly we need it. the server sent it in roundResolved. If we joined late we won't have it.
                const breakdown = roundScoreData?.scores?.find(s => s.socketId === p.socketId)?.breakdown || [];
                return (
              <div key={i} className={`bg-[#18181b] rounded-[32px] p-6 flex flex-col relative ${i === 0 ? "border-2 border-yellow-500/50 shadow-[0_10px_30px_rgba(250,204,21,0.1)]" : "border-2 border-zinc-800 border-b-4"}`}>
                <div className="flex justify-between items-center mb-4 border-b border-zinc-800/50 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-lg text-white uppercase">{p.name} {p.socketId === socket.id ? "(You)" : ""}</span>
                    <div className="flex gap-1">
                      {(p.roundColors || []).map((c) => (
                        <div key={c} className="w-4 h-4 rounded-full border border-zinc-600" style={{ backgroundColor: c }}></div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1 flex items-center gap-1">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Total</span>
                    <span className="font-mono text-yellow-400 font-bold">{p.totalScore}</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex flex-col gap-2 mb-4">
                    {p.rules.map((rule, ridx) => (
                      <div key={ridx} className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: rule.color }}></div>
                             <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Rule {ridx + 1}</span>
                          </div>
                          <span className="text-[10px] font-mono text-yellow-500">+{rule.points} pts</span>
                        </div>
                        <span className="text-[11px] font-medium text-zinc-300">{rule.color.toUpperCase()} {rule.operator} {rule.position}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 mb-6">
                    {breakdown.length > 0 ? breakdown.map((b, bi) => {
                        const isPositive = b.includes("+") || b.includes("TOP");
                         const isNegative = b.includes("NOT") || b.includes("Failed") || b.includes("no bonus");
                        return <p key={bi} className={`text-[10px] font-mono tracking-wide flex items-start gap-1 ${isPositive ? "text-lime-400" : isNegative ? "text-red-400/70" : "text-zinc-500"}`}>{isPositive ? "✓" : "✗"} {b}</p>;
                    }) : <p className="text-[10px] font-mono text-zinc-600 italic">Data missing or reconnected.</p>}
                  </div>
                </div>

                <div className={`mt-auto rounded-2xl p-4 flex justify-between items-center border-t-2 ${p.roundScore > 0 ? "bg-lime-500/10 border-lime-500/30 text-lime-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}>
                  <span className="text-xs font-black uppercase tracking-widest">Gained</span>
                  <span className="text-3xl font-bebas tracking-wide">+{p.roundScore}</span>
                </div>
              </div>
            )})}
          </div>

          <button
            onClick={handleNextRound}
            disabled={me?.readyForNext}
            className={`w-full max-w-sm font-black uppercase tracking-widest py-5 px-6 rounded-2xl border-b-4 hover:opacity-80 active:border-b-0 active:translate-y-1 transition-all shadow-xl flex justify-center items-center gap-2 ${me?.readyForNext ? "bg-zinc-800 border-zinc-900 text-zinc-500" : "bg-lime-500 text-zinc-950 border-lime-700"}`}
          >
            {me?.readyForNext ? "Waiting for players..." : "Ready for next round"} <ArrowRightIcon weight="bold" />
          </button>
      </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. GAME OVER (PODIUM)                                  */}
      {/* ---------------------------------------------------- */}
      {gameState.status === "game_over" && (
      <div className="relative z-10 flex flex-col w-full max-w-md mx-auto justify-center items-center h-full">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bebas tracking-wider text-white">Match Complete!</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">Target: {gameState.targetScore} Points</p>
          </div>

          {[...gameState.players].sort((a,b) => b.totalScore - a.totalScore).map((p, i) => {
              if (i === 0) {
                 return (
                    <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-[32px] p-8 flex flex-col items-center justify-center text-zinc-950 border-b-8 border-yellow-600 shadow-xl mb-6 relative overflow-hidden w-full">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-[32px]"></div>
                        <TrophyIcon size={56} weight="fill" className="text-yellow-700/50 mb-4 relative z-10" />
                        <span className="font-bold uppercase tracking-widest text-yellow-900 text-xs mb-1 relative z-10">Tiki Master</span>
                        <h3 className="text-3xl font-black mb-4 text-center relative z-10">{p.name} {p.socketId === socket.id ? "(You)" : ""}</h3>
                        <div className="bg-yellow-900/10 px-6 py-3 rounded-2xl backdrop-blur-sm border border-yellow-900/10 relative z-10">
                           <span className="text-4xl font-mono font-black">{p.totalScore}</span>
                           <span className="text-sm font-bold uppercase tracking-widest ml-2 text-yellow-800">PTS</span>
                        </div>
                    </motion.div>
                 );
              }
              return (
                  <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }} className="bg-[#18181b] border-2 border-zinc-800 rounded-2xl p-4 flex items-center justify-between mb-3 w-full">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-500 font-bold text-sm">{i + 1}</div>
                        <span className="font-bold text-zinc-300">{p.name} {p.socketId === socket.id ? "(You)" : ""}</span>
                    </div>
                    <div className="font-mono font-bold text-zinc-400">{p.totalScore} <span className="text-[10px] uppercase">PTS</span></div>
                  </motion.div>
              );
          })}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col gap-3 mt-6 w-full">
            <button onClick={handleNextRound} disabled={me?.readyForNext} className="w-full flex items-center justify-center gap-3 bg-lime-500 text-zinc-950 font-black uppercase tracking-widest py-5 px-4 rounded-2xl border-b-4 border-lime-700 hover:bg-lime-400 active:border-b-0 active:translate-y-1 transition-all">
                {me?.readyForNext ? "Waiting for others..." : "Play Again"}
            </button>
            <button onClick={handleLeaveRoom} className="w-full flex items-center justify-center gap-3 bg-[#18181b] text-zinc-300 font-bold uppercase tracking-widest py-5 px-4 rounded-2xl border-b-4 border-zinc-800 hover:bg-zinc-800 hover:text-white active:border-b-0 active:translate-y-1 transition-all">
                <HouseIcon size={20} weight="bold" /> Return to Lobby
            </button>
          </motion.div>
      </div>
      )}


      {/* Modal Overlays */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#121214] border-2 border-zinc-800 rounded-[32px] p-10 max-w-sm w-full shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-white mb-4 text-center uppercase tracking-[0.2em]">RETREAT?</h2>
            <p className="text-zinc-500 text-sm mb-10 text-center leading-relaxed font-bold">Are you sure you want to abandon the mission? Your opponent will be notified of your retreat.</p>
            <div className="flex flex-col gap-4">
              <button onClick={handleLeaveRoom} className="w-full bg-red-500 text-white font-black uppercase tracking-[0.2em] px-4 py-4 rounded-2xl border-b-4 border-red-700 hover:bg-red-400 active:border-b-0 active:translate-y-1 transition-all text-xs">CONFIRM RETREAT</button>
              <button onClick={() => setShowExitConfirm(false)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase tracking-[0.2em] px-4 py-4 rounded-2xl hover:bg-zinc-800 hover:text-white transition-all text-xs">STAY IN BATTLE</button>
            </div>
          </div>
        </div>
      )}

      {opponentLeftData && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <div className="bg-[#121214] border-2 border-yellow-500/30 rounded-[32px] p-10 max-w-sm w-full shadow-[0_0_100px_rgba(234,179,8,0.1)] text-center">
            <div className="w-20 h-20 bg-yellow-500/10 border-2 border-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <ArrowLeftIcon size={36} className="text-yellow-500 animate-pulse" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-[0.1em]">MISSION ABORTED</h2>
            <p className="text-zinc-500 text-sm mb-10 leading-relaxed font-bold">Operator <span className="text-yellow-500">{opponentLeftData.name}</span> has severed the connection. The session is closed.</p>
            <button onClick={() => navigate("/dashboard")} className="w-full bg-white text-zinc-950 font-black uppercase tracking-[0.2em] px-4 py-4 rounded-2xl border-b-4 border-zinc-300 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs">RETURN TO COMMAND</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Game;
