import { sumDice, getCounts, checkNOfAKind, checkFullHouse, checkSmallStraight, checkLargeStraight, checkYatzy } from './logic';

export const chooseBotHeldDice = (dice) => {
  const counts = getCounts(dice);
  const nextHeld = Array(5).fill(false);
  const highestCount = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  if (!highestCount) return nextHeld;

  const targetValue = Number(highestCount[0]);
  if (highestCount[1] >= 2) {
    dice.forEach((value, idx) => {
      if (value === targetValue) nextHeld[idx] = true;
    });
  }

  if (nextHeld.every((held) => !held)) {
    const sorted = [...dice].sort((a, b) => a - b);
    const unique = [...new Set(sorted)];
    if (unique.length >= 4) {
      sorted.forEach((value, idx) => {
        if (value >= 2) nextHeld[idx] = true;
      });
    }
  }

  return nextHeld;
};

export const getBestBotCategory = (dice, takenScores) => {
  const scoreMap = {
    ones: (d) => sumDice(d, 1),
    twos: (d) => sumDice(d, 2),
    threes: (d) => sumDice(d, 3),
    fours: (d) => sumDice(d, 4),
    fives: (d) => sumDice(d, 5),
    sixes: (d) => sumDice(d, 6),
    threeOfAKind: (d) => checkNOfAKind(d, 3),
    fourOfAKind: (d) => checkNOfAKind(d, 4),
    fullHouse: (d) => checkFullHouse(d),
    smallStraight: (d) => checkSmallStraight(d),
    largeStraight: (d) => checkLargeStraight(d),
    yatzy: (d) => checkYatzy(d),
    chance: (d) => d.reduce((a, b) => a + b, 0),
  };

  const available = Object.entries(scoreMap).filter(([id]) => takenScores[id] === undefined);
  if (!available.length) return null;

  let best = available[0];
  for (const entry of available.slice(1)) {
    if (entry[1](dice) > best[1](dice)) {
      best = entry;
    }
  }

  return best[0];
};
