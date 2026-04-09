// ===== LOCAL GAME ENGINE — MULTI-ROUND (ANIMATED) =====
// Supports 2-4 players, N rounds, persistent secret targets.
// tikiLine is now an array of objects: { id, color } for FLIP animation tracking.

export const TIKI_COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
];

export const TOTAL_ROUNDS = 5;
export const SCORING_POSITIONS = 3; // top 3 tikis score

export const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Generates a unique ID for a color, useful for toppling to trigger enter/exit animations
const generateId = (color) =>
  `${color}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

export const createInitialHand = () => {
  return [
    {
      id: "t1",
      type: "topple",
      value: 1,
      description: "Move the top Tiki to the bottom of the line.",
    },
    {
      id: "t2",
      type: "topple",
      value: 2,
      description: "Move the top 2 Tikis to the bottom.",
    },
    {
      id: "m1",
      type: "move",
      value: 1,
      description: "Move a chosen Tiki up by 1 position.",
    },
    {
      id: "m2",
      type: "move",
      value: 2,
      description: "Move a chosen Tiki up by 2 positions.",
    },
    {
      id: "m3",
      type: "move",
      value: 3,
      description: "Move a chosen Tiki up by 3 positions.",
    },
    { id: "s1", type: "swap", description: "Swap any two Tikis in the line." },
  ];
};

// Generates a random rule for a single player
export const generateRule = () => {
  const randomColor =
    TIKI_COLORS[Math.floor(Math.random() * TIKI_COLORS.length)];
  const maxPosition = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
  const points = Math.floor(Math.random() * 5) + 1; // 1 to 5

  return {
    color: randomColor,
    maxPosition,
    points,
  };
};

/**
 * Execute a single card against the tiki line of objects {id, color}.
 * Returns { newLine, logMessage }
 */
export const executeCard = (tikiLine, playerName, card) => {
  const line = [...tikiLine]; // index 0 = TOP/FRONT

  if (card.type === "topple") {
    const count = Math.min(card.value || 1, line.length);
    const toppled = line.splice(0, count);

    // Assign NEW IDs to the toppled tokens so framer-motion removes them from top and fades them in at bottom
    const refreshedToppled = toppled.map((t) => ({
      id: generateId(t.color),
      color: t.color,
    }));
    line.push(...refreshedToppled);

    return {
      newLine: line,
      logMessage: `${playerName} played Topple ${count} — moved top ${count} Tiki(s) to the bottom.`,
    };
  }

  if (card.type === "move") {
    const val = card.value || 1;
    const target = card.target1;
    if (!target)
      return {
        newLine: line,
        logMessage: `${playerName} played Move ${val} but had no target.`,
      };

    const idx = line.findIndex((t) => t.color === target);
    if (idx > 0) {
      const [movedToken] = line.splice(idx, 1);
      const newIdx = Math.max(0, idx - val);
      line.splice(newIdx, 0, movedToken);
    }
    return {
      newLine: line,
      logMessage: `${playerName} played Move ${val} on ${target} — moved it up ${val} position(s).`,
    };
  }

  if (card.type === "swap") {
    const idx1 = line.findIndex((t) => t.color === card.target1);
    const idx2 = line.findIndex((t) => t.color === card.target2);
    if (idx1 !== -1 && idx2 !== -1) {
      [line[idx1], line[idx2]] = [line[idx2], line[idx1]];
    }
    return {
      newLine: line,
      logMessage: `${playerName} swapped ${card.target1} and ${card.target2}.`,
    };
  }

  return { newLine: line, logMessage: `${playerName} played ${card.type}.` };
};

/**
 * Score a single player based on the final tiki line's top 3 positions and their custom dynamic rule.
 */
export const calculateDynamicScore = (tikiLine, rule) => {
  let score = 0;
  const breakdown = [];

  const topThree = tikiLine.slice(0, 3);
  const pos = topThree.findIndex((t) => t.color === rule.color);

  if (pos !== -1 && pos < rule.maxPosition) {
    score = rule.points;
    breakdown.push(
      `Success! ${rule.color} is at position ${pos + 1} (≤ ${rule.maxPosition}) → +${rule.points} pts`,
    );
  } else {
    const actualPos = tikiLine.findIndex((t) => t.color === rule.color);
    breakdown.push(
      `Failed. ${rule.color} finished at position ${actualPos + 1}. Needed ≤ ${rule.maxPosition}.`,
    );
  }

  return { score, breakdown };
};

/**
 * Interleaved round resolution.
 * Phase A: execute all players' FIRST cards in turn order.
 * Phase B: execute all players' SECOND cards in turn order.
 * Returns an array of steps for animated playback.
 */
export const resolveRound = (tikiLine, players) => {
  const steps = [];
  let currentLine = [...tikiLine];

  // Phase A
  for (let i = 0; i < players.length; i++) {
    const card = players[i].selectedCards?.[0];
    if (card) {
      const result = executeCard(currentLine, players[i].name, card);
      currentLine = result.newLine;
      steps.push({
        phase: "A",
        playerIndex: i,
        playerName: players[i].name,
        card,
        lineAfter: [...currentLine],
        logMessage: result.logMessage,
      });
    }
  }

  // Phase B
  for (let i = 0; i < players.length; i++) {
    const card = players[i].selectedCards?.[1];
    if (card) {
      const result = executeCard(currentLine, players[i].name, card);
      currentLine = result.newLine;
      steps.push({
        phase: "B",
        playerIndex: i,
        playerName: players[i].name,
        card,
        lineAfter: [...currentLine],
        logMessage: result.logMessage,
      });
    }
  }

  return { steps, finalLine: currentLine };
};

export const resetPlayersForNewRound = (players) => {
  return players.map((p) => ({
    ...p,
    hand: createInitialHand(),
    rule: generateRule(),
    selectedCards: [],
    hasSelected: false,
    roundScore: 0,
  }));
};

export const generateInitialTikiLine = () => {
  const colors = shuffleArray(TIKI_COLORS.slice(0, 6));
  return colors.map((c) => ({ id: generateId(c), color: c }));
};
