// ===== SERVER GAME ENGINE — MULTI-ROUND (ANIMATED) =====
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

export const assignPlayerColors = (numPlayers) => {
  const assignments = [];
  for (let i = 0; i < numPlayers; i++) {
    const shuffled = shuffleArray(TIKI_COLORS);
    assignments.push(shuffled.slice(0, 2));
  }
  return assignments; // [[color1, color2], [color3, color4], ...]
};

export const assignSecretColors = () => {
  return shuffleArray(TIKI_COLORS).slice(0, 2);
};

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

export const generatePlayerRoundRules = (colors) => {
  return colors.map((color) => {
    const operator = Math.random() > 0.5 ? "≤" : "≥";
    const position = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
    const points = Math.floor(Math.random() * 4) + 2; // 2 to 5

    return {
      color,
      operator,
      position,
      points,
    };
  });
};

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

export const calculateAntiGravityScore = (tikiLine, rules) => {
  let score = 0;
  const breakdown = [];
  const topThree = tikiLine.slice(0, 3);

  rules.forEach((rule) => {
    const actualIdx = tikiLine.findIndex((t) => t.color === rule.color);
    const pos = actualIdx + 1; // 1-indexed

    if (actualIdx !== -1 && actualIdx < 3) {
      const satisfied =
        rule.operator === "≤" ? pos <= rule.position : pos >= rule.position;

      if (satisfied) {
        score += rule.points;
        breakdown.push(
          `Success: ${rule.color.toUpperCase()} ${rule.operator} ${rule.position} (Value: ${pos}) → +${rule.points} pts`,
        );
      } else {
        breakdown.push(
          `Failed: ${rule.color.toUpperCase()} ${rule.operator} ${rule.position} (Value: ${pos})`,
        );
      }
    } else {
      breakdown.push(`Failed: ${rule.color.toUpperCase()} not in top 3.`);
    }
  });

  return { score, breakdown };
};

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

export const generateInitialTikiLine = () => {
  const colors = shuffleArray(TIKI_COLORS.slice(0, 6));
  return colors.map((c) => ({ id: generateId(c), color: c }));
};
