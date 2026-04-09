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
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import Token from "./Token";
import Card from "./Card";
import {
  createInitialHand,
  generateRule,
  resolveRound,
  calculateDynamicScore,
  resetPlayersForNewRound,
  generateInitialTikiLine,
} from "./localEngine";

const STEP_DELAY_MS = 1500; // Increased delay to allow animations to fully play out

const LocalGame = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const playerNames = (() => {
    const s = location.state || {};
    const names = [];
    if (s.player1) names.push(s.player1);
    if (s.player2) names.push(s.player2);
    if (s.player3) names.push(s.player3);
    if (s.player4) names.push(s.player4);
    if (names.length < 2) return ["Player 1", "Player 2"];
    return names;
  })();
  const numPlayers = playerNames.length;
  const targetScore = location.state?.targetScore || 50;

  // ===== CORE STATE =====
  const [tikiLine, setTikiLine] = useState([]); // Now an array of { id, color }
  const [players, setPlayers] = useState([]);
  const [logs, setLogs] = useState([]);

  // ===== ROUND TRACKING =====
  const [currentRound, setCurrentRound] = useState(1);
  const [roundStatus, setRoundStatus] = useState("selecting");
  const [selectingPlayerIndex, setSelectingPlayerIndex] = useState(0);
  const [passScreen, setPassScreen] = useState(false);

  // ===== LOCAL UI STATE =====
  const [selectedCards, setSelectedCards] = useState([]);
  const [pendingCard, setPendingCard] = useState(null);

  // ===== RESOLUTION ANIMATION STATE =====
  const [resolveSteps, setResolveSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [activeTargets, setActiveTargets] = useState([]); // which colors are being acted on right now
  const [activeActionLabel, setActiveActionLabel] = useState(null);

  const [roundScoreData, setRoundScoreData] = useState(null);

  useEffect(() => {
    initializeRound(1, null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (roundStatus === "game_over") {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [roundStatus]);

  const initializeRound = (roundNum, existingPlayers) => {
    const line = generateInitialTikiLine();
    setTikiLine(line);

    if (!existingPlayers) {
      const initialPlayers = playerNames.map((name) => ({
        name,
        hand: createInitialHand(),
        rule: generateRule(),
        selectedCards: [],
        totalScore: 0,
        roundScore: 0,
        hasSelected: false,
        scoreHistory: [],
      }));
      setPlayers(initialPlayers);
    } else {
      setPlayers(resetPlayersForNewRound(existingPlayers));
    }

    setSelectingPlayerIndex(0);
    setPassScreen(false);
    setSelectedCards([]);
    setPendingCard(null);
    setResolveSteps([]);
    setCurrentStepIndex(-1);
    setActiveTargets([]);
    setActiveActionLabel(null);
    setRoundScoreData(null);
    setRoundStatus("selecting");
    setLogs((prev) => [
      ...prev,
      `══════════════════════════════`,
      `Round ${roundNum} begins! Target Score: ${targetScore}`,
      `${playerNames[0]}, select your 2 cards.`,
    ]);
  };

  const addLog = useCallback((msg) => setLogs((prev) => [...prev, msg]), []);
  const activePlayer =
    roundStatus === "selecting" ? players[selectingPlayerIndex] : null;

  const handleCardClick = (card) => {
    if (roundStatus !== "selecting") return;
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
      setSelectedCards((prev) => [
        ...prev,
        { card, target1: null, target2: null },
      ]);
    }
  };

  const handleTikiClickForTarget = (color) => {
    if (!pendingCard) return;
    const newTargets = [...pendingCard.targets, color];
    if (newTargets.length === pendingCard.needs) {
      setSelectedCards((prev) => [
        ...prev,
        {
          card: pendingCard.card,
          target1: newTargets[0],
          target2: newTargets[1] || null,
        },
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
    setPlayers((prev) => {
      const updated = [...prev];
      updated[selectingPlayerIndex] = {
        ...updated[selectingPlayerIndex],
        selectedCards: cardsWithTargets,
        hand: updated[selectingPlayerIndex].hand.filter(
          (h) => !cardsWithTargets.map((c) => c.id).includes(h.id),
        ),
        hasSelected: true,
      };
      return updated;
    });
    addLog(`${playerNames[selectingPlayerIndex]} locked in their 2 cards.`);
    setSelectedCards([]);
    setPendingCard(null);

    const nextUnselected = selectingPlayerIndex + 1;
    if (nextUnselected >= numPlayers) {
      setRoundStatus("waiting");
      addLog("All players have selected their cards!");
    } else {
      setPassScreen(true);
    }
  };

  // ===== RESOLUTION FLOW EXECUTION (ASYNC QUEUE) =====
  const handleStartResolve = async () => {
    const { steps, finalLine } = resolveRound(tikiLine, players);
    setResolveSteps(steps);
    setCurrentStepIndex(-1);
    setRoundStatus("resolving");
    addLog("--- Resolution starting ---");

    // We use an async loop to wait for Framer Motion to complete transitions
    for (let stepIdx = 0; stepIdx < steps.length; stepIdx++) {
      const step = steps[stepIdx];

      if (
        stepIdx > 0 &&
        steps[stepIdx - 1].phase === "A" &&
        step.phase === "B"
      ) {
        addLog("--- Phase A complete. Starting Phase B (2nd cards) ---");
        setActiveActionLabel("Starting Phase B...");
        await new Promise((r) => setTimeout(r, 1000));
      }
      if (stepIdx === 0) {
        addLog("--- Phase A: Executing all 1st cards ---");
      }

      // 1. Highlight targets
      let targets = [];
      if (step.card.type === "move" && step.card.target1)
        targets = [step.card.target1];
      if (step.card.type === "swap")
        targets = [step.card.target1, step.card.target2];
      if (step.card.type === "topple") {
        // Active targets for topple are the front-most elements (count)
        targets = tikiLine.slice(0, step.card.value || 1).map((t) => t.color);
      }

      setActiveTargets(targets);
      setActiveActionLabel(
        `${step.playerName}: ${step.card.type.toUpperCase()} ${step.card.value || ""}`,
      );
      addLog(`[Phase ${step.phase}] ${step.logMessage}`);
      setCurrentStepIndex(stepIdx);

      // Wait a moment so players see the highlight BEFORE it moves
      await new Promise((r) => setTimeout(r, 600));

      // 2. Trigger the layout change (Framer Motion activates)
      setTikiLine(step.lineAfter);

      // Wait for the animation to finish + buffer
      await new Promise((r) => setTimeout(r, STEP_DELAY_MS));

      // Clear highlights before next step
      setActiveTargets([]);
      setActiveActionLabel(null);
    }

    // After loop completes
    finalizeRound(finalLine);
  };

  const finalizeRound = (finalLine) => {
    const scoredPlayers = players.map((p) => {
      const { score, breakdown } = calculateDynamicScore(finalLine, p.rule);
      return {
        ...p,
        roundScore: score,
        totalScore: p.totalScore + score,
        scoreHistory: [...p.scoreHistory, score],
      };
    });
    setPlayers(scoredPlayers);
    setTikiLine(finalLine); // Ensures states match perfectly

    const scoreData = scoredPlayers.map((p) => ({
      name: p.name,
      roundScore: p.roundScore,
      totalScore: p.totalScore,
      rule: p.rule,
      breakdown: calculateDynamicScore(finalLine, p.rule).breakdown,
    }));
    setRoundScoreData({ finalLine, scores: scoreData });

    addLog("--- Resolution Complete ---");
    scoredPlayers.forEach((p) => {
      addLog(`${p.name} scored ${p.roundScore} pts (total: ${p.totalScore})`);
    });

    setRoundStatus("round_scoring");
  };

  const handleNextRound = () => {
    const gameFinished = players.some((p) => p.totalScore >= targetScore);
    if (gameFinished) {
      setRoundStatus("game_over");
      addLog(`══════════════════════════════`);
      addLog(`GAME OVER — Final standings:`);
      const sorted = [...players].sort((a, b) => b.totalScore - a.totalScore);
      sorted.forEach((p, i) =>
        addLog(`#${i + 1} ${p.name}: ${p.totalScore} pts`),
      );
    } else {
      setRoundStatus("round_transition");
      setCurrentRound((cr) => cr + 1);
    }
  };

  // ... [Interstitial rendering blocks remain mostly identical,
  // but updated to handle {id, color} mapping] ...
  // ================================================================
  // RENDER: PASS SCREEN & WAITING
  // ================================================================
  if (passScreen) {
    const nextName = playerNames[selectingPlayerIndex + 1];
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra flex flex-col items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none"></div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#18181b] border-2 border-zinc-800 rounded-[32px] p-10 flex flex-col items-center text-center max-w-sm w-full shadow-2xl z-10"
        >
          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
            <EyeSlashIcon size={40} className="text-purple-400 animate-pulse" />
          </div>
          <h2 className="text-4xl font-bebas tracking-wider text-white mb-2">
            Pass Device
          </h2>
          <p className="text-zinc-400 text-sm mb-8 font-medium">
            Hand the device over to{" "}
            <span className="text-lime-400 font-black">{nextName}</span>. No
            peeking!
          </p>
          <button
            onClick={() => {
              setPassScreen(false);
              setSelectingPlayerIndex(selectingPlayerIndex + 1);
            }}
            className="w-full bg-lime-500 text-zinc-950 font-black uppercase tracking-widest py-4 px-6 rounded-2xl border-b-4 border-lime-700 hover:bg-lime-400 active:border-b-0 active:translate-y-1 transition-all"
          >
            I'm {nextName} — Go
          </button>
        </motion.div>
      </div>
    );
  }

  if (roundStatus === "waiting") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra flex flex-col items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none"></div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-[32px] p-10 flex flex-col items-center text-center max-w-sm w-full shadow-[0_0_50px_rgba(234,179,8,0.1)] z-10"
        >
          <CheckCircleIcon
            size={64}
            weight="fill"
            className="text-yellow-500 mb-6"
          />
          <h2 className="text-4xl font-bebas tracking-wider text-white mb-8">
            All Ready!
          </h2>
          <button
            onClick={() => setRoundStatus("revealed")}
            className="w-full bg-yellow-500 text-zinc-950 font-black uppercase tracking-widest py-4 px-6 rounded-2xl border-b-4 border-yellow-700 hover:bg-yellow-400 active:border-b-0 active:translate-y-1 transition-all"
          >
            Reveal Cards
          </button>
        </motion.div>
      </div>
    );
  }

  // ================================================================
  // RENDER: REVEAL
  // ================================================================
  if (roundStatus === "revealed") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra flex flex-col items-center pt-16 pb-12 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bebas tracking-wider text-white mb-8 text-center bg-zinc-900 px-6 py-2 rounded-2xl border-b-4 border-zinc-800">
            Cards Revealed
          </h2>

          <div
            className="w-full grid gap-4 mb-10"
            style={{
              gridTemplateColumns: `repeat(${Math.min(numPlayers, 4)}, 1fr)`,
            }}
          >
            {players.map((p, i) => (
              <div
                key={i}
                className="bg-[#18181b] border-2 border-zinc-800 border-b-4 rounded-3xl p-5 flex flex-col h-full"
              >
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 text-center">
                  {p.name}
                </p>
                <div className="flex-1 flex flex-col gap-2">
                  {p.selectedCards.map((card, ci) => (
                    <div
                      key={ci}
                      className="bg-[#0f172a] border border-blue-900/30 rounded-xl p-3 flex items-center justify-center shadow-inner"
                    >
                      <span className="text-xs font-black text-blue-400 uppercase tracking-widest">
                        {card.type} {card.value || ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Consistent Physical Track */}
          <div className="w-full bg-[#0f0f11] rounded-[32px] p-8 flex justify-center relative border-2 border-zinc-800 shadow-inner mb-10">
            <div className="absolute top-1/2 left-8 right-8 h-4 bg-zinc-950 rounded-full -translate-y-1/2 border-t border-zinc-800/50 pointer-events-none"></div>
            <div className="flex gap-3 relative z-10">
              {tikiLine.map((token) => (
                <Token key={token.id} color={token.color} />
              ))}
            </div>
          </div>

          <button
            onClick={handleStartResolve}
            className="w-full max-w-md bg-yellow-500 text-zinc-950 font-black uppercase tracking-widest py-5 px-6 rounded-2xl border-b-4 border-yellow-700 hover:bg-yellow-400 active:border-b-0 active:translate-y-1 transition-all shadow-xl flex justify-center items-center gap-2"
          >
            <PlayIcon size={20} weight="fill" /> Start Resolution
          </button>
        </div>
      </div>
    );
  }

  // ================================================================
  // RENDER: ANIMATED RESOLUTION
  // ================================================================
  if (roundStatus === "resolving") {
    const progress =
      resolveSteps.length > 0
        ? ((currentStepIndex + 1) / resolveSteps.length) * 100
        : 0;

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra flex flex-col items-center pt-16 pb-12 px-4 relative">
        <div className="w-full max-w-3xl flex flex-col items-center z-10">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-bebas tracking-wider text-white">
              Resolving Actions
            </h2>
            <div className="w-6 h-6 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"></div>
          </div>

          {/* Chunky Progress Bar */}
          <div className="w-full h-4 bg-zinc-900 rounded-full mb-8 border border-zinc-800 shadow-inner overflow-hidden p-0.5">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Active Action Floating Tag */}
          <div className="h-14 mb-4 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeActionLabel && (
                <motion.div
                  key={activeActionLabel}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="bg-yellow-400 text-yellow-950 border-b-2 border-yellow-600 px-6 py-2 rounded-full font-black uppercase tracking-widest text-sm shadow-lg flex items-center gap-2"
                >
                  <ArrowRightIcon weight="bold" /> {activeActionLabel}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Physical Track Board */}
          <div className="w-full bg-[#0f0f11] rounded-[32px] p-10 flex justify-center relative border-2 border-zinc-800 shadow-inner mb-8">
            <div className="absolute top-1/2 left-8 right-8 h-4 bg-zinc-950 rounded-full -translate-y-1/2 border-t border-zinc-800/50 pointer-events-none"></div>
            <div className="flex gap-3 relative z-10">
              <AnimatePresence mode="popLayout">
                {[...tikiLine].reverse().map((token) => (
                  <Token
                    key={token.id}
                    color={token.color}
                    isTargeted={activeTargets.includes(token.color)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Sleek Terminal Log with Custom Dark Scrollbar */}
          <div className="w-full bg-[#18181b] border-2 border-zinc-800 rounded-3xl p-5 h-40 overflow-y-auto flex flex-col-reverse relative shadow-inner [scrollbar-width:thin] [scrollbar-color:#3f3f46_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600">
            {[...logs].reverse().map((log, i) => (
              <div
                key={i}
                className={`py-1 text-xs font-mono tracking-wide flex items-start gap-2 ${log.startsWith("---") ? "text-yellow-400 font-bold mt-2" : "text-zinc-500"}`}
              >
                <span className="text-zinc-700">›</span> {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  // ================================================================
  // RENDER: SCORING / ROUND RESULTS
  // ================================================================
  if (roundStatus === "round_scoring" && roundScoreData) {
    const gameFinished = players.some((p) => p.totalScore >= targetScore);
    const sorted = [...roundScoreData.scores].sort(
      (a, b) => b.totalScore - a.totalScore,
    );

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra flex flex-col items-center pt-16 pb-12 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
          <div className="bg-zinc-900 border-2 border-zinc-800 rounded-full px-6 py-2 mb-8 inline-flex items-center gap-3">
            <MedalIcon size={20} className="text-yellow-400" weight="fill" />
            <h2 className="text-2xl font-bebas tracking-widest text-white mt-1">
              Round {currentRound} Results
            </h2>
          </div>

          {/* Final Board Mini-Display */}
          <div className="bg-[#0f0f11] border-2 border-zinc-800 rounded-3xl p-4 md:p-6 mb-10 w-full flex flex-col items-center shadow-inner relative">
            <span className="absolute -top-3 bg-zinc-800 text-zinc-400 px-3 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border border-zinc-700">
              Final Order
            </span>
            <div className="flex gap-2 relative z-10 scale-90 md:scale-100 mt-2">
              {roundScoreData.finalLine.map((token, idx) => (
                <div key={token.id} className="relative group">
                  <Token
                    color={token.color}
                    className={
                      idx < 3
                        ? "opacity-100 shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                        : "opacity-40 saturate-0"
                    }
                  />
                  {idx < 3 && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-yellow-500">
                      #{idx + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Player Scoring Cards (Tactile & Clean) */}
          <div
            className="w-full grid gap-6 mb-10"
            style={{
              gridTemplateColumns: `repeat(${Math.min(numPlayers, 4)}, minmax(0, 1fr))`,
            }}
          >
            {sorted.map((p, i) => (
              <div
                key={i}
                className={`bg-[#18181b] rounded-[32px] p-6 flex flex-col relative ${i === 0 ? "border-2 border-yellow-500/50 shadow-[0_10px_30px_rgba(250,204,21,0.1)]" : "border-2 border-zinc-800 border-b-4"}`}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b border-zinc-800/50 pb-4">
                  <span className="font-black text-lg text-white uppercase">
                    {p.name}
                  </span>
                  <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1 flex items-center gap-1">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">
                      Total
                    </span>
                    <span className="font-mono text-yellow-400 font-bold">
                      {p.totalScore}
                    </span>
                  </div>
                </div>

                {/* Secret Contract Review */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="bg-zinc-900/50 rounded-2xl p-4 mb-4 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">
                      Contract Goal
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: p.rule.color }}
                      ></div>
                      <span className="text-sm font-medium text-zinc-300">
                        Top{" "}
                        <span className="font-bold text-white">
                          {p.rule.maxPosition}
                        </span>{" "}
                        = +{p.rule.points} pts
                      </span>
                    </div>
                  </div>

                  {/* Breakdown Log */}
                  <div className="space-y-1.5 mb-6">
                    {p.breakdown.length > 0 ? (
                      p.breakdown.map((b, bi) => (
                        <p
                          key={bi}
                          className={`text-[10px] font-mono tracking-wide flex items-start gap-1 ${b.startsWith("Success") ? "text-lime-400" : "text-zinc-500"}`}
                        >
                          {b.startsWith("Success") ? "✓" : "✗"} {b}
                        </p>
                      ))
                    ) : (
                      <p className="text-[10px] font-mono text-zinc-600 italic">
                        No points scored.
                      </p>
                    )}
                  </div>
                </div>

                {/* Big Round Score Number */}
                <div
                  className={`mt-auto rounded-2xl p-4 flex justify-between items-center border-t-2 ${p.roundScore > 0 ? "bg-lime-500/10 border-lime-500/30 text-lime-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}
                >
                  <span className="text-xs font-black uppercase tracking-widest">
                    Gained
                  </span>
                  <span className="text-3xl font-bebas tracking-wide">
                    +{p.roundScore}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleNextRound}
            className="w-full max-w-sm bg-lime-500 text-zinc-950 font-black uppercase tracking-widest py-5 px-6 rounded-2xl border-b-4 border-lime-700 hover:bg-lime-400 active:border-b-0 active:translate-y-1 transition-all shadow-xl flex justify-center items-center gap-2"
          >
            {gameFinished ? "View Podium" : "Start Next Round"}{" "}
            <ArrowRightIcon weight="bold" />
          </button>
        </div>
      </div>
    );
  }

  if (roundStatus === "round_transition") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 flex flex-col items-center w-full max-w-md"
        >
          <div className="bg-lime-500/10 text-lime-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-lime-500/20">
            Get Ready
          </div>
          <h2 className="text-6xl md:text-8xl font-bebas text-white mb-10 text-center tracking-wider">
            Round <span className="text-lime-400">{currentRound}</span>
          </h2>
          <button
            onClick={() => initializeRound(currentRound, players)}
            className="w-full bg-lime-500 text-zinc-950 font-black uppercase tracking-widest py-5 px-6 rounded-2xl border-b-4 border-lime-700 hover:bg-lime-400 active:border-b-0 active:translate-y-1 transition-all shadow-xl"
          >
            Begin Round
          </button>
        </motion.div>
      </div>
    );
  }

  if (roundStatus === "game_over") {
    const sorted = [...players].sort((a, b) => b.totalScore - a.totalScore);
    const winner = sorted[0];
    const runnersUp = sorted.slice(1); // Grabs everyone except 1st place

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra flex flex-col items-center justify-center p-4 md:p-8 relative">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[50vh] bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="relative z-10 flex flex-col w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bebas tracking-wider text-white">
              Match Complete!
            </h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">
              Target: {targetScore} Points
            </p>
          </div>

          {/* Winner Hero Card (Duolingo Style: Tactile & Bright) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-[32px] p-8 flex flex-col items-center justify-center text-zinc-950 border-b-8 border-yellow-600 shadow-xl mb-6 relative overflow-hidden"
          >
            {/* Subtle inner glare */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-[32px]"></div>

            <TrophyIcon
              size={56}
              weight="fill"
              className="text-yellow-700/50 mb-4 relative z-10"
            />
            <span className="font-bold uppercase tracking-widest text-yellow-900 text-xs mb-1 relative z-10">
              Tiki Master
            </span>
            <h3 className="text-3xl font-black mb-4 text-center relative z-10">
              {winner.name}
            </h3>

            <div className="bg-yellow-900/10 px-6 py-3 rounded-2xl backdrop-blur-sm border border-yellow-900/10 relative z-10">
              <span className="text-4xl font-mono font-black">
                {winner.totalScore}
              </span>
              <span className="text-sm font-bold uppercase tracking-widest ml-2 text-yellow-800">
                PTS
              </span>
            </div>
          </motion.div>

          {/* Runners-up List (Clean, stacked rows) */}
          <div className="flex flex-col gap-3 mb-10">
            {runnersUp.map((player, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-[#18181b] border-2 border-zinc-800 rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-500 font-bold text-sm">
                    {index + 2}
                  </div>
                  <span className="font-bold text-zinc-300">{player.name}</span>
                </div>
                <div className="font-mono font-bold text-zinc-400">
                  {player.totalScore}{" "}
                  <span className="text-[10px] uppercase">PTS</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons (Tactile chunky style) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={() => initializeRound(1, null)}
              className="w-full flex items-center justify-center gap-3 bg-lime-500 text-zinc-950 font-black uppercase tracking-widest py-5 px-4 rounded-2xl border-b-4 border-lime-700 hover:bg-lime-400 active:border-b-0 active:translate-y-1 transition-all"
            >
              <ArrowClockwiseIcon size={20} weight="bold" />
              Play Again
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center justify-center gap-3 bg-[#18181b] text-zinc-300 font-bold uppercase tracking-widest py-5 px-4 rounded-2xl border-b-4 border-zinc-800 hover:bg-zinc-800 hover:text-white active:border-b-0 active:translate-y-1 transition-all"
            >
              <HouseIcon size={20} weight="bold" />
              Return to Lobby
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }
  if (!activePlayer || players.length < 2)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-bebas text-4xl text-zinc-500 animate-pulse">
        Loading Game...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra pt-8 md:pt-16 pb-32 px-4 flex flex-col items-center relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="w-full max-w-4xl flex flex-col gap-6 relative z-10">
        {/* --- TACTILE TOP STATUS BAR --- */}
        <div className="flex items-center justify-between w-full">
          {/* Player Turn Indicator (Tactile Pill) */}
          <div className="bg-lime-500 text-zinc-950 px-5 py-2.5 rounded-2xl border-b-4 border-lime-700 font-bold uppercase tracking-widest text-xs md:text-sm flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-zinc-950 animate-pulse"></div>
            {activePlayer.name}'s Turn
          </div>

          {/* Score & Target (Tactile Pill) */}
          <div className="flex items-center bg-[#18181b] p-1.5 rounded-2xl border-2 border-zinc-800 shadow-md">
            <div className="px-4 py-1 flex flex-col items-end">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">
                Target: {targetScore}
              </span>
              <span className="text-xl text-yellow-400 font-black font-mono leading-none">
                {activePlayer.totalScore}{" "}
                <span className="text-xs text-yellow-600">PTS</span>
              </span>
            </div>
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center border-b-4 border-yellow-600 ml-2">
              <TrophyIcon size={20} weight="fill" className="text-yellow-900" />
            </div>
          </div>
        </div>

        {/* --- SECRET MISSION CONTRACT --- */}
        <div className="bg-[#18181b] border-2 border-zinc-800 rounded-3xl p-5 flex items-center justify-between relative overflow-hidden group">
          {/* Color Tint Background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundColor: activePlayer.rule.color }}
          ></div>

          {/* Dynamic Color Stripe */}
          <div
            className="absolute top-0 left-0 w-2 h-full"
            style={{ backgroundColor: activePlayer.rule.color }}
          ></div>

          <div className="pl-4 relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-[0.2em] bg-zinc-900/80 px-2 py-0.5 rounded-md border border-zinc-700">
                Secret Contract
              </span>
            </div>
            <p className="text-sm md:text-base text-zinc-300 font-medium">
              Keep{" "}
              <span
                className="font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border-b-2"
                style={{
                  color: activePlayer.rule.color,
                  backgroundColor: `${activePlayer.rule.color}15`,
                  borderColor: `${activePlayer.rule.color}40`,
                }}
              >
                {activePlayer.rule.color}
              </span>{" "}
              in top{" "}
              <span className="font-mono font-bold text-white bg-zinc-800 px-2 py-0.5 rounded-md">
                {activePlayer.rule.maxPosition}
              </span>{" "}
              positions to earn{" "}
              <span className="font-mono text-yellow-400 font-black bg-yellow-400/10 px-2 py-0.5 rounded-md">
                +{activePlayer.rule.points} pts
              </span>
              .
            </p>
          </div>

          <EyeSlashIcon
            size={32}
            className="text-zinc-700 opacity-50 relative z-10 hidden sm:block"
          />
        </div>

        {/* --- THE BOARD (PHYSICAL TRACK DESIGN) --- */}
        <div className="relative w-full">
          {/* Instructions Floating Tag */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
            {pendingCard ? (
              <div className="bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border-b-2 border-yellow-600 animate-bounce flex items-center gap-2">
                <ArrowDownIcon size={14} weight="bold" /> Select Target Tiki
              </div>
            ) : (
              <div className="bg-zinc-800 text-zinc-400 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-zinc-700">
                Game Board
              </div>
            )}
          </div>

          <div
            className={`w-full bg-[#0f0f11] rounded-[32px] p-8 md:p-12 flex justify-center overflow-x-auto hide-scrollbar transition-all duration-300 relative border-t-8 border-x-4 border-b-4 ${
              pendingCard
                ? "border-yellow-500/50 shadow-[0_0_40px_rgba(234,179,8,0.15)]"
                : "border-zinc-900 shadow-inner"
            }`}
          >
            {/* The physical "groove" track line under the tokens */}
            <div className="absolute top-1/2 left-8 right-8 h-4 bg-zinc-950 rounded-full -translate-y-1/2 border-t border-zinc-800/50 pointer-events-none"></div>

            <div className="flex gap-3 relative z-10">
              <AnimatePresence>
                {[...tikiLine].reverse().map((token) => (
                  <Token
                    key={token.id}
                    color={token.color}
                    onClick={() => handleTikiClickForTarget(token.color)}
                    isSelected={pendingCard?.targets?.includes(token.color)}
                    className={
                      pendingCard
                        ? "cursor-pointer hover:-translate-y-2 transition-transform"
                        : ""
                    }
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* --- PLAYER HAND & ACTION AREA --- */}
        <div className="w-full bg-[#18181b] border-2 border-zinc-800 p-6 md:p-8 rounded-[32px] mt-2 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-wide">
                Your Hand
              </h3>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                Select 2 cards to play
              </p>
            </div>

            {/* BIG TACTILE LOCK-IN BUTTON */}
            <button
              onClick={handleLockIn}
              disabled={selectedCards.length !== 2}
              className={`flex items-center gap-2 font-black uppercase tracking-widest py-4 px-8 rounded-2xl transition-all duration-200 ${
                selectedCards.length === 2
                  ? "bg-lime-500 text-zinc-950 border-b-4 border-lime-700 hover:bg-lime-400 active:border-b-0 active:translate-y-1 shadow-lg"
                  : "bg-zinc-800 text-zinc-600 border-b-4 border-zinc-900 cursor-not-allowed"
              }`}
            >
              <CheckCircleIcon
                size={20}
                weight={selectedCards.length === 2 ? "fill" : "regular"}
              />
              Lock In {selectedCards.length}/2
            </button>
          </div>

          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            {activePlayer.hand.map((card) => {
              const selectedIdx = selectedCards.findIndex(
                (s) => s.card.id === card.id,
              );
              return (
                <div key={card.id} className="relative group">
                  <Card
                    card={card}
                    isSelected={selectedIdx !== -1}
                    selectionIndex={selectedIdx + 1}
                    onClick={() => handleCardClick(card)}
                  />
                  {/* Subtle highlight if it's the pending target selection card */}
                  {pendingCard?.card?.id === card.id && (
                    <div className="absolute -inset-2 border-2 border-dashed border-yellow-500 rounded-xl animate-spin-slow pointer-events-none"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalGame;
