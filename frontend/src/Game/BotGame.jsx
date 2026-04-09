import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  TrophyIcon,
  PlayIcon,
  RobotIcon,
  ArrowRightIcon,
  HouseIcon,
  ArrowClockwiseIcon,
  MedalIcon
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
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
  const [roundStatus, setRoundStatus] = useState("selecting"); // selecting, waiting, revealed, resolving, round_scoring, game_over
  const [selectingPlayerIndex, setSelectingPlayerIndex] = useState(0); // 0 = Human, 1 = Bot

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
    // Confetti effect for game over
    if (roundStatus === "game_over") {
      const sorted = [...players].sort((a, b) => b.totalScore - a.totalScore);
      if (sorted[0]?.name !== "Tiki Bot") {
         confetti({
           particleCount: 150,
           spread: 70,
           origin: { y: 0.6 }
         });
      }
    }
  }, [roundStatus, players]);

  // Handle Bot Turn automatically
  useEffect(() => {
    if (roundStatus === "selecting" && selectingPlayerIndex === 1) {
      // Small delay for realism
      const timer = setTimeout(() => {
        const botPlayer = players[1];
        const botSelections = selectBotCards(botPlayer.hand, tikiLine, botPlayer.rule, difficulty);
        
        setPlayers(prev => {
          const updated = [...prev];
          updated[1] = {
            ...updated[1],
            selectedCards: botSelections,
            hand: updated[1].hand.filter(h => !botSelections.map(c => c.id).includes(h.id)),
            hasSelected: true
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
          rule: generateRule(),
          selectedCards: [],
          totalScore: 0,
          roundScore: 0,
          hasSelected: false,
        },
        {
          name: "Tiki Bot",
          hand: createInitialHand(),
          rule: generateRule(),
          selectedCards: [],
          totalScore: 0,
          roundScore: 0,
          hasSelected: false,
        }
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
    addLog(`Round ${roundNum} begins! Difficulty: ${difficulty}`);
  };

  const addLog = useCallback((msg) => setLogs((prev) => [...prev, msg]), []);

  const handleCardClick = (card) => {
    if (roundStatus !== "selecting" || selectingPlayerIndex !== 0) return;
    
    // Logic for selection...
    const existingIdx = selectedCards.findIndex((s) => s.card.id === card.id);
    if (existingIdx !== -1) {
      setSelectedCards(prev => prev.filter((_, i) => i !== existingIdx));
      if (pendingCard?.card?.id === card.id) setPendingCard(null);
      return;
    }
    if (selectedCards.length >= 2) return;

    if (card.type === "move") {
      setPendingCard({ card, needs: 1, targets: [] });
    } else if (card.type === "swap") {
      setPendingCard({ card, needs: 2, targets: [] });
    } else {
      setSelectedCards(prev => [...prev, { card, target1: null, target2: null }]);
    }
  };

  const handleTikiClickForTarget = (color) => {
    if (!pendingCard) return;
    const newTargets = [...pendingCard.targets, color];
    if (newTargets.length === pendingCard.needs) {
      setSelectedCards(prev => [...prev, {
        card: pendingCard.card,
        target1: newTargets[0],
        target2: newTargets[1] || null
      }]);
      setPendingCard(null);
    } else {
      setPendingCard({ ...pendingCard, targets: newTargets });
    }
  };

  const handleLockIn = () => {
    if (selectedCards.length !== 2) return;
    const cardsWithTargets = selectedCards.map(s => ({
      ...s.card,
      target1: s.target1,
      target2: s.target2
    }));
    
    setPlayers(prev => {
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        selectedCards: cardsWithTargets,
        hand: updated[0].hand.filter(h => !cardsWithTargets.map(c => c.id).includes(h.id)),
        hasSelected: true
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
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      let targets = [];
      if (step.card.type === "move" && step.card.target1) targets = [step.card.target1];
      if (step.card.type === "swap") targets = [step.card.target1, step.card.target2];
      if (step.card.type === "topple") targets = tikiLine.slice(0, step.card.value || 1).map(t => t.color);

      setActiveTargets(targets);
      setActiveActionLabel(`${step.playerName}: ${step.card.type.toUpperCase()}`);
      addLog(`[${step.playerName}] ${step.logMessage}`);
      setCurrentStepIndex(i);
      
      await new Promise(r => setTimeout(r, 600));
      setTikiLine(step.lineAfter);
      await new Promise(r => setTimeout(r, STEP_DELAY_MS));
      
      setActiveTargets([]);
      setActiveActionLabel(null);
    }
    
    finalizeRound(finalLine);
  };

  const finalizeRound = (finalLine) => {
    const scoredPlayers = players.map(p => {
      const { score, breakdown } = calculateDynamicScore(finalLine, p.rule);
      return { ...p, roundScore: score, totalScore: p.totalScore + score };
    });
    setPlayers(scoredPlayers);
    
    const scoreData = scoredPlayers.map(p => ({
      name: p.name,
      roundScore: p.roundScore,
      totalScore: p.totalScore,
      rule: p.rule,
      breakdown: calculateDynamicScore(finalLine, p.rule).breakdown
    }));
    setRoundScoreData({ finalLine, scores: scoreData });
    setRoundStatus("round_scoring");
  };

  const handleNextRound = () => {
    const gameFinished = players.some(p => p.totalScore >= targetScore);
    if (gameFinished) {
      setRoundStatus("game_over");
    } else {
      setCurrentRound(cr => cr + 1);
      initializeRound(currentRound + 1, players);
    }
  };

  if (roundStatus === "waiting") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <h2 className="text-5xl font-bebas text-white mb-8">All Ready!</h2>
        <button onClick={() => setRoundStatus("revealed")} className="bg-yellow-500 text-black font-bold py-4 px-12 rounded-2xl">Reveal Cards</button>
      </div>
    );
  }

  if (roundStatus === "revealed") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center pt-16 px-4">
         <h2 className="text-4xl font-bebas text-white mb-8">Move Reveal</h2>
         <div className="flex gap-4 mb-12">
            {players.map((p, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl w-48 text-center">
                 <p className="text-zinc-500 text-xs font-bold uppercase mb-4">{p.name}</p>
                 {p.selectedCards.map((c, ci) => (
                   <div key={ci} className="bg-zinc-800 p-2 rounded mb-2 text-xs font-bold text-lime-400">
                     {c.type} {c.value || ""}
                   </div>
                 ))}
              </div>
            ))}
         </div>
         <button onClick={handleStartResolve} className="bg-yellow-500 text-black font-bold py-4 px-12 rounded-xl">Play Animation</button>
      </div>
    );
  }

  if (roundStatus === "resolving") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center pt-16 px-4">
        <h2 className="text-3xl font-bebas text-yellow-500 mb-8 animate-pulse">Resolving Board...</h2>
        <div className="bg-zinc-900 p-8 rounded-3xl mb-12 flex justify-center w-full max-w-2xl">
           <div className="flex gap-2">
             <AnimatePresence>
                {[...tikiLine].reverse().map(t => (
                  <Token key={t.id} color={t.color} isTargeted={activeTargets.includes(t.color)} />
                ))}
             </AnimatePresence>
           </div>
        </div>
        <div className="text-center bg-zinc-800/50 px-6 py-2 rounded-full text-white font-bold">{activeActionLabel}</div>
      </div>
    );
  }

  if (roundStatus === "round_scoring" && roundScoreData) {
      // (Similar to LocalGame results but specialized)
      const isWinner = players[0].totalScore >= targetScore && players[0].totalScore >= players[1].totalScore;
      return (
        <div className="min-h-screen bg-[#0a0a0a] p-8 flex flex-col items-center">
           <h2 className="text-5xl font-bebas text-white mb-8">Round {currentRound} Over</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {roundScoreData.scores.map((s, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                   <h3 className="text-xl font-bold mb-1">{s.name}</h3>
                   <p className="text-zinc-500 text-xs uppercase mb-4">Total: {s.totalScore}</p>
                   <div className="bg-black/40 p-3 rounded-lg text-xs text-zinc-400">
                      {s.breakdown.map((b, bi) => <p key={bi}>{b}</p>)}
                   </div>
                   <div className="mt-4 text-2xl font-mono text-lime-400">+{s.roundScore}</div>
                </div>
              ))}
           </div>
           <button onClick={handleNextRound} className="mt-12 bg-lime-500 text-black font-bold py-4 px-12 rounded-xl">
             {players.some(p => p.totalScore >= targetScore) ? "Final Results" : "Next Round"}
           </button>
        </div>
      );
  }

  if (roundStatus === "game_over") {
    const sorted = [...players].sort((a,b) => b.totalScore - a.totalScore);
    const win = sorted[0].name === "You";

    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-8">
         <motion.div initial={{scale: 0.5}} animate={{scale: 1}} className="text-center">
            <TrophyIcon size={100} className={win ? "text-yellow-400 mx-auto mb-4" : "text-zinc-600 mx-auto mb-4"} />
            <h1 className="text-8xl font-bebas text-white mb-2">{win ? "VICTORY!" : "DEFEAT"}</h1>
            <p className="text-zinc-500 tracking-widest uppercase mb-12">Final Score: {players[0].totalScore} - {players[1].totalScore}</p>
            
            <div className="flex gap-4">
               <button onClick={() => initializeRound(1, null)} className="bg-white text-black font-bold px-8 py-4 rounded-xl flex items-center gap-2">
                 <ArrowClockwiseIcon /> Retry
               </button>
               <button onClick={() => navigate("/dashboard")} className="bg-zinc-800 text-white font-bold px-8 py-4 rounded-xl flex items-center gap-2">
                 <HouseIcon /> Exit
               </button>
            </div>
         </motion.div>
      </div>
    );
  }

  const humanPlayer = players[0];
  if (!humanPlayer) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 px-4 flex flex-col items-center font-chakra">
       <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
             <div>
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">Player Score</span>
                <span className="text-2xl font-mono text-yellow-400">{humanPlayer.totalScore}</span>
             </div>
             <div className="text-center">
                <span className="bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full text-[10px] font-bold uppercase border border-blue-500/20">Mode: vs {difficulty} Bot</span>
             </div>
             <div className="text-right">
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">Bot Score</span>
                <span className="text-2xl font-mono text-blue-400">{players[1]?.totalScore || 0}</span>
             </div>
          </div>

          {/* Secret Hand Display */}
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl mb-8 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{backgroundColor: humanPlayer.rule.color}}></div>
                <p className="text-sm text-zinc-300 uppercase font-bold">Contract: {humanPlayer.rule.color} ≤ {humanPlayer.rule.maxPosition}</p>
             </div>
             <p className="text-yellow-400 font-bold">Reward: +{humanPlayer.rule.points} Pts</p>
          </div>

          <div className={`bg-zinc-900 p-12 rounded-[40px] border-2 transition-all mb-8 flex justify-center relative ${pendingCard ? "border-lime-500 shadow-2xl" : "border-zinc-800"}`}>
             {pendingCard && <div className="absolute top-4 bg-lime-500 text-black px-4 py-1 rounded-full text-[10px] font-bold uppercase animate-bounce">Select Target</div>}
             <div className="flex gap-3">
                <AnimatePresence>
                   {[...tikiLine].reverse().map(t => (
                     <Token key={t.id} color={t.color} onClick={() => handleTikiClickForTarget(t.color)} isSelected={pendingCard?.targets?.includes(t.color)} />
                   ))}
                </AnimatePresence>
             </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
             <div className="flex justify-between mb-6">
                <h3 className="text-zinc-500 uppercase font-bold text-xs">Your Hand</h3>
                <button 
                  onClick={handleLockIn} 
                  disabled={selectedCards.length !== 2}
                  className="bg-lime-500 text-black px-8 py-2 rounded-xl text-xs font-bold uppercase disabled:opacity-20 transition-opacity"
                >
                  Lock Selection
                </button>
             </div>
             <div className="flex gap-4 overflow-x-auto pb-4">
                {humanPlayer.hand.map(c => {
                  const sIdx = selectedCards.findIndex(s => s.card.id === c.id);
                  return <Card key={c.id} card={c} isSelected={sIdx !== -1} onClick={() => handleCardClick(c)} />;
                })}
             </div>
          </div>
       </div>
    </div>
  );
};

export default BotGame;
