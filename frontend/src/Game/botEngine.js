/**
 * botEngine.js
 * Logic for the Tiki Bot AI
 */

/**
 * selectBotCards
 * Heuristic based selection for the bot.
 * Returns an array of 2 selected cards with targets.
 */
export const selectBotCards = (hand, tikiLine, rule, difficulty) => {
  const line = [...tikiLine];
  const myColor = rule.color;
  const myTargetPos = rule.maxPosition - 1; // 0-indexed

  // Simple heuristic: 
  // 1. Move own color up.
  // 2. If own color is top 3, avoid toppling (unless own color is below the topple count).
  // 3. If own color is bottom, try to topple if it helps (reset).

  const availableCards = [...hand];
  const selections = [];

  // Function to find best move card for self
  const findBestMove = (cards, color) => {
    const currentIdx = line.findIndex(t => t.color === color);
    if (currentIdx === -1) return null;

    return cards
      .filter(c => c.type === 'move')
      .sort((a, b) => b.value - a.value) // Pick highest move first
      .find(c => {
        // Only move if it doesn't overshoot top
        return currentIdx > 0;
      });
  };

  // Logic per difficulty
  if (difficulty === 'easy') {
    // Just pick 2 random cards and random targets
    const randoms = shuffle([...availableCards]).slice(0, 2);
    return randoms.map(card => fillTargetsRandomly(card, line));
  }

  // Medium / Hard logic (Heuristic)
  
  // Card 1: Try to move own color up
  const moveUp = findBestMove(availableCards, myColor);
  if (moveUp) {
    selections.push({ card: moveUp, target1: myColor, target2: null });
    const idx = availableCards.findIndex(c => c.id === moveUp.id);
    availableCards.splice(idx, 1);
  }

  // Card 2: Strategic selection
  if (selections.length < 2) {
    const nextBest = availableCards[0]; // Take whatever is left
    selections.push(fillTargetsStrategic(nextBest, line, rule));
  }

  // If we still need more (unlikely)
  while (selections.length < 2) {
    const fallback = availableCards.pop();
    if (!fallback) break;
    selections.push(fillTargetsRandomly(fallback, line));
  }

  return selections.map(s => ({
    ...s.card,
    target1: s.target1,
    target2: s.target2
  }));
};

const fillTargetsRandomly = (card, line) => {
  if (card.type === 'move') {
    const randomTiki = line[Math.floor(Math.random() * line.length)].color;
    return { card, target1: randomTiki, target2: null };
  }
  if (card.type === 'swap') {
    const targets = shuffle(line.map(t => t.color)).slice(0, 2);
    return { card, target1: targets[0], target2: targets[1] };
  }
  return { card, target1: null, target2: null };
};

const fillTargetsStrategic = (card, line, rule) => {
  const myColor = rule.color;
  if (card.type === 'move') {
    // If we didn't use move for ourself yet, do it
    const myIdx = line.findIndex(t => t.color === myColor);
    if (myIdx > 0) return { card, target1: myColor, target2: null };
    // Otherwise move highest opponent tiki down? 
    // Simplified: move anyone else up randomly
    const others = line.filter(t => t.color !== myColor);
    const target = others[Math.floor(Math.random() * others.length)].color;
    return { card, target1: target, target2: null };
  }
  if (card.type === 'swap') {
    // Swap own color with someone higher
    const myIdx = line.findIndex(t => t.color === myColor);
    if (myIdx > 0) {
      return { card, target1: myColor, target2: line[0].color };
    }
    return { card, target1: line[0].color, target2: line[1].color };
  }
  return { card, target1: null, target2: null };
};

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
