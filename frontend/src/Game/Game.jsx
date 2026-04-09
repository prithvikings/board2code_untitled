import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon, ShuffleSimpleIcon, TrophyIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import Token from "./Token"; // We'll put Token.jsx in the same folder

const INITIAL_TOKENS = ["red", "blue", "green", "yellow", "purple", "orange"];

// Shuffle helper
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const p1 = location.state?.player1 || "Player 1";
  const p2 = location.state?.player2 || "Player 2";

  // State
  // track[0] is start (index 0). track[7] is finish line.
  const [track, setTrack] = useState([shuffleArray(INITIAL_TOKENS), [], [], [], [], [], [], []]);
  const [turnPlayer, setTurnPlayer] = useState(p1);
  
  // "advance" or "swap"
  const [actionSide, setActionSide] = useState(""); 
  
  // Used for swapping: holds { tIdx, sIdx }
  const [firstSwapToken, setFirstSwapToken] = useState(null);

  // Secret targets
  const [p1Targets, setP1Targets] = useState([]);
  const [p2Targets, setP2Targets] = useState([]);
  
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    // Generate valid random targets
    const shuffledForTargets = shuffleArray(INITIAL_TOKENS);
    setP1Targets([shuffledForTargets[0], shuffledForTargets[1]]);
    setP2Targets([shuffledForTargets[2], shuffledForTargets[3]]);
  }, []);

  const handleTokenClick = (trackIndex, stackIndex) => {
    if (winner) return;

    const stack = track[trackIndex];
    const depthFromTop = stack.length - stackIndex; // 1 means top token

    if (!actionSide) {
      alert("Please select an action first (Advance or Rearrange).");
      return;
    }

    if (actionSide === "advance") {
      // Must be top 1, 2, or 3
      if (depthFromTop > 3) {
        alert("You can only advance the top 1, 2, or 3 tokens.");
        return;
      }

      if (trackIndex === track.length - 1) {
        alert("These tokens are already at the finish line!");
        return;
      }

      // Splice tokens from current stack and push to next stack
      const tokensToMove = stack.slice(stackIndex); // from clicked token to the end (top)
      const newTrack = [...track];
      newTrack[trackIndex] = stack.slice(0, stackIndex);
      newTrack[trackIndex + 1] = [...newTrack[trackIndex + 1], ...tokensToMove];
      
      setTrack(newTrack);
      checkWinCondition(newTrack);
      switchTurn();

    } else if (actionSide === "swap") {
      if (depthFromTop > 3) {
        alert("You can only rearrange the top 3 tokens of a stack.");
        return;
      }

      if (!firstSwapToken) {
        setFirstSwapToken({ tIdx: trackIndex, sIdx: stackIndex });
      } else {
        // We have a first token, now swap
        if (firstSwapToken.tIdx !== trackIndex) {
          alert("You must swap tokens within the exact same stack location!");
          setFirstSwapToken(null);
          return;
        }
        if (firstSwapToken.sIdx === stackIndex) {
          // clicked same token, cancel
          setFirstSwapToken(null);
          return;
        }

        const newTrack = [...track];
        const currentStack = [...newTrack[trackIndex]];
        
        // Swap
        const temp = currentStack[firstSwapToken.sIdx];
        currentStack[firstSwapToken.sIdx] = currentStack[stackIndex];
        currentStack[stackIndex] = temp;
        
        newTrack[trackIndex] = currentStack;
        setTrack(newTrack);
        setFirstSwapToken(null);
        switchTurn();
      }
    }
  };

  const switchTurn = () => {
    setTurnPlayer(prev => prev === p1 ? p2 : p1);
    setActionSide("");
    setFirstSwapToken(null);
  };

  const checkWinCondition = (currentTrack) => {
    if (currentTrack[7].length > 0) {
      // Calculate scores based on the finish line stack
      const finishStack = currentTrack[7];
      // The higher the token in the stack, the more points.
      // Top token is at the end of the array.
      // Let's say: Top = 10 pts, 2nd = 5 pts, 3rd = 2 pts.
      let p1Score = 0;
      let p2Score = 0;

      const reverseStack = [...finishStack].reverse(); // Index 0 is Top
      
      const getPoints = (idx) => {
        if (idx === 0) return 10;
        if (idx === 1) return 5;
        if (idx === 2) return 2;
        return 0;
      };

      p1Targets.forEach(color => {
        const idx = reverseStack.indexOf(color);
        if (idx !== -1) p1Score += getPoints(idx);
      });

      p2Targets.forEach(color => {
        const idx = reverseStack.indexOf(color);
        if (idx !== -1) p2Score += getPoints(idx);
      });

      setWinner({
        p1Score,
        p2Score,
        winningPlayer: p1Score > p2Score ? p1 : (p2Score > p1Score ? p2 : "Tie"),
        finishStack: reverseStack
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-chakra relative flex flex-col pt-24 md:pt-32 pb-12 overflow-x-hidden">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_80%)] pointer-events-none z-0"></div>

      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors uppercase font-bold text-[10px] tracking-widest z-10 group"
      >
        <ArrowLeftIcon size={16} className="group-hover:-translate-x-1 transition-transform" />
        Abandon Match
      </button>

      <div className="flex-1 relative z-10 max-w-7xl w-full mx-auto px-4 lg:px-12 flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        
        {/* HUD Left - Player 1 */}
        <div className={`w-full lg:w-64 shrink-0 bg-[#0f0f11] border ${turnPlayer === p1 && !winner ? 'border-lime-500 shadow-[0_0_20px_rgba(163,230,53,0.2)]' : 'border-zinc-800/80'} rounded-2xl p-6 transition-all duration-500`}>
          <h2 className="text-2xl font-bebas tracking-wider mb-1">{p1}</h2>
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-6">Player 1</p>
          
          <div className="bg-[#151518] border border-zinc-800 rounded-xl p-4 group relative cursor-help">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheckIcon size={16} className="text-zinc-400" />
              <span className="text-xs font-bold text-zinc-300 uppercase">Secret Targets</span>
            </div>
            {/* Hidden until hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-[#151518] rounded-xl border border-zinc-700 flex items-center justify-center gap-2 p-2 z-20">
               {p1Targets.map(c => (
                 <div key={c} className={`w-8 h-8 rounded-full border-2 border-white/20 shadow-lg`} style={{ backgroundColor: c }}></div>
               ))}
            </div>
            <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest mt-4">Hover to Reveal</p>
          </div>
        </div>

        {/* Board Center */}
        <div className="flex-1 w-full bg-[#0f0f11] border border-zinc-800/80 rounded-3xl p-6 md:p-12 relative shadow-2xl overflow-hidden flex flex-col">
          {!winner && (
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-white font-bold tracking-widest text-xs uppercase mb-4 animate-pulse">
                {turnPlayer}'s Turn
              </span>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => { setActionSide("advance"); setFirstSwapToken(null); }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all border-2
                    ${actionSide === "advance" ? "bg-lime-500 text-zinc-900 border-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.4)]" : "bg-[#18181b] text-zinc-400 border-zinc-800 hover:border-lime-500/50"}`}
                >
                  <ArrowRightIcon size={18} weight="bold" /> Advance
                </button>
                <button 
                  onClick={() => { setActionSide("swap"); setFirstSwapToken(null); }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all border-2
                    ${actionSide === "swap" ? "bg-purple-500 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "bg-[#18181b] text-zinc-400 border-zinc-800 hover:border-purple-500/50"}`}
                >
                  <ShuffleSimpleIcon size={18} weight="bold" /> Rearrange
                </button>
              </div>
            </div>
          )}

          {winner && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-700">
              <div className="bg-[#0f0f11] border border-yellow-500/50 p-10 rounded-3xl text-center shadow-[0_0_50px_rgba(250,204,21,0.2)] max-w-lg w-full mx-4">
                <TrophyIcon size={64} className="text-yellow-400 mx-auto mb-6 drop-shadow-lg" weight="duotone" />
                <h2 className="text-4xl md:text-6xl font-bebas tracking-wide text-white mb-2">{winner.winningPlayer === "Tie" ? "It's a Tie!" : `${winner.winningPlayer} Wins!`}</h2>
                <div className="flex justify-center gap-8 my-8 pb-8 border-b border-zinc-800">
                   <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">{p1}</p>
                      <p className="text-3xl font-mono text-white">{winner.p1Score} <span className="text-sm">pts</span></p>
                   </div>
                   <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">{p2}</p>
                      <p className="text-3xl font-mono text-white">{winner.p2Score} <span className="text-sm">pts</span></p>
                   </div>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full bg-yellow-500 text-zinc-900 font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}

          {/* The Track Layout */}
          <div className="flex-1 flex flex-col md:flex-row justify-between items-end gap-2 md:gap-0 mt-8 relative">
            <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-zinc-800 via-zinc-700 to-yellow-500/50 rounded-full z-0 hidden md:block"></div>
            
            {track.map((stack, trackIdx) => (
              <div key={trackIdx} className="flex-1 flex flex-col items-center justify-end h-[300px] md:h-[400px] relative z-10 w-full md:w-auto border-b-2 md:border-b-0 border-zinc-800 mb-2 md:mb-0 pb-4 md:pb-0">
                {/* Track Number indicator */}
                <span className="absolute -bottom-8 font-mono text-[10px] text-zinc-600 font-bold hidden md:block">
                  {trackIdx === 0 ? "START" : trackIdx === 7 ? "FINISH" : `STEP ${trackIdx}`}
                </span>

                {/* Tokens Stack Layout */}
                <div className="flex flex-col gap-1 items-center justify-end w-full">
                  {stack.map((color, stackIdx) => {
                     const depth = stack.length - stackIdx;
                     const isTop3 = depth <= 3;
                     const isSelectedForSwap = firstSwapToken?.tIdx === trackIdx && firstSwapToken?.sIdx === stackIdx;
                     
                     return (
                      <Token 
                        key={`${color}-${stackIdx}`} 
                        color={color} 
                        isSelected={isSelectedForSwap}
                        onClick={() => handleTokenClick(trackIdx, stackIdx)}
                        className={isTop3 ? "opacity-100" : "opacity-50 grayscale pointer-events-none"} 
                      />
                     );
                  })}
                </div>
                
                {trackIdx === 7 && (
                   <div className="absolute top-0 right-0 left-0 bg-yellow-500/10 border-t border-yellow-500/30 h-full -z-10 rounded-t-xl hidden md:block" />
                )}
              </div>
            ))}
          </div>

        </div>

        {/* HUD Right - Player 2 */}
        <div className={`w-full lg:w-64 shrink-0 bg-[#0f0f11] border ${turnPlayer === p2 && !winner ? 'border-lime-500 shadow-[0_0_20px_rgba(163,230,53,0.2)]' : 'border-zinc-800/80'} rounded-2xl p-6 transition-all duration-500`}>
          <h2 className="text-2xl font-bebas tracking-wider mb-1 text-right">{p2}</h2>
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-6 text-right">Player 2</p>
          
          <div className="bg-[#151518] border border-zinc-800 rounded-xl p-4 group relative cursor-help">
            <div className="flex items-center justify-end gap-2 mb-2">
              <span className="text-xs font-bold text-zinc-300 uppercase">Secret Targets</span>
              <ShieldCheckIcon size={16} className="text-zinc-400" />
            </div>
            {/* Hidden until hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-[#151518] rounded-xl border border-zinc-700 flex items-center justify-center gap-2 p-2 z-20">
               {p2Targets.map(c => (
                 <div key={c} className={`w-8 h-8 rounded-full border-2 border-white/20 shadow-lg`} style={{ backgroundColor: c }}></div>
               ))}
            </div>
            <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest mt-4">Hover to Reveal</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Game;
