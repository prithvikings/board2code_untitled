import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  ArrowLeftIcon,
  TrophyIcon,
  PlayIcon,
  RobotIcon,
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
  generatePlayerRoundRules,
  resolveRound,
  calculateAntiGravityScore,
  resetPlayersForNewRound,
  generateInitialTikiLine,
  shuffleArray,
  TIKI_COLORS,
} from "./localEngine";
import { selectBotCards } from "./botEngine";
import toast from "react-hot-toast";

const STEP_DELAY_MS = 1500;

const BotGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const difficulty = location.state?.difficulty || "medium";
  const targetScore = location.state?.targetScore || 30;

  // ===== CORE STATE =====
  const [tikiLine, setTikiLine] = useState([]);
  const [players, setPlayers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundStatus, setRoundStatus] = useState("selecting"); 
  const [selectingPlayerIndex, setSelectingPlayerIndex] = useState(0); 

  // ===== UI STATE =====
  const [selectedCards, setSelectedCards] = useState([]);
  const [pendingCard, setPendingCard] = useState(null);
  const [resolveSteps, setResolveSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [activeTargets, setActiveTargets] = useState([]);
  const [activeActionLabel, setActiveActionLabel] = useState(null);
  const [roundScoreData, setRoundScoreData] = useState(null);

  useEffect(() => {
    initializeRound(1, null);
  }, []);

  useEffect(() => {
    if (roundStatus === "game_over") {
      const sorted = [...players].sort((a, b) => b.totalScore - a.totalScore);
      if (sorted[0]?.name !== "Tiki Bot") {
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
    }
  }, [roundStatus, players]);

  // Handle Bot Turn automatically
  useEffect(() => {
    if (roundStatus === "selecting" && selectingPlayerIndex === 1) {
      const timer = setTimeout(() => {
        const botPlayer = players[1];
        const botSelections = selectBotCards(
          botPlayer.hand,
          tikiLine,
          botPlayer.rules,
          difficulty,
        );

        setPlayers((prev) => {
          const updated = [...prev];
          updated[1] = {
            ...updated[1],
            selectedCards: botSelections,
            hand: updated[1].hand.filter(
              (h) => !botSelections.map((c) => c.id).includes(h.id),
            ),
            hasSelected: true,
          };
          return updated;
        });

        addLog(`Tiki Bot has locked in its cards.`);
        setRoundStatus("waiting");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [roundStatus, selectingPlayerIndex, players, tikiLine, difficulty]);

  const initializeRound = (roundNum, existingPlayers) => {
    const line = generateInitialTikiLine();
    setTikiLine(line);

    if (!existingPlayers) {
      const initialPlayers = [
        {
          name: "You",
          hand: createInitialHand(),
          rules: generatePlayerRoundRules(
            shuffleArray(TIKI_COLORS).slice(0, 2),
          ),
          roundColors: shuffleArray(TIKI_COLORS).slice(0, 2),
          selectedCards: [],
          totalScore: 0,
          roundScore: 0,
          hasSelected: false,
          scoreHistory: [],
        },
        {
          name: "Tiki Bot",
          hand: createInitialHand(),
          rules: generatePlayerRoundRules(
            shuffleArray(TIKI_COLORS).slice(0, 2),
          ),
          roundColors: shuffleArray(TIKI_COLORS).slice(0, 2),
          selectedCards: [],
          totalScore: 0,
          roundScore: 0,
          hasSelected: false,
          scoreHistory: [],
        },
      ];
      setPlayers(initialPlayers);
    } else {
      setPlayers(resetPlayersForNewRound(existingPlayers));
    }

    setSelectingPlayerIndex(0);
    setSelectedCards([]);
    setPendingCard(null);
    setResolveSteps([]);
    setCurrentStepIndex(-1);
    setActiveTargets([]);
    setActiveActionLabel(null);
    setRoundScoreData(null);
    setRoundStatus("selecting");
    setLogs([]);
    addLog(`══════════════════════════════`);
    addLog(`Round ${roundNum} begins! Target Score: ${targetScore}`);
    addLog(`Difficulty: ${difficulty.toUpperCase()}`);
  };

  const addLog = useCallback((msg) => setLogs((prev) => [...prev, msg]), []);

  const handleCardClick = (card) => {
    if (roundStatus !== "selecting" || selectingPlayerIndex !== 0) return;

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
      updated[0] = {
        ...updated[0],
        selectedCards: cardsWithTargets,
        hand: updated[0].hand.filter(
          (h) => !cardsWithTargets.map((c) => c.id).includes(h.id),
        ),
        hasSelected: true,
      };
      return updated;
    });

    addLog(`You locked in your cards.`);
    setSelectedCards([]);
    setPendingCard(null);
    setSelectingPlayerIndex(1); // bot turn next
  };

  const handleStartResolve = async () => {
    const { steps, finalLine } = resolveRound(tikiLine, players);
    setResolveSteps(steps);
    setCurrentStepIndex(-1);
    setRoundStatus("resolving");
    addLog("--- Resolution starting ---");

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

      let targets = [];
      if (step.card.type === "move" && step.card.target1)
        targets = [step.card.target1];
      if (step.card.type === "swap")
        targets = [step.card.target1, step.card.target2];
      if (step.card.type === "topple")
        targets = tikiLine.slice(0, step.card.value || 1).map((t) => t.color);

      setActiveTargets(targets);
      setActiveActionLabel(
        `${step.playerName}: ${step.card.type.toUpperCase()} ${step.card.value || ""}`,
      );
      addLog(`[Phase ${step.phase}] ${step.logMessage}`);
      setCurrentStepIndex(stepIdx);

      await new Promise((r) => setTimeout(r, 600));
      setTikiLine(step.lineAfter);
      await new Promise((r) => setTimeout(r, STEP_DELAY_MS));

      setActiveTargets([]);
      setActiveActionLabel(null);
    }

    finalizeRound(finalLine);
  };

  const finalizeRound = (finalLine) => {
    const scoredPlayers = players.map((p) => {
      const { score, breakdown } = calculateAntiGravityScore(
        finalLine,
        p.rules,
      );
      return { ...p, roundScore: score, totalScore: p.totalScore + score, scoreHistory: [...p.scoreHistory, score] };
    });
    setPlayers(scoredPlayers);
    setTikiLine(finalLine);

    const scoreData = scoredPlayers.map((p) => ({
      name: p.name,
      roundScore: p.roundScore,
      totalScore: p.totalScore,
      rules: p.rules,
      roundColors: p.roundColors,
      breakdown: calculateAntiGravityScore(finalLine, p.rules).breakdown,
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
              gridTemplateColumns: `repeat(2, 1fr)`,
            }}
          >
            {players.map((p, i) => (
              <div
                key={i}
                className="bg-[#18181b] border-2 border-zinc-800 border-b-4 rounded-3xl p-5 flex flex-col h-full"
              >
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 text-center flex items-center justify-center gap-2">
                  {i === 1 && <RobotIcon size={16} weight="fill" className="text-blue-500"/>}
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

  if (roundStatus === "resolving") {
    const progress = resolveSteps.length > 0 ? ((currentStepIndex + 1) / resolveSteps.length) * 100 : 0;

    return (
      <div className="h-screen max-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra flex flex-col items-center pt-2 md:pt-6 pb-6 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6 lg:gap-8 relative z-10 items-stretch h-full">
          <div className="w-full md:w-3/5 lg:w-1/2 flex flex-col gap-4 items-center md:items-start justify-center h-full">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-2xl font-bebas tracking-wider text-white">
                Resolving Actions
              </h2>
              <div className="w-5 h-5 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"></div>
            </div>

            <div className="w-full h-3 bg-zinc-900 rounded-full mb-4 border border-zinc-800 shadow-inner overflow-hidden p-0.5">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="h-10 mb-2 flex items-center justify-center w-full md:justify-start">
              <AnimatePresence mode="wait">
                {activeActionLabel && (
                  <motion.div
                    key={activeActionLabel}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -5, opacity: 0 }}
                    className="bg-yellow-400 text-yellow-950 border-b-2 border-yellow-600 px-5 py-1.5 rounded-full font-black uppercase tracking-widest text-xs shadow-lg flex items-center gap-2"
                  >
                    <ArrowRightIcon weight="bold" size={14} />{" "}
                    {activeActionLabel}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-full bg-[#18181b] border-2 border-zinc-800 rounded-2xl p-4 flex-1 overflow-y-auto flex flex-col-reverse relative shadow-inner [scrollbar-width:thin] [scrollbar-color:#3f3f46_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600">
              {[...logs].reverse().map((log, i) => (
                <div
                  key={i}
                  className={`py-0.5 text-[11px] font-mono tracking-wide flex items-start gap-2 ${log.startsWith("---") ? "text-yellow-400 font-bold mt-1" : "text-zinc-500"}`}
                >
                  <span className="text-zinc-700">›</span> {log}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-2/5 lg:w-1/2 relative flex justify-center items-center h-full pt-4">
            <div className="w-full max-w-[320px] bg-[#0f0f11] rounded-[32px] pt-8 pb-6 md:pt-10 md:pb-8 px-6 flex flex-col items-center justify-between transition-all duration-300 relative border-t-6 border-x-2 border-b-4 border-zinc-900 shadow-[inset_0_10px_40px_rgba(0,0,0,0.5),0_15px_30px_rgba(0,0,0,0.4)]">
              <div className="absolute top-10 bottom-8 left-1/2 w-3 bg-zinc-950 rounded-full -translate-x-1/2 border-x border-zinc-800/80 pointer-events-none shadow-inner z-0"></div>

              <div className="text-zinc-500 font-mono font-bold tracking-[0.4em] uppercase text-[9px] bg-[#0f0f11] px-2 relative z-10 rounded border border-zinc-800/30">
                TOP TIER
              </div>

              <div className="flex flex-col gap-3 lg:gap-4 relative z-10 w-full items-center my-4">
                <AnimatePresence mode="popLayout">
                  {tikiLine.map((token, idx) => (
                    <div
                      key={token.id}
                      className="flex items-center justify-center w-full relative"
                    >
                      <span className="absolute left-2 font-mono text-zinc-600 font-bold text-xs bg-zinc-900 border border-zinc-800 rounded-full w-6 h-6 flex items-center justify-center shadow-inner z-0">
                        {idx + 1}
                      </span>
                      <Token
                        color={token.color}
                        isTargeted={activeTargets.includes(token.color)}
                        className={`relative z-10 scale-100 md:scale-110 transition-all drop-shadow-xl`}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="text-zinc-600 font-mono font-bold tracking-[0.4em] uppercase text-[9px] bg-[#0f0f11] px-2 relative z-10 rounded border border-zinc-800/30">
                BOTTOM
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          <div
            className="w-full grid gap-6 mb-10 relative"
            style={{
              gridTemplateColumns: `repeat(2, minmax(0, 1fr))`,
            }}
          >
            {sorted.map((p, i) => (
              <div
                key={i}
                className={`bg-[#18181b] rounded-[32px] p-6 flex flex-col relative ${i === 0 ? "border-2 border-yellow-500/50 shadow-[0_10px_30px_rgba(250,204,21,0.1)]" : "border-2 border-zinc-800 border-b-4"}`}
              >
                <div className="flex justify-between items-center mb-4 border-b border-zinc-800/50 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-lg text-white uppercase flex items-center gap-2">
                      {p.name === "Tiki Bot" && <RobotIcon size={20} className="text-blue-500"/>}
                      {p.name}
                    </span>
                    <div className="flex gap-1">
                      {(p.roundColors || []).map((c) => (
                        <div
                          key={c}
                          className="w-4 h-4 rounded-full border border-zinc-600"
                          style={{ backgroundColor: c }}
                          title={c}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1 flex items-center gap-1">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">
                      Total
                    </span>
                    <span className="font-mono text-yellow-400 font-bold">
                      {p.totalScore}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex flex-col gap-2 mb-4">
                    {p.rules.map((rule, ridx) => (
                      <div
                        key={ridx}
                        className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: rule.color }}
                            ></div>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                              Rule {ridx + 1}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-yellow-500">
                            +{rule.points} pts
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-zinc-300">
                          {rule.color.toUpperCase()} {rule.operator}{" "}
                          {rule.position}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 mb-6">
                    {p.breakdown.length > 0 ? (
                      p.breakdown.map((b, bi) => {
                        const isPositive = b.includes("+") || b.includes("TOP");
                        const isNegative =
                          b.includes("NOT") ||
                          b.includes("failed") ||
                          b.includes("no bonus");
                        return (
                          <p
                            key={bi}
                            className={`text-[10px] font-mono tracking-wide flex items-start gap-1 ${isPositive ? "text-lime-400" : isNegative ? "text-red-400/70" : "text-zinc-500"}`}
                          >
                            {isPositive ? "✓" : "✗"} {b}
                          </p>
                        );
                      })
                    ) : (
                      <p className="text-[10px] font-mono text-zinc-600 italic">
                        No points scored.
                      </p>
                    )}
                  </div>
                </div>

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
    const runnersUp = sorted.slice(1);

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra flex flex-col items-center justify-center p-4 md:p-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[50vh] bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="relative z-10 flex flex-col w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bebas tracking-wider text-white">
              Match Complete!
            </h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">
              Target: {targetScore} Points
            </p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`bg-gradient-to-b ${winner.name === 'You' ? "from-yellow-400 to-yellow-500 border-yellow-600" : "from-blue-400 to-blue-500 border-blue-600"} rounded-[32px] p-8 flex flex-col items-center justify-center text-zinc-950 border-b-8 shadow-xl mb-6 relative overflow-hidden`}
          >
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-[32px]"></div>

            <TrophyIcon
              size={56}
              weight="fill"
              className={`${winner.name === 'You' ? "text-yellow-700/50" : "text-blue-700/50"} mb-4 relative z-10`}
            />
            <span className={`font-bold uppercase tracking-widest ${winner.name === 'You' ? "text-yellow-900" : "text-blue-900"} text-xs mb-1 relative z-10`}>
              Tiki Master
            </span>
            <h3 className="text-3xl font-black mb-4 text-center relative z-10 flex items-center gap-2">
               {winner.name === 'Tiki Bot' && <RobotIcon size={28} className="text-blue-900" weight="fill"/>}
               {winner.name}
            </h3>

            <div className={`${winner.name === 'You' ? "bg-yellow-900/10 border-yellow-900/10" : "bg-blue-900/10 border-blue-900/10"} px-6 py-3 rounded-2xl backdrop-blur-sm border relative z-10`}>
              <span className="text-4xl font-mono font-black">
                {winner.totalScore}
              </span>
              <span className={`text-sm font-bold uppercase tracking-widest ml-2 ${winner.name === 'You' ? "text-yellow-800" : "text-blue-800"}`}>
                PTS
              </span>
            </div>
          </motion.div>

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
                  <span className="font-bold text-zinc-300 flex items-center gap-2">
                     {player.name === 'Tiki Bot' && <RobotIcon size={16} className="text-blue-500" weight="fill"/>}
                     {player.name}
                  </span>
                </div>
                <div className="font-mono font-bold text-zinc-400">
                  {player.totalScore}{" "}
                  <span className="text-[10px] uppercase">PTS</span>
                </div>
              </motion.div>
            ))}
          </div>

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

  const humanPlayer = players[0];
  if (!humanPlayer) return null;

  return (
    <div className="h-screen max-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra pt-2 md:pt-4 pb-4 px-4 flex justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6 lg:gap-8 relative z-10 items-stretch h-full">
        <div className="w-full md:w-3/5 lg:w-1/2 flex flex-col gap-4 h-full">
          <div className="flex items-center justify-between w-full shrink-0 gap-4 flex-wrap">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-xl border-b-4 border-blue-800 font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2 shadow-sm">
              <RobotIcon size={16} weight="fill" />
              VS {difficulty.toUpperCase()} AI
            </div>

            <div className="flex items-center bg-[#18181b] p-1 rounded-xl border-2 border-zinc-800 shadow-sm shrink-0 gap-2 pl-4">
               <div className="flex items-center gap-3 pr-2">
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-0.5">
                      Bot
                    </span>
                    <span className="text-[14px] text-blue-400 font-black font-mono leading-none">
                      {players[1]?.totalScore || 0}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-zinc-700"></div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-0.5">
                      You
                    </span>
                    <span className="text-lg text-lime-400 font-black font-mono leading-none">
                      {humanPlayer.totalScore}
                    </span>
                  </div>
               </div>
               <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center border-b-2 border-yellow-600 shadow-inner group relative">
                 <TrophyIcon size={16} weight="fill" className="text-yellow-900" />
                 <div className="absolute top-full mt-2 w-max bg-zinc-900 border border-zinc-700 px-2 py-1 text-[10px] tracking-widest font-black uppercase rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                   Target: {targetScore} PTS
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-[#18181b] border-2 border-zinc-800 rounded-xl p-2.5 flex items-center justify-between shrink-0 shadow-sm">
            <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-[0.15em] flex items-center gap-1.5">
              <EyeSlashIcon size={14} className="text-zinc-500" /> Round Colors
            </span>
            <div className="flex gap-2 items-center">
              {(humanPlayer.roundColors || []).map((color) => (
                <div key={color} className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-600 shadow-inner" style={{ backgroundColor: color }}></div>
                  <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider">
                    {color.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            {humanPlayer.rules.map((rule, ridx) => (
              <div key={ridx} className="bg-[#18181b] border-2 border-zinc-800 rounded-2xl p-3 flex items-center justify-between relative overflow-hidden group shadow-md">
                <div className="absolute inset-0 opacity-10" style={{ backgroundColor: rule.color }}></div>
                <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: rule.color }}></div>

                <div className="pl-3 relative z-10 w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-[0.2em] bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-700">
                      Rule {ridx + 1}
                    </span>
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

          <div className="w-full bg-[#18181b] border-2 border-zinc-800 p-4 md:p-5 rounded-[24px] relative shadow-lg flex-1 flex flex-col min-h-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3 border-b border-zinc-800/50 pb-3 shrink-0">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wide">
                  Your Hand
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                  Select 2 cards
                </p>
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
              {humanPlayer.hand.map((card) => {
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

        <div className="w-full md:w-2/5 lg:w-1/2 relative flex justify-center items-center h-full mt-4 md:mt-0 pt-4">
          <div
            className={`w-full max-w-[280px] bg-[#0f0f11] rounded-[32px] pt-6 pb-5 md:pt-8 md:pb-6 px-4 flex flex-col items-center justify-between transition-all duration-300 relative border-t-6 border-x-2 border-b-4 ${
              pendingCard
                ? "border-yellow-500/60 shadow-[0_0_40px_rgba(234,179,8,0.15)] ring-2 ring-yellow-500/10"
                : "border-zinc-900 shadow-[inset_0_10px_40px_rgba(0,0,0,0.5),0_15px_30px_rgba(0,0,0,0.4)]"
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap">
              {pendingCard ? (
                <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md border-b-2 border-yellow-600 animate-bounce flex items-center gap-1.5">
                  <ArrowDownIcon size={12} weight="bold" /> Target Tiki
                </div>
              ) : (
                <div className="bg-[#18181b] text-zinc-400 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border border-zinc-700 shadow-md backdrop-blur-md">
                  Game Board
                </div>
              )}
            </div>

            <div className="absolute top-10 bottom-8 left-1/2 w-3 bg-zinc-950 rounded-full -translate-x-1/2 border-x border-zinc-800/80 pointer-events-none shadow-inner z-0"></div>

            <div className="text-zinc-500 font-mono font-bold tracking-[0.4em] uppercase text-[9px] bg-[#0f0f11] px-2 relative z-10 rounded border border-zinc-800/30 mb-2">
              TOP TIER
            </div>

            <div className="flex flex-col gap-2 relative z-10 w-full items-center my-1.5 flex-1 justify-center">
              <AnimatePresence>
                {tikiLine.map((token, idx) => (
                  <div key={token.id} className="flex items-center justify-center w-full relative">
                    <span className="absolute left-2 font-mono text-zinc-600 font-bold text-xs bg-zinc-900 border border-zinc-800 rounded-full w-6 h-6 flex items-center justify-center shadow-inner z-0">
                      {idx + 1}
                    </span>
                    <Token
                      color={token.color}
                      onClick={() => handleTikiClickForTarget(token.color)}
                      isSelected={pendingCard?.targets?.includes(token.color)}
                      className={`relative z-10 scale-[0.85] md:scale-95 transition-all ${
                        pendingCard
                          ? "cursor-pointer hover:scale-[1.25] hover:-translate-x-1 drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)]"
                          : "drop-shadow-lg"
                      }`}
                    />
                  </div>
                ))}
              </AnimatePresence>
            </div>

            <div className="text-zinc-600 font-mono font-bold tracking-[0.4em] uppercase text-[9px] bg-[#0f0f11] px-2 relative z-10 rounded border border-zinc-800/30 mt-2">
              BOTTOM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotGame;
