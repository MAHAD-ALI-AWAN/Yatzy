export const sumDice = (dice, val) => dice.filter((d) => d === val).reduce((a, b) => a + b, 0);

export const getCounts = (dice) => {
  const counts = {};
  dice.forEach((d) => {
    counts[d] = (counts[d] || 0) + 1;
  });
  return counts;
};

export const checkNOfAKind = (dice, n) => {
  const counts = getCounts(dice);
  for (const value in counts) {
    if (counts[value] >= n) return dice.reduce((a, b) => a + b, 0);
  }
  return 0;
};

export const checkFullHouse = (dice) => {
  const counts = Object.values(getCounts(dice));
  return (counts.includes(3) && counts.includes(2)) || counts.includes(5) ? 25 : 0;
};

export const checkSmallStraight = (dice) => {
  const unique = [...new Set(dice)].sort();
  const straights = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]];
  for (const straight of straights) {
    if (straight.every((num) => unique.includes(num))) return 30;
  }
  return 0;
};

export const checkLargeStraight = (dice) => {
  const sorted = [...dice].sort((a, b) => a - b).join('');
  return sorted === '12345' || sorted === '23456' ? 40 : 0;
};

export const checkYatzy = (dice) => (Object.values(getCounts(dice)).includes(5) ? 50 : 0);

export const COLUMN_PAIRS = [
  {
    left: { id: 'ones', label: 'Ones', diceVal: 1, calc: (d) => sumDice(d, 1) },
    right: { id: 'threeOfAKind', label: '3x TRIPS', iconLabel: '3x', calc: (d) => checkNOfAKind(d, 3) },
  },
  {
    left: { id: 'twos', label: 'Twos', diceVal: 2, calc: (d) => sumDice(d, 2) },
    right: { id: 'fourOfAKind', label: '4x QUADS', iconLabel: '4x', calc: (d) => checkNOfAKind(d, 4) },
  },
  {
    left: { id: 'threes', label: 'Threes', diceVal: 3, calc: (d) => sumDice(d, 3) },
    right: { id: 'fullHouse', label: 'Full House', iconLabel: '🏠', calc: (d) => checkFullHouse(d) },
  },
  {
    left: { id: 'fours', label: 'Fours', diceVal: 4, calc: (d) => sumDice(d, 4) },
    right: { id: 'smallStraight', label: 'Sm. Straight', iconLabel: '⚁⚂', calc: (d) => checkSmallStraight(d) },
  },
  {
    left: { id: 'fives', label: 'Fives', diceVal: 5, calc: (d) => sumDice(d, 5) },
    right: { id: 'largeStraight', label: 'Lg. Straight', iconLabel: '⚂⚃', calc: (d) => checkLargeStraight(d) },
  },
  {
    left: { id: 'sixes', label: 'Sixes', diceVal: 6, calc: (d) => sumDice(d, 6) },
    right: { id: 'yatzy', label: 'Yatzy', iconLabel: '⭐', calc: (d) => checkYatzy(d) },
  },
  {
    left: { id: 'bonus', isBonus: true },
    right: { id: 'chance', label: 'Chance', iconLabel: '🎲', calc: (d) => d.reduce((a, b) => a + b, 0) },
  },
];

export const emptyDice = [1, 1, 1, 1, 1];
export const emptyHeld = [false, false, false, false, false];
