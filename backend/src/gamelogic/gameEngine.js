const TIKI_COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];

export const createInitialHand = () => {
  return [
    {
      id: "t1",
      type: "topple",
      value: 1,
      description: "Topple 1: Move the top Tiki to the bottom.",
    },
    {
      id: "m1",
      type: "move",
      value: 1,
      description: "Move 1: Move a Tiki up 1 space.",
    },
    {
      id: "m2",
      type: "move",
      value: 2,
      description: "Move 2: Move a Tiki up 2 spaces.",
    },
    {
      id: "m3",
      type: "move",
      value: 3,
      description: "Move 3: Move a Tiki up 3 spaces.",
    },
    { id: "s1", type: "swap", description: "Swap: Swap any two Tikis." },
    {
      id: "toast",
      type: "toast",
      description: "Tiki Toast: Remove the Tiki at the bottom of the line.",
    },
  ];
};

export const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const assignSecretColors = () => {
  return shuffleArray(TIKI_COLORS).slice(0, 2); // 2 secret colors per player
};

export const executeCard = (game, player, card) => {
  game.logs.push(`${player.name} played ${card.type} ${card.value || ""}`);
  let line = [...game.tikiLine]; // Array where index 0 is TOP (front)

  if (card.type === "topple") {
    const count = card.value || 1;
    // move top N to the bottom
    const toppled = line.splice(0, count);
    line.push(...toppled);
  } else if (card.type === "move") {
    // Move target1 UP by value spaces
    const val = card.value || 1;
    const target = card.target1;
    const idx = line.indexOf(target);
    if (idx !== -1 && idx > 0) {
      let newIdx = idx - val;
      if (newIdx < 0) newIdx = 0;
      // remove from idx
      line.splice(idx, 1);
      // insert at newIdx
      line.splice(newIdx, 0, target);
    }
  } else if (card.type === "swap") {
    // Swap target1 and target2
    const idx1 = line.indexOf(card.target1);
    const idx2 = line.indexOf(card.target2);
    if (idx1 !== -1 && idx2 !== -1) {
      const temp = line[idx1];
      line[idx1] = line[idx2];
      line[idx2] = temp;
    }
  } else if (card.type === "toast") {
    // Remove the bottom most tiki (last index)
    if (line.length > 3) {
      const toasted = line.pop();
      game.logs.push(`${toasted} was Tiki Toasted!`);
    } else {
      game.logs.push("Cannot Tiki Toast when only 3 Tikis remain.");
    }
  }

  game.tikiLine = line;

  // Check if round should end
  const roundEnded = line.length <= 3;
  return roundEnded;
};

export const calculateScores = (game) => {
  const line = game.tikiLine; // index 0 is TOP

  game.players.forEach((p) => {
    let roundScore = 0;
    p.secretColors.forEach((color) => {
      const pos = line.indexOf(color);
      if (pos === 0) roundScore += 10;
      else if (pos === 1) roundScore += 5;
      else if (pos === 2) roundScore += 2;
    });
    p.score += roundScore;
    game.logs.push(`${p.name} scored ${roundScore} points this round. Total: ${p.score}`);
  });
};
